#!/usr/bin/env node
/**
 * App Store guideline 2.5.2 guard for iOS plugin sources.
 *
 * Fails when ios/Sources contains dynamic dispatch or swizzling patterns
 * that commonly trigger private API review.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iosSources = path.join(pluginRoot, "ios", "Sources");

/** @type {{ id: string, pattern: RegExp }[]} */
const RULES = [
  { id: "NSSelectorFromString", pattern: /\bNSSelectorFromString\b/ },
  { id: "performSelector", pattern: /\bperformSelector\b/ },
  { id: "NSClassFromString", pattern: /\bNSClassFromString\b/ },
  { id: "method_exchangeImplementations", pattern: /\bmethod_exchangeImplementations\b/ },
  { id: "class_replaceMethod", pattern: /\bclass_replaceMethod\b/ },
  { id: "dlopen", pattern: /\bdlopen\s*\(/ },
  { id: "dlsym", pattern: /\bdlsym\s*\(/ },
  { id: "valueForKey", pattern: /\bvalueForKey\b|\bvalue\s*\(\s*forKey\s*:/ },
  { id: "setValue:forKey:", pattern: /\bsetValue\b[^\n]*\bforKey\s*:/ },
];

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

const violations = [];

for (const file of walk(iosSources)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        violations.push(`${path.relative(pluginRoot, file)}:${index + 1}: ${rule.id}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("iOS App Store 2.5.2 guard failed:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("iOS App Store 2.5.2 guard passed.");
