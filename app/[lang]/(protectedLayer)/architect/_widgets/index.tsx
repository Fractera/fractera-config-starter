import type { ReactNode } from 'react'
import { Widget as W0 } from './dynamic/widget-dynamic-config-basics'
import { Widget as W1 } from './dynamic/widget-dynamic-config-cookie-banner'
import { Widget as W2 } from './dynamic/widget-dynamic-config-footer'
import { Widget as W3 } from './dynamic/widget-dynamic-config-header'
import { Widget as W4 } from './dynamic/widget-dynamic-config-languages'
import { Widget as W5 } from './dynamic/widget-dynamic-config-meta-media'
import { Widget as W6 } from './dynamic/widget-dynamic-config-parallel-routing'
import { Widget as W7 } from './dynamic/widget-dynamic-config-seo'
import { Widget as W8 } from './dynamic/widget-dynamic-config-features'
import { Widget as W9 } from './dynamic/widget-dynamic-config-node-mode'

// 549-1: страницы режима архитектора элемента config — по виджету на страницу прежнего config.
export const WIDGETS: Record<string, (lang: string) => ReactNode> = {
  'widget-dynamic-config-basics': (lang) => <W0 lang={lang} />,
  'widget-dynamic-config-cookie-banner': (lang) => <W1 lang={lang} />,
  'widget-dynamic-config-footer': (lang) => <W2 lang={lang} />,
  'widget-dynamic-config-header': (lang) => <W3 lang={lang} />,
  'widget-dynamic-config-languages': (lang) => <W4 lang={lang} />,
  'widget-dynamic-config-meta-media': (lang) => <W5 lang={lang} />,
  'widget-dynamic-config-parallel-routing': (lang) => <W6 lang={lang} />,
  'widget-dynamic-config-seo': (lang) => <W7 lang={lang} />,
  'widget-dynamic-config-features': (lang) => <W8 lang={lang} />,
  'widget-dynamic-config-node-mode': (lang) => <W9 lang={lang} />,
}
