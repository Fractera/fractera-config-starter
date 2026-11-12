// Who asks a door of config: the architect or not (node step 734-3a-2). The owner at this machine's keyboard first — the node's law
// (the same rule as `/api/me` and the admin doors: `lib/auth/owner-at-machine.ts`, a request with Cloudflare's headers is never the
// machine), then the session of the sign-in service (`architect-auth.mjs`). Without the first, the architect editors on localhost asked
// a person at his own computer to sign in (seen 2026-11-12: `/api/me` 200 as architect, `/api/settings/app` 401).
import type { NextRequest } from "next/server"
import { isOwnerAtMachine } from "@/lib/auth/owner-at-machine"
import { sessionOf } from "./architect-auth.mjs"
import { headersOf } from "./http"

export type ArchitectCheck = { status: number; reason?: string; roles?: string[]; architect?: boolean; viaMachine?: true }

export async function architectOf(req: Request): Promise<ArchitectCheck> {
  if (isOwnerAtMachine(req as NextRequest)) return { status: 200, roles: ["architect"], architect: true, viaMachine: true }
  return (await sessionOf({ headers: headersOf(req) })) as ArchitectCheck
}
