# `widget-dynamic-config-node-mode`

The red card «Node mode» on the main page of the config architect branch (node step 564). A switch between the two node modes —
**Single project** and **App factory** — with both modes described, a list of own elements living differently from the current
mode, and a button to the Passport of the core, which shows the mode without a switch.

The mode is stored in one place — `nodeType` of the core registry (`WEB4-ITEMS-REGISTRY/web4-items.json`, node step 553). The
island reads and writes it through the config door `/api/node-mode` (architect only), which calls the core door
`POST /api/node/type` over the machine loopback (`lib/config-store/node-mode.mjs`). The island lives in
`../../../_components/config-editors/node-mode.client.tsx`; words — `words.i18n.ts` (en, ru).
