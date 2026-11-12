// @api whether the visitor is the architect of the project
import { architectOf } from "@/lib/config-store/architect-of"
import { json } from "@/lib/config-store/http"

// 549-1: прежняя дверь config `/api/session`.
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  const s = await architectOf(req)
  return json(s.status === 200 ? 200 : s.status, s.status === 200 ? { ok: true, architect: s.architect } : { ok: false, reason: s.reason })
}
