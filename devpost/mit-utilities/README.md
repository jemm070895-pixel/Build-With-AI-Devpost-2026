# MIT utilities — independent code release

Reusable TypeScript modules derived from AZHERYN Chapter 1:
- `src/noise.ts`: procedural noise and terrain helpers.
- `src/treeFruits.ts`: deterministic fruit variety and Fibonacci-angle distribution.

No game illustrations or narrative assets are included in this directory. This **is not the complete G6.31.1 game**.

## Verify

Requires Node.js 22.16+ with TypeScript type stripping:

```sh
node --experimental-strip-types test/smoke.mjs
```

The separately packaged local modules passed 7/7 smoke checks on 2026-10-23. The GitHub directory's smoke test currently checks four noise assertions; the published fruit module must be tested with an expanded suite before claiming equivalent 7/7 results.

## Licensing

Original code in this folder is MIT-licensed; see `LICENSE`. The AZHERYN fictional universe, original media and future chapters are outside this release.

## Devpost status

The full game G6.31.1 has not yet been synced to GitHub. Its local `npm ci --offline` failed in the validation environment because Vite 8.3.2 was not cached, **not** because a TypeScript compile error was found. Build and browser acceptance remain unverified here.
