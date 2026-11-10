#!/usr/bin/env node
/**
 * Packed example CI: turn on R8 for the generated Android app release build so
 * consumer rules from the plugin are exercised. Idempotent marker: cursor-r8-ci
 */
import fs from "node:fs";
import process from "node:process";

const file = process.argv[2];
if (!file) {
  console.error("usage: patch-example-android-release-minify.mjs <path-to-app-build.gradle>");
  process.exit(2);
}

let text = fs.readFileSync(file, "utf8");
if (text.includes("cursor-r8-ci")) {
  if (!/minifyEnabled(?:\s*=\s*|\s+)true/.test(text) || !/shrinkResources(?:\s*=\s*|\s+)true/.test(text)) {
    console.error("[patch-example-android-release-minify] cursor-r8-ci marker present but release minify or resource shrinking is disabled");
    process.exit(1);
  }
  process.exit(0);
}

const needle = `        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }`;

const insert = `        release {
            // cursor-r8-ci: release minify for CI (debug signing)
            minifyEnabled true
            shrinkResources true
            signingConfig signingConfigs.debug
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }`;

if (!text.includes(needle)) {
  console.error(`[patch-example-android-release-minify] expected release block not found in ${file}`);
  process.exit(1);
}

text = text.replace(needle, insert);
fs.writeFileSync(file, text, "utf8");
