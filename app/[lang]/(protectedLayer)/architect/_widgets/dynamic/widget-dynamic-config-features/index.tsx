import { FeatureSwitches } from "../../../_components/config-editors/blocks"
import { configPageProps } from "./words.i18n"

// 549-1: страница «_index» прежнего config — тот же блок `featureSwitches` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <FeatureSwitches lang={lang} {...(configPageProps(lang) as any)} />
}
