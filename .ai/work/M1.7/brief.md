# M1.7 — Supplied holiday background

Outcome: exact provided background.png appears as responsive full-page website background while existing forms/cards remain readable on desktop and phone.

Base: latest origin/main (last known316cdf5). Original home filesystem is full; use independent clone under/tmp with its own.git, not linked worktree writing home.git. Preserve all original dirty notes/keys and original image. Never delete files to recover space without authorisation.

Acceptance:
- Copy supplied image unchanged to public/background.png; explicit server whitelist route returns200 image/png with bytes matching source.
- Tasteful desktop/390px phone background placement, artwork visible without excessive overlay, readable cards/inputs/headings, no overflow.
- No unrelated UI/backend/draw changes; existing tests pass. Meaningful image HTTP/type/byte assertion appropriate, no CSS mirror tests.
- Real Chrome desktop+phone screenshots visually inspected; bounded create/join sanity; no repeated full4participant draw required.
- Real independent reviewer exact SHA, separate committer normal reviewed integration to main, no force or history deletion.
- Explicit human authorises merge+deploy; prior projectlead one-release direct Git exception applies if PRauth missing. Preserve guest data/workshop; no key copies/commits/outputs.
- Hosted image200/hash equals source; exact health/publicsmoke and hosted desktop/phone verified. Record brief/validation/review/session/context exact base/head.

OwnerEray; lead/root/m1_lead. Branchm1.7-holiday-background. Coder/session dispatch currently blocked by home ENOSPC threadstore/lock creation; no application code changed. /tmp writable with258GB free; home/dev/sda9.4GBfull. Human/organiser space recovery needed before session lifecycle can continue.
