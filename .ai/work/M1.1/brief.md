# M1.1 — The live starting point

## Outcome
The team can identify its fork and confirm an explicitly authorised deployed revision at the assigned URL.

## Audit
Base: c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645, main. Origin is erraii/vibecode-workshop-megadodo. Starter server serves public/index.html, style.css and revision health; no product state. Scripts preserve deployment guards. Repository connection docs contain placeholders only, not verified assigned details. Planning changes are uncommitted and preserved.

## Acceptance
- [x] Local starter HTTP and deployment contract checks pass (see validation.md).
- [ ] Every teammate confirms access to the same fork; do not infer collaborator access from origin.
- [ ] Assigned SSH reaches the team's environment using authorised credentials.
- [ ] After explicit release approval, assigned HTTPS page and health identify intended deployed SHA.
- [ ] Another real teammate opens the page on a phone and records their observation.
- [ ] Failure: absent access or release permission is recorded; no inferred hosting identity, deployment or fabricated acceptance.

## Boundaries and dependencies
No deployment authorised. Preserve deployment scripts and durable app data. Never commit private connection details or keys. Local M1.2 can follow the local baseline audit; hosted milestone acceptance still depends on this step. No code change is needed merely to create evidence.

## Handoff
Human owner Eray. Milestone lead /root/m1_lead. No coder, reviewer or committer dispatched for this audit-only step; no PR or approval claimed. Next: obtain assigned URL/access evidence and explicit release instruction when ready. Review and deployment sessions must be recorded when real.
