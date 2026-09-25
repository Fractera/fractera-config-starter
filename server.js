// ЭЛЕМЕНТ УЗЛА «НАСТРОЙКИ ПРОЕКТА» (шаг 299, 2026-09-25).
//
// Слово владельца: «весь CONFIG сгруппировать в отдельный AGI ITEM на собственном домене также как и блоки… в нём и
// шапка и подвал и данные конфигурации» → «to do it». Ядро больше не хранит настройки проекта: оно их потребитель,
// как сайт, вход, данные и «Блоки». Анатомия — как у «Блоков» (эталон микросервиса).
//
//   GET  /health                     — жив ли (без ключа: это дверь сторожа);
//   POST /mcp                        — MCP: настройки проекта командами для агента (`mcp-tools.js`, каркас `mcp/serve-mcp.js`);
//   GET  /, /en, /ru, /<язык>/…      — сайт элемента: публичная главная и режим архитектора (Next в этом же процессе).
// Двери самих настроек (чтение ключом, запись архитектором) — подшаг 299-2.
// A2A и M2M этот прототип НЕ даёт — названо в паспорте, а не скрыто.
import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import next from 'next'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { mcpHandler } from './mcp/serve-mcp.js'
import { configTools } from './mcp-tools.js'

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
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' })
  res.end(JSON.stringify(body))
}

const SITE_PATH = /^\/(?:(en|ru)(?:\/.*)?|_next\/.*|robots\.txt|sitemap\.xml)$/

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://x')
  try {
    if (pathname === '/health') return json(res, 200, { ok: true, service: 'config', version: VERSION })
    if (pathname === '/mcp') return await mcp(req, res)
    if (pathname === '/') { res.writeHead(302, { location: '/en' }); return res.end() }
    if (SITE_PATH.test(pathname)) {
      const handle = await site
      if (!handle) return json(res, 503, { error: 'site-not-built', fix: 'npm run build' })
      return await handle(req, res)
    }
    return json(res, 404, { error: 'not-found', doors: ['/en', '/ru', '/health', '/mcp'] })
  } catch (err) {
    console.error('[config]', err)
    if (!res.headersSent) json(res, 500, { error: 'internal' })
  }
}).listen(PORT, BIND, () => {
  console.log(`fractera-config ${VERSION} · http://${BIND}:${PORT}`)
})
