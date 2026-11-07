// SPDX-License-Identifier: GPL-2.0-or-later
// Shared rules for the CLA bot: config, art detection, ledgers, manifests.
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  art_dirs: ['anims', 'bitmaps', 'fonts', 'icons', 'modelmaterials', 'modelmaterials_gl4',
    'music', 'objects3d', 'sidepics', 'sounds', 'unitpics', 'unittextures'],
  art_extensions: ['s3o', 'obj', 'fbx', 'dae', '3ds', 'png', 'jpg', 'jpeg', 'tga', 'dds', 'bmp',
    'gif', 'svg', 'psd', 'xcf', 'ogg', 'wav', 'mp3', 'flac', 'opus', 'bvh', 'blend', 'kra', 'spr',
    'ttf', 'otf', 'ttc'],
  code_extensions: ['glsl', 'frag', 'vert', 'glslf', 'glslv', 'bos', 'cob', 'lua', 'py'],
  doc_extensions: ['md', 'ipynb'],
  notice_stem_pattern: 'licen[cs]e|^ofl(?:$|[-_])',
  licenses: {
    'LicenseRef-BAR-CLA-1.0': { name: 'BAR Project License (CLA)', label: 'license: BAR-CLA' },
    'CC-BY-SA-4.0': { name: 'CC-BY-SA 4.0', label: 'license: CC-BY-SA-4.0' },
  },
  pr_choices: ['LicenseRef-BAR-CLA-1.0', 'CC-BY-SA-4.0'],
  ledger: {
    signatures: '.github/cla-signatures.json',
    assignments: '.github/file-license-assignments.json',
    flags: 'license_comments_flags.json',
    contributors: '.github/contributors.json',
  },
  bot: { name: 'BAR CLA Bot', email: 'cla-bot@beyondallreason.info' },
  status_context: 'BAR CLA / License Check',
  legal_dir: 'legal',
};

function loadConfig(root) {
  root = root || process.env.GITHUB_WORKSPACE || process.cwd();
  let cfg = {};
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(root, '.github', 'licensing.json'), 'utf8'));
  } catch (e) { /* defaults apply */ }
  // A private mirror shares this file with the public repo; overrides keyed by
  // owner/name let it differ (extra PR choices, other bot identity).
  const slug = process.env.GITHUB_REPOSITORY || '';
  const over = (cfg.overrides && slug && cfg.overrides[slug]) || {};
  const merged = Object.assign({}, DEFAULT_CONFIG, cfg, over);
  merged.ledger = Object.assign({}, DEFAULT_CONFIG.ledger, cfg.ledger || {}, over.ledger || {});
  merged.bot = Object.assign({}, DEFAULT_CONFIG.bot, cfg.bot || {}, over.bot || {});
  merged.licenses = Object.assign({}, cfg.licenses || DEFAULT_CONFIG.licenses, over.licenses || {});
  delete merged.overrides;
  merged.root = root;
  merged._noticeRe = new RegExp(merged.notice_stem_pattern, 'i');
  merged._artDirsSorted = [...merged.art_dirs].sort((a, b) => b.length - a.length);
  return merged;
}

function extOf(file) {
  const base = path.posix.basename(file);
  const i = base.lastIndexOf('.');
  return i < 0 ? '' : base.slice(i + 1).toLowerCase();
}

function isCode(file, cfg) {
  return cfg.code_extensions.includes(extOf(file));
}

// Manifests, license notices and docs sit beside assets but are not assets.
function isNonAsset(file, cfg) {
  const ext = extOf(file);
  if (cfg.code_extensions.includes(ext) || cfg.doc_extensions.includes(ext)) return true;
  if (ext !== 'txt') return false;
  const base = path.posix.basename(file);
  return cfg._noticeRe.test(base.slice(0, base.length - 4));
}

function artTopForPath(file, cfg) {
  for (const d of cfg._artDirsSorted) {
    if (file.startsWith(d + '/')) return d;
  }
  return null;
}

function isArt(file, cfg) {
  if (isNonAsset(file, cfg)) return false;
  return cfg.art_extensions.includes(extOf(file)) || artTopForPath(file, cfg) !== null;
}

