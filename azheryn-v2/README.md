# AZHERYN V2 — Chapter 1

A bilingual (Spanish/English) browser strategy game built for Build With AI — Devpost 2026.

Lead Mui and seven guards as they establish a woodland settlement, fell trees, transport logs in pairs and complete the first storehouse (91 logs). Chapter 1 ends there. Food systems, villages, markets, kingdoms and other mechanics are **future plans**, not features in this contest build.

## Run locally

Requires Node.js and npm.

```sh
cd azheryn-v2
npm ci
npm run build
npm run dev
```

Open the local address printed by Vite. The downloadable Windows package also includes a double-click launcher.

## Key mechanics

- Forest, tree cutting and continuous paired hauling
- Stockpile capacity: 264 logs
- 91-log storehouse; placement preview, rotation and roof visibility
- Time, weather, animals, mission journal and story replay
- Bilingual interface and end-of-chapter epilogue

## Audio and media

This Chapter 1 release has no in-game music, sound effects, or narration. The owner also confirms that the submitted gameplay video is silent. The illustrations were generated with ChatGPT following the owner's creative direction; the Fehe design is the owner's original creation. Individual image-generation records and any supplied references have not been independently audited. See [asset provenance audit](ASSET_PROVENANCE_AUDIT.md).

## Licensing

Original source code in the paths specified by [LICENSE](LICENSE) is MIT-licensed. Game media in `public/` and original fictional-world materials are **not MIT-licensed**; see [ASSET_RIGHTS.md](ASSET_RIGHTS.md). Third-party packages retain their own licenses.

## Submission status

The owner published the original G6.31.1 contest game to this public repository on 2026-10-23. The original Windows release was played and approved by the owner, and its production build completed successfully (Vite: 54 modules, 319 ms). A separate clean build of this public checkout is not claimed. The owner reports that the gameplay video was published to YouTube and the Devpost submission was sent on 2026-10-24. The video URL and submitted entry have not been independently reverified in this repository audit. A fresh GitHub-checkout Windows launch was also demonstrated by the owner on 2026-10-24; full automated test coverage is not claimed. See [final review](../devpost/FINAL_REVIEW_G6_31_1.md) and [shipping checklist](../devpost/checklist.md).
