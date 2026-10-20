const root = document.querySelector('#app');
const message = document.querySelector('#message');
const route = location.hash.slice(1).split('/');
const [role, credential] = route;
const apiPath = role && credential ? `/api/${role}/${credential}` : '/api/exchanges';
const euro = cents => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const link = (kind, key) => `${location.origin}/#${kind}/${key}`;
const element = (tag, text, parent = root) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; parent.append(node); return node; };
async function request(path, body) {
  const response = await fetch(path, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Please try again.');
  return result;
}
function field(form, label, name, options = {}) {
  const wrapper = element('label', label, form);
  const input = element(options.area ? 'textarea' : 'input', undefined, wrapper);
  input.name = name;
  Object.assign(input, options);
  return input;
}
function form(buttonText, submit) {
  const form = element('form');
  const button = element('button', buttonText, form);
  form.addEventListener('submit', async event => {
    event.preventDefault(); button.disabled = true; message.textContent = '';
    try { await submit(new FormData(form)); }
    catch (error) { message.textContent = error.message; }
    finally { button.disabled = false; }
  });
  return form;
}
function saveLink(title, url) {
  const section = element('section');
  element('h3', title, section);
  const input = field(section, title, 'link', { value: url, readOnly: true });
  input.addEventListener('click', () => input.select());
  const copy = element('button', 'Copy link', section); copy.type = 'button';
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); message.textContent = 'Link copied.'; }
    catch { input.select(); message.textContent = 'Select and copy the link above.'; }
  });
}
function go(kind, key) { location.hash = `${kind}/${key}`; location.reload(); }
async function render() {
  root.replaceChildren();
  if (!role && !credential) {
    element('h2', 'Start your exchange');
    const create = form('Create exchange', async values => {
      const result = await request('/api/exchanges', Object.fromEntries(values)); go('manage', result.organiser);
    });
    const button = create.firstChild;
    field(create, 'Exchange name', 'name', { required: true, maxLength: 100, placeholder: 'Friends’ festive exchange' });
    field(create, 'Budget per gift (€)', 'budget', { required: true, type: 'number', min: '0.01', max: '999999.99', step: '0.01', placeholder: '25.00' });
    create.append(button);
    element('p', 'Set a euro spending limit, invite your people, and collect their wishes.');
    return;
  }
  if (!['manage', 'invite', 'participant'].includes(role) || !/^[a-f0-9]{64}$/.test(credential || '') || route.length !== 2) throw new Error('This link is incomplete or invalid. Ask for the complete link.');
  const view = await request(apiPath);
  element('h2', view.name);
  element('p', `${euro(view.budgetCents)} per gift · EUR spending limit`).className = 'budget';
  if (role === 'manage') {
    element('h3', 'Your exchange is ready');
    element('p', 'Share the invitation below. Everyone, including you if you are taking part, joins through that link.');
    saveLink('Invitation — share with participants', link('invite', view.invitation));
    const join = element('a', 'Join as a participant'); join.href = link('invite', view.invitation);
    saveLink('Organiser link — keep private', location.href);
    element('p', 'Anyone holding your organiser link has management access. Save it now: lost private links cannot be recovered.');
    element('h3', `${view.participants.length} participants`);
    element('p', view.participants.length ? view.participants.join(', ') : 'No one has joined yet. Send the invitation to get started.');
    if (view.drawn) {
      element('h3', 'The draw is complete');
      element('p', 'Joining is closed. Each participant can open their private link to see their recipient. Matches stay private, including from the organiser.');
    } else {
      element('p', view.participants.length < 3 ? 'At least three participants must join before drawing. Refresh this page after people join.' : 'Ready to draw. This closes joining permanently. Everyone keeps their private link to see their recipient.');
      const draw = form('Draw gift partners', async () => { await request(apiPath, { action: 'draw' }); await render(); });
      draw.firstChild.disabled = view.participants.length < 3;
    }
  } else if (role === 'invite') {
    if (view.drawn) {
      element('h3', 'Joining is closed');
      element('p', 'The gift draw is complete. If you already joined, open your saved private link to see your recipient and edit your wishlist.');
      return;
    }
    element('h3', 'Join the exchange');
    element('p', 'Use a name your group will recognise. You’ll receive your own private wishlist link.');
    const join = form('Join exchange', async values => { const result = await request(apiPath, Object.fromEntries(values)); go('participant', result.participant); });
    const button = join.firstChild;
    field(join, 'Your name', 'name', { required: true, maxLength: 80, autocomplete: 'name' }); join.append(button);
    element('p', `${view.participants.length} people have joined.`);
  } else {
    if (view.recipient) {
      const reveal = element('section');
      element('h3', `You’re buying for ${view.recipient.name}`, reveal);
      element('p', view.recipient.wishlist || 'Their wishlist is empty. Check back later for their wishes.', reveal).className = 'recipient-wishlist';
      element('p', 'Your match stays the same. Refresh to see their latest wishlist.', reveal);
    } else {
      element('h3', 'Your recipient is a secret for now');
      element('p', 'The organiser has not drawn yet. Save your link and refresh after the draw.');
    }
    element('h3', `${view.self.name}’s wishlist`);
    element('p', view.self.wishlist ? 'Your saved wishes are below. You can update them any time.' : 'Your wishlist is empty. Add ideas, sizes or preferences to help your gift giver.');
    const wishlist = form('Save wishlist', async values => { await request(apiPath, Object.fromEntries(values)); await render(); message.textContent = 'Wishlist saved.'; });
    const button = wishlist.firstChild;
    field(wishlist, 'What would you love?', 'wishlist', { area: true, value: view.self.wishlist, maxLength: 5000, rows: 7 }); wishlist.append(button);
    element('p', 'The budget is a spending limit; wishlist prices are not checked.');
    saveLink('Your private link — keep safe', location.href);
    element('p', 'Anyone holding this link can see your recipient and read and edit your wishlist. Save it now: lost links cannot be recovered.');
  }
}
render().catch(error => { root.replaceChildren(); element('h2', 'We couldn’t open this exchange'); message.textContent = error.message; const home = element('a', 'Start a new exchange'); home.href = '/'; });
window.addEventListener('hashchange', () => location.reload());
