import { LanguagesBlock } from "../../../_components/config-editors/panels"
import { configPageProps } from "./words.i18n"

// 549-1: страница «languages» прежнего config — та же панель `languagesEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <LanguagesBlock lang={lang} {...(configPageProps(lang) as any)} />
}
