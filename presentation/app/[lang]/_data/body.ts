// СЛОВА ГЛАВНОЙ СТРАНИЦЫ ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» (шаг 299). Сборка в блоки — `../_components/`.
// Раскладка — по образцу главной «Блоков»: ряд мер, ярлыки, карточки групп, три шага, вопросы. Группы — те же восемь, что
// на aifa.dev/ru/architect/app-config (слово владельца 2026-09-25: «будет работать также как настройка на этой странице»).

export type ConfigHomeWords = {
  title: string
  description: string
  cta: string
  faqTitle: string
  faq: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }]
  metrics: { value: string; label: string }[]
  badges: string[]
  groups: { badge: string; title: string; note: string; items: { title: string; text: string }[] }
  flow: { badge: string; title: string; note: string; steps: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }] }
}

const en: ConfigHomeWords = {
  title: 'Fractera CONFIG — the settings of every application in one place',
  description: 'A standalone microservice that keeps the settings of your project — name, languages, search, header, footer, design and feature switches — and gives them over MCP to every application that wants them. Configure the whole project from one screen; every application stays independent.',
  cta: 'Go to settings',
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'Do my applications need CONFIG to run?', a: 'No. CONFIG is an addition, not a foundation. Every application keeps its own settings and runs without it. An application that connects to CONFIG over MCP simply gets one convenient place where all its settings are changed.' },
    { q: 'How does an application connect?', a: 'Over MCP, the same way applications take components from Fractera Blocks. The application asks for the version of the settings, and when it changes, takes the new settings and lays them over its own defaults. CONFIG never calls anyone: each application decides for itself whether and how often to ask.' },
    { q: 'Who can change the settings?', a: 'Only the architect of the project, after signing in. Everyone else sees this page and nothing more; applications read the settings with the key of the node and never write them.' },
  ],
  metrics: [
    { value: '8', label: 'groups of settings' },
    { value: '12', label: 'features you switch on and off' },
    { value: '1', label: 'screen for every application of the project' },
  ],
  badges: ['MCP', 'APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'Claude Code Agent'],
  groups: {
    badge: 'What you configure',
    title: 'Eight groups, each on its own page',
    note: 'Open a group, change what you need, save. Every connected application picks the change up on its own.',
    items: [
      { title: 'Languages', text: 'Which languages the project speaks and which one is the default.' },
      { title: 'Basics', text: 'The name of the project, its description and contacts.' },
      { title: 'Search and AI', text: 'How search engines and AI assistants read the project.' },
      { title: 'Meta and media', text: 'Logos, icons and the pictures shown when a page is shared.' },
      { title: 'Parallel routing', text: 'Which parts of the application screen are shown side by side.' },
      { title: 'Header', text: 'The menu at the top of every page.' },
      { title: 'Footer', text: 'The links and pages at the bottom of every page.' },
      { title: 'Cookie banner', text: 'The consent message and its words in every language.' },
    ],
  },
  flow: {
    badge: 'How it works',
    title: 'Change once — every connected application follows',
    note: 'No settings scattered across repositories, no rebuild for a menu item or a switch.',
    steps: [
      { title: 'Change', text: 'The architect changes a setting on this screen and saves it. CONFIG keeps it.' },
      { title: 'Take', text: 'Every application connected over MCP notices the new version and takes the settings itself — the Fractera site within a minute.' },
      { title: 'See', text: 'The application applies them over its own defaults, and visitors see the change without a rebuild. A new language goes out with the next deployment.' },
    ],
  },
}

const ru: ConfigHomeWords = {
  title: 'Fractera CONFIG — настройки всех приложений в одном месте',
  description: 'Самостоятельный микросервис, который хранит настройки вашего проекта — название, языки, поиск, шапку, подвал, оформление и переключатели функций — и отдаёт их по MCP каждому приложению, которое их хочет. Весь проект настраивается с одного экрана, а каждое приложение остаётся независимым.',
  cta: 'Перейти к настройкам',
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Нужен ли CONFIG, чтобы мои приложения работали?', a: 'Нет. CONFIG — дополнение, а не фундамент. Каждое приложение хранит свои настройки и работает без него. Приложение, подключённое к CONFIG по MCP, просто получает одно удобное место, где меняются все его настройки.' },
    { q: 'Как приложение подключается?', a: 'По MCP — так же, как приложения берут компоненты у Fractera Blocks. Приложение спрашивает версию настроек, а когда она меняется, забирает новые настройки и кладёт их поверх своих умолчаний. CONFIG никого не вызывает сам: каждое приложение решает, спрашивать ли и как часто.' },
    { q: 'Кто может менять настройки?', a: 'Только архитектор проекта после входа. Остальные видят эту страницу и ничего больше; приложения читают настройки ключом узла и никогда их не пишут.' },
  ],
  metrics: [
    { value: '8', label: 'групп настроек' },
    { value: '12', label: 'функций включаются переключателем' },
    { value: '1', label: 'экран для всех приложений проекта' },
  ],
  badges: ['MCP', 'APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'Claude Code Agent'],
  groups: {
    badge: 'Что настраивается',
    title: 'Восемь групп, у каждой своя страница',
    note: 'Откройте группу, поменяйте нужное, сохраните. Каждое подключённое приложение заберёт правку само.',
    items: [
      { title: 'Языки', text: 'На каких языках говорит проект и какой из них главный.' },
      { title: 'Основное', text: 'Название проекта, его описание и контакты.' },
      { title: 'Поиск и ИИ', text: 'Как проект читают поисковики и ИИ-помощники.' },
      { title: 'Мета и медиа', text: 'Логотипы, значки и картинки для ссылок в мессенджерах.' },
      { title: 'Параллельная маршрутизация', text: 'Какие части экрана приложения показываются рядом.' },
      { title: 'Шапка', text: 'Меню вверху каждой страницы.' },
      { title: 'Подвал', text: 'Ссылки и страницы внизу каждой страницы.' },
      { title: 'Куки-баннер', text: 'Сообщение о согласии и его слова на каждом языке.' },
    ],
  },
  flow: {
    badge: 'Как это работает',
    title: 'Поменяли один раз — подключённые приложения подстроились',
    note: 'Настройки не разбросаны по репозиториям, и ради пункта меню или переключателя ничего не пересобирается.',
    steps: [
      { title: 'Поменять', text: 'Архитектор меняет настройку на этом экране и сохраняет. CONFIG её хранит.' },
      { title: 'Забрать', text: 'Каждое приложение, подключённое по MCP, замечает новую версию и забирает настройки само — сайт Fractera в течение минуты.' },
      { title: 'Увидеть', text: 'Приложение кладёт их поверх своих умолчаний, и посетители видят правку без пересборки. Новый язык уходит со следующим развёртыванием.' },
    ],
  },
}

const WORDS: Record<string, ConfigHomeWords> = { en, ru }

export function configHomeWords(lang: string): ConfigHomeWords {
  return WORDS[lang] ?? en
}

export const LANGS = Object.keys(WORDS)
