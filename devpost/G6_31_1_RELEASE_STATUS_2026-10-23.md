# AZHERYN V2 — Devpost release candidate (2026-10-23)

- Candidate: **G6.31.1**, browser game, Chapter 1.
- Source of truth for this candidate: locally packaged `AZHERYN_V2_G6_31_1_COMPILACION_CORREGIDA.zip` (not yet uploaded to this repository).
- User reports the game works on Windows; G6.31 had a TypeScript tuple error, fixed in G6.31.1. **G6.31.1 compilation and end-to-end acceptance are still pending independent confirmation.**
- Scope: Mui and seven guards, forestry and paired log hauling, stockpile up to 264 logs, 91-log storehouse, bilingual interface, prologue, mission guide, and end-of-chapter epilogue.
- Future chapters (not implemented in this contest build): food systems, trades, villages, markets, kingdoms, and broader strategic mechanics.
- The Devpost Learn Skill Pack and `devpost/scope.md`, `devpost/prd.md`, `devpost/spec.md` already exist in this repository. Their contents should be reconciled with G6.31.1 before submission.

## Remaining gates
1. Upload current G6.31.1 source/assets to `azheryn-v2/` without replacing unrelated repository history.
2. Run `npm ci`, `npm run build`, and the available tests from `azheryn-v2/`; record actual results.
3. Review assets and third-party rights; choose and add an appropriate open-source license with owner approval.
4. Update README, scope, PRD, spec, and shipping checklist.
5. Capture a public video under three minutes and verify its URL.
6. Complete and submit the Devpost form before the deadline.

Do not describe unverified builds, tests, public deployment, or submission as completed.
