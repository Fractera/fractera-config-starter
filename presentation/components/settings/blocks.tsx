// БЛОКИ РЕЖИМА АРХИТЕКТОРА (шаг 299-4): серверные обёртки островков. Ссылку на вход дают отсюда, из окружения узла
// (`PROJECT_SITE_URL`, как у шапки проекта), — данные страницы в `content/**/<lang>.json` адресов узла не знают.
import { FeatureSwitchesIsland, type FeatureSwitchesProps } from './feature-switches.client'
import { SettingsViewIsland, type SettingsViewProps } from './settings-view.client'

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
