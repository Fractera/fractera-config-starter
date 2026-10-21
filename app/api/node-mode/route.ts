// @api read and switch the node mode single project or app factory
import { sessionOf } from "@/lib/config-store/architect-auth.mjs"
import { json, headersOf } from "@/lib/config-store/http"
import { nodeModeMismatches, readNodeMode, writeNodeMode } from "@/lib/config-store/node-mode.mjs"

// 564: режим узла на странице настроек. Читать и менять — только архитектор (сессия службы входа); хранит режим реестр ядра,
// пишет его дверь ядра (`lib/config-store/node-mode.mjs`).
export const dynamic = "force-dynamic"

async function architect(req: Request): Promise<Response | null> {
  const s = await sessionOf({ headers: headersOf(req) })
  if (s.status !== 200) return json(s.status, { ok: false, reason: s.reason })
  return s.architect ? null : json(403, { ok: false, reason: "not-architect" })
}

export async function GET(req: Request) {
  const denied = await architect(req)
  if (denied) return denied
  const type = readNodeMode()
  if (!type) return json(503, { ok: false, reason: "no-registry" })
  return json(200, { ok: true, type, mismatches: await nodeModeMismatches() })
}

export async function POST(req: Request) {
  const denied = await architect(req)
  if (denied) return denied
  let type: unknown
  try { type = ((await req.json()) as { type?: unknown })?.type } catch { /* нет тела */ }
  if (type !== "project" && type !== "factory") return json(400, { ok: false, reason: "type must be project or factory" })
  const r = await writeNodeMode(type)
  return json(r.ok ? 200 : 502, r)
}
