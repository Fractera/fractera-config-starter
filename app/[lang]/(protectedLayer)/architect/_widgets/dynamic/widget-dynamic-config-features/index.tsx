import { FeatureSwitches } from "../../../_components/config-editors/panels"
import { configPageProps } from "./words.i18n"

// 549-1: страница «_index» прежнего config — та же панель `featureSwitches` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <FeatureSwitches lang={lang} {...(configPageProps(lang) as any)} />
}