function readJson(p, fallback) {
  try {
    const txt = fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
    return txt.trim() ? JSON.parse(txt) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

function loadLedgers(cfg) {
  const r = cfg.root;
  const flagsRaw = readJson(path.join(r, cfg.ledger.flags), null);
  return {
    signatures: readJson(path.join(r, cfg.ledger.signatures), []),
    assignments: readJson(path.join(r, cfg.ledger.assignments), []),
    flags: flagsRaw && Array.isArray(flagsRaw.files) ? flagsRaw : null,
  };
}

function saveLedgers(cfg, ledgers, which) {
  const r = cfg.root;
  const all = !which;
  if (all || which.includes('signatures')) writeJson(path.join(r, cfg.ledger.signatures), ledgers.signatures);
  if (all || which.includes('assignments')) writeJson(path.join(r, cfg.ledger.assignments), ledgers.assignments);
  if ((all || which.includes('flags')) && ledgers.flags) writeJson(path.join(r, cfg.ledger.flags), ledgers.flags);
}

// Assignments ledger is authoritative; signatures hold intent for open PRs.
function recordFor(file, ledgers) {
  const a = ledgers.assignments.find(x => x.file === file);
  if (a) {
    const license = a.license || '';
    return {
      file, license, author: a.contributor || '', pr: a.pr,
      status: license ? 'confirmed' : 'awaiting', source: 'assignment',
      submitted_by: a.submitted_by || null,
    };
  }
  const s = ledgers.signatures.find(x => x.file === file);
  if (s) {
    return {
      file, license: s.license || '', author: s.github_username || '', pr: s.pr,
      status: s.status === 'confirmed' ? 'confirmed' : 'intent', source: 'signature',
      submitted_by: s.proxy_submitter || null,
    };
  }
  return null;
}

// Split a PR's files (pulls.listFiles items) by what the bot must do with them.
// Only files the PR adds can be licensed by its author; edits and moves keep
// their record. Intent counts as licensed; callers check status and pr.
function classifyPrFiles(prFiles, ledgers, cfg) {
  const out = { artFiles: [], needsLicense: [], licensed: [], legacy: [], modified: [] };
  for (const f of prFiles) {
    const file = f.filename;
    if (f.status === 'removed' || !isArt(file, cfg)) continue;
    out.artFiles.push(file);
    const rec = recordFor(file, ledgers);
    if (f.status === 'renamed' && f.previous_filename) {
      const old = recordFor(f.previous_filename, ledgers);
      const r = rec && rec.license ? rec : old;
      if (r && r.license) {
        out.licensed.push({ file, license: r.license, author: r.author, status: r.status, pr: r.pr, renamed_from: r === old ? f.previous_filename : undefined });
      } else {
        out.legacy.push({ file, status: r ? r.status : 'none', author: r ? r.author : '', renamed_from: f.previous_filename });
      }
      continue;
    }
    if (rec && rec.license) {
      out.licensed.push({ file, license: rec.license, author: rec.author, status: rec.status, pr: rec.pr });
      continue;
    }
    if (f.status === 'modified') {
      out.modified.push(file);
      out.legacy.push({ file, status: rec ? rec.status : 'none', author: rec ? rec.author : '' });
      continue;
    }
    out.needsLicense.push(file);
  }
  return out;
}

function licenseName(id, cfg) {
  const l = cfg.licenses[id];
  return l && l.name ? l.name : id;
}

function licenseLabel(id, cfg) {
  const l = cfg.licenses[id];
  return l && l.label ? l.label : `license: ${id}`;
}

function allLicenseLabels(cfg) {
  return Object.keys(cfg.licenses).map(id => licenseLabel(id, cfg));
}

// Rewrites ledger paths for renames; returns the art tops touched.
function applyRenames(renameMap, ledgers, cfg) {
  const tops = new Set();
  let count = 0;
  const lists = [ledgers.signatures, ledgers.assignments, ledgers.flags ? ledgers.flags.files : []];
  for (const list of lists) {
    for (const e of list) {
      const dst = renameMap.get(e.file);
      if (!dst) continue;
      for (const p of [e.file, dst]) {
        const t = artTopForPath(p, cfg);
        if (t) tops.add(t);
      }
      e.file = dst;
      count++;
    }
  }
  return { count, tops: [...tops] };
}

function byFile(a, b) {
  const x = a.file || '', y = b.file || '';
  return x < y ? -1 : x > y ? 1 : 0;
}

// Ledger names a GitHub login may answer for: its own login plus any
// display names mapped to it in contributors.json.
function ledgerNamesFor(login, cfg) {
  const map = readJson(path.join(cfg.root, cfg.ledger.contributors), {});
  const names = new Set([login]);
  for (const [name, info] of Object.entries(map)) {
    if (name.startsWith('_')) continue;
    const gh = typeof info === 'string' ? info : (info && info.github) || '';
    if (gh.toLowerCase() === login.toLowerCase()) names.add(name);
  }
  return [...names];
}

function awaitingRowsFor(login, ledgers, cfg) {
  const names = new Set(ledgerNamesFor(login, cfg).map(n => n.toLowerCase()));
  return ledgers.assignments.filter(a => !a.license && names.has((a.contributor || '').toLowerCase()));
}

// Resolves "/confirm-license <choice>" to a license id from pr_choices.
function parseConsentChoice(body, cfg) {
  const m = (body || '').trim().match(/^\/confirm-license(?:\s+(\S+))?\s*$/i);
  if (!m) return null;
  const arg = (m[1] || '').toLowerCase();
  if (!arg) return { license: null, missing: true };
  const aliases = { cla: 'LicenseRef-BAR-CLA-1.0', 'bar-cla': 'LicenseRef-BAR-CLA-1.0', cc: 'CC-BY-SA-4.0', 'cc-by-sa': 'CC-BY-SA-4.0' };
  const id = aliases[arg] || cfg.pr_choices.find(c => c.toLowerCase() === arg) || null;
  return { license: id, missing: false };
}

// Applies one license to every awaiting row of the answering contributor.
function applyConsent(rows, license, source, ref, date) {
  for (const a of rows) {
    a.license = license;
    a.pr = ref;
    a.date = date;
    a.source = source;
    delete a.status;
  }
  return rows.length;
}

function prCell(pr) {
  if (pr === null || pr === undefined || pr === '' || pr === 0) return '';
  const s = String(pr);
  return /^\d+$/.test(s) ? `#${s}` : s;
}

// Same table the auditor writes, so either tool can regenerate a manifest.
function renderManifest(top, entries, cfg) {
  const legalPrefix = '../'.repeat(top.split('/').length);
  // Code-point order, same as Python's sorted(), so both tools emit identical files.
  const sorted = [...entries].sort((a, b) => byFile(a, b));
  const lines = [];
  lines.push(`# License Manifest — \`${top}/\``);
  lines.push('');
  lines.push('<!-- AUTO-GENERATED by the BAR License Auditor / .github/workflows/cla-check.yml on every PR merge. Do not edit by hand. -->');
  lines.push('');
  lines.push(`This file lists the recorded license, contributor, and source PR for every art asset under \`${top}/\` that has passed through the BAR CLA bot. Assets not yet processed through the CLA flow are not listed here — they fall under the project policy in [legal/POLICY_PROJECT_LICENSE.md](${legalPrefix}${cfg.legal_dir}/POLICY_PROJECT_LICENSE.md).`);
  lines.push('');
  lines.push(`Total assets recorded: **${sorted.length}**`);
  lines.push('');
  lines.push('| File | License | Contributor | PR | Date |');
  lines.push('|---|---|---|---|---|');
  for (const e of sorted) {
    const fpath = (e.file || '').replace(/\\/g, '/');
    const sub = fpath.startsWith(top + '/') ? fpath.slice(top.length + 1) : fpath;
    const lic = e.license || '';
    let contrib = e.contributor || '';
    if (e.submitted_by) contrib += ` (submitted by ${e.submitted_by})`;
    const date = (e.date || '').split('T')[0];
    let licCell = lic ? `\`${lic}\`` : '';
    if (!lic && e.status === 'awaiting_license') licCell = '_awaiting license_';
    const fileCell = sub ? `\`${sub}\`` : '';
    lines.push(`| ${fileCell} | ${licCell} | ${contrib} | ${prCell(e.pr)} | ${date} |`);
  }
  if (sorted.length === 0) lines.push('| _(no assets recorded yet)_ |  |  |  |  |');
  lines.push('');
  return lines.join('\n');
}

// Writes manifests for the given tops (all art tops when null); skips tops
// absent on disk or with no entries. Returns written paths relative to root.
function regenerateManifests(cfg, assignments, tops) {
  const byTop = new Map();
  for (const e of assignments) {
    const t = artTopForPath(e.file || '', cfg);
    if (!t) continue;
    if (!byTop.has(t)) byTop.set(t, []);
    byTop.get(t).push(e);
  }
  const written = [];
  const wanted = tops ? tops : cfg.art_dirs;
  for (const top of wanted) {
    const dir = path.join(cfg.root, top);
    if (!fs.existsSync(dir)) continue;
    const entries = byTop.get(top) || [];
    if (entries.length === 0) continue;
    const rel = path.posix.join(top, 'LICENSE_MANIFEST.md');
    fs.writeFileSync(path.join(cfg.root, rel), renderManifest(top, entries, cfg));
    written.push(rel);
  }
  return written;
}

module.exports = {
  DEFAULT_CONFIG, loadConfig, extOf, isCode, isNonAsset, isArt, artTopForPath,
  readJson, writeJson, loadLedgers, saveLedgers, recordFor, classifyPrFiles,
  licenseName, licenseLabel, allLicenseLabels, applyRenames, byFile, renderManifest, regenerateManifests,
  ledgerNamesFor, awaitingRowsFor, parseConsentChoice, applyConsent,
};
