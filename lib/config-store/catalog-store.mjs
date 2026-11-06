// КАТАЛОГ ЭЛЕМЕНТОВ УЗЛА ДЛЯ ВКЛАДКИ «ВСЕ ПРОЕКТЫ» (узел, шаг 553-2).
//
// 🎯 Слово владельца 2026-10-21: «каждый раз когда появляется новый элемент ссылка на него появляется в этом верхнем списке».
// Считает каталог ядро (реестр, адреса, заголовки и описания главных страниц) и кладёт сюда дверью `PUT /api/settings/catalog` ключом
// узла; config хранит его рядом с настройками, отдаёт полем `catalog` в `get_project_settings` и шлёт подписчикам сигнал — элементы,
// подключённые к CONFIG, рисуют вкладку из своей копии.
//
// 🔒 КАТАЛОГ — НЕ РЕШЕНИЕ ВЛАДЕЛЬЦА, А СНИМОК УЗЛА: отдельный файл `catalog.json`, не заплата настроек. Пустой каталог равен отсутствию —
// версия настроек тогда считается прежней формулой, и элементы не перекачивают настройки зря.
import { readFileSync, writeFileSync, renameSync, mkdirSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.env.ELEMENT_DIR || process.cwd()
const dataDir = () => process.env.SETTINGS_DATA_DIR || join(ROOT, 'data', 'settings')
const file = () => join(dataDir(), 'catalog.json')

const LANG = /^[a-z]{2}$/
const ID = /^[a-z0-9-]{1,64}$/
const HREF = /^https?:\/\//
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1):\d+\//
// 662-1: выключенный элемент ведёт в свой раздел ядра — путь от корня ядра (`/ru/architect/stripe`); элемент ставит перед ним `ARCHITECT_URL`.
const CORE_PATH = /^\/[a-z]{2}\/architect(\/[a-z0-9-]+)*$/
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)
const str = (v, min, max) => typeof v === 'string' && v.length >= min && v.length <= max

/** `{ updatedAt, byLang }` или `null`: нет файла, не JSON или во всех языках пусто. */
export function readCatalog() {
  try {
    const j = JSON.parse(readFileSync(file(), 'utf8'))
    if (!isObj(j?.byLang)) return null
    const any = Object.values(j.byLang).some((list) => Array.isArray(list) && list.length > 0)
    return any ? { updatedAt: j.updatedAt ?? null, byLang: j.byLang } : null
  } catch {
    return null
  }
}

/** Форма каталога: `{ byLang: { <язык>: Entry[] } }`. Лишние поля записи отбрасываются. */
export function validateCatalog(body) {
  if (!isObj(body) || !isObj(body.byLang)) return { ok: false, reason: 'byLang-required' }
  const langs = Object.keys(body.byLang)
  if (langs.length > 8) return { ok: false, reason: 'too-many-languages' }
  const byLang = {}
  for (const lang of langs) {
    if (!LANG.test(lang)) return { ok: false, reason: `bad-language:${lang}` }
    const list = body.byLang[lang]
    if (!Array.isArray(list)) return { ok: false, reason: `not-a-list:${lang}` }
    if (list.length > 1000) return { ok: false, reason: `too-many-entries:${lang}` }
    const out = []
    for (const [i, e] of list.entries()) {
      const at = `${lang}[${i}]`
      if (!isObj(e)) return { ok: false, reason: `entry-shape:${at}` }
      if (typeof e.id !== 'string' || !ID.test(e.id)) return { ok: false, reason: `bad-id:${at}` }
      if (!str(e.title, 1, 160)) return { ok: false, reason: `bad-title:${at}` }
      const description = e.description ?? ''
      if (!str(description, 0, 400)) return { ok: false, reason: `bad-description:${at}` }
      // 662-1 (владелец 2026-11-06, выбор «Метка + включение»): `off` — элемент выключен узлом, `href` — путь в его раздел ядра, `mark` —
      // слово метки. ✗ Без этого дверь отказывала всему каталогу («bad-href») и выбрасывала метку — замерено на узле владельца.
      const off = e.off === true
      const href = e.href ?? null
      if (href !== null && !(str(href, 1, 300) && (off ? CORE_PATH.test(href) : HREF.test(href)))) return { ok: false, reason: `bad-href:${at}` }
      const mark = e.mark ?? null
      if (mark !== null && !str(mark, 1, 40)) return { ok: false, reason: `bad-mark:${at}` }
      const local = e.local ?? null
      if (local !== null && !(str(local, 1, 300) && LOCAL.test(local))) return { ok: false, reason: `bad-local:${at}` }
      if (e.kind !== 'custom' && e.kind !== 'native') return { ok: false, reason: `bad-kind:${at}` }
      out.push({ id: e.id, title: e.title, description, href, local, kind: e.kind, ...(off ? { off: true } : {}), ...(mark ? { mark } : {}) })
    }
    byLang[lang] = out
  }
  return { ok: true, byLang }
}

/** Атомарная запись (временный файл + rename); `updatedAt` ставит сервер. */
export function writeCatalog(byLang) {
  mkdirSync(dataDir(), { recursive: true })
  const tmp = `${file()}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify({ updatedAt: new Date().toISOString(), byLang }, null, 2) + '\n', 'utf8')
  renameSync(tmp, file())
}

export function removeCatalog() {
  if (existsSync(file())) unlinkSync(file())
}
