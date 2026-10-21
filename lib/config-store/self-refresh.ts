import "server-only"
import { revalidatePath } from "next/cache"
import { onSettingsSignal } from "@/lib/settings-listener"

// САМ СЕБЕ ПОДПИСЧИК (узел, шаг 553-7). config тоже носит шапку проекта и вкладку «Все проекты» из копии настроек — но подписаться на
// самого себя при старте он не может: его сервер ещё не готов отвечать (✗ замерено 2026-10-21: в списке подписчиков осталась запись
// пробного запуска установщика с портом 25679, и сигналы до config не доходили — вкладки на его страницах не было).
// Поэтому после каждой записи (настройки, каталог) config сам забирает свою копию и перерисовывает свои страницы — без подписки.
export async function refreshSelf(): Promise<void> {
  try {
    const r = await onSettingsSignal()
    if (!r.ok && r.reason !== "no-config-element") console.warn(`[settings] своя копия не обновлена — ${r.reason}`)
  } catch (e) {
    console.warn(`[settings] своя копия не обновлена — ${e instanceof Error ? e.message : e}`)
  }
  revalidatePath("/", "layout")
  revalidatePath("/[lang]", "layout")
}
