import { NodeModeCard } from "../../../_components/config-editors/node-mode.client"
import { configPageProps } from "../widget-dynamic-config-features/words.i18n"
import { nodeModeWords } from "./words.i18n"

const ARCHITECT = (process.env.ARCHITECT_URL ?? "").replace(/\/+$/, "")

// 564: красная карточка режима узла над переключателями функций — переключатель, оба режима словами, кнопка «Паспорт» ядра.
export function Widget({ lang }: { lang: string }) {
  return (
    <NodeModeCard
      words={nodeModeWords(lang)}
      access={configPageProps(lang).words}
      passportHref={ARCHITECT ? `${ARCHITECT}/${lang}/passport` : undefined}
      loginHref={`/login?lang=${lang}`} /* 734-3a-2: свой /login CONFIG, не адрес элемента root */
    />
  )
}
