---
doc: checklist
status: active
version: v2
---

# AZHERYN V2 — Build Checklist

Build mode: learn

## Devpost Learn Skill Pack
- [x] 1-start — project/repository initialized and Skill Pack installed.
- [x] 2-scope — contest scope reconciled with V2.
- [x] 3-prd — V2 PRD updated.
- [x] 4-spec — V2 technical specification updated.
- [x] 5-build — original G6.31.1 compiled on Windows, owner-tested and approved; final review, source map and learner reflection documented.
- [ ] 6-ship — pending until the contest slice is complete and verified.

## V2 build metas
- [x] META 0 — Base técnica V2.
- [x] META 1 — Mundo y geografía. First-pass G1 closed after build and human visual review; further visual polish is deferred until Chapter 1 works end-to-end.
- [x] META 2 — Tiempo y clima.
- [ ] META 3 — next first-pass development block.
- [ ] Later metas — first-pass only until Chapter 1 end-to-end.

## Chapter 1 end-to-end requirements
- [ ] Mui appears in the playable founding context.
- [ ] Seven former guards appear.
- [ ] Group can begin establishing itself in/near the clearing.
- [ ] Trees can be selected/acted upon for cutting.
- [ ] Cutting changes the physical world.
- [ ] Cutting produces wood.
- [ ] Cutting frees usable settlement space.
- [ ] Player can choose the first building location.
- [ ] Construction consumes/uses the required wood according to the implemented rules.
- [ ] Characters visibly/meaningfully perform the construction work.
- [ ] First warehouse/storage building reaches a functional state.
- [ ] End-to-end Chapter 1 can be demonstrated clearly.
- [ ] Performance is acceptable for the demo.
- [ ] User approves the contest slice visually/gameplay-wise.

## Contest polish
- [ ] Polish from G1 toward G2 where time allows without destabilizing the playable loop.
- [ ] Prepare a clear 1–3 minute demo path.
- [x] Verify public GitHub repository (original G6.31.1 source uploaded and core files checked on 2026-10-23).
- [ ] Verify public repo link is in Devpost “Try it out”.
- [ ] Prepare submission text.
- [x] Record learner's own Skill Pack reflection in FINAL_REVIEW_G6_31_1.md (must still enter it in the Devpost form).
- [ ] Complete required age-of-majority checkbox.
- [ ] Prepare/verify demo video and required presentation assets.
- [ ] Final submission review before October 26, 2026, 5:00 PM ET.
- [ ] 6-ship complete.

## Scope locks
Do not silently expand Chapter 1 beyond the public contest requirements above.

## Historical evidence
Earlier prototype history is retained privately.

## Shipping audit — 2026-10-23 (G6.31.1)
- [x] Owner confirms playable G6.31.1 works on Windows laptop.
- [x] Six Devpost Learn Skill Pack folders present in `.agents/skills/`.
- [x] Scope, PRD, spec and existing checklist present.
- [x] Public GitHub repository exists; standalone MIT utility modules published.
- [x] Record owner acceptance and learning reflection in **Final Review**, and publish technical **Code Tour and App Map**. Detailed mechanical checklist reconciliation remains open; do not mark 6-ship complete.
- [ ] Check learner-profile.md for private data before public release; inspect git history and intended files for secrets.
- [x] Sync original contest game source to public repository (owner push confirmed; key source paths checked). Independent public build and complete asset inventory remain unverified.
- [ ] Publicly accessible short video demonstrating real gameplay. A deployment does not replace the video.
- [ ] Ensure public repository URL is entered in Devpost's **Try it out** field.
- [ ] Learner personally writes submission name, description and answers; AI-generated draft is **not** a substitute under the 6-ship skill.
- [ ] Answer the required question on how the Devpost Learn Skill Pack was used, in learner's own words.
- [ ] Complete required exit survey and age-of-majority checkbox if shown in the submission form.
- [ ] Check the live Devpost form for exact fields and video constraints; do not assume 1–3 minutes is an official maximum.
- [ ] Submit before **2026-10-26 5:00 PM ET / 2:00 PM Arizona (MST)**.

