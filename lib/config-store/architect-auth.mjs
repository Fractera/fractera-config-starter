// 549-1: перенесено из server-модулей config v0.2.26 без изменения логики. Пути — от папки элемента (process.cwd(): pm2 запускает
// собранный сервер из неё), а не от файла: собранный модуль лежит внутри .next-*/standalone; standalone-сервер делает chdir в свою папку,
// поэтому первым — ELEMENT_DIR (абсолютный путь от установщика, как у шаблона).
// КТО ПРИШЁЛ — АРХИТЕКТОР ИЛИ НЕТ (шаг 299-2). Вход раздаёт ровно одна служба узла; этот элемент своих паролей не держит.
// Куки посетителя пересылаются в `AUTH_SERVICE_URL/api/session`, ответ — сессия с ролями (образец — `requireAuth` службы данных).
// Менять настройки проекта могут только роли ARCHITECT_ROLES: слово владельца — «переход в защищённый авторизацией и руль
// архитектора режим».
// 🔒 Служба входа недоступна — это «не знаю» (503), а не «нельзя» (401): иначе архитектор увидел бы «у вас нет прав» в
// день, когда просто лёг вход.
import { timingSafeEqual } from 'node:crypto'
import { elementOf } from '../element-key.mjs'

const ARCHITECT_ROLES = new Set(['architect', 'admin'])

export async function sessionOf(req) {
  const auth = (process.env.AUTH_SERVICE_URL ?? '').replace(/\/+$/, '')
  if (!auth) return { status: 503, reason: 'auth-not-configured' }
  const cookie = req.headers.cookie ?? ''
  if (!cookie) return { status: 401, reason: 'no-session' }
  try {
    const r = await fetch(`${auth}/api/session`, { headers: { cookie }, signal: AbortSignal.timeout(5000) })
    if (r.status === 401 || r.status === 403) return { status: 401, reason: 'no-session' }
    if (!r.ok) return { status: 503, reason: `auth-${r.status}` }
    const session = await r.json()
    const roles = Array.isArray(session?.roles) ? session.roles : []
    return { status: 200, roles, architect: roles.some((x) => ARCHITECT_ROLES.has(x)) }
  } catch {
    return { status: 503, reason: 'auth-unreachable' }
  }
}

/** Ключ узла (ядро и нативные элементы): им пишет каталог ядро; настройки им тоже читаются. Записи настроек ключ не даёт. */
export function keyOk(req) {
  const expected = process.env.SETTINGS_SECRET ?? ''
  const given = String(req.headers['x-settings-key'] ?? '')
  if (!expected || given.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

// 818-7 (the red team's H6): WHO READS THE SETTINGS. Since 818-7c a custom element holds its own key `<id>.<mac>` instead of the node key;
// it reads the settings with it in the same header `X-Settings-Key`. This element holds the node's DATA_SECRET and checks such a key
// offline (`lib/element-key.mjs`). Reading only: writing the catalogue stays with the node key (`keyOk`), the settings with the architect.
/** The reader of the settings: the node key → { kind: 'node' }; a custom element's own key → { kind: 'element', id }; else null. */
export function readerOf(req) {
  const given = String(req.headers['x-settings-key'] ?? '')
  if (!given) return null
  if (keyOk(req)) return { kind: 'node' }
  const id = elementOf(given, process.env.DATA_SECRET ?? '')
  return id ? { kind: 'element', id } : null
}
