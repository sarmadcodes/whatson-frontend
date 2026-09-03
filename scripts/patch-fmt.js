#!/usr/bin/env node
'use strict';

/**
 * React Native 0.82.1 pins RCT-Folly to fmt 11.0.2, whose consteval-based
 * FMT_STRING checking fails to compile under Xcode 26.4's newer Apple Clang
 * ("call to consteval function ... is not a constant expression").
 * Upstream React Native's own fix is bumping fmt to 12.1.0. This script
 * applies that same bump directly to the podspecs inside node_modules so
 * `pod install` resolves fmt 12.1.0 consistently (RCT-Folly's dependency
 * constraint is rewritten too, so there is no version conflict).
 *
 * Runs automatically via the "postinstall" npm script, so a fresh
 * `npm install` + `pod install` reproduces the fix with no manual steps.
 */

const fs = require('fs');
const path = require('path');

const OLD_VERSION = '11.0.2';
const NEW_VERSION = '12.1.0';

const reactNativeDir = path.join(__dirname, '..', 'node_modules', 'react-native');
const podspecDir = path.join(reactNativeDir, 'third-party-podspecs');

const targets = [
  {
    label: 'fmt.podspec',
    file: path.join(podspecDir, 'fmt.podspec'),
    pattern: new RegExp(`(['"])${OLD_VERSION.replace(/\./g, '\\.')}\\1`, 'g'),
    replace: (m, quote) => `${quote}${NEW_VERSION}${quote}`,
  },
  {
    label: 'RCT-Folly.podspec',
    file: path.join(podspecDir, 'RCT-Folly.podspec'),
    pattern: new RegExp(
      `(spec\\.dependency\\s*['"]fmt['"]\\s*,\\s*['"])${OLD_VERSION.replace(/\./g, '\\.')}(['"])`,
      'g',
    ),
    replace: (m, prefix, quote) => `${prefix}${NEW_VERSION}${quote}`,
  },
];

let patchedAny = false;

for (const target of targets) {
  if (!fs.existsSync(target.file)) {
    // node_modules/react-native isn't installed yet (e.g. fresh Android/Windows-only
    // install before `npm install` has run), or the podspec moved. Not fatal here —
    // pod install itself will fail loudly on a Mac if this file is genuinely missing.
    console.warn(`[patch-fmt] SKIP: ${target.label} not found at ${target.file}`);
    continue;
  }

  const original = fs.readFileSync(target.file, 'utf8');

  if (original.includes(NEW_VERSION) && !original.includes(OLD_VERSION)) {
    console.log(`[patch-fmt] ${target.label} already patched to fmt ${NEW_VERSION} — skipping.`);
    continue;
  }

  if (!original.includes(OLD_VERSION)) {
    throw new Error(
      `[patch-fmt] FAILED: ${target.label} does not contain the expected version string ` +
      `"${OLD_VERSION}". React Native's podspec format may have changed in this version — ` +
      `inspect ${target.file} manually and update scripts/patch-fmt.js accordingly.`,
    );
  }

  const patched = original.replace(target.pattern, target.replace);

  if (patched === original) {
    throw new Error(
      `[patch-fmt] FAILED: found "${OLD_VERSION}" in ${target.label} but the replacement ` +
      `pattern did not match it. Inspect ${target.file} manually and update scripts/patch-fmt.js.`,
    );
  }

  fs.writeFileSync(target.file, patched, 'utf8');
  console.log(`[patch-fmt] Patched ${target.label}: fmt ${OLD_VERSION} -> ${NEW_VERSION}`);
  patchedAny = true;
}

if (patchedAny) {
  console.log('[patch-fmt] Done. Run `cd ios && pod install` to pick up fmt 12.1.0.');
}
