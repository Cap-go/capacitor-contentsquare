#!/usr/bin/env node
/**
 * App Store guideline 2.5.2 guard for iOS plugin sources.
 *
 * Allows documented private Contentsquare integration when selectors are compile-time
 * literals (Selector("...") or NSSelectorFromString("...")) and marked with
 * appstore-2.5.2-allow on private dispatch sites.
 *
 * Fails on runtime-built selector or class names (interpolation, concatenation, variables).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iosSources = path.join(pluginRoot, "ios", "Sources");

/** @type {{ id: string, pattern: RegExp }[]} */
const RUNTIME_NAME_RULES = [
  {
    id: "NSSelectorFromString-interpolation",
    pattern: /NSSelectorFromString\s*\([\s\S]*?\\\(/,
  },
  {
    id: "NSSelectorFromString-concatenation",
    pattern: /NSSelectorFromString\s*\([\s\S]*?\+/,
  },
  {
    id: "NSSelectorFromString-non-literal",
    pattern: /NSSelectorFromString\s*\(\s*(?!")[\s\S]*?\)/,
  },
  {
    id: "Selector-interpolation",
    pattern: /(?<![A-Za-z])Selector\s*\([\s\S]*?\\\(/,
  },
  {
    id: "Selector-concatenation",
    pattern: /(?<![A-Za-z])Selector\s*\([\s\S]*?\+/,
  },
  {
    id: "Selector-non-literal",
    pattern: /(?<![A-Za-z])Selector\s*\(\s*(?!")[\s\S]*?\)/,
  },
  {
    id: "NSClassFromString-interpolation",
    pattern: /NSClassFromString\s*\([\s\S]*?\\\(/,
  },
  {
    id: "NSClassFromString-concatenation",
    pattern: /NSClassFromString\s*\([\s\S]*?\+/,
  },
  {
    id: "NSClassFromString-non-literal",
    pattern: /NSClassFromString\s*\(\s*(?!")[\s\S]*?\)/,
  },
  { id: "method_exchangeImplementations", pattern: /\bmethod_exchangeImplementations\b/ },
  { id: "class_replaceMethod", pattern: /\bclass_replaceMethod\b/ },
  { id: "dlopen", pattern: /\bdlopen\s*\(/ },
  { id: "dlsym", pattern: /\bdlsym\s*\(/ },
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
 * Replace string literals and comments with spaces while preserving length and newlines.
 * @param {string} source
 */
function stripStringsAndComments(source) {
  const out = [...source];
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

function indexToLine(source, matchIndex) {
  let line = 1;
  for (let index = 0; index < matchIndex && index < source.length; index += 1) {
    if (source[index] === "\n") {
      line += 1;
    }
  }
  return line;
}

function findRuntimeNameViolations(relativePath, source) {
  const stripped = stripStringsAndComments(source);
  const found = [];

  for (const rule of RUNTIME_NAME_RULES) {
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
