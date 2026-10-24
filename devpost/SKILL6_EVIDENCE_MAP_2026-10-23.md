# Skill 6 — evidence map and final demonstration checks

Date: 2026-10-23. Technical preparation only. No video captured or Devpost form submitted.

## What is evidenced
| Topic | Code / evidence | Status |
|---|---|---|
| Browser game and core loop | `azheryn-v2/README.md`, `src/ui/WorldView.tsx` | Published source; owner approved Windows gameplay |
| Successful local production build | `devpost/FINAL_REVIEW_G6_31_1.md` | Owner supplied successful build screenshot; not independently rerun on public checkout |
| Seven guard personality profiles | `src/world/work.ts`: `G1_FOUNDING_WORK_PROFILES` | Confirmed code |
| Task priorities and hauling pairs | `src/world/work.ts`: `chooseG1Haulers`; `src/ui/WorldView.tsx` | Confirmed call site |
| Rest and fatigue | `src/world/work.ts`: `g1FatigueDecision`; `src/ui/WorldView.tsx` | Confirmed call site |
| Social trust and complaints | `src/world/socialLife.ts` | Confirmed code; not generative AI |
| Autonomous construction eligibility | `src/world/socialLife.ts`: `autonomousConstructionDecision`; `src/ui/WorldView.tsx` | Confirmed call site |
| Nearby sharing of work knowledge | `src/world/work.ts`: `g1ShareWorkKnowledge`; `src/ui/WorldView.tsx` | Confirmed call site |
| Animal motion and avoidance | `src/world/peacefulWildlife.ts`: `animalAvoidance`; `src/ui/WorldView.tsx` | Confirmed visual behavior code |
| Human-AI collaboration | `devpost/scope.md`, `prd.md`, `spec.md`, `checklist.md`, `FINAL_REVIEW_G6_31_1.md` | Project process evidence; learner must describe in own words |
| Future Academy / leadership loss | Learner-authored long description | **Vision only**; not claimed as playable |

## Capture checklist for the owner, after recording begins
- Show the playable original, not a code slide.
- Verify Mui and seven guards appear and the world is responsive.
- Show an actual logging action and two-person log movement.
- Show stockpile and warehouse progress; show completion if practical.
- If visible naturally, include an autonomous guard decision, rest or animal reaction.
- Keep actual video under the time limit shown by Devpost and verify accessible playback.
- Avoid exposing account information or personal notifications.

## Submission blockers
1. Learner's own short description and form answers, plus exit survey.
2. Actual short video and publicly accessible link.
3. Actual Devpost form fields, eligibility checkbox and submission.
4. Full public repository tree/history privacy review (not yet verified).

## Important accuracy boundary
`devpost/spec.md` still contains early META 1.2 language despite the later approved G6.31.1 build. It is historical planning documentation, **not** a current-release inventory. Prefer the release README, Final Review and this evidence map for current features. The historical unchecked META 3 / Chapter 1 task list in `devpost/checklist.md` is not proof those features are absent; it has not been individually reconciled. Do not mark unverified checklist items complete.

No game code was changed.
