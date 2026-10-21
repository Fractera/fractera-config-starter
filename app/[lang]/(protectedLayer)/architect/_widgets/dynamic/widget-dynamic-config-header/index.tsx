import { MenuEditor } from "../../../_components/config-editors/blocks"
import { configPageProps } from "./words.i18n"

// 549-1: страница «header» прежнего config — тот же блок `menuEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MenuEditor lang={lang} {...(configPageProps(lang) as any)} />
}