Peer feedback, Discord posts and live deployment are **optional** per the installed 6-ship skill; no peer-review quota is required.

## Hands-on Checkpoints
- [x] Owner tested G6.31.1 on their Windows laptop and reported that the game works correctly (2026-10-23).
- [x] Historical per-slice learner checks not individually documented; accepted as a legacy-record gap. Final release check was performed by the owner.

## Final Review
- [x] Owner explicitly accepted the Windows G6.31.1 playable release.
- [x] Technical final-review evidence documented in [FINAL_REVIEW_G6_31_1.md](FINAL_REVIEW_G6_31_1.md).
- [x] Owner ran `npm run build` on Windows G6.31.1: Vite transformed 54 modules and built production output in 319ms; screenshot evidence supplied. Historical 280-test suite remains diagnostic and does not establish a clean 280/280 pass. A separate clean build of the public checkout is not claimed.
- [x] Document accepted exception: historical text-pattern and module-loading tests have inconsistent results across invocation contexts; original release acceptance rests on successful Windows production build plus owner gameplay review. See [FINAL_REVIEW_G6_31_1.md](FINAL_REVIEW_G6_31_1.md).

## Code Tour and App Map
- [x] [app-map.html](app-map.html) published as the technical source tour.
- [x] Owner's learning reflection was received and recorded verbatim in [FINAL_REVIEW_G6_31_1.md](FINAL_REVIEW_G6_31_1.md).
- [x] Learning wrap-up satisfied through the documented app map and owner's own reflection; no separate hands-on code tour is claimed.

## Revisions
- 2026-10-23: Retrospectively reconciled the legacy G1/G3 checklist with the owner-approved G6.31.1 release without fabricating historical per-slice checks.
- 2026-10-23: Public original game upload verified; technical suite still requires classification and a reproducible build. Do not mark Skill 5 complete solely because the game launched successfully.

## Post-submission evidence update — 2026-10-24
- [x] Owner reports final Devpost submission sent and YouTube gameplay video published (2:59, unlisted); independently verifying the URLs remains open.
- [x] Owner supplied screenshot of the game running from the GitHub-downloaded Windows checkout, with English UI and playable map; owner reported everything worked.
- [ ] Audit each published image/media file for origin, generation method, third-party rights, and permitted public redistribution. ASSET_RIGHTS.md is a scope notice, not provenance proof.
- [ ] Independently verify submitted Devpost page and linked demo video.
- [ ] Close Skill 6 only after its remaining required evidence and learner-owned tasks are confirmed; do not claim completion based solely on submission.

## Consolidated remaining checks — 2026-10-24
This section supersedes older **pending-to-submit** wording above; older entries remain as historical snapshots rather than being silently rewritten.

**Completed / owner-confirmed:**
- [x] Devpost entry submitted, as reported by owner (entry ID 1258683); the entry's public URL and form fields have not been independently re-opened.
- [x] Gameplay video uploaded to YouTube and linked in submission, as reported by owner; runtime 2:59 and video is unlisted. Its exact URL has not been independently re-opened.
- [x] Owner launched the public GitHub checkout on Windows and accepted the English HUD/gameplay.
- [x] Owner confirms no music, sound effects or narration in either the game or the submitted video; audio-rights checks are not applicable to this release.
- [x] English README includes launch instructions, owner-designed Fehe, ChatGPT-assisted illustration provenance, and rights boundary; root LICENSE now points to the correct `azheryn-v2/ASSET_RIGHTS.md` path.
- [x] Documented internal derivation: founder portrait sheet to eight portraits; approved Fehe illustration to delivery-scene composite. No identified third-party visual source in the examined project documentation.

