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
