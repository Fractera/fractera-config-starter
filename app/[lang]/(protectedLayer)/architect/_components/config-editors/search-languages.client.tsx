"use client"

import { useEffect, useMemo, useState } from "react"
import { ExternalLink, Loader2, Lock, LockOpen } from "lucide-react"
import { toast } from "./toast"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { H3, P, Small } from "@/components/ui/typography"
import { AdviceNote } from "./advice-note"
import type { LangRow } from "./languages-editor.client"
import type { SearchLanguagesWords } from "./search-languages.i18n"

// ЯЗЫКИ ДЛЯ ПОИСКОВЫХ СИСТЕМ — CONFIG (узел, шаг 341-2; перенесено из шаблона элемента `components/site-settings/`, 340-3).
// Слово владельца 2026-09-30: «перенеси этот блок в CONFIG ядра». Людям сайт виден на всех выбранных языках; поисковику —
// только на открытых.
//
// 🔒 АНГЛИЙСКИЙ И ЯЗЫК ПО УМОЛЧАНИЮ ОТКРЫТЫ ВСЕГДА, И ЗАКРЫТЬ ИХ ЗДЕСЬ НЕЛЬЗЯ. Остальные открываются по одному, с
// подтверждением «под мою ответственность». Хранится заплата CONFIG `languages.indexed` — только разблокированные сверх
// постоянных. Элементы, подключённые к CONFIG, получают её копией; узел переносит набор в сборку элемента
// (`lib/agi-items/element-languages.mjs` ядра → `NEXT_PUBLIC_INDEXED_LANGUAGES`).
//
// 🔒 СОХРАНЕНО ≠ ПРИМЕНЕНО, И ПРИМЕНЯЕТ КАЖДЫЙ ЭЛЕМЕНТ САМ. CONFIG управляет многими сайтами, а собран каждый своим
// набором, поэтому вместо одной кнопки — список элементов со ссылкой на их «Развёртывания» (слово владельца 2026-09-30:
// «Список элементов»). Развёртывание запускает человек; CONFIG ничего не пересобирает сам.

type Follower = { id: string; address: string; searchLanguages: boolean; deployments: string | null }

