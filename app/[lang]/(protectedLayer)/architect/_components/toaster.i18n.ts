// 549-1: слова тостера редакторов config — те же, что прежний config ставил в макете (`presentation/app/[lang]/layout.tsx`).
const WORDS = {
  en: { deployLabel: "Open deployments", closeLabel: "Close" },
  ru: { deployLabel: "Открыть развёртывания", closeLabel: "Закрыть" },
} as const

export const toasterWords = (lang: string) => (lang === "ru" ? WORDS.ru : WORDS.en)
