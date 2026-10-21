import { NodeModeCard } from "../../../_components/config-editors/node-mode.client"
import { configPageProps } from "../widget-dynamic-config-features/words.i18n"
import { nodeModeWords } from "./words.i18n"

const ARCHITECT = (process.env.ARCHITECT_URL ?? "").replace(/\/+$/, "")
const SITE = (process.env.PROJECT_SITE_URL ?? "").replace(/\/+$/, "")

// 564: красная карточка режима узла над переключателями функций — переключатель, оба режима словами, кнопка «Паспорт» ядра.
export function Widget({ lang }: { lang: string }) {
  return (
    <NodeModeCard
      words={nodeModeWords(lang)}
      access={configPageProps(lang).words}
      passportHref={ARCHITECT ? `${ARCHITECT}/${lang}/passport` : undefined}
      loginHref={SITE ? `${SITE}/login?lang=${lang}` : undefined}
    />
  )
}