export function SearchLanguages({
  catalogue,
  supported,
  defaultLang,
  initialUnlocked,
  lang,
  w,
}: {
  catalogue: readonly LangRow[]
  /** Языки сайта (сохранённый набор CONFIG). */
  supported: readonly string[]
  defaultLang: string
  /** Заплата CONFIG `languages.indexed`. */
  initialUnlocked: readonly string[]
  /** Язык страницы CONFIG — для адресов «Развёртываний» в ядре. */
  lang: string
  w: SearchLanguagesWords
}) {
  const always = useMemo(() => supported.filter((l) => l === "en" || l === defaultLang), [supported, defaultLang])
  const start = useMemo(() => initialUnlocked.filter((l) => supported.includes(l) && !always.includes(l)), [initialUnlocked, supported, always])
  const [unlocked, setUnlocked] = useState<string[]>(start)
  const [pick, setPick] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [followers, setFollowers] = useState<Follower[] | "loading" | "failed">("loading")

  useEffect(() => {
    fetch(`/api/language-followers?lang=${lang === "ru" ? "ru" : "en"}`, { cache: "no-store", credentials: "include" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; elements?: Follower[] }) => setFollowers(d.ok && Array.isArray(d.elements) ? d.elements : "failed"))
      .catch(() => setFollowers("failed"))
  }, [lang])

  const row = (code: string) => catalogue.find((r) => r.code === code)
  const label = (code: string) => {
    const r = row(code)
    return r ? `${r.flag} ${r.nativeName} · ${r.englishName}` : code
  }
  const closed = supported.filter((l) => !always.includes(l) && !unlocked.includes(l))
  const norm = (list: readonly string[]) => [...list].sort().join(",")
  const pending = norm(unlocked) !== norm(start)

  async function save(next: string[]) {
    setBusy(true)
    try {
      const res = await fetch("/api/settings/app", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ languages: { indexed: next } }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(w.failed)
        return false
      }
      setUnlocked(next)
      toast.success(w.saved)
      return true
    } catch {
      toast.error(w.failed)
      return false
    } finally {
      setBusy(false)
    }
  }

  async function unlock() {
    if (!pick) return
    if (await save([...unlocked, pick])) {
      setPick("")
      setConfirming(false)
    }
  }

  return (
    <section data-block="gkpjo" data-search-languages className="flex flex-col gap-5">
      <H3 data-block="givo7" variant="ui">{w.title}</H3>
      <AdviceNote probe="search-languages" tone="recommended" title={w.adviceTitle} text={w.advice} />
      <Small data-block="qfxs8" className="max-w-2xl">{w.why}</Small>

      <div data-block="hegne" className="flex flex-col gap-2">
        <P data-block="dr77q" className="text-[length:var(--fs-body)] font-medium">{w.openTitle}</P>
        <ul data-block="o92x0" className="flex flex-col gap-2">
          {[...always, ...unlocked].map((code) => (
            <li data-block="dtdbc" key={code} data-open-lang={code} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2">
              <LockOpen className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-[length:var(--fs-body)]">{label(code)}</span>
              {always.includes(code) ? (
                <Small data-block="spnfi">{w.alwaysOpen}</Small>
              ) : (
                <>
                  <Small data-block="ezxum">{w.unlockedByYou}</Small>
                  <Button type="button" variant="ghost" size="sm" disabled={busy} data-close-lang={code} onClick={() => save(unlocked.filter((l) => l !== code))}>
                    <Lock className="size-4" aria-hidden />
                    {w.close}
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div data-block="o9c5t" className="flex flex-col gap-2">
        <P data-block="wgtoy" className="text-[length:var(--fs-body)] font-medium">{w.closedTitle}</P>
        {closed.length === 0 ? (
          <Small data-block="e21pt">{w.allOpen}</Small>
        ) : (
          <div data-block="zsaaj" className="flex flex-wrap items-center gap-3">
            <Select value={pick} onValueChange={(v) => { setPick(v); setConfirming(false) }}>
              <SelectTrigger data-unlock-pick className="h-10 min-w-64">
                <SelectValue placeholder={w.pick} />
              </SelectTrigger>
              <SelectContent>
                {closed.map((code) => (
                  <SelectItem key={code} value={code}>
                    <Lock className="size-3.5" aria-hidden /> {label(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" disabled={!pick || busy} data-unlock onClick={() => setConfirming(true)} className="h-10">
              <LockOpen className="size-4" aria-hidden />
              {w.unlock}
            </Button>
          </div>
        )}
        {confirming && pick && (
          <div data-block="g9edq" data-unlock-confirm className="flex max-w-2xl flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <P data-block="q9ubs" className="text-[length:var(--fs-body)] font-medium">{w.confirmTitle} {label(pick)}</P>
            <Small data-block="p2p45" className="text-foreground">{w.confirmText}</Small>
            <div data-block="p0rv2" className="flex flex-wrap gap-2">
              <Button type="button" disabled={busy} data-unlock-yes onClick={unlock}>
                {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {w.confirmYes}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirming(false)}>
                {w.cancel}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div data-block="i3cl2" data-search-rebuild={pending ? "pending" : "clean"} className="flex flex-col gap-2">
        {pending && (
          <>
            <P data-block="wfc5b" className="text-[length:var(--fs-body)] font-medium">{w.pendingTitle}</P>
            <Small data-block="iiw2x" className="max-w-2xl">{w.pending}</Small>
          </>
        )}
        <P data-block="qg4et" className="text-[length:var(--fs-body)] font-medium">{w.whereTitle}</P>
        <Small data-block="g81me" className="max-w-2xl">{w.where}</Small>
        {followers === "loading" ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
        ) : followers === "failed" ? (
          <Small data-block="rn2g7" className="text-destructive">{w.followersFailed}</Small>
        ) : followers.length === 0 ? (
          <Small data-block="lespf">{w.noFollowers}</Small>
        ) : (
          <ul data-block="axta1" data-language-followers className="flex max-w-2xl flex-col gap-2">
            {followers.map((f) => (
              <li data-block="lrkgr" key={f.id} data-follower={f.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2">
                <span className="min-w-0 flex-1 text-[length:var(--fs-body)]">
                  {f.address}
                  {!f.searchLanguages && <Small data-block="z45ta" className="block">{w.oldCode}</Small>}
                </span>
                {f.deployments && (
                  <a href={f.deployments} data-start-deploy className={buttonVariants({ variant: pending ? "default" : "outline", size: "sm" })}>
                    <ExternalLink className="size-4" aria-hidden />
                    {w.toDeployments}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
