import http from 'node:http';
import { randomInt } from 'node:crypto';
import { createStore, defaultDataDir, token } from './store.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

export function createApp({ revision = process.env.APP_REVISION || 'development', dataDir = defaultDataDir() } = {}) {
  const transact = createStore(dataDir);
  return http.createServer(async (req, res) => {
    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('cache-control', 'no-store');
    res.setHeader('referrer-policy', 'no-referrer');
    res.setHeader('content-security-policy', "default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    let path;
    try { path = new URL(req.url, 'http://localhost').pathname; }
    catch { res.writeHead(400); return res.end('Bad request'); }
    if (path === '/api/health') {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { allow: 'GET, HEAD' }); return res.end('Method not allowed'); }
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ ok: true, revision }));
    }
    if (path === '/api/exchanges' || /^\/api\/(invite|manage|participant)\/[a-f0-9]{64}$/.test(path)) {
      const send = (status, body) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
      try {
        if (req.method !== 'GET' && req.method !== 'POST') return send(405, { error: 'Method not allowed' });
        if (req.method === 'POST' && req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) return send(403, { error: 'Untrusted origin' });
        let body = {};
        if (req.method === 'POST') {
          if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Send JSON' });
          let raw = '';
          for await (const part of req) { raw += part; if (raw.length > 20000) { const error = new Error('Request too large'); error.status = 413; throw error; } }
          try { body = JSON.parse(raw); } catch { return send(400, { error: 'Invalid JSON' }); }
          if (!body || typeof body !== 'object' || Array.isArray(body)) return send(400, { error: 'Invalid input' });
        }
        const clean = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
        const fail = message => { const error = new Error(message); error.status = 400; throw error; };
        const value = await transact(data => {
          if (path === '/api/exchanges') {
            if (req.method !== 'POST') { const error = new Error('Method not allowed'); error.status = 405; throw error; }
            if (!clean(body.name, 100)) fail('Enter an exchange name (up to 100 characters).');
            if (typeof body.budget !== 'string' || !/^\d{1,6}(\.\d{1,2})?$/.test(body.budget) || Number(body.budget) <= 0) fail('Enter a positive euro budget with at most two decimal places.');
            const exchange = { name: body.name.trim(), budgetCents: Math.round(Number(body.budget) * 100), invitation: token(), organiser: token(), participants: [] };
            data.exchanges.push(exchange);
            return { write: true, value: { organiser: exchange.organiser, invitation: exchange.invitation } };
          }
          const [, , role, credential] = path.split('/');
          const exchange = data.exchanges.find(e => role === 'invite' ? e.invitation === credential : role === 'manage' ? e.organiser === credential : e.participants.some(p => p.credential === credential));
          if (!exchange) { const error = new Error('This link is invalid. Check the complete link with the person who shared it.'); error.status = 404; throw error; }
          const participant = role === 'participant' ? exchange.participants.find(p => p.credential === credential) : null;
          if (req.method === 'POST') {
            if (role === 'invite') {
              if (exchange.drawn) { const error = new Error('The draw is complete. Joining is closed.'); error.status = 409; throw error; }
              if (!clean(body.name, 80)) fail('Enter your name (up to 80 characters).');
              const name = body.name.trim().normalize('NFKC');
              if (exchange.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) fail('That name is taken. Add a surname or initial so everyone is distinguishable.');
              const joined = { name, credential: token(), wishlist: '' };
              exchange.participants.push(joined);
              return { write: true, value: { participant: joined.credential } };
            }
            if (role === 'manage' && body.action === 'draw') {
              if (!exchange.drawn) {
                if (exchange.participants.length < 3) fail('At least three participants must join before drawing.');
                // Rejection sampling gives each valid permutation equal probability.
                let recipients;
                do {
                  recipients = [...exchange.participants];
                  for (let i = recipients.length - 1; i > 0; i--) {
                    const j = randomInt(i + 1);
                    [recipients[i], recipients[j]] = [recipients[j], recipients[i]];
                  }
                } while (recipients.some((p, i) => p === exchange.participants[i]));
                exchange.participants.forEach((p, i) => { p.recipient = recipients[i].credential; });
                exchange.drawn = true;
              }
            } else {
              if (role !== 'participant') { const error = new Error('Only a participant private link can edit a wishlist.'); error.status = 403; throw error; }
              if (typeof body.wishlist !== 'string' || body.wishlist.length > 5000) fail('Keep your wishlist within 5000 characters.');
              participant.wishlist = body.wishlist;
            }
          }
          const view = { drawn: Boolean(exchange.drawn), name: exchange.name, budgetCents: exchange.budgetCents, participants: exchange.participants.map(p => p.name) };
          if (role === 'manage') view.invitation = exchange.invitation;
          if (participant) {
            view.self = { name: participant.name, wishlist: participant.wishlist };
            const recipient = exchange.drawn && exchange.participants.find(p => p.credential === participant.recipient);
            if (recipient) view.recipient = { name: recipient.name, wishlist: recipient.wishlist };
          }
          return { write: req.method === 'POST', value: view };
        });
        return send(200, value);
      } catch (error) { return send(error.status || 500, { error: error.status ? error.message : 'Unable to save right now. Please try again.' }); }
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { allow: 'GET, HEAD' }); return res.end('Method not allowed');
    }
    const asset = assets.get(path);
    if (!asset) { res.writeHead(404); return res.end('Not found'); }
    try {
      const body = await readFile(new URL(`./public/${asset[0]}`, import.meta.url));
      res.writeHead(200, { 'content-type': asset[1] });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      console.error('Asset unavailable:', error.message);
      res.writeHead(500);
      res.end('Page temporarily unavailable');
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '0.0.0.0';
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
  const app = createApp();
  app.on('error', error => { console.error(error.message); process.exitCode = 1; });
  app.listen(port, host, () => console.log(`Workshop app listening on ${host}:${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      app.close(() => process.exit(0));
      app.closeIdleConnections();
    });
  }
}
