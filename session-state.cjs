'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');

function cleanSessionURL(value) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || text.length > 8192 || /[\x00-\x1f\x7f]/.test(text)) return '';
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.href.length <= 8192 ? url.href : '';
  } catch { return ''; }
}

function cleanTabSession(value) {
  const tabs = (Array.isArray(value?.tabs) ? value.tabs : []).slice(0, 200).map(tab => {
    if (['settings', 'history'].includes(tab?.internal)) return { internal: tab.internal };
    return { url: cleanSessionURL(tab?.url) };
  });
  const active = tabs.length ? Math.max(0, Math.min(tabs.length - 1, Number.isInteger(value?.active) ? value.active : 0)) : 0;
  return { tabs, active };
}

function meaningfulSession(value) {
  return Array.isArray(value?.tabs) && value.tabs.some(tab => ['settings', 'history'].includes(tab?.internal) || Boolean(cleanSessionURL(tab?.url)));
}

function cleanSession(value) {
  const session = cleanTabSession(value), backup = cleanTabSession(value?.recovery);
  return { ...session, cleanExit: value?.cleanExit !== false, recovery: meaningfulSession(backup) ? backup : null };
}

// Only a recorded unclean exit is a crash. Old session files migrate as clean.
function recoverySession(value) {
  const saved = cleanSession(value);
  if (saved.recovery) return saved.recovery;
  return saved.cleanExit === false && meaningfulSession(saved) ? { tabs: saved.tabs, active: saved.active } : null;
}

// Pure acknowledgement: the caller persists this value and clears its in-memory recovery.
// restore=false retains current tabs; restore=true selects the preserved crash snapshot.
function acknowledgeRecovery(value, { restore = false } = {}) {
  const saved = cleanSession(value), backup = recoverySession(saved), chosen = restore && backup ? backup : saved;
  return { tabs: chosen.tabs, active: chosen.active, cleanExit: saved.cleanExit, recovery: null };
}

function sessionFile(directory, owner) {
  return path.join(directory, 'sessions', crypto.createHash('sha256').update(String(owner || 'local')).digest('hex').slice(0, 24) + '.json');
}

function loadSession(directory, owner) {
  try {
    const file = sessionFile(directory, owner);
    if (fs.statSync(file).size > 4 * 1024 * 1024) return cleanSession();
    return cleanSession(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch { return cleanSession(); }
}

function saveSession(directory, owner, value) {
  let temporary;
  try {
    const file = sessionFile(directory, owner), saved = cleanSession(value);
    // Legacy callers may omit recovery. An explicit null (acknowledgeRecovery) clears it.
    if (!Object.hasOwn(value || {}, 'recovery')) saved.recovery = loadSession(directory, owner).recovery;
    const text = JSON.stringify(saved);
    try { if (fs.readFileSync(file, 'utf8') === text) return true; } catch {}
    fs.mkdirSync(path.dirname(file), { recursive: true });
    temporary = file + '.' + process.pid + '.' + crypto.randomUUID() + '.tmp';
    fs.writeFileSync(temporary, text, { mode: 0o600 });
    fs.renameSync(temporary, file);
    return true;
  } catch { return false; }
  finally { if (temporary) try { fs.unlinkSync(temporary); } catch {} }
}

module.exports = { cleanSessionURL, cleanTabSession, meaningfulSession, cleanSession, recoverySession, acknowledgeRecovery, loadSession, saveSession };
