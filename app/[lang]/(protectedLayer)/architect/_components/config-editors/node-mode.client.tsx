'use client'

// РЕЖИМ УЗЛА — КРАСНАЯ КАРТОЧКА НА ГЛАВНОЙ НАСТРОЕК (узел, шаг 564). Слова владельца 2026-10-21: «на главный тебе нужно прям красную
// карточку добавить чтобы это описать … что режим разработки выбирается вначале проекта и о том какой сейчас режим разработки можно
// увидеть в паспорте дальше кнопку на паспорт» и «в этом конфигураторе и нужно сделать ещё один механический переключатель».
// Переключатель — единственное место смены режима в интерфейсе; «Паспорт» ядра режим только показывает. Режим хранит реестр ядра,
// островок читает и пишет его дверью config `/api/node-mode` (число о машине — в браузере, в сборку не запекается).
import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { H2 } from '@/components/ui/typography'
import { Switch } from '@/components/ui/switch'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Access, AccessWords } from './settings-access'
import { AccessNotice } from './access-notice'
import { toast } from './toast'

type Mode = 'project' | 'factory'
type Mismatch = { id: string; address?: string; config: boolean }

export type NodeModeWords = {
  title: string
  chosen: string
  project: { label: string; text: string }
  factory: { label: string; text: string }
  only: string
  mismatches: string
  linkedOff: string
  linkedOn: string
  passport: string
  passportButton: string
  saved: string
  saveFailed: string
  unknown: string
}

const accessOf = (status: number): Access =>
  status === 200 ? 'ok' : status === 401 ? 'signin' : status === 403 ? 'forbidden' : status === 503 ? 'unavailable' : 'error'

export function NodeModeCard({ words, access: accessWords, passportHref, loginHref }: {
  words: NodeModeWords
  access: AccessWords
  passportHref?: string
  loginHref?: string
}) {
  const [access, setAccess] = useState<Access>('loading')
  const [mode, setMode] = useState<Mode | null>(null)
  const [mismatches, setMismatches] = useState<Mismatch[] | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/node-mode', { cache: 'no-store' })
      .then(async (r) => {
        const b = await r.json().catch(() => null)
        setAccess(accessOf(r.status))
        if (r.ok && b?.ok) {
          setMode(b.type)
          setMismatches(Array.isArray(b.mismatches) ? b.mismatches : null)
        }
      })
      .catch(() => setAccess('unavailable'))
  }, [])

  async function toggle(next: boolean) {
    const type: Mode = next ? 'factory' : 'project'
    setBusy(true)
    const r = await fetch('/api/node-mode', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type }),
    }).catch(() => null)
    const b = r ? await r.json().catch(() => null) : null
    setBusy(false)
    if (r?.ok && b?.ok) {
      setMode(b.type)
      setMismatches(Array.isArray(b.mismatches) ? b.mismatches : null)
      toast.success(words.saved.replace('{mode}', b.type === 'factory' ? words.factory.label : words.project.label))
    } else {
      toast.error(words.saveFailed)
    }
  }

  const side = (m: Mode) => (
    <div className={cn('rounded-lg border p-3', mode === m ? 'border-destructive bg-background' : 'border-border/60 opacity-70')} data-node-mode-option={m}>
      <p className="font-medium">{words[m].label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{words[m].text}</p>
    </div>
  )

  return (
    <section data-block="nmc64" aria-labelledby="node-mode" className="mb-10 rounded-xl border-2 border-destructive bg-destructive/5 p-4 sm:p-6">
      <H2 variant="ui" id="node-mode" className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="size-5" aria-hidden />
        {words.title}
      </H2>
      <p className="mt-2 text-sm">{words.chosen}</p>

      {access !== 'ok' ? (
        <div className="mt-4"><AccessNotice access={access} words={accessWords} loginHref={loginHref} /></div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-3" data-node-mode={mode ?? 'unknown'}>
            <span className={cn('text-sm', mode === 'project' ? 'font-semibold' : 'text-muted-foreground')}>{words.project.label}</span>
            <Switch
              checked={mode === 'factory'}
              disabled={busy || mode === null}
              aria-label={`${words.project.label} / ${words.factory.label}`}
              onCheckedChange={toggle}
            />
            <span className={cn('text-sm', mode === 'factory' ? 'font-semibold' : 'text-muted-foreground')}>{words.factory.label}</span>
          </div>
          {mode === null && <p className="mt-2 text-sm text-muted-foreground">{words.unknown}</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {side('project')}
            {side('factory')}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{words.only}</p>
          {mismatches && mismatches.length > 0 && (
            <div className="mt-3 text-sm" data-node-mode-mismatches>
              <p>{words.mismatches}</p>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                {mismatches.map((m) => (
                  <li key={m.id}>{m.address ?? m.id} — {m.config ? words.linkedOn : words.linkedOff}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {passportHref && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm">{words.passport}</p>
          <a href={passportHref} className={buttonVariants({ variant: 'outline', size: 'sm' })}>{words.passportButton}</a>
        </div>
      )}
    </section>
  )
}
