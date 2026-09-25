// ЭЛЕМЕНТ УЗЛА «НАСТРОЙКИ ПРОЕКТА» (шаг 299, 2026-09-25).
//
// Слово владельца: «весь CONFIG сгруппировать в отдельный AGI ITEM на собственном домене также как и блоки… в нём и
// шапка и подвал и данные конфигурации» → «to do it». Ядро больше не хранит настройки проекта: оно их потребитель,
// как сайт, вход, данные и «Блоки». Анатомия — как у «Блоков» (эталон микросервиса).
//
//   GET  /health                     — жив ли (без ключа: это дверь сторожа);
//   POST /mcp                        — MCP: настройки проекта командами для агента (`mcp-tools.js`, каркас `mcp/serve-mcp.js`);
//   GET  /, /en, /ru, /<язык>/…      — сайт элемента: публичная главная и режим архитектора (Next в этом же процессе).
//   GET  /api/settings[/<вид>]       — настройки проекта (app · platform · design): ключ служб X-Settings-Key ИЛИ архитектор;
//   PATCH /api/settings/<вид>        — записать заплату: ТОЛЬКО архитектор (ключ служб записи не даёт);
//   GET  /api/session                — архитектор ли тот, кто смотрит (для экранов режима архитектора);
//   GET  /api/elements               — все элементы узла и их адреса (только архитектор): ссылки в окне перед выключением
//                                       меню или входа (реестр узла NODE_ITEMS_FILE + домен NODE_DOMAIN_FILE).
// A2A и M2M этот прототип НЕ даёт — названо в паспорте, а не скрыто.
import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import next from 'next'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { mcpHandler } from './mcp/serve-mcp.js'
import { configTools } from './mcp-tools.js'
import { KINDS, readSettings, writeSettings } from './settings-store.js'
import { sessionOf, keyOk } from './architect-auth.js'

const ROOT = dirname(fileURLToPath(import.meta.url))
config({ path: join(ROOT, '.env'), quiet: true })

const PORT = Number(process.env.PORT) || 24685
const BIND = process.env.SERVICE_BIND || '127.0.0.1'
const PUBLIC_URL = process.env.SERVICE_PUBLIC_URL || `http://localhost:${PORT}`
const VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version

// Сайт элемента: сборка в папке, которую называет метка `.presentation-dist` (установщик чередует .next-a / .next-b).
const distMarker = join(ROOT, '.presentation-dist')
process.env.NEXT_DIST_DIR = existsSync(distMarker) ? readFileSync(distMarker, 'utf8').trim() : '.next'
// Дерево страниц (шаг 298): страница — папка `presentation/content/<коллекция>/<slug>/`, шаблон у всех один.
process.env.PAGE_TREE_DIR = resolve(ROOT, 'presentation', 'content')
const nextApp = next({ dev: false, dir: resolve(ROOT, 'presentation') })
const site = nextApp.prepare().then(() => nextApp.getRequestHandler()).catch((err) => {
  console.warn(`[site] не собран (${process.env.NEXT_DIST_DIR}): ${err instanceof Error ? err.message : err} — npm run build`)
  return null
})

const mcp = mcpHandler({ name: 'fractera-config', version: VERSION, tools: configTools(PUBLIC_URL) })

const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null') } catch { return undefined }
}

// Настройки: читать — ключ служб или архитектор; писать — только архитектор.
async function settingsDoor(req, res, kind) {
  if (req.method === 'GET') {
    let allowed = keyOk(req)
    if (!allowed) {
      const s = await sessionOf(req)
      if (s.status !== 200) return json(res, s.status, { ok: false, reason: s.reason })
      allowed = s.architect
    }
    if (!allowed) return json(res, 403, { ok: false, reason: 'not-architect' })
    if (!kind) {
      const all = Object.fromEntries(KINDS.map((k) => [k, readSettings(k)]))
      const bad = Object.values(all).find((r) => !r.ok)
      // `patches` — только решения владельца, без умолчаний элемента (299-6): потребитель кладёт их поверх СВОИХ
      // умолчаний, и «владелец не высказывался» остаётся отличимым от «владелец выбрал то же, что по умолчанию».
      if (bad) return json(res, 500, { ok: false, reason: bad.reason })
      return json(res, 200, {
        ok: true,
        settings: Object.fromEntries(KINDS.map((k) => [k, all[k].config])),
        patches: Object.fromEntries(KINDS.map((k) => [k, all[k].patch])),
      })
    }
    const r = readSettings(kind)
    return json(res, r.ok ? 200 : r.reason === 'unknown-kind' ? 404 : 500, r)
  }
  if (req.method === 'PATCH' && kind) {
    const s = await sessionOf(req)
    if (s.status !== 200) return json(res, s.status, { ok: false, reason: s.reason })
    if (!s.architect) return json(res, 403, { ok: false, reason: 'not-architect' })
    const body = await readBody(req)
    const r = writeSettings(kind, body)
    if (!r.ok) return json(res, r.reason === 'bad-body' ? 400 : r.reason === 'unknown-kind' ? 404 : 500, r)
    // 299-6: сохранено → толчок всем элементам узла; ответ называет, кто принял (экран говорит «применено»).
    return json(res, 200, { ...r, pushed: await pushToElements() })
  }
  return json(res, 405, { ok: false, reason: 'method' })
}

