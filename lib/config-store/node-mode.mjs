// РЕЖИМ УЗЛА НА СТРАНИЦЕ НАСТРОЕК (узел, шаг 564). Слово владельца 2026-10-21: «в этом конфигураторе и нужно сделать ещё один
// механический переключатель чтобы определить в каком из двух режимов сайт будет работать и описать оба режима».
// 🔒 ИСТОЧНИК ОДИН — РЕЕСТР ЯДРА (`nodeType` в `NODE_ITEMS_FILE`, шаг 553). Config его не хранит: читает файл реестра, а пишет
// дверью ядра `POST /api/node/type` — та же дверь, что у команды `npm run node-type` и у «Паспорта». Ядро перерисовывает свои страницы
// само. Зовём ядро по петле машины: петля — хозяин машины (`isOwnerAtMachine` ядра), а архитектора проверяет дверь config ДО вызова.
// 🔒 Порт ядра спрашивается у ядра (`<узел>/logs/runtime.json`), а не помнится (закон 232).
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const TYPES = ['project', 'factory']
const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null } }

/** Папка узла — родитель папки реестра. Нет `NODE_ITEMS_FILE` — `null`. */
function nodeDir() {
  const f = process.env.NODE_ITEMS_FILE
  return f ? dirname(dirname(resolve(f))) : null
}

/** Режим узла из реестра: `project` | `factory`; реестра нет — `null` («не знаю», а не «единый проект»). */
export function readNodeMode() {
  const reg = readJson(process.env.NODE_ITEMS_FILE ?? '')
  if (!reg) return null
  return TYPES.includes(reg.nodeType) ? reg.nodeType : 'project'
}

/** Адрес ядра на этой машине: `http://<имя из runtime.json>:<порт>`; ядро не записало себя — `null`. */
export function coreLoopback() {
  const dir = nodeDir()
  const rt = dir ? readJson(join(dir, 'logs', 'runtime.json')) : null
  if (!rt || !Number.isInteger(rt.port)) return null
  const host = rt.hostname === '127.0.0.1' || rt.hostname === '::1' ? rt.hostname : 'localhost'
  return `http://${host === '::1' ? '[::1]' : host}:${rt.port}`
}

/** Записать режим дверью ядра. Итог: `{ ok, type?, mismatches?, reason? }`. */
export async function writeNodeMode(type) {
  if (!TYPES.includes(type)) return { ok: false, reason: 'bad-type' }
  const core = coreLoopback()
  if (!core) return { ok: false, reason: 'core-unknown' }
  try {
    const r = await fetch(`${core}/api/node/type`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    const b = await r.json().catch(() => null)
    if (!r.ok || !b?.ok) return { ok: false, reason: b?.reason ?? b?.error ?? `core-${r.status}` }
    return { ok: true, type: b.type, mismatches: b.mismatches ?? [] }
  } catch {
    return { ok: false, reason: 'core-unreachable' }
  }
}

/** Свои элементы, живущие не по режиму (то, что ядро называет `mismatches`), — спрашиваются у ядра. Ядро молчит — `null`. */
export async function nodeModeMismatches() {
  const core = coreLoopback()
  if (!core) return null
  try {
    const r = await fetch(`${core}/api/node/type`, { cache: 'no-store', signal: AbortSignal.timeout(5_000) })
    const b = await r.json().catch(() => null)
    return r.ok && Array.isArray(b?.mismatches) ? b.mismatches : null
  } catch {
    return null
  }
}
