# M1.3 — Secret draw and private reveal

## Outcome

Aysegul's part: the organiser draws once; participants privately see their stable recipient and current wishlist.

## Audit

Base: e163d07 (main, merged M1.2). Clean checkout. server.mjs currently rejects organiser POST and exposes no draw; public/app.js explicitly says draw is a future step. store.mjs serialises atomic file transactions for one app instance, defaulting outside release directories. Existing private links and wishlist edits must remain compatible.

## Acceptance

- Organiser draw requires at least three participants. Membership closes atomically with a successful draw.
- Every member gives and receives exactly once, with no self-match. Draw is random; persisted results never change on repeat or concurrent draw requests.
- Only a participant's private credential reveals that participant's recipient name and current wishlist. No recipient credential or complete assignments leak through organiser, invitation, or participant responses.
- Non-organisers cannot draw; invalid/missing credentials disclose no result. Late joins fail clearly. Organiser participation uses a separate participant credential.
- Existing exchanges/wishlists remain usable. Saved access, wishes and assignments survive reload and fresh app creation/restart. Post-draw wishlist edits reach the giver without changing assignments.
- UI clearly provides organiser draw, insufficient-count state, closed invitation, pending and private recipient views; EUR budget remains visible. Exercise real desktop and phone browser journeys where tooling permits and record limitations honestly.
- Meaningful HTTP tests cover access, concurrency, stable bijection, restart and post-draw edits; existing deployment-contract tests remain green.

## Boundaries and dependencies

M1.2 is actually merged despite stale planning/context notes. Preserve original styling and deployment scripts/contracts. No accounts, email, redraw, exclusion rules, late joining, public matches or deployment. Do not access another team's resources or existing user data. Use isolated test directories. One writer at a time.

## Handoff

Human owner: Aysegul. Lead: /root/aysegul_m13_lead. Branch: m1.3-secret-draw from e163d07. Coder then independent reviewer then committer, each a real separate session. Evidence: .ai/work/M1.3/{brief,validation,review}.md. Reviewer records exact reviewed base/head. PR must explicitly target erraii/vibecode-workshop-megadodo; merge requires partner acceptance and passing CI. No deployment authorised.
