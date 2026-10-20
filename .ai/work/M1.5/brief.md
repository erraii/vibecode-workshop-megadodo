# M1.5 — A clearer, warmer gifting journey

## Outcome
Within seconds, a visitor understands this Secret Santa tool and can create an exchange, join the right group or edit their own wishlist with clear next steps.

## Audit
Base origin/main e163d0711cd33f7d7011ad89e60c71efda907d3f, reviewed implementation aa7bb909. Live partial create/join/wishlist flow works; draw not implemented. Current page repeats a large generic hero on every role, has plain ungrouped forms/links, global feedback distant from actions, and stale empty-wishlist text after saving. Inspect public/index.html, app.js, style.css and existing test/access contracts before implementing. Uncommitted release evidence/context must be preserved; untracked bootstrap files must NEVER be staged or read into output.

## Acceptance
- [ ] Landing clearly explains shared EUR budget, invitation and wishlists, and states before creation that the draw is not available yet. No fake gifting completion, draw CTA, fabricated matches or unavailable actions.
- [ ] Role-specific hierarchy: organiser invites and sees roster; invitation shows exchange/budget and asks name; participant sees own name, budget and wishlist. Avoid giant repeated generic hero on these routes.
- [ ] Primary action is obvious per view; invitation sharing and private organiser/participant links are clearly distinguished. Clear copy success/fallback and saved confirmation near relevant action.
- [ ] Readable budget, friendly empty roster/wishlist states, loading, useful errors, busy/disabled submit feedback, preserved input on errors. Wishlist status updates immediately after save including empty/nonempty edits.
- [ ] Warm, restrained gift-themed cards/spacing/native decoration, consistent typography, responsive single-column phone flow. No external artwork needed.
- [ ] Accessible labelled inputs, visible focus, keyboard journey, sufficient contrast, sensible heading order, announced feedback and no narrow-screen horizontal overflow.
- [ ] Existing API routes, token separation, rendering safety, durable storage, health and deploy/test scripts unchanged in behaviour. Do not implement draw or change product scope.
- [ ] Actual Chrome desktop and phone: create -> invitation -> separate participant context -> wishlist save/edit/reload; copy states, invalid/duplicate name and invalid link, empty-to-saved state. Capture credential-free screenshots and visually inspect. Report unavailable checks honestly.

## Design reference
Use existing Secret Santa wordmark/system font and warm orange as continuity. Aim for warm cream background, dark readable text, gift/ribbon CSS or native illustration, compact role headers, focused cards with clear primary controls and distinguishable private-link panels. This is a reference direction, not a requirement for decorative complexity; clarity comes first.

## Boundaries and dependencies
One step branch m1.5-gifting-ux from current origin/main. Existing deployment evidence may be included as docs-only work. Never git add all: credential files are untracked. No fresh deployment authorised, no main bypass. Preserve data/backend contracts. Run existing meaningful suite; avoid tests that merely mirror styles.

## Handoff
Owner Eray; lead /root/m1_lead. Coder then independent reviewer then separate committer. Commit exact base/head validation and pause edits for review. Push authorised. PR must target erraii/vibecode-workshop-megadodo main; if authenticated GitHub interface missing, prepare compare URL/body, do not directly push main. New implementation SHA requires re-review.
