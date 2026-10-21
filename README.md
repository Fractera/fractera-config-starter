# Fractera Config — the project settings of the node

This element keeps the **project settings of the whole node** — APP, PLATFORM and DESIGN settings and the menu — and gives them
to every element. Since **v1.0.0** (node step 549-1) it is built on the Fractera native element template; its doors did not change.

| Door | What it does |
|---|---|
| `GET /health` | `{ ok, service: "config", version }` for the node watcher (the template's `/api/health` answers too) |
| `POST /mcp` | MCP, stateless: `describe_config`, `settings_version`, `get_project_settings`, `subscribe` (the node key in `X-Settings-Key`) |
| `GET /api/settings`, `GET /api/settings/<app|platform|design>` | the settings — the node key or the architect session |
| `PATCH /api/settings/<kind>` | the architect writes a patch; every subscribed address gets `POST {version}` with `X-Settings-Key` |
| `GET /api/elements`, `/api/language-followers?lang=`, `/api/session` | the architect's helpers of the editors |
| `/<lang>/architect/*` | the editors: features, basics, SEO, meta and media, languages, header, footer, parallel routing, cookie banner |

Where it lives: server modules `lib/config-store/`, editors `app/[lang]/(protectedLayer)/architect/_components/config-editors/`,
one widget per page in `architect/_widgets/dynamic/widget-dynamic-config-*`. Defaults — `settings/<kind>/defaults.json`; the owner
patch and the subscribers — `data/settings/` (never in git). Seed at birth — `node scripts/seed-from-site.mjs <site folder>`.

---

## In the Fractera project

The project settings of the whole node: APP, PLATFORM and DESIGN settings, the menu, the catalog for the All projects tab and the node mode switch. Elements under CONFIG take their settings from it and redraw their pages when it signals a new version.

You can change it. The code is open under the MIT license and the copy on your node is yours. The node installs this element from
this repository by the tag written in `WEB4-ITEMS-REGISTRY/web4-items.json` of the core; the core does not let you delete a built-in
element or move its address.

To change it, open it in the core (left menu, Native items, Config), go to Build and tell its agent in the terminal what you need.
The agent edits the element folder `WEB4-ITEMS/core/config` and commits. Settings themselves are not code: change them on the element's settings pages, and its agent only for new capabilities.

The change goes live when you press Deploy in Build, Deployments: the element is rebuilt beside the running one and switched over in
seconds. Other elements call its doors by address, request and answer, so a change to a door breaks every element that uses it;
that is a decision for the node owner, while a change inside the element is ordinary work. To keep your version when the node is
reinstalled, save the element to your own GitHub repository in Build, GitHub. A newer Fractera version arrives through Update, which
merges it with your commits, and the element's agent resolves a conflict.

# fractera-native-item-starter

The reference starter template of a Fractera native element. Native elements are the root elements of a node: they stand on
every node, they come only from the Fractera repository, and they are never sold and never join an outside network. They serve
the person and the other elements of their own node. Custom elements are born from `fractera-custom-item-starter` by the node's
button «Create WEB4 ITEM»; native ones are added from here.

The template is the custom reference template without the network parts: no showcase or Nostr fields in the passport
(`visibility: node`, `messengers: { h2a: true, h2h: false, a2a: false }`), no messenger between people, no work for outside agents
and no order summaries. The home page shows one line, «Reference native template», and the yellow starter sign.

## The contract a replacement must keep

- `OWN-SERVICE-PROPS/` — the passport, the element's main door (`GET /api/own-service-props`); `NODE-CONTRACT.json` — what the node needs to install it.
- The port comes from the `PORT` environment variable.
- `GET /api/health` answers 200 without a session.
- Sign-in only through the node's auth element; stored data only through the node's data element.
- Public pages stay static.

A repository that does not keep this contract is refused; the node does not bend to it.

## Run on its own

```
npm install
npm run build
PORT=24683 node .next/standalone/server.js
```

License: MIT.

## Catalog for the All projects tab (node step 553-2)

- **Who writes:** only the core of the node, with the node key — `PUT /api/settings/catalog` (header `X-Settings-Key`). The
  architect session does not write it: the catalog is a snapshot of the node, not an owner decision. `DELETE` removes it; `GET` with
  the key reads it. Without the key — `401 { ok: false, reason: "bad-key" }`; a bad body — `400 { ok: false, reason }`.
- **Form:** `{ "byLang": { "<two-letter language>": [ { "id", "title", "description", "href", "local", "kind" } ] } }` — up to
  8 languages and 1000 entries per language; `href` is `null` or `http(s)://…`, `local` is `null` or `http://localhost:<port>/…`,
  `kind` is `custom` or `native`. Other fields of an entry are dropped. It is kept as `data/settings/catalog.json`, apart from the
  settings patches.
- **Signal:** every write and removal changes `settings_version` and sends `POST {version}` to the subscribers, as after the
  architect saves the settings. With no catalog the version is the former fingerprint of the patches.
- **What an element does with it:** `get_project_settings` without `kind` carries `catalog` (or `null`); an element that follows
  CONFIG keeps it in its copy of the settings and draws the first tab of its header, «All projects», from it. With `kind` the answer
  has no catalog, as before.
