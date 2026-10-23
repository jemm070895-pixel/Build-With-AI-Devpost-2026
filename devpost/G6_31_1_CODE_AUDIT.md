# G6.31.1 — Code and narrative audit (2026-10-23)

## Findings

The code-only MIT candidate excludes graphical assets but still embeds protected-world terms and narrative passages in source files. This makes a blanket code-only release ambiguous for the owner's intended separation.

| File | Findings |
| --- | --- |
| `src/ui/IntroStory.tsx` | AZHERYN, Mui, Fehe, Forastero, Rey, Academia; introduction/story text |
| `src/ui/WorldView.tsx` | AZHERYN, Mui, Fehe; dialogue and gameplay text |
| `src/foundation/meta0.ts` | AZHERYN, Mui, Fehe |
| `src/world/characterHistories.ts` | Mui and character histories |
| `src/world/socialLife.ts` | Mui, Fehe and dialogue |
| `src/world/work.ts` | Mui |
| `src/world/terrain.ts` | AZHERYN, Mui |
| `src/world/saveSlots.ts` | Mui |
| `index.html` | AZHERYN |

These are **search hits**, not determinations of trademark status or infringement. Some are variable names; some are user-visible content. The distinction requires a line-by-line review.

## Publication gate

1. Keep the original full playable game and its graphics in a private repository.
2. For an MIT-only code package, move protected story/dialogue into separately licensed data, replace with neutral sample data, and remove restricted art imports. Preserve the private game's functionality.
3. Check the release's license scope and all third-party assets.
4. Run a clean install and production build on the exact public package, and check a fresh browser run.
5. Synchronize the audited code to the public repository only after the gates pass.

**Status:** code-only ZIP prepared, audit found embedded narrative; no claim of completed source synchronization, successful build, or Devpost submission.
