# M1.7 coder validation

Base: 316cdf5e1dc0d3a0b26c60fb2935f144b5ce5abd. Exact implementation head follows in evidence-only commit.

Exact supplied source copied unchanged. SHA256: 242edf6d8efdcb74b661dc8ddbb185cd35e7b20368fc30fce6c9dd90cb73282c. Server explicitly whitelists /background.png with image/png. Responsive full-width artwork repeats vertically over full page; translucent main surface and existing opaque forms maintain readability. No draw/data/deployment changes.

`npm test` passed25/25 with approved local-port escalation. New asset test checks HTTP200, exact image/png and served bytes identical to committed asset. Source-to-asset comparison also passed. `git diff --check` passed.

Actual default-security headless Chrome desktop1365 and phone390 passed: background loaded, create EUR25 exchange, organiser screen, isolated phone participant join, save wishlist, no horizontal overflow. Visually inspected final desktop and phone create screenshots: holiday artwork visible, headings/forms/buttons readable and unclipped. Redacted screenshot links only. Harness /tmp/santa-m17-browser.cjs. First visual pass used85% main overlay; reduced to70% for clearer artwork and reran browser successfully. No other product changes.

Local Node20.11.1 is below declared>=22; supported runtime validation remains release responsibility. Local phone emulation is not physical phone or hosted acceptance. Coder has not merged main or deployed; original dirty checkout/credentials untouched.
