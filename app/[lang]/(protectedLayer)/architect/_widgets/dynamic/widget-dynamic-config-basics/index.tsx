import { SettingsEditor } from "../../../_components/config-editors/blocks"
import { configPageProps } from "./words.i18n"

// 549-1: страница «basics» прежнего config — тот же блок `settingsEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SettingsEditor lang={lang} {...(configPageProps(lang) as any)} />
}
