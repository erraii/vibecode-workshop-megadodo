# M1.2 review

Base SHA: c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645
Head SHA: aa7bb909fb7aff4a222d322e87ef021cbcba87e4
Reviewer session: /root/m1_lead/m1_2_reviewer (independent session, did not author implementation; same available model family).

## What I checked

Read project/role instructions, acceptance brief, coder validation, actual committed diff, server.mjs, store.mjs, public assets and test changes. Working tree was clean at review start. No implementation edits, merge or deployment performed.

Independently reran `npm test`: sandbox run could not exercise sockets; approved outside-sandbox run passed 22/22, zero skipped. Examined role/credential boundaries: cryptographic 32-byte credentials; invitation and organiser views return roster names without participant tokens or wishlists; participant editing selects identity from its credential rather than submitted participant fields; organisers cannot edit participant wishes. Existing HTTP/static-file/deployment guards still pass. Hostile Origin is refused and responses set no-store, no-referrer and CSP. Rendering uses textContent/value, not HTML interpolation.

Persistence implementation uses owner-only creation, serial read-modify-write transactions and atomic replacement, with data outside release directories. Lifecycle test reads saved data through a second app instance; README documents DATA_DIR and the one-process requirement. No separate OS process restart test was run. No existing user data was modified: browser runs used fresh /tmp directories.

Real installed Chrome headless browser exercised through raw Chrome DevTools Protocol over a pipe, without adding dependencies. Reviewed screenshots visually at desktop 1365×1000 and phone 390×844; single-column forms, labels, contrast, clear orange actions, wrapping and budget emphasis match the agreed reference. Phone wishlist reported document scroll width 390 for viewport width 390.

Browser tasks actually run:
- Create Eray’s exchange with €25; invalid zero budget blocked by browser validation while exchange name remained intact.
- Management page explains empty roster/invitation sharing and exposes separate organiser/invitation links.
- Copy button exercised: this headless permission context used the documented select-and-copy fallback. Successful system clipboard write/manual paste was NOT verified; the selected invitation URL was used for navigation.
- Invitation join with whitespace name gives useful error; Eray joins and receives private wishlist view with honest empty state.
- Save literal `<script>alert(1)</script> Books`, reload and inspect textarea: remains literal, no alert executes.
- Open invitation in a separate isolated Chrome browser context: case-insensitive duplicate `eray` rejected and valid input preserved; Monir joins with an independent empty wishlist.
- Organiser roster shows Eray and Monir. Eray's original private link opened in the second context retains his saved wishes; edit to `Updated: books and socks` survives reload.
- Malformed private link and syntactically valid unknown credential both show useful errors without exposing exchange content.

Saved credential-free visual evidence: screenshots/desktop-create.png and screenshots/phone-invalid.png. Additional inspected disposable screenshots remain at /tmp/santa-review-desktop-manage.png, /tmp/santa-review-desktop-wishlist.png, /tmp/santa-review-phone-wishlist.png and /tmp/santa-review-phone-manage.png; these are ephemeral and deliberately not committed because link fields include generated access credentials. Browser driver is /tmp/santa-review-browser.cjs (ephemeral). No hosted acceptance, real phone device, four-person full draw or deployment is claimed; M1.3/M1.4 own the remaining journey.

## Findings

No blocking findings for M1.2.

Low, public/app.js participant rendering: after saving the first wishlist, the introductory empty-state sentence remains until reload because submit updates only the status region. Save succeeds and reload shows the correct saved-state sentence. Suggested follow-up: refresh the introductory sentence after successful save so it always reflects saved content. This does not prevent wishlist editing or persistence.

## Verdict

APPROVE aa7bb909fb7aff4a222d322e87ef021cbcba87e4 for M1.2 only. Reviewed implementation meets create/name/EUR budget, separate organiser/invitation access, private wishlist editing, roster, validation, persistence and deployment contracts. Independent tests and actual desktop/phone browser interaction support this verdict. Remaining clipboard, process-restart and hosted limits are stated above. No draw or milestone-release approval is implied. Application changes after this SHA require re-review; the review and screenshot artifacts themselves contain no implementation changes.
