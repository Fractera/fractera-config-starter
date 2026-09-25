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
  title: 'Project settings',
  description: 'One place for the settings of the whole project — name, languages, search, header, footer and design. Every part of the site takes them from here.',
  cta: 'Go to settings',
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'Who can change the settings?', a: 'Only the architect of the project, after signing in. Everyone else sees this page and nothing more.' },
    { q: 'Where are features switched on and off?', a: 'At the top of the settings home: one switch per feature — the top menu, footer pages, breadcrumbs, FAQ, the cookie banner, the offline copy and more.' },
    { q: 'What if this element is not available for a moment?', a: 'Every part of the project keeps the last settings it received and keeps working with them.' },
  ],
  metrics: [
    { value: '8', label: 'groups of settings' },
    { value: '12', label: 'features you switch on and off' },
    { value: '1', label: 'place for the whole project' },
  ],
  badges: ['APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'MCP', 'Claude Code Agent'],
  groups: {
    badge: 'Inside',
    title: 'Eight groups, each on its own page',
    note: 'Open a group, change what you need, save — the rest of the project follows.',
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
    title: 'One change reaches every part',
    note: 'The site, sign-in, data and blocks read the same settings.',
    steps: [
      { title: 'Change', text: 'The architect changes a setting here and saves it.' },
      { title: 'Share', text: 'This element hands the new settings to every part of the project.' },
      { title: 'See', text: 'The next visitor sees the change — nothing has to be rebuilt.' },
    ],
  },
}

const ru: ConfigHomeWords = {
  title: 'Настройки проекта',
  description: 'Одно место для настроек всего проекта — название, языки, поиск, шапка, подвал и оформление. Каждая часть сайта берёт их отсюда.',
  cta: 'Перейти к настройкам',
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Кто может менять настройки?', a: 'Только архитектор проекта после входа. Остальные видят эту страницу и ничего больше.' },
    { q: 'Где включаются и выключаются функции?', a: 'Вверху главной страницы настроек: по переключателю на функцию — верхнее меню, страницы подвала, крошки, вопросы и ответы, куки-баннер, офлайн-копия и другие.' },
    { q: 'Что будет, если этот элемент на минуту недоступен?', a: 'Каждая часть проекта держит последние полученные настройки и продолжает работать с ними.' },
  ],
  metrics: [
    { value: '8', label: 'групп настроек' },
    { value: '12', label: 'функций включаются переключателем' },
    { value: '1', label: 'место на весь проект' },
  ],
  badges: ['APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'MCP', 'Claude Code Agent'],
  groups: {
    badge: 'Внутри',
    title: 'Восемь групп, у каждой своя страница',
    note: 'Откройте группу, поменяйте нужное, сохраните — остальной проект подстроится.',
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
    title: 'Одна правка доходит до всех',
    note: 'Сайт, вход, данные и блоки читают одни и те же настройки.',
    steps: [
      { title: 'Поменять', text: 'Архитектор меняет настройку здесь и сохраняет.' },
      { title: 'Раздать', text: 'Этот элемент передаёт новые настройки каждой части проекта.' },
      { title: 'Увидеть', text: 'Следующий посетитель видит правку — пересобирать ничего не нужно.' },
    ],
  },
}

const WORDS: Record<string, ConfigHomeWords> = { en, ru }

export function configHomeWords(lang: string): ConfigHomeWords {
  return WORDS[lang] ?? en
}

export const LANGS = Object.keys(WORDS)
