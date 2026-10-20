# M1.6 — Integrate reviewed team work and release the complete journey

## Outcome
One reviewed main revision includes both Aysegul's private draw and the warm UX, and is deployed to the assigned site after independent combined review.

## Audit
Main last fetched e163d0711cd33f7d7011ad89e60c71efda907d3f. Already-merged m1.2 needs no duplicate work. Unmerged origin/m1.3-secret-draw head3be25ba contains implementationea3cd0f with independent APPROVE and24tests/browser evidence. Unmerged origin/m1.5-gifting-ux head3dab120 contains UXimplementatione2ed482 independently approved at6355c004. Both based on main; expect overlapping public/app.js, PLAN/context. Fresh fetch required before coding and committer integration. Original checkout has diagnosis docs/context and bootstrap credentials; preserve, never stage/read/copy key files. Use separate integration worktree to avoid shared dirty checkout.

## Acceptance
- [ ] Normal merges preserve both branch ancestries and evidence; inspect all remote branches, merge actual unmerged work once, no reset/force/delete.
- [ ] Warm responsive UX, clear role-specific create/join/organiser/participant screens, budget and private/public links remain; stale empty wishlist text fixed. Replace obsolete unavailable-draw claims with accurate create/invite/draw/reveal guidance.
- [ ] Full journey: create EUR budget, four distinct participants join and save wishes, organiser draws once with minimum3, membership closes, each participant privately sees exactly one other recipient and current wishlist. Each receives exactly once, no self matches.
- [ ] Repeat/concurrent draws stable; late joining refused; organiser/invitation/other participants cannot read other assignments or private credentials. Invalid links remain safe. Postdraw wishlist edits update giver view without changing matches.
- [ ] Reload and restart preserve access/wishlists/matches. Existing durable data/deployment contracts unchanged; tests on meaningful integrated cases pass. No new accounts/exclusions/redraws.
- [ ] Real Chrome default-security desktop+390px phone full journey, separate participant sessions, draw/reveal/reload/latejoin/privacy and safe rendering; visually inspect credential-free screenshots. Record actual limits, no fabricated physical-phone/human acceptance.
- [ ] Independent reviewer examines committed combined SHA, not prior separate approvals alone. Fixes return coder and changed implementation requires re-review.
- [ ] Separate committer refreshes main, verifies reviewed implementation, integrates normally without force, deploys reviewed main only, confirms guest health exact SHA/public smoke and hosted desktop+phone journey leaves loading.

## Boundaries and authorisation
Human explicitly requested pull all branches, merge and deploy on2026-10-20 after being informed of missing GitHub PR auth. Project lead interprets latest repeated instruction as a one-release exception allowing normal direct Git integration if authenticated PR interface remains unavailable. Prefer team-fork PR when available; record exception transparently, never invent PR/CI. Explicit release authorised for this combined journey. Preserve data and ~/workshop; use assigned environment only, keys never copied. No additional product scope. Main advances only after independent combined approval.

## Handoff
Human owner Eray; milestone lead /root/m1_lead. Coder /root/m1_lead/m1_6_integrator, branchm1.6-integrate-team-work from fresh origin/main, separate worktree. Evidence .ai/work/M1.6/{brief,validation,review}.md with exact base/head. Then fresh independent reviewer and separate committer. Coder commits/pushes then stops editing; does not merge main/deploy. Preserve original-checkout diagnosis notes for later safe docs integration.
