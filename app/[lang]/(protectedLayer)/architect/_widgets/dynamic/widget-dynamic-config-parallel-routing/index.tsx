import { RoutingEditorBlock } from "../../../_components/config-editors/panels"
import { configPageProps } from "./words.i18n"

// 549-1: страница «parallel-routing» прежнего config — та же панель `routingEditor` с теми же словами.
export function Widget({ lang }: { lang: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RoutingEditorBlock lang={lang} {...(configPageProps(lang) as any)} />
}
