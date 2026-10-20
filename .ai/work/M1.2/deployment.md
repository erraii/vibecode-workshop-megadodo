# M1.2 partial release — 2026-10-20

Explicit human instruction authorised merging and deploying the current create/join/wishlist app, without draw. Human had already merged team-fork [PR #1](https://github.com/erraii/vibecode-workshop-megadodo/pull/1) and [PR #2](https://github.com/erraii/vibecode-workshop-megadodo/pull/2). Remote main and deployed SHA: e163d0711cd33f7d7011ad89e60c71efda907d3f. Application, tests, package/lock and deployment scripts have no diff from independently approved aa7bb909fb7aff4a222d322e87ef021cbcba87e4; later changes are documentation/evidence.

Assigned guest audit confirmed authorised account and user-app-v1 contract. Existing source checkout pointed at the starter fork; preserved it and cloned the team fork into a separate checkout. Bootstrap key permission corrected to owner-only locally; never copied to guest or committed. No private connection details recorded here.

Guest clean main: npm ci passed; npm test passed 22/22; npm run deploy:preview passed; npm run deploy independently repeated 22/22, installed release and reported DEPLOYED exact SHA, active user service. Deployment helper preserved workshop and data, and kept active/rollback releases.

Local guest health returned {"ok":true,"revision":"e163d0711cd33f7d7011ad89e60c71efda907d3f"}. Initial laptop smoke from the feature branch failed expected revision comparison because local HEAD was 2c61283. Reran npm run smoke -- https://team-04.intra.land from an isolated checkout of deployed main: PASS exact revision. No GitHub CI success is inferred from guest checks.

Hosted Chrome desktop 1365×1000 and phone 390×844 exercised: create €25 exchange; zero-budget browser validation retains name; invitation and blank/duplicate name errors; two participants in separate isolated contexts; honest empty wishlist; literal script text saved safely; wishlist reload/edit/reload; roster and invalid/unknown private links. All completed. Phone document width 390 matched viewport width 390. Copy used select-and-copy fallback; actual clipboard write/paste not verified. Desktop create and phone invalid screenshots visually inspected and saved under hosted/ without bearer credentials. Other ephemeral screenshots contain private links and were not committed. Dedicated hosted verification exchange/data retained; no data deleted.

Limits: no real phone device/teammate observation, process-restart acceptance, draw or assignments. Full M1 journey remains M1.3/M1.4. Nonblocking stale empty-wishlist introductory sentence remains until reload.
