'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const LIMIT = 500;
const PROGRESS_INTERVAL = 200;
const SAVE_INTERVAL = 500;
const EXISTS_INTERVAL = 2000;
const PHASES = new Set(['progressing', 'completed', 'cancelled', 'interrupted']);
const TERMINAL = new Set(['completed', 'cancelled', 'interrupted']);

const bytes = value => Number.isFinite(value) && value > 0 ? Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value)) : 0;
const stamp = (value, fallback = 0) => Number.isFinite(value) && value >= 0 && value <= 8640000000000000 ? value : fallback;
const validId = value => typeof value === 'string' && /^[a-f\d-]{36}$/i.test(value);
const ownerKey = owner => {
  if (typeof owner !== 'string' || !owner || owner.length > 4096) throw new Error('Perfil de download inválido.');
  return owner;
};
const privatePath = value => typeof value === 'string' && value.length <= 32768 && !/[\x00-\x1f]/.test(value) && path.isAbsolute(value) ? value : '';
const filename = value => {
  const name = String(value || '').split(/[\\/]/).at(-1).replace(/[\x00-\x1f\x7f\u202a-\u202e\u2066-\u2069]/g, '').trim();
  return (name || 'Arquivo').slice(0, 300);
};
const readItem = (item, method, fallback) => {
  try { return typeof item?.[method] === 'function' ? item[method]() : fallback; } catch { return fallback; }
};

/**
 * Main-process-only download storage. Paths never leave this module.
 * onChange(owner, downloads), onEvent({ owner, type: 'started'|'finished', download }).
 * snapshot(owner) returns metadata; run(owner,{action,id}) returns {ok,downloads,...}.
 * Actions: list/status, pause, resume, cancel, open, reveal, remove, clear.
 * clear(owner,{since,until}) removes terminal list entries, preserving their files.
 * attach(session,owner) is idempotent and refuses assigning a session to another owner.
 */
