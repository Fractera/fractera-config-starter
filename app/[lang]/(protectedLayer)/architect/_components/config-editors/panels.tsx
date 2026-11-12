// ПАНЕЛИ РЕЖИМА АРХИТЕКТОРА (шаг 299-4): серверные обёртки островков.
// 🔒 CONFIG — ИСТОЧНИК НАСТРОЕК, А НЕ ИХ ЧИТАТЕЛЬ (узел, шаг 734-3a-2). Владелец 2026-11-12: «У нас есть элемент CONFIG создан специально
// для того чтобы ядро и все элементы которые не включили собственные настройки брали из него настройки». ✗ До 734 меню «как сейчас» и
// языки читались из оболочки элемента `root` (`PROJECT_SHELL_URL`), а вход и политика вели на его адрес (`PROJECT_SITE_URL`): хранилище
// настроек спрашивало их у одного кастомного элемента. Теперь всё своё: `siteShellData` — из собственных настроек и каталога CONFIG (их
// копию он обновляет сам после каждой записи, `self-refresh.ts`), вход — свой `/login` (его прокси ведёт на службу входа), политика —
// своя страница `/<язык>/cookies`.
import { FeatureSwitchesIsland, type FeatureSwitchesProps } from './feature-switches.client'
import { appDialogUi } from '@/components/dialog/app-dialog.i18n'
import { SettingsViewIsland, type SettingsViewProps } from './settings-view.client'
import { SettingsEditorIsland, type SettingsEditorProps } from './settings-editor.client'
import { fieldsUi } from './fields.i18n'
import { MenuEditorIsland, type MenuEditorProps } from './menu-editor.client'
import { groupsUi } from './groups.i18n'
import { RoutingEditorIsland, CookieBannerIsland } from './platform-editors.client'
import type { AccessWords } from './settings-access'
import { LanguagesIsland } from './languages-island.client'
import { searchLanguagesWords } from './search-languages.i18n'
import { ALL_LANGUAGE_METADATA } from './lib/language-metadata'
import { siteShellData } from '@/lib/shell/site-shell-data'
import type { ShellGroup } from './shell/shell-types'
import type { NavCandidate, NavItem, NavSlot } from './lib/nav'

const loginHref = (lang: string) => `/login?lang=${lang}`

type Own = { lang: string; itemKey?: string }

export function FeatureSwitches({ lang, itemKey: _k, ...rest }: Omit<FeatureSwitchesProps, 'loginHref'> & Own) {
  return <FeatureSwitchesIsland {...rest} loginHref={loginHref(lang)} dialogUi={appDialogUi(lang)} />
}

// `kind` у части страницы занят её видом, поэтому вид настроек в данных страницы — `settingsKind`.
export function SettingsView({ lang, itemKey: _k, settingsKind, ...rest }: Omit<SettingsViewProps, 'loginHref' | 'kind'> & Own & { settingsKind: SettingsViewProps['kind'] }) {
  return <SettingsViewIsland {...rest} kind={settingsKind} loginHref={loginHref(lang)} />
}

// Редактор раздела APP-CONFIG: подписи полей выбирает СЕРВЕР (`fieldsUi(lang)`) и отдаёт островку пропсом — словарь в
// браузер целиком не едет.
export function SettingsEditor({ lang, itemKey: _k, ...rest }: Omit<SettingsEditorProps, 'loginHref' | 'ui' | 'lang'> & Own) {
  return <SettingsEditorIsland {...rest} lang={lang} ui={fieldsUi(lang)} loginHref={loginHref(lang)} />
}

