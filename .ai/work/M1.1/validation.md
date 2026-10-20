# M1.1 baseline audit — 2026-10-20

Base/head inspected: c3e2c3936c0c938b2eb4e01ac6cd89e7ee3a3645 (no implementation diff).

- npm test in sandbox: failed, both test files reported ERR_TEST_FAILURE without detailed cause.
- npm test with approved sandbox escalation: 21/21 passed, including HTTP behaviour, revision health, file exposure, deployment guards, recovery and storage boundaries. This establishes local contracts only.
- Inspected server.mjs, public assets, package.json, scripts/test inventory, connection and deployment docs; no assigned handout found in repository.
- Not checked: team collaborator membership, assigned SSH, public HTTPS, hosted revision, teammate phone journey. No deployment attempted; release instruction absent.

This is a lead audit, not independent review or hosted acceptance.
