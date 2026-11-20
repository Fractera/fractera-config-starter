// 549-1: перенесено из server-модулей config v0.2.26 без изменения логики. Пути — от папки элемента (process.cwd(): pm2 запускает
// собранный сервер из неё), а не от файла: собранный модуль лежит внутри .next-*/standalone; standalone-сервер делает chdir в свою папку,
// поэтому первым — ELEMENT_DIR (абсолютный путь от установщика, как у шаблона).
// ПОДПИСЧИКИ НА ИЗМЕНЕНИЕ НАСТРОЕК (шаг 306, решение владельца 2026-09-26: «заводи шаг, строим уведомление от CONFIG»).
//
// 🔒 ЗАМЕНЯЕТ ЗАКОН 299-6 «ЭЛЕМЕНТ НИКОГО НЕ ЗОВЁТ» — и ровно в названном объёме. После сохранения архитектором элемент
// шлёт каждому подписчику сигнал «версия сменилась»; настроек в сигнале нет, подписчик забирает их сам по MCP тем же путём,
// что при старте. Действие — только в ответ на сохранение человеком: ни таймеров, ни опросов, ни повторов.
//
// 🔒 ПОДПИСКА ДОБРОВОЛЬНА И НИЧЕГО НЕ ГАРАНТИРУЕТ. Подписчик, который не ответил, остаётся в списке и получит следующий
// сигнал; пропущенный сигнал он наверстает при своём старте, сверив версию. Отказ доставки не валит сохранение.
//
// Реестр — файл `subscribers.json` в папке данных элемента (`SETTINGS_DATA_DIR`), вне сборки и вне git.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { neighbourDoor } from '../neighbour.mjs'

const ROOT = process.env.ELEMENT_DIR || process.cwd()
const file = () => join(process.env.SETTINGS_DATA_DIR || join(ROOT, 'data', 'settings'), 'subscribers.json')
const TIMEOUT_MS = 5000

export function listSubscribers() {
  try {
    const list = JSON.parse(readFileSync(file(), 'utf8')).subscribers
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/**
 * Подписать адрес двери подписчика. Разрешены только http(s). Одна служба (`who`) — одна запись, как и один адрес:
 * повторная подписка заменяет прежнюю. ✗ Иначе пробный запуск службы при установке (другой порт) оставался в реестре
 * мёртвым адресом, и каждый сигнал уходил и в пустоту (замерено на узле 2026-09-26: root на 24699 и 24683).
 */
// 818-7 (the red team's H6): a custom element subscribes with its own key and only in its own name — `who` is its id from the key — and
// never takes over an address another element subscribed (its signals would stop). The node key (the core, a native) subscribes any.
export function subscribe(url, who, reader) {
  if (!reader) return { ok: false, reason: 'bad-key' }
  let u
  try {
    u = new URL(String(url))
  } catch {
    return { ok: false, reason: 'bad-url' }
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return { ok: false, reason: 'bad-url' }
  const id = reader.kind === 'element' ? reader.id : who ? String(who).slice(0, 64) : null
  if (reader.kind === 'element' && listSubscribers().some((s) => s.url === u.href && s.who !== id)) return { ok: false, reason: 'url-of-another-element' }
  const list = listSubscribers().filter((s) => s.url !== u.href && !(id && s.who === id))
  list.push({ url: u.href, who: id, since: new Date().toISOString() })
  mkdirSync(dirname(file()), { recursive: true })
  writeFileSync(file(), JSON.stringify({ subscribers: list }, null, 2) + '\n')
  return { ok: true, url: u.href, subscribers: list.length }
}

// 818-7 (the red team's H6): EACH SUBSCRIBER'S SIGNAL CARRIES ITS OWN KEY. Before 818-7 every signal carried the node key — to every
// subscribed address, custom elements among them. Now the key for the subscriber `who` comes from the core (lib/neighbour.mjs → the door
// /api/node/pair-key, decided by the node's registry at the moment of sending): a custom element's own key, the node key for a native.
// A record the core cannot name (no `who`, an element gone) gets no signal: it subscribes again at its next start.
/** Разослать сигнал «версия сменилась». Возвращает, кто принял, — для ответа экрану и журнала. */
export async function notifySubscribers(version, { doorOf = neighbourDoor, send = fetch } = {}) {
  const list = listSubscribers()
  return Promise.all(
    list.map(async (s) => {
      let key
      try {
        key = (await doorOf(s.who)).key
      } catch (e) {
        return { url: s.url, who: s.who, ok: false, status: 0, reason: `no-key: ${String(e?.message ?? e)}` }
      }
      try {
        const r = await send(s.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-settings-key': key },
          body: JSON.stringify({ version }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        return { url: s.url, who: s.who, ok: r.ok, status: r.status }
      } catch (e) {
        return { url: s.url, who: s.who, ok: false, status: 0, reason: String(e?.name ?? e) }
      }
    }),
  )
}
