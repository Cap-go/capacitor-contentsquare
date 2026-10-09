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
    pattern: /NSSelectorFromString\s*\([^)]*\\\(/,
  },
  {
    id: "NSSelectorFromString-concatenation",
    pattern: /NSSelectorFromString\s*\([^)]*\+/,
  },
  {
    id: "NSSelectorFromString-non-literal",
    pattern: /NSSelectorFromString\s*\(\s*(?!")[^)]+\)/,
  },
  {
    id: "Selector-interpolation",
    pattern: /(?<![A-Za-z])Selector\s*\([^)]*\\\(/,
  },
  {
    id: "Selector-concatenation",
    pattern: /(?<![A-Za-z])Selector\s*\([^)]*\+/,
  },
  {
    id: "Selector-non-literal",
    pattern: /(?<![A-Za-z])Selector\s*\(\s*(?!")[^)]+\)/,
  },
  {
    id: "NSClassFromString-interpolation",
    pattern: /NSClassFromString\s*\([^)]*\\\(/,
  },
  {
    id: "NSClassFromString-concatenation",
    pattern: /NSClassFromString\s*\([^)]*\+/,
  },
  {
    id: "NSClassFromString-non-literal",
    pattern: /NSClassFromString\s*\(\s*(?!")[^)]+\)/,
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

const violations = [];

for (const file of walk(iosSources)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) {
      continue;
    }

    for (const rule of RUNTIME_NAME_RULES) {
      if (rule.pattern.test(line)) {
        violations.push(`${path.relative(pluginRoot, file)}:${index + 1}: ${rule.id}`);
      }
    }

    if (PERFORM_ON_CONTENTSQUARE.test(line) && !lineHasAllowTag(lines, index)) {
      violations.push(
        `${path.relative(pluginRoot, file)}:${index + 1}: Contentsquare.perform missing ${ALLOW_TAG} on same or previous lines`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error("iOS App Store 2.5.2 guard failed:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("iOS App Store 2.5.2 guard passed.");
