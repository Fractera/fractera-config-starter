// WHO READS AND WHO IS SIGNALLED (core step 818-7, the red team's H6): `npm run test:config-readers`, part of the prebuild.
// The node key and a custom element's own key read the settings; a custom element subscribes only in its own name and cannot take over
// another's address; every signal carries the subscriber's own key — never the node key to a custom element.
// Negative control: the signal before 818-7 carried one key, the node key, to every subscriber.
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { elementKeyOf } from '../element-key.mjs'
import { keyOk, readerOf } from './architect-auth.mjs'
import { listSubscribers, notifySubscribers, subscribe } from './subscribers.mjs'

const NODE_KEY = 'the-node-key-of-a-test-node'
const DATA = 'the-data-secret-of-a-test-node'
process.env.SETTINGS_SECRET = NODE_KEY
process.env.DATA_SECRET = DATA
const DIR = mkdtempSync(join(tmpdir(), 'config-readers-'))
process.env.SETTINGS_DATA_DIR = DIR
const ROOTKEY = elementKeyOf('root', DATA)
const SHOPKEY = elementKeyOf('shop', DATA)
const H = (key) => ({ headers: key === undefined ? {} : { 'x-settings-key': key } })

let passed = 0
const t = async (name, fn) => {
  try { await fn(); passed += 1; console.log(`  ✓ ${name}`) } catch (e) { console.error(`  ✗ ${name}\n    ${e.message}`); process.exitCode = 1 }
}

await t('the node key and an element\'s own key read; nothing else does', () => {
  assert.deepEqual(readerOf(H(NODE_KEY)), { kind: 'node' })
  assert.deepEqual(readerOf(H(ROOTKEY)), { kind: 'element', id: 'root' })
  for (const k of [undefined, '', 'x', DATA, `shop.${ROOTKEY.split('.')[1]}`, elementKeyOf('root', 'another-node')]) assert.equal(readerOf(H(k)), null, String(k))
})
await t('the catalogue is written by the node key only', () => {
  assert.equal(keyOk(H(NODE_KEY)), true)
  assert.equal(keyOk(H(ROOTKEY)), false)
})
await t('an element subscribes in its own name: who comes from its key', () => {
  const r = subscribe('http://127.0.0.1:24690/api/settings/changed', 'auth', { kind: 'element', id: 'root' })
  assert.equal(r.ok, true)
  assert.equal(listSubscribers().find((s) => s.url === 'http://127.0.0.1:24690/api/settings/changed').who, 'root')
})
await t('an element cannot take over another element\'s address; the node can name anyone', () => {
  assert.deepEqual(subscribe('http://127.0.0.1:24690/api/settings/changed', 'shop', { kind: 'element', id: 'shop' }), { ok: false, reason: 'url-of-another-element' })
  assert.equal(listSubscribers().find((s) => s.url === 'http://127.0.0.1:24690/api/settings/changed').who, 'root')
  assert.equal(subscribe('http://127.0.0.1:24685/api/settings/changed', 'auth', { kind: 'node' }).ok, true)
  assert.deepEqual(subscribe('http://x/y', 'a', null), { ok: false, reason: 'bad-key' })
})
const DOORS = { root: ROOTKEY, auth: NODE_KEY } // what the core answers: a custom element's own key, the node key for a native
const doorOf = async (who) => { if (!(who in DOORS)) throw new Error(`no element «${who}»`); return { key: DOORS[who] } }
await t('every signal carries its subscriber\'s own key — the node key never goes to a custom element', async () => {
  subscribe('http://127.0.0.1:24699/old', null, { kind: 'node' }) // a record without a name: the core cannot say whose it is
  const sent = []
  const send = async (url, init) => { sent.push({ url, key: init.headers['x-settings-key'] }); return { ok: true, status: 200 } }
  const out = await notifySubscribers('v1', { doorOf, send })
  assert.deepEqual(sent.find((x) => x.url.includes('24690')).key, ROOTKEY)
  assert.deepEqual(sent.find((x) => x.url.includes('24685')).key, NODE_KEY)
  assert.equal(sent.some((x) => x.url.includes('24699')), false, 'a record nobody can name got a signal')
  assert.equal(out.find((x) => x.url.includes('24699')).ok, false)
  assert.equal(sent.filter((x) => x.key === NODE_KEY).every((x) => x.url.includes('24685')), true)
})
await t('NEGATIVE CONTROL: the signal before 818-7 sent the node key to every subscriber, root among them', async () => {
  const old = (list) => list.map((s) => ({ url: s.url, key: process.env.SETTINGS_SECRET }))
  const custom = old(listSubscribers()).find((x) => x.url.includes('24690'))
  assert.equal(custom.key, NODE_KEY)
  assert.notEqual(custom.key, DOORS.root)
})
rmSync(DIR, { recursive: true, force: true })
assert.ok(SHOPKEY)
console.log(`config readers: ${passed} passed${process.exitCode ? ', FAILURES above' : ''}`)
