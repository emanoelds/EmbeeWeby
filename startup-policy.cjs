'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { cleanSessionURL, cleanSession, recoverySession } = require('./session-state.cjs');

function cleanStartup(value) {
  const mode = ['newtab', 'restore', 'pages'].includes(value?.mode) ? value.mode : 'newtab', urls = [], seen = new Set();
  for (const entry of (Array.isArray(value?.urls) ? value.urls : []).slice(0, 200)) {
    const url = cleanSessionURL(entry);
    if (!url || seen.has(url)) continue;
    seen.add(url); urls.push(url);
    if (urls.length === 20) break;
  }
  return { mode, urls };
}

function chooseStartupSession(value, startup) {
  const saved = cleanSession(value), policy = cleanStartup(startup), recovery = recoverySession(saved);
  // A crash snapshot is offered for explicit recovery, never loaded automatically.
  if (recovery) return { tabs: [{ url: '' }], active: 0, recovery };
  if (policy.mode === 'restore' && saved.tabs.length) return { tabs: saved.tabs, active: saved.active, recovery: null };
  if (policy.mode === 'pages' && policy.urls.length) return { tabs: policy.urls.map(url => ({ url })), active: 0, recovery: null };
  return { tabs: [{ url: '' }], active: 0, recovery: null };
}

function startupFile(directory, owner) {
  return path.join(directory, 'startup-settings', crypto.createHash('sha256').update(String(owner || 'local')).digest('hex').slice(0, 24) + '.json');
}

function loadStartup(directory, owner) {
  try {
    const file = startupFile(directory, owner);
    if (fs.statSync(file).size > 256 * 1024) return cleanStartup();
    return cleanStartup(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch { return cleanStartup(); }
}

function saveStartup(directory, owner, value) {
  let temporary;
  try {
    const file = startupFile(directory, owner), text = JSON.stringify(cleanStartup(value));
    try { if (fs.readFileSync(file, 'utf8') === text) return true; } catch {}
    fs.mkdirSync(path.dirname(file), { recursive: true });
    temporary = file + '.' + process.pid + '.' + crypto.randomUUID() + '.tmp';
    fs.writeFileSync(temporary, text, { mode: 0o600 });
    fs.renameSync(temporary, file);
    return true;
  } catch { return false; }
  finally { if (temporary) try { fs.unlinkSync(temporary); } catch {} }
}

module.exports = { cleanStartup, chooseStartupSession, loadStartup, saveStartup };
