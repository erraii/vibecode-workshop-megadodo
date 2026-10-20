## Outcome

M1.2: organisers can create a Secret Santa exchange with a euro budget; participants join through an invitation and save or edit wishlists using private links.

## Acceptance and evidence

- [Brief](.ai/work/M1.2/brief.md), [validation](.ai/work/M1.2/validation.md), [independent review](.ai/work/M1.2/review.md).
- Independent reviewer APPROVE for implementation aa7bb909fb7aff4a222d322e87ef021cbcba87e4 against base c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645. Subsequent commits contain evidence and handoff documents only.

## Validation

Coder and independent reviewer each ran npm test successfully outside sandbox: 22/22. Sandbox socket checks failed and were rerun with approval. Actual Chrome journey exercised create, validation, invitation, separate browser join, private wishlist save/edit/reload, roster and invalid links at desktop 1365×1000 and phone 390×844. Credential-free screenshots are in the review directory.

GitHub CI has not passed yet: public API reported no check runs for b72ad83 and no Actions runs for this branch. Verify CI before merging.

## Limits

One nonblocking stale empty-state sentence remains immediately after first wishlist save until reload. Clipboard write success, separate OS process restart, real phone device and hosted acceptance were not verified. Persistence requires one app process. Drawing belongs to M1.3. No deployment or milestone release is authorised by this PR.
