// КОМАНДЫ ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» — то, что его MCP умеет (шаг 299). Каркас MCP — `mcp/serve-mcp.js`, общий для любой
// службы.
//
// 🔒 MCP — ЕДИНСТВЕННЫЙ ПУТЬ ПОТРЕБИТЕЛЯ К НАСТРОЙКАМ, И ПОТРЕБИТЕЛЬ ДОБРОВОЛЕН (299-6, слово владельца 2026-09-25): «мы
// делаем у него MCP также как мы делаем MCP у блоков … А хочет их забирать микро service или не хочет нам вообще неважно».
// Элемент хранит настройки сам и НИКОГО НЕ ЗОВЁТ: ни толчка, ни списка подписчиков. Приложение, которое хочет жить по
// этим настройкам, спрашивает `settings_version` (дёшево) и, если отпечаток сменился, `get_project_settings`.
// Приложение, которое не хочет, живёт своими — элемент об этом не знает и знать не должен.
//
// 🔒 ЧТЕНИЕ — КЛЮЧОМ УЗЛА (`X-Settings-Key`, тот же, что у двери `/api/settings`). Настройки — не тайна посетителю, но и не
// витрина: их состав описывает проект целиком. Запись по MCP не даётся вовсе — пишет только архитектор, экраном.
import { createHash } from 'node:crypto'
import { z } from 'zod'
import { KINDS, readSettings } from './settings-store.js'
import { keyOk } from './architect-auth.js'

const KIND = z.enum(['app', 'platform', 'design'])

/** Все три вида разом; первая ошибка чтения — отказ целиком (не отдаём половину как целое). */
function readAll() {
  const all = Object.fromEntries(KINDS.map((k) => [k, readSettings(k)]))
  const bad = Object.values(all).find((r) => !r.ok)
  if (bad) throw new Error(`settings unreadable: ${bad.reason}`)
  return all
}

/** Отпечаток решений владельца: меняется ровно тогда, когда меняется хоть одно решение. */
function versionOf(all) {
  const patches = Object.fromEntries(KINDS.map((k) => [k, all[k].patch]))
  return createHash('sha256').update(JSON.stringify(patches)).digest('hex').slice(0, 16)
}

function requireKey(ctx) {
  if (!keyOk({ headers: ctx?.headers ?? {} })) throw new Error('bad-key: send the node key in the X-Settings-Key header')
}

export function configTools(publicUrl) {
  const base = publicUrl.replace(/\/+$/, '')
  return [
    {
      name: 'describe_config',
      title: 'Describe the settings element',
      description: 'What this element is, where it lives, which settings of the project it keeps and how an application takes them.',
      run: () => ({
        element: 'config',
        address: base,
        keeps: ['APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'menu'],
        consumers: 'voluntary: an application that wants to live by these settings asks settings_version, and when it changes, get_project_settings. This element calls no one and does not know who reads.',
        writers: 'only the architect, on the screens of this element (sign-in service); MCP never writes',
        tools: {
          settings_version: 'a fingerprint of the owner decisions — cheap to poll (X-Settings-Key)',
          get_project_settings: 'the owner decisions (patch) and the full result (settings) of app, platform, design — all or one kind (X-Settings-Key)',
        },
      }),
    },
    {
      name: 'settings_version',
      title: 'Version of the project settings',
      description: 'A fingerprint of the owner decisions. It changes exactly when any decision changes: poll it, and fetch the settings only when it moves. Needs the node key (X-Settings-Key).',
      run: (_args, ctx) => {
        requireKey(ctx)
        return { version: versionOf(readAll()) }
      },
    },
    {
      name: 'get_project_settings',
      title: 'Get the project settings',
      description: 'The owner decisions (patch: only what the owner changed) and the full result over this element defaults (settings), for app, platform and design — or for one kind. Apply the patch over your own defaults. Needs the node key (X-Settings-Key).',
      inputSchema: { kind: KIND.optional() },
      run: ({ kind }, ctx) => {
        requireKey(ctx)
        const all = readAll()
        const kinds = kind ? [kind] : KINDS
        return {
          version: versionOf(all),
          patches: Object.fromEntries(kinds.map((k) => [k, all[k].patch])),
          settings: Object.fromEntries(kinds.map((k) => [k, all[k].config])),
        }
      },
    },
  ]
}
