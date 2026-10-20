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
  const feedback = element('p', '', form); feedback.className = 'feedback'; feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite');
  const button = element('button', buttonText, form);
  form.addEventListener('submit', async event => {
    event.preventDefault(); button.disabled = true; button.textContent = 'One moment…'; feedback.textContent = ''; message.textContent = '';
    try { await submit(new FormData(form)); }
    catch (error) { feedback.textContent = error.message; }
    finally { button.disabled = false; button.textContent = buttonText; }
  });
  form.append(feedback);
  return form;
}
function saveLink(title, url, description) {
  const section = element('section');
  element('h2', title, section);
  element('p', description, section);
  const input = field(section, title, 'link', { value: url, readOnly: true });
  input.addEventListener('click', () => input.select());
  const feedback = element('p', '', section); feedback.className = 'feedback'; feedback.setAttribute('role', 'status');
  const copy = element('button', 'Copy link', section); copy.type = 'button';
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); feedback.textContent = 'Link copied. Ready to paste.'; }
    catch { input.select(); feedback.textContent = 'Copy unavailable. Select and copy the link above.'; }
  });
}
function go(kind, key) { location.hash = `${kind}/${key}`; location.reload(); }
async function render() {
  root.replaceChildren();
  if (!role && !credential) {
    element('p', 'A little thought goes a long way').className = 'eyebrow';
    element('h1', 'Make someone’s day.');
    element('p', 'Set a shared euro budget, invite your people and gather gift ideas in one cosy place.').className = 'intro';
    const steps = element('ol'); steps.className = 'steps';
    ['Set the budget', 'Share an invitation', 'Collect wishlists'].forEach(text => element('li', text, steps));
    element('p', 'For now, you can create an exchange and collect wishlists. The random partner draw is not available yet.').className = 'notice';
    element('h2', 'Start your exchange');
    const create = form('Create exchange', async values => {
      const result = await request('/api/exchanges', Object.fromEntries(values)); go('manage', result.organiser);
    });
    const button = create.querySelector('button');
    field(create, 'Exchange name', 'name', { required: true, maxLength: 100, placeholder: 'Friends’ festive exchange' });
    field(create, 'Budget per gift (€)', 'budget', { required: true, type: 'number', min: '0.01', max: '999999.99', step: '0.01', placeholder: '25.00' });
    create.append(button, create.querySelector('.feedback'));
    element('p', 'Set a euro spending limit, invite your people, and collect their wishes.');
    return;
  }
  if (!['manage', 'invite', 'participant'].includes(role) || !/^[a-f0-9]{64}$/.test(credential || '') || route.length !== 2) throw new Error('This link is incomplete or invalid. Ask for the complete link.');
  const loading = element('p', 'Unwrapping your exchange…'); loading.setAttribute('role', 'status');
  const view = await request(apiPath);
  loading.remove();
  element('p', { manage: 'Your organiser space', invite: 'You’re invited', participant: 'Your wishlist space' }[role]).className = 'eyebrow';
  element('h1', view.name);
  element('p', `${euro(view.budgetCents)} per gift · EUR spending limit`).className = 'budget';
  if (role === 'manage') {
    element('h2', 'Invite your people');
    element('p', 'Share the invitation below. Everyone, including you if you are taking part, joins through that link.');
    saveLink('Invitation — share with your group', link('invite', view.invitation), 'Send this link to everyone taking part. Each person gets a separate private wishlist link.');
    const join = element('a', 'Join as a participant'); join.href = link('invite', view.invitation);
    saveLink('Organiser link — just for you', location.href, 'Save this separately from the invitation. Anyone with it can manage the exchange.');
    element('p', 'Anyone holding your organiser link has management access. Save it now: lost private links cannot be recovered.');
    element('h2', `${view.participants.length} ${view.participants.length === 1 ? 'participant' : 'participants'}`);
    element('p', view.participants.length ? view.participants.join(', ') : 'No one has joined yet. Send the invitation to get started.');
    element('p', 'Wishlist collection is open. The partner draw is not available yet.');
  } else if (role === 'invite') {
    element('h2', 'A thoughtful gift starts with you');
    element('p', 'Use a name your group will recognise. You’ll receive your own private wishlist link.');
    const join = form('Join exchange', async values => { const result = await request(apiPath, Object.fromEntries(values)); go('participant', result.participant); });
    const button = join.querySelector('button');
    field(join, 'Your name', 'name', { required: true, maxLength: 80, autocomplete: 'name' }); join.append(button, join.querySelector('.feedback'));
    element('p', view.participants.length === 1 ? '1 person has joined.' : `${view.participants.length} people have joined.`);
  } else {
    element('h2', `${view.self.name}’s wishlist`);
    const wishlistStatus = element('p', view.self.wishlist ? 'Your saved wishes are below. You can update them any time.' : 'Your wishlist is empty. Add ideas, sizes or preferences to help your gift giver.');
    const wishlist = form('Save wishlist', async values => {
      await request(apiPath, Object.fromEntries(values));
      wishlistStatus.textContent = String(values.get('wishlist')).trim() ? 'Your saved wishes are below. You can update them any time.' : 'Your wishlist is empty. Add ideas, sizes or preferences to help your gift giver.';
      wishlist.querySelector('.feedback').textContent = 'Wishlist saved. You can come back and edit it any time.';
    });
    const button = wishlist.querySelector('button');
    field(wishlist, 'What would you love?', 'wishlist', { area: true, value: view.self.wishlist, maxLength: 5000, rows: 7 }); wishlist.append(button, wishlist.querySelector('.feedback'));
    element('p', 'The budget is a spending limit; wishlist prices are not checked.');
    saveLink('Your private link — keep safe', location.href, 'Bookmark this link to return to your wishlist. It belongs to you, so keep it private.');
    element('p', 'Anyone holding this link can read and edit your wishlist. Save it now: lost links cannot be recovered.');
  }
}
render().catch(error => { root.replaceChildren(); element('h1', 'We couldn’t open this exchange'); message.textContent = error.message; const home = element('a', 'Start a new exchange'); home.href = '/'; });
window.addEventListener('hashchange', () => location.reload());
