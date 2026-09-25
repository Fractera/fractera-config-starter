import Link from 'next/link'
import { notFound } from 'next/navigation'
import { H1, Lead } from '@/components/ui/typography'
import { buttonVariants } from '@/components/ui/button'
import { PageBody, type BlockData } from '@/components/blocks/page-body'
import { BLOCK_SET } from '@/lib/block-set'
import { Faq } from '@/components/blocks/faq'
import { configHomeWords, LANGS, type ConfigHomeWords } from '../_data/body'

// ПУБЛИЧНАЯ ГЛАВНАЯ ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» (шаг 299). Собрана из блоков реестра «Блоков» — они пришли сюда командой
// `npx shadcn add @fractera/<блок>` (реестр назван в `components.json` через FRACTERA_BLOCKS_URL) и живут своей копией в
// `presentation/components/blocks/`. Главное действие страницы — «Перейти к настройкам»: вход в режим архитектора (299-4).
// 🛑 СЛОВА ОТСЮДА НЕ ПИШУТСЯ — `../_data/body.ts`.

function body(w: ConfigHomeWords): BlockData[] {
  return [
    { kind: 'metrics', items: w.metrics },
    { kind: 'badges', items: w.badges.map((label) => ({ label, tone: 'code' })) },
    {
      kind: 'cards', badge: w.groups.badge, title: w.groups.title, note: w.groups.note, cols: 2,
      children: w.groups.items.map((i) => ({ kind: 'card', children: [{ kind: 'h3', text: i.title }, { kind: 'p', text: i.text }] })),
    },
    { kind: 'flow', badge: w.flow.badge, title: w.flow.title, note: w.flow.note, steps: w.flow.steps },
  ]
}

export default async function ConfigHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!LANGS.includes(lang)) notFound()
  const w = configHomeWords(lang)
  return (
    <main data-app-column className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <H1 className="mt-6">{w.title}</H1>
      <Lead className="mt-4 max-w-3xl">{w.description}</Lead>
      <Link href={`/${lang}/architect`} className={buttonVariants({ size: 'lg', className: 'mt-6' })}>
        {w.cta}
      </Link>
      <PageBody blocks={body(w)} set={BLOCK_SET} />
      <Faq title={w.faqTitle} items={w.faq} />
    </main>
  )
}
