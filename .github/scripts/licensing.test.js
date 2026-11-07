// SPDX-License-Identifier: GPL-2.0-or-later
// Run: node .github/scripts/licensing.test.js [path-to-repo-with-ledgers]
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const lib = require('./licensing.js');

const here = path.resolve(__dirname, '..', '..');
const cfg = lib.loadConfig(here);

// Art detection
assert.strictEqual(lib.isArt('unitpics/armcom.png', cfg), true);
assert.strictEqual(lib.isArt('luaui/images/foo.png', cfg), true);
assert.strictEqual(lib.isArt('luaui/widgets/foo.png', cfg), true, 'art extension outside art dirs still counts');
assert.strictEqual(lib.isArt('luaui/images/tool.lua', cfg), false);
assert.strictEqual(lib.isArt('sounds/LICENSE_MANIFEST.md', cfg), false);
assert.strictEqual(lib.isArt('anims/license.txt', cfg), false);
assert.strictEqual(lib.isArt('fonts/OFL-Poppins.txt', cfg), false);
assert.strictEqual(lib.isArt('anims/icexuick_100/cursorattack.txt', cfg), true);
assert.strictEqual(lib.isArt('shaders/foo.glsl', cfg), false);
assert.strictEqual(lib.isArt('objects3d/foo.bos', cfg), false);
assert.strictEqual(lib.artTopForPath('luaui/images/x/y.png', cfg), 'luaui/images');
assert.strictEqual(lib.artTopForPath('luaui/widgets/y.png', cfg), null);

// Labels
assert.strictEqual(lib.licenseLabel('LicenseRef-BAR-CLA-1.0', cfg), 'license: BAR-CLA');
assert.strictEqual(lib.licenseLabel('CC-BY-SA-4.0', cfg), 'license: CC-BY-SA-4.0');
assert.strictEqual(lib.licenseLabel('GPL-2.0-or-later', cfg), 'license: GPL');
assert.strictEqual(lib.licenseLabel('Weird-1.0', cfg), 'license: Weird-1.0');

// Classification against synthetic ledgers
const ledgers = {
  signatures: [
    { file: 'unitpics/intent.png', github_username: 'alice', license: 'CC-BY-SA-4.0', status: 'intent', pr: 7 },
  ],
  assignments: [
    { file: 'unitpics/done.png', license: 'LicenseRef-BAR-CLA-1.0', contributor: 'Beherith', pr: 'manual-audit' },
    { file: 'sounds/wait.wav', license: '', contributor: 'Winter', status: 'awaiting_license', pr: 'manual-audit' },
    { file: 'objects3d/old.s3o', license: 'GPL-2.0-or-later', contributor: 'Floris', pr: 12 },
  ],
  flags: null,
};
const prFiles = [
  { filename: 'unitpics/new.png', status: 'added' },
  { filename: 'unitpics/done.png', status: 'modified' },
  { filename: 'sounds/wait.wav', status: 'modified' },
  { filename: 'sounds/gap.wav', status: 'modified' },
  { filename: 'objects3d/new.s3o', status: 'renamed', previous_filename: 'objects3d/old.s3o' },
  { filename: 'objects3d/moved.s3o', status: 'renamed', previous_filename: 'objects3d/nowhere.s3o' },
  { filename: 'unitpics/intent.png', status: 'added' },
  { filename: 'luarules/gadgets/x.lua', status: 'added' },
  { filename: 'anims/LICENSE_MANIFEST.md', status: 'modified' },
  { filename: 'sounds/bye.wav', status: 'removed' },
];
const c = lib.classifyPrFiles(prFiles, ledgers, cfg);
assert.deepStrictEqual(c.needsLicense, ['unitpics/new.png'], 'only added files without any record need a license');
assert.deepStrictEqual(c.licensed.map(x => [x.file, x.status]), [
  ['unitpics/done.png', 'confirmed'], ['objects3d/new.s3o', 'confirmed'], ['unitpics/intent.png', 'intent'],
]);
assert.strictEqual(c.licensed[1].renamed_from, 'objects3d/old.s3o');
assert.strictEqual(c.licensed[2].pr, 7);
assert.deepStrictEqual(c.legacy.map(x => [x.file, x.status]), [
  ['sounds/wait.wav', 'awaiting'], ['sounds/gap.wav', 'none'], ['objects3d/moved.s3o', 'none'],
]);
assert.deepStrictEqual(c.modified, ['sounds/wait.wav', 'sounds/gap.wav']);
assert.strictEqual(c.artFiles.length, 7);

const rec = lib.recordFor('unitpics/intent.png', ledgers);
assert.strictEqual(rec.status, 'intent');

// Renames touch every ledger
const renameMap = new Map([['unitpics/done.png', 'unitpics/renamed.png']]);
const rn = lib.applyRenames(renameMap, ledgers, cfg);
assert.strictEqual(rn.count, 1);
assert.deepStrictEqual(rn.tops, ['unitpics']);
assert.strictEqual(ledgers.assignments[0].file, 'unitpics/renamed.png');

