// СЛОВА БЛОКА «ЯЗЫКИ ДЛЯ ПОИСКОВЫХ СИСТЕМ» — CONFIG (узел, шаг 341-2; перенесено из шаблона элемента, шаг 340-3). Серверный
// словарь: страница берёт его по языку и передаёт островку. Отличие от шаблона — список элементов вместо одной кнопки
// развёртывания (слово владельца 2026-09-30: «Список элементов»).
//
// Совет — слова владельца 2026-09-30, отредактированные: «запускать проект продакшн рекомендуется только на одном или двух
// языках… английский язык плюс язык по дефолту… На запуске проекта вы получите именно такие настройки поисковой
// оптимизации… каждые полгода добавлять ещё один регион… под вашу собственную ответственность».
// 🔒 «Раз в полгода» подано как рекомендация, а не как правило Google: в документации Google такого правила нет (проверено
// 2026-09-30). Довод Google — правило о массово созданных страницах, оно названо в `why`.

export type SearchLanguagesWords = {
  title: string
  adviceTitle: string
  advice: string
  why: string
  openTitle: string
  alwaysOpen: string
  unlockedByYou: string
  close: string
  closedTitle: string
  pick: string
  unlock: string
  confirmTitle: string
  confirmText: string
  confirmYes: string
  cancel: string
  allOpen: string
  saved: string
  failed: string
  pendingTitle: string
  pending: string
  whereTitle: string
  where: string
  toDeployments: string
  oldCode: string
  noFollowers: string
  followersFailed: string
}

const en: SearchLanguagesWords = {
  title: "Languages for search engines",
  adviceTitle: "Launch on one or two languages",
  advice:
    "The recommended launch strategy is English plus your site's default language, if it is not English — a new project starts with exactly these search settings. Once the project gets traffic, open one more region about every six months: the one most of your visitors come from right now. People see the site in every language you chose above; this list only decides what search engines are shown.",
  why:
    "Why: Google's spam policies treat many pages produced by automated translation with little value for readers as scaled content abuse, and advise keeping such pages out of Search.",
  openTitle: "Open to search engines",
  alwaysOpen: "always open",
  unlockedByYou: "unlocked by you",
  close: "Close again",
  closedTitle: "Open one more language",
  pick: "Choose a language",
  unlock: "Unlock at my own risk",
  confirmTitle: "Open this language to search engines?",
  confirmText:
    "Its pages will be offered to search engines after the next deployment. If the translation is automatic and thin, Google may treat it as low-value content. You take this decision at your own risk and can close the language again at any time.",
  confirmYes: "Yes, unlock",
  cancel: "Cancel",
  allOpen: "Every language of the site is already open to search engines.",
  saved: "Saved. Search engines will see the change after each element's next deployment.",
  failed: "Could not save. Try again.",
  pendingTitle: "Waiting for deployment",
  pending: "You changed the set in this visit. It reaches each site below after that site's next deployment.",
  whereTitle: "Where it applies",
  where: "Every element that takes its settings from CONFIG. Open its Deployments and press Preview or Deploy — the new set is built into its pages: robots tags, the sitemap and the map of alternate languages. It takes a few minutes; the site keeps working meanwhile.",
  toDeployments: "Deployments",
  oldCode: "built from an older template — shows search engines every language until it is updated",
  noFollowers: "No element takes its languages from CONFIG right now.",
  followersFailed: "Could not load the list of elements.",
}

const ru: SearchLanguagesWords = {
  title: "Языки для поисковых систем",
  adviceTitle: "Запускайтесь на одном-двух языках",
  advice:
    "Рекомендуемая стратегия запуска — английский плюс язык сайта по умолчанию, если он не английский: именно с такими настройками поисковой оптимизации запускается новый проект. Когда у проекта появится трафик, открывайте поисковикам ещё один регион примерно раз в полгода — тот, откуда сейчас приходит больше всего посетителей. Люди видят сайт на всех языках, выбранных выше; этот список решает только то, что показывается поисковым системам.",
  why:
    "Почему: правила Google считают нарушением массово созданные страницы, в том числе автоматические переводы, мало полезные читателю, и советуют не показывать такие страницы в поиске.",
  openTitle: "Открыты поисковикам",
  alwaysOpen: "открыт всегда",
  unlockedByYou: "открыт вами",
  close: "Закрыть снова",
  closedTitle: "Открыть ещё один язык",
  pick: "Выберите язык",
  unlock: "Разблокировать под мою ответственность",
  confirmTitle: "Открыть этот язык поисковым системам?",
  confirmText:
    "Его страницы будут предложены поисковикам после следующего развёртывания. Если перевод автоматический и бедный, Google может счесть его малоценным. Вы принимаете это решение под свою ответственность и в любой момент можете закрыть язык снова.",
  confirmYes: "Да, разблокировать",
  cancel: "Отмена",
  allOpen: "Все языки сайта уже открыты поисковым системам.",
  saved: "Сохранено. Поисковики увидят изменение после следующего развёртывания каждого элемента.",
  failed: "Не удалось сохранить. Попробуйте ещё раз.",
  pendingTitle: "Ждёт развёртывания",
  pending: "Вы изменили набор в этом посещении. На каждый сайт ниже он попадёт после его следующего развёртывания.",
  whereTitle: "Где применится",
  where: "Каждый элемент, который берёт настройки из CONFIG. Откройте его «Развёртывания» и нажмите «Предпросмотр» или «Развернуть» — новый набор войдёт в его страницы: теги для роботов, карту сайта и карту альтернативных языков. Это займёт несколько минут; сайт всё это время работает.",
  toDeployments: "Развёртывания",
  oldCode: "собран из старого шаблона — показывает поисковикам все языки, пока его не обновят",
  noFollowers: "Сейчас ни один элемент не берёт языки из CONFIG.",
  followersFailed: "Не удалось загрузить список элементов.",
}

const DICT: Record<string, SearchLanguagesWords> = { en, ru }

export function searchLanguagesWords(lang: string): SearchLanguagesWords {
  return DICT[lang] ?? en
}
