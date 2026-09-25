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
//   GET  /api/session                — архитектор ли тот, кто смотрит (для экранов режима архитектора).
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
      return bad ? json(res, 500, { ok: false, reason: bad.reason }) : json(res, 200, { ok: true, settings: Object.fromEntries(KINDS.map((k) => [k, all[k].config])) })
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
    return json(res, r.ok ? 200 : r.reason === 'bad-body' ? 400 : r.reason === 'unknown-kind' ? 404 : 500, r)
  }
  return json(res, 405, { ok: false, reason: 'method' })
}

const SITE_PATH = /^\/(?:(en|ru)(?:\/.*)?|_next\/.*|robots\.txt|sitemap\.xml)$/

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://x')
  try {
    if (pathname === '/health') return json(res, 200, { ok: true, service: 'config', version: VERSION })
    if (pathname === '/mcp') return await mcp(req, res)
    if (pathname === '/api/settings' || pathname.startsWith('/api/settings/')) {
      const kind = pathname.slice('/api/settings/'.length) || null
      return await settingsDoor(req, res, pathname === '/api/settings' ? null : kind)
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