function createDownloadManager({ directory, onChange = () => {}, onEvent = () => {} } = {}) {
  if (typeof directory !== 'string' || !path.isAbsolute(directory)) throw new Error('Pasta de downloads inválida.');
  const root = path.resolve(directory), owners = new Map(), bindings = new Map();
  let disposed = false;
  fs.mkdirSync(root, { recursive: true });

  function storePath(owner) { return path.join(root, crypto.createHash('sha256').update(owner).digest('hex') + '.json'); }

  function persist(bucket) {
    if (bucket.saveTimer) { clearTimeout(bucket.saveTimer); bucket.saveTimer = null; }
    const target = storePath(bucket.owner), temporary = target + '.' + process.pid + '.' + crypto.randomUUID() + '.tmp';
    try {
      const downloads = bucket.records.slice(0, LIMIT).map(record => ({
        id: record.id, name: record.name, phase: record.phase, received: record.received, total: record.total,
        startedAt: record.startedAt, updatedAt: record.updatedAt, finishedAt: record.finishedAt,
        path: record.path, recovered: Boolean(record.recovered)
      }));
      fs.writeFileSync(temporary, JSON.stringify({ version: 1, downloads }), { mode: 0o600 });
      fs.renameSync(temporary, target);
      bucket.saveError = false;
    } catch {
      bucket.saveError = true;
    } finally {
      try { fs.unlinkSync(temporary); } catch {}
    }
  }

  function scheduleSave(bucket) {
    if (!bucket.saveTimer && !disposed) {
      bucket.saveTimer = setTimeout(() => { bucket.saveTimer = null; persist(bucket); }, SAVE_INTERVAL);
      bucket.saveTimer.unref?.();
    }
  }

  function getOwner(owner) {
    owner = ownerKey(owner);
    if (owners.has(owner)) return owners.get(owner);
    const bucket = { owner, records: [], live: new Map(), notifyTimer: null, saveTimer: null, notifiedAt: 0, saveError: false };
    owners.set(owner, bucket);
    let recovered = false;
    try {
      const file = storePath(owner);
      if (fs.statSync(file).size > 3 * 1024 * 1024) throw new Error('Arquivo de lista excedeu o limite.');
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (data.version !== 1 || !Array.isArray(data.downloads)) throw new Error('Lista inválida.');
      const ids = new Set();
      for (const item of data.downloads.slice(0, LIMIT)) {
        if (!item || !validId(item.id) || ids.has(item.id) || !PHASES.has(item.phase)) continue;
        ids.add(item.id);
        const wasActive = item.phase === 'progressing' || item.phase === 'interrupted' && !stamp(item.finishedAt);
        const record = {
          id: item.id, name: filename(item.name), phase: wasActive ? 'interrupted' : item.phase,
          received: bytes(item.received), total: bytes(item.total), path: privatePath(item.path),
          startedAt: stamp(item.startedAt), updatedAt: stamp(item.updatedAt), finishedAt: stamp(item.finishedAt),
          recovered: wasActive || Boolean(item.recovered), existence: null
        };
        if (wasActive) { recovered = true; record.updatedAt = record.finishedAt = Date.now(); }
        bucket.records.push(record);
      }
    } catch {}
    if (recovered) persist(bucket);
    return bucket;
  }

  function fileExists(record) {
    if (record.phase !== 'completed' || !record.path) return false;
    if (!record.existence || record.existence.path !== record.path || Date.now() - record.existence.at >= EXISTS_INTERVAL) {
      let exists = false;
      try { exists = fs.existsSync(record.path); } catch {}
      record.existence = { path: record.path, at: Date.now(), value: exists };
    }
    return record.existence.value;
  }

  function metadata(bucket, record) {
    const live = bucket.live.get(record.id), active = Boolean(live && !live.finished);
    const paused = active && Boolean(readItem(live.item, 'isPaused', false));
    const canResume = active && Boolean(readItem(live.item, 'canResume', false)) && (paused || record.phase === 'interrupted');
    const percent = record.phase === 'completed' ? 100 : record.total ? Math.min(100, Math.round(record.received / record.total * 100)) : null;
    return {
      id: record.id, name: record.name, phase: record.phase, status: record.phase,
      received: record.received, total: record.total, percent, active, paused, canResume,
      exists: fileExists(record), recovered: Boolean(record.recovered),
      startedAt: record.startedAt, updatedAt: record.updatedAt, finishedAt: record.finishedAt,
      timestamp: record.startedAt
    };
  }

  function snapshot(owner) {
    const bucket = getOwner(owner);
    return bucket.records.map(record => metadata(bucket, record));
  }

  function emitChange(bucket, immediate = false) {
    if (disposed) return;
    if (immediate || Date.now() - bucket.notifiedAt >= PROGRESS_INTERVAL) {
      if (bucket.notifyTimer) { clearTimeout(bucket.notifyTimer); bucket.notifyTimer = null; }
      bucket.notifiedAt = Date.now();
      try { onChange(bucket.owner, snapshot(bucket.owner)); } catch {}
      return;
    }
    if (!bucket.notifyTimer) {
      bucket.notifyTimer = setTimeout(() => { bucket.notifyTimer = null; emitChange(bucket, true); }, Math.max(1, PROGRESS_INTERVAL - (Date.now() - bucket.notifiedAt)));
      bucket.notifyTimer.unref?.();
    }
  }

  function emitEvent(bucket, type, record) {
    if (!disposed) try { onEvent({ owner: bucket.owner, type, download: metadata(bucket, record) }); } catch {}
  }

  function refreshRecord(record, item, phase) {
    record.received = bytes(readItem(item, 'getReceivedBytes', record.received));
    record.total = bytes(readItem(item, 'getTotalBytes', record.total));
    const saved = privatePath(readItem(item, 'getSavePath', record.path));
    if (saved) { record.path = saved; record.name = filename(saved); }
    if (PHASES.has(phase)) record.phase = phase;
    record.updatedAt = Date.now();
  }

  function finish(bucket, record, runtime, phase) {
    if (runtime.finished) return;
    runtime.finished = true;
    refreshRecord(record, runtime.item, TERMINAL.has(phase) ? phase : 'interrupted');
    record.finishedAt = Date.now();
    runtime.item.removeListener('updated', runtime.updated);
    runtime.item.removeListener('done', runtime.done);
    bucket.live.delete(record.id);
    persist(bucket);
    emitChange(bucket, true);
    emitEvent(bucket, 'finished', record);
  }

  function attach(session, owner) {
    if (disposed) throw new Error('Gerenciador de downloads encerrado.');
    owner = ownerKey(owner);
    const previous = bindings.get(session);
    if (previous) {
      if (previous.owner !== owner) throw new Error('A sessão já pertence a outro perfil.');
      return;
    }
    if (!session || typeof session.on !== 'function' || typeof session.removeListener !== 'function') throw new Error('Sessão inválida.');
    const bucket = getOwner(owner);
    const listener = (event, item) => {
      if (disposed || !item || typeof item.on !== 'function') return;
      // Never discard an active item to make room for history. Refuse excessive concurrency.
      while (bucket.records.length >= LIMIT) {
        const index = bucket.records.findLastIndex(record => !bucket.live.has(record.id));
        if (index < 0) {
          const rejected = { id: crypto.randomUUID(), name: filename(readItem(item, 'getFilename', 'Arquivo')), phase: 'cancelled', received: 0, total: bytes(readItem(item, 'getTotalBytes', 0)), path: '', startedAt: Date.now(), updatedAt: Date.now(), finishedAt: Date.now(), recovered: false };
          if (typeof event?.preventDefault === 'function') event.preventDefault();
          else try { item.cancel(); } catch {}
          emitEvent(bucket, 'finished', rejected);
          return;
        }
        bucket.records.splice(index, 1);
      }
      const record = { id: crypto.randomUUID(), name: filename(readItem(item, 'getFilename', 'Arquivo')), phase: 'progressing', received: 0, total: 0, path: '', startedAt: Date.now(), updatedAt: Date.now(), finishedAt: 0, recovered: false, existence: null };
      const runtime = { item, finished: false, updated: null, done: null };
      refreshRecord(record, item, readItem(item, 'getState', 'progressing'));
      runtime.updated = (_event, phase) => {
        if (disposed || runtime.finished) return;
        refreshRecord(record, item, phase === 'interrupted' ? 'interrupted' : 'progressing');
        scheduleSave(bucket);
        emitChange(bucket);
      };
      runtime.done = (_event, phase) => { if (!disposed) finish(bucket, record, runtime, phase); };
      bucket.records.unshift(record);
      bucket.live.set(record.id, runtime);
      item.on('updated', runtime.updated);
      item.once('done', runtime.done);
      persist(bucket);
      emitChange(bucket, true);
      emitEvent(bucket, 'started', record);
    };
    bindings.set(session, { owner, listener });
    session.on('will-download', listener);
    emitChange(bucket, true);
  }

  function result(bucket, extra = {}) { return { ok: true, downloads: snapshot(bucket.owner), ...extra }; }
  function failure(bucket, message) { return { ok: false, message, downloads: bucket ? snapshot(bucket.owner) : [] }; }

  function clear(owner, { since = 0, until = Date.now() } = {}) {
    if (disposed) return failure(null, 'Gerenciador de downloads encerrado.');
    const bucket = getOwner(owner);
    if (!Number.isFinite(since) || since < 0 || !Number.isFinite(until) || until < since) return failure(bucket, 'Período inválido.');
    const previous = bucket.records.length;
    bucket.records = bucket.records.filter(record => bucket.live.has(record.id) || !TERMINAL.has(record.phase) || record.startedAt < since || record.startedAt > until);
    const removed = previous - bucket.records.length;
    if (removed) { persist(bucket); emitChange(bucket, true); }
    return result(bucket, { removed });
  }

  async function run(owner, request = {}) {
    if (disposed) return failure(null, 'Gerenciador de downloads encerrado.');
    let bucket;
    try {
      bucket = getOwner(owner);
      if (!request || typeof request !== 'object') return failure(bucket, 'Ação de download inválida.');
      const { action, id } = request;
      if (action === 'list' || action === 'status') return result(bucket);
      if (action === 'clear') return clear(owner, { since: request.since ?? 0, until: request.until ?? Date.now() });
      if (!validId(id)) return failure(bucket, 'Download não encontrado neste perfil.');
      const record = bucket.records.find(entry => entry.id === id);
      if (!record) return failure(bucket, 'Download não encontrado neste perfil.');
      const runtime = bucket.live.get(id);
      switch (action) {
        case 'pause':
          if (!runtime || record.phase !== 'progressing') return failure(bucket, 'Este download não pode ser pausado.');
          runtime.item.pause();
          refreshRecord(record, runtime.item, record.phase);
          scheduleSave(bucket); emitChange(bucket, true);
          return result(bucket);
        case 'resume':
          if (!runtime || !metadata(bucket, record).canResume) return failure(bucket, record.recovered ? 'Este download foi interrompido ao fechar o navegador. Baixe o arquivo novamente no site.' : 'Este download não pode ser retomado.');
          runtime.item.resume();
          refreshRecord(record, runtime.item, 'progressing');
          scheduleSave(bucket); emitChange(bucket, true);
          return result(bucket);
        case 'cancel':
          if (!runtime) return failure(bucket, 'Este download já terminou.');
          runtime.item.cancel();
          if (!runtime.finished) finish(bucket, record, runtime, 'cancelled');
          return result(bucket);
        case 'remove': {
          if (runtime) return failure(bucket, 'Cancele o download antes de removê-lo da lista.');
          bucket.records = bucket.records.filter(entry => entry.id !== id);
          persist(bucket); emitChange(bucket, true);
          return result(bucket, { removed: 1 });
        }
        case 'open':
        case 'reveal': {
          if (runtime || record.phase !== 'completed' || !record.path) return failure(bucket, 'O arquivo ainda não foi concluído.');
          let info;
          try { info = await fs.promises.stat(record.path); } catch {}
          if (!info?.isFile()) { record.existence = { path: record.path, at: Date.now(), value: false }; return failure(bucket, 'O arquivo não foi encontrado. Ele pode ter sido movido ou removido.'); }
          if (disposed || !bucket.records.includes(record)) return failure(bucket, 'Este download não está mais disponível.');
          const { shell } = require('electron');
          if (action === 'open') {
            const error = await shell.openPath(record.path);
            if (error) return failure(bucket, 'O sistema não conseguiu abrir este arquivo.');
          } else shell.showItemInFolder(record.path);
          record.existence = { path: record.path, at: Date.now(), value: true };
          return result(bucket);
        }
        default: return failure(bucket, 'Ação de download indisponível.');
      }
    } catch { return failure(bucket, 'Não foi possível concluir esta ação de download.'); }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const [session, binding] of bindings) session.removeListener('will-download', binding.listener);
    bindings.clear();
    for (const bucket of owners.values()) {
      if (bucket.notifyTimer) clearTimeout(bucket.notifyTimer);
      if (bucket.saveTimer) clearTimeout(bucket.saveTimer);
      for (const [id, runtime] of bucket.live) {
        const record = bucket.records.find(entry => entry.id === id);
        refreshRecord(record, runtime.item, 'interrupted');
        record.recovered = true;
        record.finishedAt = Date.now();
        runtime.finished = true;
        runtime.item.removeListener('updated', runtime.updated);
        runtime.item.removeListener('done', runtime.done);
      }
      bucket.live.clear();
      persist(bucket);
    }
  }

  return { attach, snapshot, run, clear, dispose };
}

module.exports = { createDownloadManager };
