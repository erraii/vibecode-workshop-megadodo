# M1.5 coder validation

Base: e163d0711cd33f7d7011ad89e60c71efda907d3f (origin/main).
Implementation head: e2ed48247bd11e41d6e76c2b2f1991013000c05b.
Branch: m1.5-gifting-ux. Coder: /root/m1_lead/m1_5_coder. Independent review pending.

Changed only public HTML/JS/CSS: warm cream/orange cards, compact purpose-specific views, euro budget, pre-create disclosure that draw is unavailable, differentiated invitation/private links, local copy/error/save feedback, busy submit labels, honest loading and immediately updated wishlist state. Backend, API, storage and deployment contracts unchanged.

## Actual checks

- npm test: 22/22 passed outside restricted sandbox. First sandbox run failed without useful subtest output; elevated run exposed one real existing HTML-heading assertion after moving the heading into JS. Restored a meaningful static loading heading; all 22 then passed. No tests removed or weakened.
- node --check public/app.js; git diff --check: passed.
- Real installed Google Chrome, headless CDP, local server with fresh temporary data. Desktop 1365×1000 and phone emulation 390×844. Script /tmp/santa-m15-browser.cjs; final run ended DONE. No hosted release performed.
- Created €25 exchange; zero-budget browser validation preserved exchange name. Organiser invitation/empty roster/private-link roles visible. Blank name server error; case-insensitive duplicate name error retained input.
- Invitation joined in a separate isolated browser context; independent participant saw own empty wishlist. Literal script-tag text remained inert in textarea. Save, clear and resave immediately changed empty/saved guidance; save confirmation appears under submit. Private-link reload and edit/reload preserved text. Organiser roster reflected both names.
- Clipboard unavailable path selected input and displayed manual-copy guidance. Granting Chrome clipboard permissions then clicking copied successfully (COPY_SUCCESS true).
- Keyboard Tab focused an anchor with visible solid focus outline. Labels wrap controls; headings h1 then h2; status feedback live regions; native validation preserved. This is a focus smoke check, not a full assistive-technology audit.
- Phone wishlist and invitation scrollWidth=390 matched viewport=390. Invalid malformed and unknown token links displayed useful safe errors.
- Visually inspected desktop landing/manage and phone wishlist/invitation. Readable contrast, responsive cards, prominent primary form action and budget; no horizontal overflow observed. Saved screenshots in screenshots/ mask bearer input values before capture. Browser URL bar absent; no credentials in artifacts.

## Limits

No physical phone, human teammate acceptance, screen-reader audit, hosted verification or deployment. Draw remains absent as disclosed. Backend persistence/security regression coverage comes from existing suite; no new process-restart browser check performed for this frontend-only change. Loading/busy states exist but were not deliberately delayed in Chrome for visual capture. Reviewer must independently inspect committed diff and running page.
