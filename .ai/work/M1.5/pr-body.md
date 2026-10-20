## Outcome

M1.5: visitors understand the EUR budget, invitation and wishlist journey, with warm responsive cards and clear actions for each role. Landing explains that drawing is not available yet. Wishlist saved/empty guidance now updates immediately after edits.

## Acceptance and evidence

[Brief](.ai/work/M1.5/brief.md), [validation](.ai/work/M1.5/validation.md), [independent review](.ai/work/M1.5/review.md).

Independent APPROVE for exact reviewed head 6355c00471273632666af8c4e6f0af5a160a4cc8, implementation e2ed48247bd11e41d6e76c2b2f1991013000c05b, base e163d0711cd33f7d7011ad89e60c71efda907d3f. Subsequent committer changes contain evidence and handoff documents only.

## Validation

Coder and independent reviewer each passed npm test 22/22 outside sandbox after sandbox execution failures. Actual Chrome desktop 1365×1000 and phone 390×844 exercised create, invitation, separate-context joining, save/clear/edit/reload, invalid/duplicate names, safe markup, invalid links, clipboard fallback/success and focus smoke. Redacted screenshots were visually inspected. Backend, storage and deployment scripts unchanged.

## Limits

No physical phone, human teammate acceptance, hosted UX verification, screen-reader audit or full keyboard-only journey. Loading/busy states inspected in code without deliberate browser delay. No draw, merge authorisation or new deployment is implied. GitHub CI must be checked separately.
