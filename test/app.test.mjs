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

test('supplied background is served unchanged as a PNG', async t => {
  const { readFile } = await import('node:fs/promises');
  const origin = await fixture(t);
  const response = await fetch(`${origin}/background.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(new URL('../public/background.png', import.meta.url)));
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


test('draw is private, atomic, permanent and durable with current recipient wishes', async t => {
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const directory = await mkdtemp(join(tmpdir(), 'santa-draw-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  let app;
  const stop = () => new Promise(resolve => { app.close(resolve); app.closeAllConnections(); });
  const start = async () => {
    app = createApp({ dataDir: directory });
    await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
    return `http://127.0.0.1:${app.address().port}`;
  };
  let origin = await start();
  t.after(stop);
  const post = (path, body) => fetch(origin + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const get = async path => (await fetch(origin + path)).json();
  for (const count of [3, 4, 9]) {
    const created = await (await post('/api/exchanges', { name: `Draw ${count}`, budget: '20' })).json();
    const manage = `/api/manage/${created.organiser}`;
    const invite = `/api/invite/${created.invitation}`;
    const members = [];
    for (let i = 0; i < count; i++) {
      if (i < 3) assert.equal((await post(manage, { action: 'draw' })).status, 400);
      const joined = await (await post(invite, { name: `Person ${i}` })).json();
      members.push({ path: `/api/participant/${joined.participant}`, credential: joined.participant, name: `Person ${i}` });
    }
    for (const m of members) {
      assert.equal((await get(m.path)).recipient, undefined);
      assert.equal((await post(m.path, { action: 'draw' })).status, 400);
      await post(m.path, { wishlist: `Wishes for ${m.name}` });
    }
    assert.equal((await fetch(origin + `/api/manage/${created.invitation}`)).status, 404);
    assert.equal((await fetch(origin + `/api/participant/${'0'.repeat(64)}`)).status, 404);
    const draws = await Promise.all(Array.from({ length: 8 }, () => post(manage, { action: 'draw' })));
    assert.ok(draws.every(response => response.status === 200));
    const views = await Promise.all(members.map(m => get(m.path)));
    assert.equal(new Set(views.map(v => v.recipient.name)).size, count);
    for (const [i, view] of views.entries()) {
      assert.equal(view.drawn, true);
      assert.notEqual(view.recipient.name, members[i].name);
      assert.equal(view.recipient.wishlist, `Wishes for ${view.recipient.name}`);
      assert.deepEqual(Object.keys(view.recipient).sort(), ['name', 'wishlist']);
      for (const m of members) assert.equal(JSON.stringify(view).includes(m.credential), false);
    }
    for (const path of [manage, invite]) {
      const view = await get(path);
      assert.equal(view.drawn, true);
      assert.equal(view.recipient, undefined);
      assert.equal(view.self, undefined);
      for (const m of members) {
        assert.equal(JSON.stringify(view).includes(m.credential), false);
        assert.equal(JSON.stringify(view).includes(`Wishes for ${m.name}`), false);
      }
    }
    assert.equal((await post(invite, { name: 'Late arrival' })).status, 409);
    const giver = views.findIndex(v => v.recipient.name === members[0].name);
    await post(members[0].path, { wishlist: 'Updated wishes after draw' });
    assert.equal((await get(members[giver].path)).recipient.wishlist, 'Updated wishes after draw');
    await stop();
    origin = await start();
    await post(manage, { action: 'draw' });
    for (const [i, m] of members.entries()) {
      assert.equal((await get(m.path)).recipient.name, views[i].recipient.name);
    }
    assert.equal((await get(members[giver].path)).recipient.wishlist, 'Updated wishes after draw');
    assert.equal((await post(invite, { name: 'Still late' })).status, 409);
  }
});

test('a join racing the draw is either included completely or refused', async t => {
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const directory = await mkdtemp(join(tmpdir(), 'santa-race-'));
  const app = createApp({ dataDir: directory });
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => { app.close(resolve); app.closeAllConnections(); });
    await rm(directory, { recursive: true, force: true });
  });
  const origin = `http://127.0.0.1:${app.address().port}`;
  const post = (path, body) => fetch(origin + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const created = await (await post('/api/exchanges', { name: 'Race', budget: '15' })).json();
  const invite = `/api/invite/${created.invitation}`;
  const credentials = [];
  for (const name of ['A', 'B', 'C']) credentials.push((await (await post(invite, { name })).json()).participant);
  const [late, draw] = await Promise.all([post(invite, { name: 'Racing join' }), post(`/api/manage/${created.organiser}`, { action: 'draw' })]);
  assert.equal(draw.status, 200);
  assert.ok([200, 409].includes(late.status));
  if (late.status === 200) credentials.push((await late.json()).participant);
  const views = await Promise.all(credentials.map(async key => (await fetch(origin + `/api/participant/${key}`)).json()));
  assert.equal(new Set(views.map(v => v.recipient.name)).size, credentials.length);
  assert.ok(views.every(v => v.self.name !== v.recipient.name));
});
