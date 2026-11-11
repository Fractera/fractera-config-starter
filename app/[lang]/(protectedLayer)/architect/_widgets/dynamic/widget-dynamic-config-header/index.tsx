import { MenuEditor } from "../../../_components/config-editors/panels"
import { configPageProps } from "./words.i18n"

// 549-1: страница «header» прежнего config — та же панель `menuEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MenuEditor lang={lang} {...(configPageProps(lang) as any)} />
}
