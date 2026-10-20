import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server.mjs';

async function fixture(t) {
  const app = createApp({ revision: 'test-revision' });
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { app.close(resolve); app.closeAllConnections(); }));
  return `http://127.0.0.1:${app.address().port}`;
}

test('page, CSS and health are reachable and health identifies the served revision', async t => {
  const origin = await fixture(t);
  const page = await fetch(origin);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.match(await page.text(), /<h1>/);
  const css = await fetch(`${origin}/style.css`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get('content-type'), /text\/css/);
  const health = await fetch(`${origin}/api/health`);
  assert.deepEqual(await health.json(), { ok: true, revision: 'test-revision' });
});

test('repository files and traversal requests cannot be downloaded', async t => {
  const origin = await fixture(t);
  for (const path of ['/.env', '/AGENTS.md', '/package.json', '/.git/config', '/%2e%2e/.env', '/public/../server.mjs']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
  }
});

test('HEAD has no body and unsupported writes are rejected', async t => {
  const origin = await fixture(t);
  const head = await fetch(origin, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const post = await fetch(origin, { method: 'POST', body: 'data' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});

test('exchange lifecycle preserves data and keeps access roles separate', async t => {
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const directory = await mkdtemp(join(tmpdir(), 'santa-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  async function start() {
    const app = createApp({ dataDir: directory });
    await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => { app.close(resolve); app.closeAllConnections(); }));
    return `http://127.0.0.1:${app.address().port}`;
  }
  let origin = await start();
  const post = (path, body) => fetch(origin + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  for (const budget of ['0', '-1', '1.234', 'NaN', 25]) assert.equal((await post('/api/exchanges', { name: 'Friends', budget })).status, 400);
  assert.equal((await post('/api/exchanges', { name: ' ', budget: '25' })).status, 400);
  const created = await (await post('/api/exchanges', { name: 'Friends', budget: '25.50' })).json();
  assert.match(created.organiser, /^[a-f0-9]{64}$/);
  assert.notEqual(created.organiser, created.invitation);
  const invitation = `/api/invite/${created.invitation}`;
  assert.equal((await post(invitation, { name: ' ' })).status, 400);
  const alice = await (await post(invitation, { name: 'Alice' })).json();
  assert.equal((await post(invitation, { name: 'alice' })).status, 400);
  const bob = await (await post(invitation, { name: 'Bob' })).json();
  assert.notEqual(alice.participant, bob.participant);
  const alicePath = `/api/participant/${alice.participant}`;
  assert.equal((await post(alicePath, { wishlist: '<script>alert(1)</script>', participant: bob.participant })).status, 200);
  for (const path of [invitation, `/api/manage/${created.organiser}`]) {
    const response = await fetch(origin + path);
    const text = await response.text();
    assert.equal(text.includes(alice.participant), false);
    assert.equal(text.includes(bob.participant), false);
    assert.equal(text.includes('<script>'), false);
    const view = JSON.parse(text);
    assert.equal(view.budgetCents, 2550);
    assert.deepEqual(view.participants, ['Alice', 'Bob']);
  }
  assert.equal((await post(`/api/manage/${created.organiser}`, { wishlist: 'overwrite' })).status, 403);
  assert.equal((await fetch(origin + `/api/participant/${created.invitation}`)).status, 404);
  assert.equal((await fetch(origin + '/api/participant/' + 'a'.repeat(64))).status, 404);
  assert.equal((await post(alicePath, { wishlist: 'x'.repeat(5001) })).status, 400);
  const bobView = await (await fetch(origin + `/api/participant/${bob.participant}`)).json();
  assert.equal(bobView.self.wishlist, '');
  origin = await start();
  const restored = await (await fetch(origin + alicePath)).json();
  assert.equal(restored.self.wishlist, '<script>alert(1)</script>');
  assert.equal(restored.name, 'Friends');
  const saved = await post(alicePath, { wishlist: 'Books' });
  assert.equal((await saved.json()).self.wishlist, 'Books');
  const hostile = await fetch(origin + alicePath, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://attacker.example' }, body: JSON.stringify({ wishlist: 'bad' }) });
  assert.equal(hostile.status, 403);
});
