# Skill 5 reproducibility audit — 2026-10-23

Source: owner-approved original G6.31.1 contest ZIP, extracted unchanged for this audit.

## Build check
- `azheryn-v2/package.json`: `npm run build` executes `tsc --noEmit && vite build`.
- Dependencies include React 19, TypeScript 6 and Vite 8.
- `npm ci --offline --no-audit --no-fund` failed with `ENOTCACHED`: Vite 8.3.2 tarball was not present in this environment's npm cache.
- This does **not** establish a TypeScript or gameplay failure. No successful clean build was obtained here.

## Historical tests
- Historical local audits reported differing results (231/280, 220/280, 204/280) depending on package, working directory and invocation.
- A further direct run of `node scripts/run-all-tests.cjs` from the extracted original was stopped after exceeding the execution time budget; its partial output is not a complete pass/fail result.
- Many tests use exact source-text regular expressions, so a failing assertion is not necessarily a functional regression. None of the old failures have been reclassified as passed.

## Owner acceptance
- The owner personally tested G6.31.1 on Windows and confirmed the game worked well.
- The full original was subsequently pushed to the public GitHub repository, and key source paths plus the Devpost Learn Skill Pack were checked.

## Closeout
The technical map, owner's feedback and learning reflection are recorded. The mechanical build evidence is **incomplete in this isolated environment**, so Skill 5 must not be represented as fully mechanically verified. Do not destabilize the accepted original solely to satisfy obsolete text-pattern tests.

Recommended final verification on the owner's already working Windows installation: `npm run build`, with exit code 0, followed by preserving the output. This is one check, not a request to replay the game.
