// @api elements whose languages the config element sets for the architect
import { sessionOf } from "@/lib/config-store/architect-auth.mjs"
import { languageFollowers } from "@/lib/config-store/node-elements.mjs"
import { json, headersOf } from "@/lib/config-store/http"

// 549-1: прежняя дверь config `/api/language-followers?lang=` (341-3) — только архитектор.
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  const s = await sessionOf({ headers: headersOf(req) })
  if (s.status !== 200) return json(s.status, { ok: false, reason: s.reason })
  if (!s.architect) return json(403, { ok: false, reason: "not-architect" })
  const lang = new URL(req.url).searchParams.get("lang") === "ru" ? "ru" : "en"
  const list = languageFollowers(lang)
  return list ? json(200, { ok: true, elements: list }) : json(500, { ok: false, reason: "registry-unreadable" })
}
