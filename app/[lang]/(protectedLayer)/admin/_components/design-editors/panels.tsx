// 579-1: серверная обёртка своего редактора оформления — `DesignEditorPanel`.
// Адреса дают отсюда, из окружения узла; слова раздела выбирает СЕРВЕР — словарь в браузер целиком не едет.
import { DesignEditorIsland, type DesignSection } from './design-editor.client'
import { designUi } from './design.i18n'
import type { AccessWords } from './settings-access'
import { ownId } from '@/lib/own-id'

const CORE = (process.env.ARCHITECT_URL ?? '').trim().replace(/\/+$/, '')
// 734-3a-2: вход — свой `/login` CONFIG (его прокси ведёт на службу входа), а не адрес элемента `root`.
const loginHref = (lang: string) => `/login?lang=${lang}`
// Нет адреса ядра — ссылок нет: ссылка в никуда хуже её отсутствия.

export function DesignEditorPanel({ lang, section, words }: { lang: string; section: DesignSection; words: AccessWords }) {
  const all = designUi(lang)
  return (
    <DesignEditorIsland
      section={section}
      ui={{ colors: all.colors, fonts: all.fonts, type: all.type, shape: all.shape }}
      words={words}
      loginHref={loginHref(lang)}
    />
  )
}
