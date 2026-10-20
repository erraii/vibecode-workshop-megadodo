# M1.6 coder validation

Base: e163d0711cd33f7d7011ad89e60c71efda907d3f. Combined implementation head: the merge commit containing this evidence (resolve with `git log --merges -1`); exact SHA appended in follow-up evidence commit.

Normal fast-forward of draw head 3be25ba, then normal merge of UX head 3dab120 preserves both ancestries. Resolved app.js/style/PLAN/context conflicts: retain warm UX and local feedback, add draw/reveal/closed joining with h2 hierarchy; min-three disabling targets button rather than feedback paragraph. Replaced obsolete draw-unavailable copy. Backend and deployment contracts unchanged from reviewed draw branch.

- `npm test`: sandbox run failed due local binding restrictions; rerun with approved escalation passed 24/24, zero skips.
- `git diff --check`: passed.
- Actual default-security headless Chrome via `/tmp/santa-m16-integration.cjs`: passed desktop1365 and phone390, four isolated browser contexts, create EUR25, four joins and wishes, min3 disabled at0/2 and enabled3, draw once, unique recipients/no self, private current wishlist reveal, repeated/concurrent draw stability, latejoin409 and closed UI, organiser/invitation API privacy, invalid links, postdraw safe-text edit, reload and real process restart persistence. No horizontal overflow in participant views.
- Initial harness assertion failed because Page.navigate to same URL did not refresh organiser roster; explicit Page.reload fixed harness. No app change for this harness issue.
- Visually inspected redacted desktop/phone reveal screenshots: readable budget, recipient, own wishlist, save and private-link sections; no clipping/overlap. Evidence screenshot links are hidden.

Runtime local Node20.11.1 is below declared >=22; supported guest runtime tests remain release responsibility. This is local browser emulation, not physical-phone/team acceptance or hosted acceptance. No deploy/merge-main by coder.