// Manifest format
const md = lib.renderManifest('luaui/images', [
  { file: 'luaui/images/b.png', license: '', contributor: 'Winter', status: 'awaiting_license', pr: 'manual-audit', date: '2026-10-14T10:00:00Z' },
  { file: 'luaui/images/a.png', license: 'MIT', contributor: 'Floris', pr: 42, date: '2026-05-01', submitted_by: 'PtaQQ' },
], cfg);
assert.ok(md.includes('[legal/POLICY_PROJECT_LICENSE.md](../../legal/POLICY_PROJECT_LICENSE.md)'));
assert.ok(md.includes('| `a.png` | `MIT` | Floris (submitted by PtaQQ) | #42 | 2026-05-01 |'));
assert.ok(md.includes('| `b.png` | _awaiting license_ | Winter | manual-audit | 2026-10-14 |'));
assert.ok(md.endsWith('|\n'));

// Consent helpers
assert.deepStrictEqual(lib.ledgerNamesFor('PtaQQ', cfg), ['PtaQQ', 'PtaQ']);
assert.deepStrictEqual(lib.ledgerNamesFor('nobody', cfg), ['nobody']);
assert.deepStrictEqual(lib.parseConsentChoice('/confirm-license cla', cfg), { license: 'LicenseRef-BAR-CLA-1.0', missing: false });
assert.deepStrictEqual(lib.parseConsentChoice('/confirm-license CC-BY-SA-4.0', cfg), { license: 'CC-BY-SA-4.0', missing: false });
assert.deepStrictEqual(lib.parseConsentChoice('/confirm-license', cfg), { license: null, missing: true });
assert.deepStrictEqual(lib.parseConsentChoice('/confirm-license mit', cfg), { license: null, missing: false });
assert.strictEqual(lib.parseConsentChoice('thanks', cfg), null);
const consentLedgers = {
  signatures: [],
  assignments: [
    { file: 'unitpics/a.png', license: '', contributor: 'PtaQ', status: 'awaiting_license', pr: 'manual-audit', date: '2026-09-01' },
    { file: 'unitpics/b.png', license: '', contributor: 'ptaqq', status: 'awaiting_license', pr: 'manual-audit', date: '2026-09-01' },
    { file: 'unitpics/c.png', license: 'MIT', contributor: 'PtaQ', pr: 3, date: '2026-09-01' },
    { file: 'unitpics/d.png', license: '', contributor: 'Someone', status: 'awaiting_license', pr: 'manual-audit', date: '2026-09-01' },
  ],
  flags: null,
};
const mine = lib.awaitingRowsFor('PtaQQ', consentLedgers, cfg);
assert.deepStrictEqual(mine.map(r => r.file), ['unitpics/a.png', 'unitpics/b.png']);
assert.strictEqual(lib.applyConsent(mine, 'CC-BY-SA-4.0', 'consent-issue', 77, '2026-11-06'), 2);
assert.deepStrictEqual(consentLedgers.assignments[0], { file: 'unitpics/a.png', license: 'CC-BY-SA-4.0', contributor: 'PtaQ', pr: 77, date: '2026-11-06', source: 'consent-issue' });
assert.strictEqual(lib.awaitingRowsFor('PtaQQ', consentLedgers, cfg).length, 0);

// Per-repository overrides
{
  const os = require('os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lic-'));
  fs.mkdirSync(path.join(dir, '.github'));
  fs.writeFileSync(path.join(dir, '.github', 'licensing.json'), JSON.stringify({
    pr_choices: ['A'], licenses: { A: { name: 'A' } },
    overrides: { 'org/private': { pr_choices: ['A', 'B'], licenses: { B: { name: 'B', label: 'license: B' } }, bot: { name: 'Private Bot' } } },
  }));
  const saved = process.env.GITHUB_REPOSITORY;
  process.env.GITHUB_REPOSITORY = 'org/public';
  const pub = lib.loadConfig(dir);
  assert.deepStrictEqual(pub.pr_choices, ['A']);
  assert.strictEqual(pub.bot.name, 'BAR CLA Bot');
  process.env.GITHUB_REPOSITORY = 'org/private';
  const priv = lib.loadConfig(dir);
  assert.deepStrictEqual(priv.pr_choices, ['A', 'B']);
  assert.strictEqual(priv.licenses.A.name, 'A');
  assert.strictEqual(priv.licenses.B.label, 'license: B');
  assert.strictEqual(priv.bot.name, 'Private Bot');
  assert.strictEqual(priv.overrides, undefined);
  if (saved === undefined) delete process.env.GITHUB_REPOSITORY; else process.env.GITHUB_REPOSITORY = saved;
  fs.rmSync(dir, { recursive: true });
}

// Optional parity check: regenerate manifests from a real ledger and diff against disk
const target = process.argv[2];
if (target) {
  const tcfg = lib.loadConfig(path.resolve(target));
  const led = lib.loadLedgers(tcfg);
  let mismatches = 0;
  for (const top of tcfg.art_dirs) {
    const p = path.join(tcfg.root, top, 'LICENSE_MANIFEST.md');
    if (!fs.existsSync(p)) continue;
    const entries = led.assignments.filter(e => lib.artTopForPath(e.file, tcfg) === top);
    const want = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    const got = lib.renderManifest(top, entries, tcfg);
    if (want !== got) {
      mismatches++;
      const w = want.split('\n'), g = got.split('\n');
      const i = w.findIndex((l, k) => l !== g[k]);
      console.log(`MISMATCH ${top}: line ${i + 1}\n  disk: ${w[i]}\n  lib : ${g[i]}`);
    }
  }
  console.log(`manifest parity against ${target}: ${mismatches} mismatching manifest(s)`);
  assert.strictEqual(mismatches, 0);
}

console.log('licensing.js: all tests passed');
