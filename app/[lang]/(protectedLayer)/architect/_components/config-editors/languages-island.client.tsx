'use client'

// РЕДАКТОР ЯЗЫКОВ ПРОЕКТА (шаг 299-5) — группа multilang редактора aifa.dev/ru/architect/app-config. `LanguagesEditor`
// перенесён как есть. Сохранённый набор — APP-CONFIG `languages` элемента; пока его нет, начальным служит набор, с которым
// сайт собран сейчас (он же `built` — расхождение и есть «ждёт пересборки»).
import { useEffect, useState } from 'react'
import { LanguagesEditor, type LangRow } from './languages-editor.client'
import type { GroupsUi } from './groups.i18n'
import type { SearchLanguagesWords } from './search-languages.i18n'
import { loadSettings, type Access, type AccessWords } from './settings-access'
import { AccessNotice } from './access-notice'

export type LanguagesIslandProps = {
  catalogue: LangRow[]
  built: string[]
  builtDefault: string
  ui: GroupsUi
  /** Узел 341-2: слова блока «Языки для поисковых систем» и язык страницы. */
  search: SearchLanguagesWords
  lang: string
  words: AccessWords
  loginHref?: string
}

export function LanguagesIsland({ catalogue, built, builtDefault, ui, search, lang, words, loginHref }: LanguagesIslandProps) {
  const [access, setAccess] = useState<Access>('loading')
  const [saved, setSaved] = useState<{ supported: string[]; default: string; indexed: string[] } | null>(null)
  useEffect(() => {
    loadSettings('app').then((r) => {
      setAccess(r.access)
      const l = r.config?.languages as { supported?: unknown; default?: unknown; indexed?: unknown } | undefined
      const supported = Array.isArray(l?.supported) ? (l.supported as unknown[]).filter((x): x is string => typeof x === 'string') : built
      // 341-2: записи `indexed` нет — сверх английского и языка по умолчанию не открыто ничего (закон 340).
      const indexed = Array.isArray(l?.indexed) ? (l.indexed as unknown[]).filter((x): x is string => typeof x === 'string') : []
      setSaved({ supported, default: typeof l?.default === 'string' ? l.default : builtDefault, indexed })
    })
  }, [built, builtDefault])
  if (access !== 'ok' || !saved) return <AccessNotice access={access} words={words} loginHref={loginHref} />
  return <LanguagesEditor catalogue={catalogue} initial={saved.supported} initialDefault={saved.default} built={built} ui={ui} search={{ w: search, initialUnlocked: saved.indexed, lang }} />
}
