'use client'

// ПЕРЕКЛЮЧАТЕЛИ ФУНКЦИЙ ПРОЕКТА — верх главной режима архитектора (шаг 299-4). Слово владельца: «ещё одну вкладку
// активации и деактивации, которая влияет у нас на platform config … все эти переключатели будут стоять на странице
// архитектора в корне всех этих настроек». Читает и пишет PLATFORM-CONFIG через дверь элемента; дверь пускает только
// архитектора. Слова приходят данными страницы (`content/architect/_index/<lang>.json`), а не из кода.
//
// 🔒 КАЖДОЕ ПЕРЕКЛЮЧЕНИЕ — ТОСТ СВЕРХУ (слово владельца 2026-09-25). Элемент никого не зовёт (299-6): приложения,
// подключённые по MCP, забирают настройки сами, поэтому тост говорит «сохранено; подключённые заберут сами»
// (`distributionReady: false` в данных — «применено» элемент обещать не может). Функция, которая вступает в силу только после развёртывания, получает тост с кнопкой на дашборд (`needsDeploy`).
//
// 🔒 ВЫКЛЮЧИТЬ МЕНЮ ИЛИ ВХОД — ТОЛЬКО ЧЕРЕЗ ТРЕВОЖНОЕ ОКНО (слово владельца: «когда пользователь выключает верхнее меню, он
// может потерять вообще любую возможность управлять проектом … запомните или скопируйте их прежде чем вы продолжите»).
// В окне — ссылки на все элементы узла из реестра (дверь `/api/elements`), кнопка «Скопировать» и флажок «Я сохранил
// ссылки»; без флажка выключить нельзя.
import { H2 } from '@/components/ui/typography'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { AppDialog } from '@/components/dialog/app-dialog.client'
import type { AppDialogUi } from '@/components/dialog/app-dialog.i18n'
import { loadSettings, saveSettings, type Access, type AccessWords } from './settings-access'
import { AccessNotice } from './access-notice'
import { toast } from './toast'

type Guard = { title: string; text: string }
export type FeatureSwitchesProps = {
  title: string
  note?: string
  features: { key: string; label: string; hint?: string; needsDeploy?: boolean; guard?: Guard }[]
  distributionReady: boolean
  words: AccessWords & {
    savedLive: string
    savedPending: string
    savedDeploy: string
    saveFailed: string
    guardLinks: string
    guardCopy: string
    guardCopied: string
    guardConfirm: string
    guardProceed: string
    guardCancel: string
    guardNoLinks: string
  }
  elementNames: Record<string, string>
  loginHref?: string
}

type Element = { id: string; url: string | null }

export function FeatureSwitchesIsland({ title, note, features, distributionReady, words, elementNames, loginHref, dialogUi }: FeatureSwitchesProps & { dialogUi: AppDialogUi }) {
  const [access, setAccess] = useState<Access>('loading')
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [guarded, setGuarded] = useState<{ key: string; guard: Guard } | null>(null)
  const [elements, setElements] = useState<Element[] | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadSettings('platform').then((r) => {
      setAccess(r.access)
      if (r.config) setValues(r.config)
    })
  }, [])

  async function save(key: string, next: boolean) {
    setBusy(key)
    const r = await saveSettings('platform', { [key]: next })
    setBusy(null)
    if (r.access === 'ok' && r.config) {
      setValues(r.config)
      const f = features.find((x) => x.key === key)
      if (f?.needsDeploy) toast.deploy(words.savedDeploy)
      // 306: «применено» — только когда хоть одна служба приняла сигнал; иначе честно «сохранено, заберут при старте».
      else toast.success((r.applied ?? 0) > 0 || distributionReady ? words.savedLive.replace('{n}', String(r.applied ?? 0)) : words.savedPending)
    } else if (r.access === 'ok') {
      toast.error(words.saveFailed)
    } else {
      setAccess(r.access)
    }
  }

  async function toggle(key: string) {
    const next = !(values[key] === true)
    const f = features.find((x) => x.key === key)
    if (!next && f?.guard) {
      setGuarded({ key, guard: f.guard })
      setConfirmed(false)
      setCopied(false)
      setElements(null)
      const r = await fetch('/api/elements', { cache: 'no-store' }).then((x) => x.json()).catch(() => null)
      setElements(Array.isArray(r?.elements) ? (r.elements as Element[]) : [])
      return
    }
    await save(key, next)
  }

  const linksText = (elements ?? []).filter((e) => e.url).map((e) => `${elementNames[e.id] ?? e.id}: ${e.url}`).join('\n')

  async function copyLinks() {
    try {
      await navigator.clipboard.writeText(linksText)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    // 299-8: внутри рабочего экрана заголовок раздела печатает его правая часть — пустой `title` не дублирует его.
    <section className={title ? 'mt-10' : undefined} aria-labelledby={title ? 'feature-switches' : undefined} aria-label={title ? undefined : note}>
      {title && <H2 variant="ui" id="feature-switches">{title}</H2>}
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">
        {access !== 'ok' ? (
          <AccessNotice access={access} words={words} loginHref={loginHref} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => {
              const on = values[f.key] === true
              return (
                <li key={f.key} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
                  <div>
                    <p className="font-medium">{f.label}</p>
                    {f.hint && <p className="mt-1 text-sm text-muted-foreground">{f.hint}</p>}
                  </div>
                  <Switch
                    checked={on}
                    aria-label={f.label}
                    disabled={busy !== null}
                    onCheckedChange={() => toggle(f.key)}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* 549-1: окно — через AppDialog шаблона (сторож check-dialogs): заголовок, пояснение, тело и подвал те же, что у прежнего config. */}
      <AppDialog
        open={guarded !== null}
        onOpenChange={(open) => { if (!open) setGuarded(null) }}
        ui={dialogUi}
        titleClassName="flex items-center gap-2 text-destructive"
        title={<><AlertTriangle className="size-5" aria-hidden />{guarded?.guard.title}</>}
        description={guarded?.guard.text}
        footer={<>
            <Button variant="outline" type="button" onClick={() => setGuarded(null)}>
              {words.guardCancel}
            </Button>
            <Button
              variant="destructive"
              type="button"
              disabled={!confirmed}
              onClick={async () => {
                const g = guarded
                setGuarded(null)
                if (g) await save(g.key, false)
              }}
            >
              {words.guardProceed}
            </Button>
        </>}
      >
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">{words.guardLinks}</p>
            {elements === null ? (
              <p className="text-sm text-muted-foreground">{words.loading}</p>
            ) : linksText ? (
              <ul className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                {elements.filter((e) => e.url).map((e) => (
                  <li key={e.id} className="flex flex-wrap gap-2">
                    <span className="text-muted-foreground">{elementNames[e.id] ?? e.id}:</span>
                    <a href={e.url as string} className="break-all text-primary hover:underline">{e.url}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-destructive">{words.guardNoLinks}</p>
            )}
            <Button variant="outline" size="sm" type="button" onClick={copyLinks} disabled={!linksText} className="self-start">
              {copied ? words.guardCopied : words.guardCopy}
            </Button>
            <Label className="flex items-start gap-2 text-sm font-normal">
              <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
              {words.guardConfirm}
            </Label>
          </div>
      </AppDialog>
    </section>
  )
}
