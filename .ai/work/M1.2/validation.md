# M1.2 validation

Base: c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645. Implementation head recorded below after commit. No independent verdict yet.

- `npm test`: first sandbox attempt failed (HTTP sockets/deployment subprocess environment); rerun with escalation passed 22/22. Includes existing HTTP/deployment contracts and new exchange lifecycle/access test: invalid names/budgets, duplicate names, credential separation, invitation/organiser redaction, unsupported editing, invalid credentials, wishlist size, literal markup, persisted data read through a new app instance, edits and hostile Origin rejection.
- No dependencies added; package lock and deployment helpers retained.
- Durable storage uses DATA_DIR or ~/.local/share/vibecode-workshop/data, owner-only creation, serial transactions and atomic rename. Requires one app process. Data is not deleted on failure or deployment.
- Browser: NOT RUN. Chrome binary found; no browser connector or installed Playwright/Puppeteer. A proposed local Chrome/CDP validation invocation was interrupted before execution. No screenshots exist and no desktop/mobile acceptance is claimed. User requested prompt push; reviewer must complete actual UI verification.
- No hosted test, deploy or full assignment journey; drawing belongs to M1.3.

Visual decisions: preserve the starter's dark system-font palette and warm orange accent. Use a focused single-column create/join/wishlist form, explicit EUR budget, labelled inputs, status region, readable private links and 44px minimum buttons. Expected phone fit must be verified in browser.
