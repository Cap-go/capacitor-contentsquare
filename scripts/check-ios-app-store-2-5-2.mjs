#!/usr/bin/env node
/**
 * App Store guideline 2.5.2 guard for iOS plugin sources.
 *
 * Allows documented private Contentsquare integration when selectors are compile-time
 * literals (Selector("...") or NSSelectorFromString("...")) and marked with
 * appstore-2.5.2-allow on private dispatch sites.
 *
 * Fails on runtime-built selector or class names (interpolation, concatenation, variables).
 * Call-argument scans use balanced parentheses so unrelated `+` operators are ignored.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iosSources = path.join(pluginRoot, "ios", "Sources");

/** @type {{ id: string, pattern: RegExp }[]} */
const GLOBAL_RULES = [
  { id: "method_exchangeImplementations", pattern: /\bmethod_exchangeImplementations\b/ },
  { id: "class_replaceMethod", pattern: /\bclass_replaceMethod\b/ },
  { id: "dlopen", pattern: /\bdlopen\s*\(/ },
  { id: "dlsym", pattern: /\bdlsym\s*\(/ },
];

/** @type {{ idPrefix: string, pattern: RegExp }[]} */
const CALLEE_CALLS = [
  { idPrefix: "NSSelectorFromString", pattern: /\bNSSelectorFromString\s*\(/g },
  { idPrefix: "Selector", pattern: /(?<![A-Za-z])Selector\s*\(/g },
  { idPrefix: "NSClassFromString", pattern: /\bNSClassFromString\s*\(/g },
];

const ALLOW_TAG = "appstore-2.5.2-allow";
const PERFORM_ON_CONTENTSQUARE = /Contentsquare\.perform\s*\(/;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (entry.name.endsWith(".swift") || entry.name.endsWith(".m") || entry.name.endsWith(".mm")) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineHasAllowTag(lines, index) {
  const window = [lines[index], lines[index - 1], lines[index - 2]].filter(Boolean);
  return window.some((line) => line.includes(ALLOW_TAG));
}

/**
 * Replace string literals and comments with spaces while preserving UTF-16 length.
 * Swift string interpolation (`\(`) stays visible so runtime-name rules can match it.
 * @param {string} source
 */
function stripStringsAndComments(source) {
  const out = source.split("");
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "/" && next === "/") {
      index += 2;
      while (index < source.length && source[index] !== "\n") {
        out[index] = " ";
        index += 1;
      }
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        out[index] = " ";
        index += 1;
      }
      if (index < source.length) {
        out[index] = " ";
        out[index + 1] = " ";
        index += 2;
      }
      continue;
    }

    if (char === '"') {
      index += 1;
      while (index < source.length) {
        if (source[index] === "\\" && index + 1 < source.length) {
          if (source[index + 1] === "(") {
            index += 2;
            continue;
          }
          out[index] = " ";
          out[index + 1] = " ";
          index += 2;
          continue;
        }
        if (source[index] === '"') {
          index += 1;
          break;
        }
        out[index] = " ";
        index += 1;
      }
      continue;
    }

    index += 1;
  }

  return out.join("");
}

function findMatchingParen(source, openParenIndex) {
  let depth = 0;

  for (let index = openParenIndex; index < source.length; index += 1) {
    const char = source[index];

    if (char === '"') {
      index += 1;
      while (index < source.length) {
        if (source[index] === "\\" && index + 1 < source.length) {
          index += 2;
          continue;
        }
        if (source[index] === '"') {
          break;
        }
        index += 1;
      }
      continue;
    }

    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function indexToLine(source, matchIndex) {
  let line = 1;
  for (let index = 0; index < matchIndex && index < source.length; index += 1) {
    if (source[index] === "\n") {
      line += 1;
    }
  }
  return line;
}

function analyzeCalleeCalls(relativePath, source, stripped) {
  const found = [];

  for (const callee of CALLEE_CALLS) {
    const pattern = new RegExp(callee.pattern.source, callee.pattern.flags);
    let match = pattern.exec(stripped);

    while (match !== null) {
      const openParenIndex = match.index + match[0].length - 1;
      const closeParenIndex = findMatchingParen(stripped, openParenIndex);
      const line = indexToLine(source, match.index);

      if (closeParenIndex > openParenIndex) {
        const argument = stripped.slice(openParenIndex + 1, closeParenIndex);
        const trimmedArgument = argument.trimStart();

        if (/\\\(/u.test(argument)) {
          found.push(`${relativePath}:${line}: ${callee.idPrefix}-interpolation`);
        }
        if (/\+/.test(argument)) {
          found.push(`${relativePath}:${line}: ${callee.idPrefix}-concatenation`);
        }
        if (!trimmedArgument.startsWith('"')) {
          found.push(`${relativePath}:${line}: ${callee.idPrefix}-non-literal`);
        }
      }

      match = pattern.exec(stripped);
    }
  }

  return found;
}

function findRuntimeNameViolations(relativePath, source) {
  const stripped = stripStringsAndComments(source);
  const found = analyzeCalleeCalls(relativePath, source, stripped);

  for (const rule of GLOBAL_RULES) {
    const pattern = new RegExp(rule.pattern.source, "g");
    let match = pattern.exec(stripped);
    while (match !== null) {
      found.push(`${relativePath}:${indexToLine(source, match.index)}: ${rule.id}`);
      match = pattern.exec(stripped);
    }
  }

  return found;
}

const violations = [];

for (const file of walk(iosSources)) {
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/);
  const relativePath = path.relative(pluginRoot, file);

  violations.push(...findRuntimeNameViolations(relativePath, source));

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (PERFORM_ON_CONTENTSQUARE.test(line) && !lineHasAllowTag(lines, index)) {
      violations.push(
        `${relativePath}:${index + 1}: Contentsquare.perform missing ${ALLOW_TAG} on same or previous lines`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error("iOS App Store 2.5.2 guard failed:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("iOS App Store 2.5.2 guard passed.");
