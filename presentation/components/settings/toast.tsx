'use client'

// СООБЩЕНИЯ РЕДАКТОРОВ НАСТРОЕК (шаг 299-5). Редакторы перенесены с aifa.dev как есть и зовут `toast.success/error/info`
// (там — пакет sonner). Здесь тот же интерфейс без пакета: сообщение уходит событием окна, `SettingsToaster` (один на
// страницу, в макете `[lang]`) показывает последнее. Меняется только строка импорта в перенесённом файле.
import { useEffect, useState } from 'react'

type Kind = 'success' | 'error' | 'info'
type Message = { kind: Kind; text: string }
const EVENT = 'settings-toast'

function emit(kind: Kind, text: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<Message>(EVENT, { detail: { kind, text } }))
}

export const toast = {
  success: (text: string) => emit('success', text),
  error: (text: string) => emit('error', text),
  info: (text: string) => emit('info', text),
  message: (text: string) => emit('info', text),
}

export function SettingsToaster() {
  const [message, setMessage] = useState<Message | null>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const onMessage = (e: Event) => {
      setMessage((e as CustomEvent<Message>).detail)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(null), 5000)
    }
    window.addEventListener(EVENT, onMessage)
    return () => {
      window.removeEventListener(EVENT, onMessage)
      clearTimeout(timer)
    }
  }, [])
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border bg-card px-4 py-3 text-sm shadow-lg ${message.kind === 'error' ? 'border-destructive text-destructive' : 'border-border'}`}
    >
      {message.text}
    </div>
  )
}
