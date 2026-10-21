import { CookieBannerBlock } from "../../../_components/config-editors/blocks"
import { configPageProps } from "./words.i18n"

// 549-1: страница «cookie-banner» прежнего config — тот же блок `cookieBannerEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <CookieBannerBlock lang={lang} {...(configPageProps(lang) as any)} />
}