**Outstanding, do not claim completed:**
- [ ] Obtain a recursive list of the **current public GitHub** media tree and reconcile it against release-archive inventories (20 images in original G6.31.1; 22 in later G6.31.19). Current binary tree not independently enumerated.
- [ ] Examine original generation prompts, any uploaded reference images and editing inputs, where available, for individual provenance; no copying or infringement has been identified, but exclusivity and third-party clearance are not conclusively established.
- [ ] Independently view the submitted video for visual overlays, stock clips, editor templates or other externally sourced media. Owner reports the video is silent.
- [ ] Independently open the Devpost entry and unlisted YouTube URL and confirm links/English form answers, if accessible. Do not request a new video or a new submission.
- [ ] Review repository files/history for accidentally committed secrets or private data. Indexed search alone is not a comprehensive history scan; common learner-profile paths were not present when checked.
- [ ] Verify remaining learner-owned Skill 6 fields (reflection in submitted form, age/exit survey if required) against the actual submission record before marking 6-ship closed.

**Release rule:** Do not alter accepted Chapter 1 gameplay or replace images solely because generation records are unavailable. Any future claim of full rights clearance requires evidence, not inference.

## Submitted YouTube URL and local video review — 2026-10-24
Owner provided exact YouTube URL: https://youtu.be/DTPEt2LiVW4 (video ID `DTPEt2LiVW4`). Direct YouTube access through the available web fetch was blocked; independent online playback and verification that the Devpost entry embeds this exact URL remain open.

A local file available in the working environment, `VIDEO-GAME AZHERYN.mp4`, was inspected. FFprobe reports 179.6 seconds, H.264 video at 1916x986 and an AAC audio stream. FFmpeg audio `volumedetect` reports mean and maximum -91.0 dB, consistent with near-silence. Thirteen sampled frames (0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165 and 178 seconds) show AZHERYN V2 title, Fehe/prologue, forest gameplay, NPCs, wood collection and the storehouse. No obvious external stock footage, watermark, or third-party overlay was observed in those sampled frames. This is a sampled visual inspection, not full-frame clearance. The local file has **not** been byte-for-byte or otherwise independently matched to the hosted YouTube video.

**Video pending item 3:** local 2:59 video inspected, with no apparent third-party visual material in sampled frames; online video identity, full frame-by-frame review and any editing project/source materials remain unverified. Do not claim the hosted YouTube video has been directly inspected.

## Live external verification attempt — 2026-10-25
- Owner-provided exact YouTube demo URL: https://youtu.be/DTPEt2LiVW4 (video ID `DTPEt2LiVW4`). Preserve this exact link. The user previously reported that the 2:59 video was uploaded unlisted and included in the submitted Devpost entry.
- The live Devpost event listing identifies `Build With AI: Basics` with an October 26, 2026 deadline; the competition page is not proof of the user's submission status.
- Public search for `AZHERYN` plus Devpost/Build With AI did not surface a matching indexed project. Direct attempts to open the guessed `https://devpost.com/software/azheryn` page and the user-provided YouTube URL were inaccessible from the external page reader. A guessed Devpost slug is **not** an established project URL.
- The prior local `VIDEO-GAME AZHERYN.mp4` inspection supports a silent ~2:59 game demo with no obvious outside visual assets in sampled frames, but identity with the published YouTube upload has not been independently proven.
- The owner-reported submitted entry ID `1258683` is retained as testimony; a submission ID alone does not establish the actual public project page or all required form answers.
- **Pending:** obtain the exact Devpost project page URL or a screenshot of the submitted project form, then verify its GitHub link, YouTube link, English content and required responses. Do not submit again or edit the accepted game merely to address an access limitation.

## Exact Devpost project page supplied — 2026-10-25
- Owner provided the actual project URL: **https://devpost.com/software/azheryn-v2-chapter-1**. This supersedes previously guessed project slugs.
- Owner supplied an iPhone Safari screenshot visibly displaying the project page titled **AZHERYN V2 — Chapter 1**, its English short description, an embedded YouTube video, and the `Story` / `Inspiration` section. This is strong owner-provided visual evidence of the live project presentation.
- The submitted YouTube video URL was separately provided by the owner: https://youtu.be/DTPEt2LiVW4.
- The external web reader could not retrieve the Devpost project page, and a targeted search returned no indexed result; therefore the entire Story, the Try it out GitHub destination, the submission status/history and private form answers have **not** been independently verified. Do not infer them from the screenshot.
- **Next owner evidence needed:** screenshot or copied text of the Devpost `Try it out` section and, if desired, the submission-history/status panel. Do not request another submission.
