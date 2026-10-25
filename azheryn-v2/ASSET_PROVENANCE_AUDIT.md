# AZHERYN V2 — Visual asset provenance audit

Date: 2026-10-24
Status: PARTIAL / NOT RIGHTS-CLEARED

## Scope and methodology
This is a documentary review of GitHub repository references and the existing ASSET_RIGHTS.md, not a file-by-file visual examination or a legal clearance. The game's media under `azheryn-v2/public/` are excluded from the source-code MIT license. No unverified claim of ownership or AI-generated originality is made.

## Assets identified in existing documentation / code
| Asset or group | Evidence in repository | Provenance / rights status | Next verification |
| --- | --- | --- | --- |
| `public/intro/Fehe_original.jpeg` | Referenced by Fehe documentation and intro code | User-approved canonical reference, but original creator, source and permission evidence not independently verified | Obtain creator/source, original file history, permission or generation record |
| `public/characters/FEHE_CANONICA_13_PUNTAS.jpeg` | Referenced in Fehe documentation | Canonical derivative/reference relationship reported, but publication rights not independently verified | Compare hashes, identify creator and confirm authorized use |
| `public/intro/entrega_fehe_canonica.webp` | Documented in `FEHE_ENTREGA_G6_31_12.md` | Described as a composite using the approved Fehe crop and an existing guards background; rights depend on both source images | Record exact inputs, origin of background and composite authoring workflow |
| `public/intro/guardias.webp` | Named as an input in handoff composition documentation | Source and rights not independently verified | Identify source and permission/generation evidence |
| Other `public/intro/` and `public/characters/` files | Existing asset-rights notice lists intro illustrations and portraits | Not individually audited | Enumerate files and build provenance register with author, date, tool, inputs and license |
| Third-party dependencies | Existing `ASSET_RIGHTS.md` | Separate upstream licenses apply | Preserve notices and check distribution requirements |

## Publication checklist
- [x] Media excluded from the MIT code license in `ASSET_RIGHTS.md`.
- [x] Canonical Fehe source and derived composition references identified.
- [ ] Full inventory of every image, font, sound and video actually distributed.
- [ ] Evidence of creator and source for every media asset.
- [ ] Evidence of rights to publish all inputs and derivatives, including backgrounds.
- [ ] Check third-party marks, logos, fonts and music in screenshots and demo video.
- [ ] Confirm permission to publish and redistribute each asset in the public GitHub repository.
- [ ] Independent review of the final YouTube video and Devpost submission URL.

## Decision
Do not mark visual rights/originality audit complete. This audit is not evidence that any identified asset infringes rights; it documents that provenance has not yet been independently established. Do not claim 100% original or fully cleared media until the evidence above is available.
