// 549-1: слова и параметры блока страницы «_index» прежнего config (content/architect/_index/<язык>.json) — дословно.
export const P_features = {
  "en": {
    "title": "",
    "note": "A change is saved at once.",
    "features": [
      {
        "key": "topMenu",
        "label": "Top menu",
        "hint": "The menu at the top of every page.",
        "guard": {
          "title": "Switching off the top menu",
          "text": "Without the top menu the parts of the project are reachable only by direct links. Remember or copy them before you continue."
        }
      },
      {
        "key": "footerPages",
        "label": "Footer pages",
        "hint": "Legal and information pages linked from the footer."
      },
      {
        "key": "cookieBanner",
        "label": "Cookie banner",
        "hint": "The consent message for visitors."
      },
      {
        "key": "offlineCache",
        "label": "Offline copy",
        "hint": "Pages a visitor has seen open without a connection."
      },
      {
        "key": "auth",
        "label": "Sign-in",
        "hint": "The sign-in button and the visitor cabinet.",
        "guard": {
          "title": "Switching off sign-in",
          "text": "Without the sign-in button there is no drawer and no way to the architect pages from the site. The parts of the project are reachable only by direct links. Remember or copy them before you continue."
        }
      },
      {
        "key": "breadcrumbs",
        "label": "Breadcrumbs",
        "hint": "The path to the page above its title."
      },
      {
        "key": "faq",
        "label": "Questions and answers",
        "hint": "The FAQ section on the pages that have it."
      },
      {
        "key": "themeToggle",
        "label": "Theme switch",
        "hint": "Light and dark theme for the visitor."
      },
      {
        "key": "widthToggle",
        "label": "Width switch",
        "hint": "Narrow or wide page for the visitor."
      },
      {
        "key": "languageSwitcher",
        "label": "Language switch",
        "hint": "The choice of language in the header."
      },
      {
        "key": "socials",
        "label": "Social links",
        "hint": "Links to the project in social networks."
      },
      {
        "key": "viewportBadge",
        "label": "Screen width badge",
        "hint": "A small badge with the screen width, for checking layouts."
      }
    ],
    "words": {
      "loading": "Loading the settings…",
      "signin": "Sign in as the architect of the project to see and change the settings.",
      "signinLink": "Sign in",
      "forbidden": "You are signed in, but only the architect of the project can see and change these settings.",
      "unavailable": "The sign-in service is not answering right now — try again in a minute.",
      "error": "The settings could not be read. Nothing was changed.",
      "saveFailed": "Not saved — try again.",
      "savedLive": "Saved and sent to the services that follow the settings ({n}). Reload the page to see the change.",
      "savedPending": "Saved in the project settings. No service is listening right now — each one picks it up at its next start.",
      "savedDeploy": "Saved. This change takes effect after the next deployment of the project.",
      "guardLinks": "Direct links to every part of the project:",
      "guardCopy": "Copy the links",
      "guardCopied": "Copied",
      "guardConfirm": "I have saved these links",
      "guardProceed": "Switch off",
      "guardCancel": "Cancel",
      "guardNoLinks": "The list of the parts of the project could not be read. Do not switch this off until it can."
    },
    "distributionReady": false,
    "elementNames": {
      "core": "Core (architect)",
      "root": "Site",
      "auth": "Sign-in",
      "data": "Data",
      "config": "Project settings",
      "blocks": "Blocks"
    }
  },
  "ru": {
    "title": "",
    "note": "Изменение сохраняется сразу.",
    "features": [
      {
        "key": "topMenu",
        "label": "Верхнее меню",
        "hint": "Меню вверху каждой страницы.",
        "guard": {
          "title": "Выключение верхнего меню",
          "text": "Без верхнего меню части проекта будут доступны только по прямым ссылкам. Запомните или скопируйте их, прежде чем продолжить."
        }
      },
      {
        "key": "footerPages",
        "label": "Страницы подвала",
        "hint": "Юридические и справочные страницы по ссылкам из подвала."
      },
      {
        "key": "cookieBanner",
        "label": "Куки-баннер",
        "hint": "Сообщение о согласии для посетителей."
      },
      {
        "key": "offlineCache",
        "label": "Офлайн-копия",
        "hint": "Уже открытые посетителем страницы работают без сети."
      },
      {
        "key": "auth",
        "label": "Вход",
        "hint": "Кнопка входа и кабинет посетителя.",
        "guard": {
          "title": "Выключение входа",
          "text": "Без кнопки входа не будет выдвижного ящика и перехода на страницы архитектора с сайта. Части проекта будут доступны только по прямым ссылкам. Запомните или скопируйте их, прежде чем продолжить."
        }
      },
      {
        "key": "breadcrumbs",
        "label": "Хлебные крошки",
        "hint": "Путь к странице над её заголовком."
      },
      {
        "key": "faq",
        "label": "Вопросы и ответы",
        "hint": "Раздел вопросов на страницах, где он есть."
      },
      {
        "key": "themeToggle",
        "label": "Переключатель темы",
        "hint": "Светлая и тёмная тема для посетителя."
      },
      {
        "key": "widthToggle",
        "label": "Переключатель ширины",
        "hint": "Узкая или широкая страница для посетителя."
      },
      {
        "key": "languageSwitcher",
        "label": "Переключатель языка",
        "hint": "Выбор языка в шапке."
      },
      {
        "key": "socials",
        "label": "Соцсети",
        "hint": "Ссылки на проект в социальных сетях."
      },
      {
        "key": "viewportBadge",
        "label": "Значок ширины экрана",
        "hint": "Маленький значок с шириной экрана — для проверки раскладки."
      }
    ],
    "words": {
      "loading": "Загружаю настройки…",
      "signin": "Войдите как архитектор проекта, чтобы видеть и менять настройки.",
      "signinLink": "Войти",
      "forbidden": "Вы вошли, но видеть и менять эти настройки может только архитектор проекта.",
      "unavailable": "Служба входа сейчас не отвечает — попробуйте через минуту.",
      "error": "Настройки не удалось прочитать. Ничего не изменено.",
      "saveFailed": "Не сохранилось — попробуйте ещё раз.",
      "savedLive": "Сохранено и отправлено службам, которые следят за настройками ({n}). Обновите страницу, чтобы увидеть изменение.",
      "savedPending": "Сохранено в настройках проекта. Сейчас за настройками не следит ни одна служба — каждая заберёт их при следующем запуске.",
      "savedDeploy": "Сохранено. Изменение вступит в силу после следующего развёртывания проекта.",
      "guardLinks": "Прямые ссылки на все части проекта:",
      "guardCopy": "Скопировать ссылки",
      "guardCopied": "Скопировано",
      "guardConfirm": "Я сохранил эти ссылки",
      "guardProceed": "Выключить",
      "guardCancel": "Отмена",
      "guardNoLinks": "Список частей проекта не удалось прочитать. Не выключайте, пока он не прочитается."
    },
    "distributionReady": false,
    "elementNames": {
      "core": "Ядро (архитектор)",
      "root": "Сайт",
      "auth": "Авторизация",
      "data": "Данные",
      "config": "Настройки проекта",
      "blocks": "Блоки"
    }
  }
} as const

export const configPageProps = (lang: string) => (lang === "ru" ? P_features.ru : P_features.en)