// Редактор шапки или подвала: меню «как сейчас» и кандидаты — из собственных настроек и каталога CONFIG.
// Читается на сервере и кэшируется минутами (`'use cache'`), как шапка самого элемента.
async function shellMenu(lang: string, slot: NavSlot): Promise<{ current: NavItem[]; candidates: NavCandidate[] }> {
  // 549-1: в шаблоне нет cacheComponents — без кэша функции: страницы ветки статические (ISR 300 с), оболочку читают при сборке и перерисовке.
  const shell = siteShellData(lang)
  const groups: ShellGroup[] = shell ? (slot === 'top' ? shell.top : shell.footer) : []
  const hrefOf = (g: ShellGroup) => g.href ?? `/${lang}/${g.slug}`
  const current: NavItem[] = groups.map((g, i) => ({
    id: g.slug,
    href: hrefOf(g),
    order: (i + 1) * 10,
    label: g.label,
    ...(g.children.length ? { children: g.children.filter((c) => c.href).map((c) => ({ id: c.slug, href: c.href as string, label: c.title })) } : {}),
  }))
  const all = shell ? [...shell.top, ...shell.footer] : []
  const seen = new Set<string>()
  const candidates: NavCandidate[] = []
  for (const g of all) {
    for (const c of [{ id: g.slug, href: hrefOf(g), title: g.label, section: g.label }, ...g.children.filter((c) => c.href).map((c) => ({ id: c.slug, href: c.href as string, title: c.title, section: g.label }))]) {
      if (!seen.has(c.href)) { seen.add(c.href); candidates.push(c) }
    }
  }
  return { current, candidates }
}

export async function MenuEditor({ lang, itemKey: _k, slot, ...rest }: Omit<MenuEditorProps, 'loginHref' | 'ui' | 'current' | 'candidates' | 'editLang'> & Own) {
  const { current, candidates } = await shellMenu(lang, slot)
  return <MenuEditorIsland {...rest} slot={slot} editLang={lang} current={current} candidates={candidates} ui={groupsUi(lang)} loginHref={loginHref(lang)} />
}

export function RoutingEditorBlock({ lang, itemKey: _k, words }: Own & { words: AccessWords }) {
  return <RoutingEditorIsland ui={groupsUi(lang)} words={words} loginHref={loginHref(lang)} />
}

// Правовая страница о куки — своя у каждого элемента (`/<язык>/cookies`), и у CONFIG тоже.
export function CookieBannerPanel({ lang, itemKey: _k, words }: Own & { words: AccessWords }) {
  return <CookieBannerIsland ui={groupsUi(lang)} words={words} loginHref={loginHref(lang)} policyHref={`/${lang}/cookies`} />
}

// Языки: каталог (84 записи) собирает СЕРВЕР — в браузер едут имя, флаг и качество перевода, а не весь справочник.
// Набор, с которым проект собран сейчас, — из собственных настроек CONFIG.
export async function LanguagesBlock({ lang, itemKey: _k, words }: Own & { words: AccessWords }) {
  const catalogue = Object.values(ALL_LANGUAGE_METADATA)
    .map((m) => ({ code: m.code, flag: m.flag, nativeName: m.nativeName, englishName: m.englishName, tier: m.aiTier }))
    .sort((a, b) => a.englishName.localeCompare(b.englishName))
  const shell = await shellLanguages(lang)
  return <LanguagesIsland catalogue={catalogue} built={shell.languages} builtDefault={shell.defaultLang} ui={groupsUi(lang)} search={searchLanguagesWords(lang)} lang={lang} words={words} loginHref={loginHref(lang)} />
}

async function shellLanguages(lang: string): Promise<{ languages: string[]; defaultLang: string }> {
  // 549-1: в шаблоне нет cacheComponents — без кэша функции: страницы ветки статические (ISR 300 с), оболочку читают при сборке и перерисовке.
  const shell = siteShellData(lang) as unknown as { languages?: unknown; defaultLang?: unknown } | null
  const codes = Array.isArray(shell?.languages)
    ? (shell.languages as unknown[]).map((x) => (typeof x === 'string' ? x : (x as { code?: string })?.code)).filter((x): x is string => typeof x === 'string')
    : ['en']
  return { languages: codes, defaultLang: typeof shell?.defaultLang === 'string' ? shell.defaultLang : codes[0] }
}
