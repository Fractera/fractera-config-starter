// БЛОКИ РЕЖИМА АРХИТЕКТОРА (шаг 299-4): серверные обёртки островков. Ссылку на вход дают отсюда, из окружения узла
// (`PROJECT_SITE_URL`, как у шапки проекта), — данные страницы в `content/**/<lang>.json` адресов узла не знают.
import { FeatureSwitchesIsland, type FeatureSwitchesProps } from './feature-switches.client'
import { SettingsViewIsland, type SettingsViewProps } from './settings-view.client'
import { SettingsEditorIsland, type SettingsEditorProps } from './settings-editor.client'
import { fieldsUi } from './fields.i18n'

const SITE = (process.env.PROJECT_SITE_URL ?? '').replace(/\/+$/, '')
const loginHref = (lang: string) => (SITE ? `${SITE}/login?lang=${lang}` : undefined)

type Own = { lang: string; blockKey?: string }

export function FeatureSwitches({ lang, blockKey: _k, ...rest }: Omit<FeatureSwitchesProps, 'loginHref'> & Own) {
  return <FeatureSwitchesIsland {...rest} loginHref={loginHref(lang)} />
}

// `kind` у блока занят видом блока, поэтому вид настроек в данных страницы — `settingsKind`.
export function SettingsView({ lang, blockKey: _k, settingsKind, ...rest }: Omit<SettingsViewProps, 'loginHref' | 'kind'> & Own & { settingsKind: SettingsViewProps['kind'] }) {
  return <SettingsViewIsland {...rest} kind={settingsKind} loginHref={loginHref(lang)} />
}

// Редактор раздела APP-CONFIG: подписи полей выбирает СЕРВЕР (`fieldsUi(lang)`) и отдаёт островку пропсом — словарь в
// браузер целиком не едет.
export function SettingsEditor({ lang, blockKey: _k, ...rest }: Omit<SettingsEditorProps, 'loginHref' | 'ui' | 'lang'> & Own) {
  return <SettingsEditorIsland {...rest} lang={lang} ui={fieldsUi(lang)} loginHref={loginHref(lang)} />
}