// Элементы узла и их публичные адреса — то же правило, что у двери ядра `/api/node/reach`: сайт (root) — корень зоны,
// ядро — architect.<зона>, остальные — <id>.<зона>. Домена нет — адрес на петле машины (он годится только на ней).
function elementsOfNode() {
  let registry, domain = null
  try { registry = JSON.parse(readFileSync(process.env.NODE_ITEMS_FILE ?? '', 'utf8')) } catch { return null }
  try { domain = JSON.parse(readFileSync(process.env.NODE_DOMAIN_FILE ?? '', 'utf8')) } catch { /* домен не подключён */ }
  const zone = domain?.zone
  const list = [{ id: 'core', url: zone ? `https://${domain.architectHostname ?? `architect.${zone}`}` : null }]
  for (const s of registry.services ?? []) {
    const url = zone ? (s.id === 'root' ? `https://${domain.hostname ?? zone}` : `https://${s.id}.${zone}`) : Number.isInteger(s.port) ? `http://127.0.0.1:${s.port}` : null
    list.push({ id: s.id, url })
  }
  return list
}

// ТОЛЧОК (299-6): «настройки изменились» каждому элементу узла — по петле машины, ключом узла. Толчок не несёт
// настроек: элемент берёт их сам своей дверью чтения. Элемент без двери (404) или выключенный — строка в ответе,
// а не отказ сохранения: сохранённое у элемента настроек уже верно, отставший элемент догонит при своём запуске.
async function pushToElements() {
  let registry
  try { registry = JSON.parse(readFileSync(process.env.NODE_ITEMS_FILE ?? '', 'utf8')) } catch { return { ok: false, reason: 'registry-unreadable' } }
  const key = process.env.SETTINGS_SECRET?.trim()
  if (!key) return { ok: false, reason: 'no-settings-key' }
  const targets = (registry.services ?? []).filter((s) => s.id !== 'config' && Number.isInteger(s.port))
  const results = await Promise.all(targets.map(async (s) => {
    const started = Date.now()
    try {
      const r = await fetch(`http://127.0.0.1:${s.port}/api/settings/refresh`, {
        method: 'POST', headers: { 'x-settings-key': key }, signal: AbortSignal.timeout(8000),
      })
      const b = await r.json().catch(() => null)
      return { id: s.id, status: r.status, changed: b?.changed ?? null, ms: Date.now() - started }
    } catch (err) {
      return { id: s.id, status: 0, reason: err instanceof Error ? err.name : 'error', ms: Date.now() - started }
    }
  }))
  return { ok: true, results }
}

const SITE_PATH =/^\/(?:(en|ru)(?:\/.*)?|_next\/.*|robots\.txt|sitemap\.xml)$/

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://x')
  try {
    if (pathname === '/health') return json(res, 200, { ok: true, service: 'config', version: VERSION })
    if (pathname === '/mcp') return await mcp(req, res)
    if (pathname === '/api/settings' || pathname.startsWith('/api/settings/')) {
      const kind = pathname.slice('/api/settings/'.length) || null
      return await settingsDoor(req, res, pathname === '/api/settings' ? null : kind)
    }
    if (pathname === '/api/elements') {
      const s = await sessionOf(req)
      if (s.status !== 200) return json(res, s.status, { ok: false, reason: s.reason })
      if (!s.architect) return json(res, 403, { ok: false, reason: 'not-architect' })
      const list = elementsOfNode()
      return list ? json(res, 200, { ok: true, elements: list }) : json(res, 500, { ok: false, reason: 'registry-unreadable' })
    }
    if (pathname === '/api/session') {
      const s = await sessionOf(req)
      return json(res, s.status === 200 ? 200 : s.status, s.status === 200 ? { ok: true, architect: s.architect } : { ok: false, reason: s.reason })
    }
    if (pathname === '/') { res.writeHead(302, { location: '/en' }); return res.end() }
    if (SITE_PATH.test(pathname)) {
      const handle = await site
      if (!handle) return json(res, 503, { error: 'site-not-built', fix: 'npm run build' })
      return await handle(req, res)
    }
    return json(res, 404, { error: 'not-found', doors: ['/en', '/ru', '/health', '/mcp', '/api/settings', '/api/settings/<app|platform|design>', '/api/session'] })
  } catch (err) {
    console.error('[config]', err)
    if (!res.headersSent) json(res, 500, { error: 'internal' })
  }
}).listen(PORT, BIND, () => {
  console.log(`fractera-config ${VERSION} · http://${BIND}:${PORT}`)
})
