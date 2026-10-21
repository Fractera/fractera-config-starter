// 549-1: элементы узла и элементы, чьи языки задаёт CONFIG — дословно из server.js config v0.2.26.
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'

// Элементы узла и их публичные адреса — то же правило, что у двери ядра `/api/node/reach`: сайт (root) — корень зоны,
// ядро — architect.<зона>, остальные — <id>.<зона>. Домена нет — адрес на петле машины (он годится только на ней).
export function elementsOfNode() {
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

// ЭЛЕМЕНТЫ, ЧЬИ ЯЗЫКИ ЗАДАЁТ CONFIG (узел, шаг 341-3). Слово владельца 2026-09-30 о кнопке развёртывания в блоке «Языки для
// поисковых систем»: «Список элементов» — под блоком элементы, подключённые к CONFIG, у каждого ссылка на его «Развёртывания».
// Элемент попадает в список, если он собирает сайт с языками (его `.env.example` объявляет `NEXT_PUBLIC_SUPPORTED_LANGUAGES`)
// и связь с CONFIG у него не выключена (`<узел>/data/services/<id>/links.json`). `searchLanguages` — понимает ли его код
// открытые поисковику языки (`NEXT_PUBLIC_INDEXED_LANGUAGES`, шаблон ≥ v0.3.52): старый код отдаёт поисковику все языки.
// Читаются только `.env.example` (в git, без секретов), `links.json` и `address.json` — не `.env.local` элемента.
// Страница «Развёртывания» есть у РОЖДЁННОГО элемента (`born` в реестре, маршрут ядра `[item]`); сайт узла (root) своей
// страницы элемента не имеет — его развёртывают на доске узла `/<язык>/architect/build/deployments` (замерено 2026-09-30:
// `/ru/root/build/deployments` → 404, у xbmpu → 200).
export function languageFollowers(lang) {
  let registry
  try { registry = JSON.parse(readFileSync(process.env.NODE_ITEMS_FILE ?? '', 'utf8')) } catch { return null }
  const registryDir = dirname(resolve(process.env.NODE_ITEMS_FILE))
  const node = dirname(registryDir)
  // 520: папка элементов — соседка папки реестра без `-REGISTRY` (`WEB4-ITEMS-REGISTRY` → `WEB4-ITEMS`), а не имя в коде:
  // ✗ жёсткое `AGI-ITEMS` опустошило список после переименования узла (519). Папка элемента — по адресу, если перенесена
  // (343, «Папка = адрес»), иначе по id — тот же порядок, что у `lib/web4-items/paths.cjs` ядра.
  const itemsDir = join(node, basename(registryDir).replace(/-REGISTRY$/, ''))
  const architect = (process.env.ARCHITECT_URL ?? '').replace(/\/+$/, '')
  const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null } }
  const out = []
  for (const s of registry.services ?? []) {
    if (typeof s.id !== 'string') continue
    const kind = s.kind === 'user' ? 'user' : 'core'
    const data = join(node, 'data', 'services', s.id)
    const a = readJson(join(data, 'address.json'))?.address
    const address = typeof a === 'string' && /^[a-z0-9-]+$/.test(a) ? a : s.id
    const folder = address !== s.id && existsSync(join(itemsDir, kind, address)) ? address : s.id
    let example = ''
    try { example = readFileSync(join(itemsDir, kind, folder, '.env.example'), 'utf8') } catch { continue }
    if (!/^NEXT_PUBLIC_SUPPORTED_LANGUAGES=/m.test(example)) continue
    if (readJson(join(data, 'links.json'))?.config === false) continue
    out.push({
      id: s.id,
      address,
      searchLanguages: /^NEXT_PUBLIC_INDEXED_LANGUAGES=/m.test(example),
      deployments: !architect ? null : s.born ? `${architect}/${lang}/architect/${address}/build/deployments` : `${architect}/${lang}/architect/build/deployments`,
    })
  }
  return out
}

