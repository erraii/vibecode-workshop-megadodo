# M1.2 — Create an exchange, join and save wishlists

## Outcome
An organiser creates an exchange with a euro budget, shares its joining link, and distinct participants retain private access to their own saved wishlist.

## Audit
Base main: c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645. Node HTTP starter has static routes and health only; no persistence or browser scripts. M1.1 local baseline has 21 passing checks outside sandbox; hosted acceptance pending. Planning docs are existing uncommitted work: include them in this reviewable step without discarding changes. No framework replacement is required.

## Acceptance
- [ ] Create with nonblank exchange name and positive per-gift EUR budget; organiser obtains management access and a separate invitation link.
- [ ] Invitation allows separate participants to join and see exchange name/budget. Names are distinguishable; reject ambiguous duplicates clearly. Organiser participation uses the same participant flow.
- [ ] Each participant receives a private access link and can save/edit their own text wishlist. Explain that holders can use it and losing it has no recovery. Reload/restart preserves exchanges, credentials and wishlists.
- [ ] New exchange explains invitation/sharing; empty wishlist is honest. Invalid budget/name gives useful errors and preserves valid form input.
- [ ] Shared invitation and organiser credential do not grant another participant's editing credential. Unauthenticated/direct requests cannot read private tokens or change another wishlist. Render text safely; never execute wishlist markup.
- [ ] Private credentials use sufficient randomness and never appear in public participant lists, health, logs or committed fixtures. Avoid leaking bearer links through referrers.
- [ ] Durable storage is outside deployment release directories, with isolated temporary storage in tests. Document configuration; retain existing data.
- [ ] HTTP health/revision, PORT binding, lockfile, test and deployment scripts continue to meet AGENTS.md contracts.
- [ ] Browser desktop and phone widths: create → copy invitation → join in separate session → save/edit wishlist → reload. Exercise validation, missing/invalid links and empty state. Record actual screenshots/observations and limitations; no hosted claims.

## Design reference
Use the existing starter's system font, warm accent and clear responsive spacing as a repository-native starting reference. Adapt wording and structure to a focused Secret Santa form journey: visible euro budget, labelled inputs, clear link-sharing actions, status/error feedback and single-column phone forms. No external artwork required. Record the resulting visual decisions for reviewer comparison.

## Boundaries and dependencies
M1.1 local audit passed; hosted evidence waits separately. Implement no draw or assignment yet: M1.3 owns draw invariants, secrecy and concurrency. Make persistence/access interfaces suitable for this next step without speculative features. No accounts, email, exclusions, price checking or deployment. Private-link secrecy means organiser UI/API cannot expose all assignments later; no claim against server administrators.

## Handoff
Human owner Eray; milestone lead /root/m1_lead. Branch m1.2-exchange-wishlists from current main. One writer at a time. Coder must read role, preserve planning docs, commit implementation and validation.md, then stop editing for separate review. Record exact base/head. Independent reviewer and committer will be assigned after coder finishes; PR explicitly targets erraii/vibecode-workshop-megadodo. No self-approval or direct main commits.
