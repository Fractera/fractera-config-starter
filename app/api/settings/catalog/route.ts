// @api the node elements catalog for the All projects tab
import { readAll, versionOf } from "@/lib/config-store/mcp-tools.mjs"
import { readCatalog, validateCatalog, writeCatalog, removeCatalog } from "@/lib/config-store/catalog-store.mjs"
import { notifySubscribers } from "@/lib/config-store/subscribers.mjs"
import { keyOk } from "@/lib/config-store/architect-auth.mjs"
import { json, headersOf } from "@/lib/config-store/http"
import { refreshSelf } from "@/lib/config-store/self-refresh"

// 553-2: каталог «Все проекты». Пишет только ядро ключом узла (X-Settings-Key) — сессия архитектора записи не даёт: каталог считает
// узел, а не человек. После записи и удаления — сигнал подписчикам «версия сменилась» (как после сохранения настроек, 306).
export const dynamic = "force-dynamic"

type Notified = Array<{ ok: boolean; who?: string; url?: string; status?: number; reason?: string }>

async function signal(): Promise<{ version: string; notified: Notified }> {
  const version = versionOf(readAll())
  let notified: Notified = []
  try {
    notified = await notifySubscribers(version)
    for (const n of notified) console.log(`[catalog] сигнал ${n.who ?? n.url}: ${n.ok ? "принят" : `не принят (${n.status || n.reason})`}`)
  } catch (e) {
    console.warn(`[catalog] рассылка не удалась: ${e instanceof Error ? e.message : e}`)
  }
  await refreshSelf()
  return { version, notified }
}

const denied = (req: Request) => !keyOk({ headers: headersOf(req) })

export async function GET(req: Request) {
  if (denied(req)) return json(401, { ok: false, reason: "bad-key" })
  return json(200, { ok: true, catalog: readCatalog() })
}

export async function PUT(req: Request) {
  if (denied(req)) return json(401, { ok: false, reason: "bad-key" })
  let body: unknown
  try { body = JSON.parse((await req.text()) || "null") } catch { return json(400, { ok: false, reason: "bad-json" }) }
  const v = validateCatalog(body) as { ok: boolean; reason?: string; byLang?: unknown }
  if (!v.ok) return json(400, { ok: false, reason: v.reason })
  writeCatalog(v.byLang)
  return json(200, { ok: true, ...(await signal()) })
}

export async function DELETE(req: Request) {
  if (denied(req)) return json(401, { ok: false, reason: "bad-key" })
  removeCatalog()
  const { version, notified } = await signal()
  return json(200, { ok: true, version, notified })
}

const notAllowed = () => json(405, { ok: false, reason: "method" })
export { notAllowed as POST, notAllowed as PATCH }
