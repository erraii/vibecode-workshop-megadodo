# Project plan

M1 agreed by the human on 2026-10-20. Keep assigned IDs permanent.

## Goal

Agreed goal: a small group completes a Secret Santa exchange: create a shared spending limit, join and add wishlists, draw partners once, and privately view a recipient and their wishlist. See IDEA.md for confirmed input and proposed assumptions.

Planning audit (2026-10-20): the checkout is the static Node starter at `c3e2c39` on `main`, with a health endpoint and deployment tooling but no product action or persistence. The human subsequently agreed M1 and its owner on 2026-10-20; implementation may proceed through the prescribed roles.

Confirmed decisions: private access links without accounts, matches hidden from the organiser, and a stated per-gift budget in euros (EUR), without price verification. Team: Eray, Monir, Aysegul and Atousa. M1 outcomes and exclusions agreed; accountable human owner: Eray. Deployment requires a separate explicit milestone release instruction.

## Working model

Project lead → one milestone lead → one step at a time through coder → independent reviewer → committer. Each milestone has one lead session. Each step names a human owner and the real agent sessions used. The lead records blockers here; it does not invent an approval.

## Team task assignments — updated 2026-10-20

Eray remains accountable for M1 overall. These are four human-owned tasks within the existing milestone; permanent step IDs remain unchanged.

| Member | Assigned task | Step | Current state and next action |
|---|---|---|---|
| Eray | Exchange creation and joining: exchange name, EUR budget, separate organiser/invitation links and participant roster | M1.2 | Implemented and independently approved on the pushed branch. Coordinate the team-fork PR and integration; verify this flow before adding more work. |
| Monir | Wishlists and saved data: private wishlist editing, access boundaries and persistence across reload/restart | M1.2 component | Implemented in the same reviewed branch. Verify the existing work rather than rebuild it; address the documented stale empty-wishlist message through a new brief and reviewed change if needed. |
| Aysegul | Secret draw and private reveal: no self-matches, one giver/recipient each, draw once, close joining, hide other matches | M1.3 | Not implemented. Prepare acceptance cases now; start coding from updated main after M1.2 merges. |
| Atousa | Whole-journey verification and release preparation: desktop/phone, four participant sessions, persistence checks and hosted revision evidence | M1.4; M1.1 evidence | Prepare the test journey and environment checklist now. Run full acceptance after M1.3; hosted checks and deployment require assigned access and explicit release instruction. |

### How each member starts

1. Read AGENTS.md, IDEA.md, PLAN.md, .ai/context.md and the role brief for the session. Inspect Git state and existing step evidence before changing files.
2. Use the shared team fork and update from main after the prerequisite PR merges. Current implementation is on `m1.2-exchange-wishlists`; do not recreate work already present there.
3. Prepare acceptance cases independently. Implementation follows one active milestone lead and one writer per checkout; separate worktrees and agreed interfaces are required before any concurrent writing.
4. Implement one brief on one step branch, then use a different reviewer session and a separate committer. A changed implementation SHA requires re-review. Human task ownership does not replace these role boundaries.
5. Keep validation and review in the step evidence directory. Do not claim hosted acceptance from local checks or deploy without explicit release approval.

## M1 — First useful live journey

Milestone lead: `/root/m1_lead` (fresh session, assigned 2026-10-20). Human owner: Eray. Release: only after the team accepts the journey.

| Step | Outcome | Depends on | Human owner | State / PR |
|---|---|---|---|---|
| M1.1 | Our fork runs at the assigned URL and reports its deployed revision | Team access and explicit release | Atousa | partial app hosted and revision verified; teammate access/phone observation pending |
| M1.2 | An organiser creates an exchange with a budget; participants join and save wishlists | M1.1 local baseline audit | Eray (exchange/join); Monir (wishlists/data) | merged [PR #1](https://github.com/erraii/vibecode-workshop-megadodo/pull/1); partial app released e163d07 |
| M1.3 | Participants privately receive stable gift assignments and recipient wishlists | M1.2 | Aysegul | planned |
| M1.4 | A teammate can complete the whole journey; observed failures are corrected | M1.3 | Atousa | planned |
| M1.5 | Current create/join/wishlist journey is clear, welcoming and accessible | reviewed M1.2 main | Eray | independently approved 6355c00; ready branch/PR; no fresh release authorised |

Sequencing decision (2026-10-20, project lead): local M1.2 work may proceed after M1.1 starter/deployment-contract audit. Hosted M1.1 acceptance remains required for the milestone and waits for assigned access and explicit release approval; this does not authorise deployment. IDs and product scope are unchanged.

### M1.1 — The live starting point

- [ ] Every teammate has access to the same team fork.
- [ ] The assigned SSH connection reaches our team environment.
- [ ] Our page is reachable at the assigned HTTPS URL.
- [ ] `/api/health` reports the revision we intended to deploy.
- [ ] Another teammate opens the page on a phone.

### M1.2 — Core action

Agreed acceptance:
- An organiser creates an exchange with a name, positive per-gift spending limit in euros (EUR), then shares a joining link.
- Separate participants join, see the same budget and save or edit their own text wishlists; names are distinguishable.
- A new exchange explains how to invite people; an empty wishlist is shown honestly.
- Invalid budget or blank participant name gives a useful error without losing valid input.
- Participants cannot edit another person's wishlist through the supported interface or direct requests.

### M1.3 — Private draw and persistence

Agreed acceptance, using the confirmed private-link and secrecy decisions:
- The organiser can draw only with at least three participants; membership closes at the draw.
- Every participant gives to exactly one other participant and receives from exactly one; no self-assignment.
- Organiser privileges do not expose the full assignment list through the UI or API. An organiser who joins as a participant can see their own recipient.
- Each participant sees only their own assignment and the recipient's current wishlist; the shared invitation grants no access to existing participants' private results.
- Repeating or simultaneously requesting the draw does not replace or partially save assignments.
- A late join is refused clearly; a missing or invalid private link reveals no assignment.
- Exchange details, wishlists, access and assignments survive reload, use by separate browsers and app restart. Durable data remains outside deployment release directories.
- Wishlist edits after the draw appear to the assigned giver without changing assignments.

### M1.4 — Feedback

Have all four teammates complete create → join → wishlist → draw → private reveal on desktop and phone widths. Check budget visibility, secrecy between sessions, unchanged assignments after reload and restart, and a wishlist update after the draw. Record observed problems and corrections; do not invent feedback. Verify the intended hosted revision only following explicit release approval. Add new scope as a new step.

### M1.5 — Gifting UX refinement

Human requested better UX on 2026-10-20. Refine the existing create/join/wishlist flow with clear role-specific headings, prominent euro budget and actions, warm cards, useful states and phone accessibility. Explain before creation that the draw is not yet available. Fix stale empty-wishlist copy after saving. Preserve backend, private-link boundaries and durable data; no draw implementation. Branch `m1.5-gifting-ux` from reviewed/deployed main e163d07. Actual desktop/phone review required. Prior push authorisation applies; a fresh UX deployment is not authorised.

## M2 — Improve the demonstrated journey

Plan only after M1 gives you evidence. Add the next useful milestone or stop and prepare the demo.
