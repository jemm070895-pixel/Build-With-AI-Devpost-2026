# Audit of existing NPC and wildlife autonomy — 2026-10-23

## Scope
Source review of the published G6.31.1 game. This is a **code inspection**, not a new gameplay or build test. No game code was modified.

## Confirmed and integrated into the game
- **Individual worker traits:** seven guard profiles with steady, orderly, helpful or reluctant traits, and different fatigue limits and recovery rates (`src/world/work.ts`).
- **Work decisions:** workers select hauling partners according to priorities; available guards can be assigned to cooperative two-person hauling; fatigue may trigger rest and interrupted work (`src/world/work.ts`, invoked in `src/ui/WorldView.tsx`).
- **Autonomous construction decisions:** idle guards may join construction when not exhausted or in severe social protest; this is called in `WorldView.tsx` (`src/world/socialLife.ts`).
- **Social state:** trust in Mui, resentment, complaints, group mood and deterministic dialogue choices (`src/world/socialLife.ts`). Some behaviors are advisory or presentation-only; direct orders remain dominant.
- **Knowledge sharing:** nearby characters exchange time-bounded work knowledge, called in `WorldView.tsx` (`src/world/work.ts`).
- **Wildlife:** deer, rabbits and birds follow independent deterministic paths and visually avoid nearby people; `animalAvoidance` is invoked from `WorldView.tsx` (`src/world/peacefulWildlife.ts`).

## Limits and precise terminology
- This is **rule-based autonomous agent behavior**, with scripted decisions and state, not evidence of an integrated generative AI model, machine learning, natural-language reasoning, or self-learning NPCs.
- Some exported helpers (e.g. `chooseG1AutonomousOpportunity`, `chooseG1SpontaneousHelper`) were **not found called by name** in `WorldView.tsx`; do not advertise them as live features merely because functions exist.
- Wildlife avoidance is expressly **visual-only**; no hunting, predator behavior or ecological learning is claimed.
- Leadership loss and advanced independent character learning are future narrative goals, not verified Chapter 1 mechanics.
- No need to add external AI API before submission just to claim existing NPC autonomy. Demonstrate real, observable decisions and describe them accurately.

## Recommended no-risk demo evidence
Show a guard resting after fatigue, guards working together on one log, idle guards joining construction, and animals avoiding nearby humans if these are visible in the owner's approved build. The learner should verify each action during capture; do not claim a scene was recorded without evidence.

## Status
Code review completed; original game code unchanged; production build acceptance from owner remains intact. No new local gameplay tests were run in this audit.
