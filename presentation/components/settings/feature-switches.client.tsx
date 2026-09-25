'use client'

// ПЕРЕКЛЮЧАТЕЛИ ФУНКЦИЙ ПРОЕКТА — верх главной режима архитектора (шаг 299-4). Слово владельца: «ещё одну вкладку
// активации и деактивации, которая влияет у нас на platform config … все эти переключатели будут стоять на странице
// архитектора в корне всех этих настроек». Читает и пишет PLATFORM-CONFIG через дверь элемента; дверь пускает только
// архитектора. Слова приходят данными страницы (`content/architect/_index/<lang>.json`), а не из кода.
import { useEffect, useState } from 'react'
import { loadSettings, saveSettings, type Access, type AccessWords } from './settings-access'
import { AccessNotice } from './access-notice'

export type FeatureSwitchesProps = {
  title: string
  note?: string
  features: { key: string; label: string; hint?: string }[]
  words: AccessWords & { saved: string; saveFailed: string }
  loginHref?: string
}

export function FeatureSwitchesIsland({ title, note, features, words, loginHref }: FeatureSwitchesProps) {
  const [access, setAccess] = useState<Access>('loading')
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadSettings('platform').then((r) => {
      setAccess(r.access)
      if (r.config) setValues(r.config)
    })
  }, [])

  async function toggle(key: string) {
    const next = !(values[key] === true)
    setBusy(key)
    setMessage(null)
    const r = await saveSettings('platform', { [key]: next })
    setBusy(null)
    if (r.access === 'ok' && r.config) {
      setValues(r.config)
      setMessage(words.saved)
    } else if (r.access === 'ok') {
      setMessage(words.saveFailed)
    } else {
      setAccess(r.access)
    }
  }

  return (
    <section className="mt-10" aria-labelledby="feature-switches">
      <h2 id="feature-switches" className="text-xl font-semibold tracking-tight">{title}</h2>
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
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={f.label}
                    disabled={busy !== null}
                    onClick={() => toggle(f.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-60 ${on ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
                  >
                    <span className={`inline-block size-5 rounded-full bg-background shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {message && <p className="mt-3 text-sm text-muted-foreground" role="status">{message}</p>}
      </div>
    </section>
  )
}
