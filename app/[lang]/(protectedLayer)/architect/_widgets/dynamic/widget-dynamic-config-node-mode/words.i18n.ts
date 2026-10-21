import type { NodeModeWords } from "../../../_components/config-editors/node-mode.client"

// 564: слова красной карточки режима узла (en и ru; остальные языки — английский).
const WORDS: Record<string, NodeModeWords> = {
  en: {
    title: "Node mode",
    chosen: "The mode is chosen at the start of the project. It decides where the settings of your elements live.",
    project: {
      label: "Single project",
      text: "One owner. Every element of the node takes its settings from this page: one header, one footer, one set of languages, one node wallet.",
    },
    factory: {
      label: "App factory",
      text: "The node hosts projects of different owners. A new element of yours is born with its own settings; this page keeps the settings of the core and the built-in elements.",
    },
    only: "Switching the mode changes only the elements born after it. Elements that already exist keep their settings and are switched one by one.",
    mismatches: "Your elements that live differently from this mode:",
    linkedOn: "takes its settings from this page",
    linkedOff: "keeps its own settings",
    passport: "The current mode is also shown on the Passport of the node.",
    passportButton: "Passport",
    saved: "Node mode: {mode}.",
    saveFailed: "The mode was not changed — the core of the node did not answer. Try again.",
    unknown: "The mode could not be read.",
  },
  ru: {
    title: "Режим узла",
    chosen: "Режим выбирают в начале проекта. От него зависит, где живут настройки ваших элементов.",
    project: {
      label: "Единый проект",
      text: "Один хозяин. Все элементы узла берут настройки с этой страницы: одна шапка, один подвал, одни языки, один кошелёк узла.",
    },
    factory: {
      label: "Завод приложений",
      text: "Узел держит проекты разных хозяев. Новый свой элемент рождается со своими настройками, а здесь остаются настройки ядра и встроенных элементов.",
    },
    only: "Смена режима касается только элементов, рождённых после неё. Уже существующие сохраняют свои настройки и переключаются по одному.",
    mismatches: "Свои элементы, которые живут не по этому режиму:",
    linkedOn: "берёт настройки с этой страницы",
    linkedOff: "держит свои настройки",
    passport: "Текущий режим показан и в «Паспорте» узла.",
    passportButton: "Паспорт",
    saved: "Режим узла: {mode}.",
    saveFailed: "Режим не изменён — ядро узла не ответило. Попробуйте ещё раз.",
    unknown: "Режим не удалось прочитать.",
  },
}

export const nodeModeWords = (lang: string): NodeModeWords => WORDS[lang] ?? WORDS.en
