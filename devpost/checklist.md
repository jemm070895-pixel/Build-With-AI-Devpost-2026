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

## Owner screenshot: Devpost Try it out and submitted contest — 2026-10-25
- Screenshot shows the exact project page's **Built With** tags: canvas, chatgpt, github, github-copilot, html5, javascript, react, typescript, visual-studio-code, vite.
- **Try it out** displays a clickable **GitHub Repo** link. Its precise destination is not exposed in the screenshot and is not independently verified.
- **SUBMITTED TO** visibly identifies **Build With AI: Basics**, shows a time-to-submit notice and an **Edit hackathon submission** control. This is owner-supplied visual evidence that the project is associated with an editable hackathon submission; it is not a view of private required answers or a guarantee of judging eligibility.
- Remaining checks: confirm the GitHub Repo hyperlink destination; review repository secret/privacy exposure and any required private submission fields, including Skill 6, without exposing sensitive values.

## GitHub link opened from Devpost — owner photo, 2026-10-25
- Owner followed the **GitHub Repo** link on the Devpost project and photographed the resulting browser page. The visible repository breadcrumb is `jemm070895-pixel / Build-With-AI-Devpost-2026`, with GitHub's **Public** badge.
- This is direct user-provided visual confirmation that Devpost's GitHub Repo link opens the intended public repository. Mark the project-to-repository destination check **confirmed**.
- The photo does not establish repository history-wide secret scanning, all private Devpost form responses, or Skill 6 completion; retain those as final audit checks.

## Submitted status confirmed in Devpost edit wizard — owner photo, 2026-10-25
- Owner's photo of the Devpost `submit-to/30447-build-with-ai-basics/...` edit wizard displays **AZHERYN V2 — Capítulo 1**, green status **ENVIADO** (submitted), and **5 de 5 pasos realizados** (five of five steps completed).
- Current wizard page is **Detalles del proyecto** with a populated `Sobre el proyecto` Story field in English (begins with `## Inspiration`). This is direct visual confirmation of submitted status and completed wizard steps, not merely an association with the contest.
- The screenshot does not show the content of all five steps, so exact eligibility answers and any Skill 6/exit survey requirement remain unverified. Continue read-only review of remaining wizard steps; do not resubmit or change fields without necessity.

## Final Devpost additional-information screenshots — 2026-10-25
- Owner provided screenshots showing AI cost limitation answer, agent confidence `4`, qualitative feedback, open-source-license URL field, value-to-user answers, Learn Skill Pack explanation, and both required age/eligibility checkboxes **checked**. The form was already marked `ENVIADO` and `5 de 5 pasos realizados`.
- License field visually starts `https://github.com/jemm070895-pixel/Build-With-AI-Devpost-2026/blob/main/azheryn-v2/LICE...`. Live GitHub fetch **confirmed** `azheryn-v2/LICENSE` exists and contains the MIT license, followed by a scope notice excluding game images/media and fictional universe. Root `LICENSE` also exists. Exact end of the field is cut off in the photograph, so the full submitted URL is not verified byte-for-byte.
- Eligibility boxes are confirmed checked; truth of underlying eligibility and precise Skill Pack usage cannot be independently proven by screenshots. The explanation field visibly begins `I used the Devpost Learn Skill Pack to define scope, write planning documents, organize requireme...`.
- One question `¿Cuál de estos usaste realmente?` is answered `Ninguno`, while the public Built With tags include ChatGPT and GitHub Copilot. This could be different category options, so do **not** assert inconsistency without viewing the selectable options.
- Final technical security audit remains limited: prior indexed secret search and `.gitignore` checks are not a full commit-history or dependency scan. No claim of comprehensive security certification.

## Current default-branch indexed secret check — 2026-10-25
- Searched GitHub's default-branch code index for `sk_live_`, `ghp_`, `github_pat_`, `AKIA`, `PAYPAL_API_KEY`, `OPENAI_API_KEY`, and `password=`: **zero indexed results** for each. These are targeted searches, not proof of absence of secrets.
- Search for `BEGIN PRIVATE KEY` returned two hits, but direct inspection of both current file contents (`devpost/checklist.md`, `azheryn-v2/src/ui/IntroStory.tsx`) showed **no actual private-key delimiter**. Treat as search-index false positives/approximate matches, not a discovered secret.
- Root `.gitignore` explicitly ignores `.env` and `.env.*` except `.env.example`.
- `.env` query matches are references in docs/source, not by themselves evidence of a committed environment file.
- **Limitation:** attempted full Git clone from the execution container failed because outbound DNS could not resolve `github.com`. A complete historical blob scan, branch inventory and dependency vulnerability scan have **not** been completed. Do not mark repository security 100% certified. Recommend enabling GitHub secret scanning and push protection where available, and scanning all history locally before final security signoff.

## Commit and branch audit expansion — 2026-10-25
- GitHub commit search returned **98 recent commit records** in the accessible repository; this is a result count, not proof of exhaustive history enumeration.
- Branch search returned **35 branches**: `main`, 17 dated `lec/laboratorio-*` branches and 17 dated `lec/respaldo-*` branches (Oct 8–24). A branch-history exposure review must include these, not only main.
- Fetched and inspected diffs for the **eight most recent commits** (`e1f8685a`, `f798ec7f`, `ee0c7f1a`, `d8e432d9`, `b3a8a25e`, `bd75bdd6`, `f77b5bf2`, `ea3b5d6f`). No exact-pattern private-key delimiters, `ghp_`/`github_pat_` tokens or AWS AKIA identifiers detected in those eight diffs. This is not a scan of all 98 commits or all branches.
- An attempted larger batch exceeded connector call limits. Historical scanning remains incomplete. Do not claim full certification or 100% completion.


## Security audit continuation — 2026-10-25
- GitHub connector confirms repository visibility `public`, default branch `main`, and administrative access for the connected account.
- Branch search returned 35 named branches: `main`, 17 `lec/laboratorio-*` and 17 `lec/respaldo-*`. Branch contents and full histories are **not** yet individually scanned.
- Commit search returned recent commit references. Six newest commits (`161827050`, `e1f8685a7`, `f798ec7f1`, `ee0c7f1`, `d8e432d95`, `b3a8a25e`) were fetched and each changes only `devpost/checklist.md` according to the returned commit file lists. Pattern matches for secret-like words in two diffs refer to audit documentation and are **not evidence of exposed credentials**; no actual secret was confirmed in this sample.
- Earlier indexed searches for common token/key patterns and `.gitignore` checks were documented previously; those are not a complete scan of history, other branches, binaries, GitHub Actions secrets, or dependency vulnerabilities.
- **Status: OPEN.** Do not claim all commits/branches clean or GitHub security settings verified. No gameplay, media, license, or Devpost submission changes authorized.


## Security audit — branch comparison and dependency inventory (2026-10-25)
- Compared all 34 non-main branches against `main`: 17 `lec/respaldo-*` branches are behind with zero ahead commits; 17 `lec/laboratorio-*` branches diverge with one ahead commit each, affecting a dated `90_AA_REVISION/LABORATORIO/*.md` file. This is a branch-difference check, not a complete historical content scan.
- Retrieved the 17 dated laboratory Markdown files from their respective branch refs (October 8–24). Pattern checks for private-key blocks, common token prefixes, AWS access-key IDs and password assignments found **zero matches**. This does not rule out unrecognized secret formats or private information.
- Confirmed `azheryn-v2/package.json` and `azheryn-v2/package-lock.json` are accessible. Direct dependencies are React and React DOM; development dependencies include TypeScript, Vite and the React plugin. No `npm audit` or GitHub Dependabot alert API result was obtained; vulnerability status remains **unverified**.
- `.github/dependabot.yml` and `.github/workflows/ci.yml` were not accessible at the requested paths; absence of these specific files does not establish absence of security tooling or workflows under other filenames.
- **Still open:** full historical commit scan, dependency advisory audit, repository security settings/secret scanning, personal data inspection and other file paths. No confirmed credential leak in the inspected samples. Do not modify submitted game or Devpost materials.


## Security audit — recent commit history and GitHub Actions (2026-10-25)
- Retrieved and checked the diffs of the **100 most recent commits** returned by GitHub commit search, using pattern checks for private-key PEM headers, GitHub token prefixes, live payment token prefixes and AWS access key IDs. **No matches** in those diffs. This is a bounded 100-commit sample, not a complete all-time repository history or exhaustive secret detector.
- Verified actual workflows in `.github/workflows/`: `aa-lf-informe-diario.yml`, `lec-laboratorio-copia.yml`, `aa-auditoria-universal.yml`. Earlier attempts to fetch `ci.yml` were not an inventory of all workflows.
- `aa-lf-informe-diario.yml` and `lec-laboratorio-copia.yml` explicitly request `contents: write`; `aa-auditoria-universal.yml` requests `contents: read` and `issues: write`. All use `actions/checkout@v4`; audit workflow also uses `actions/upload-artifact@v4`. No `secrets.*` references or `pull_request_target`/`workflow_run` triggers were found in these three files. Permissions may be necessary for intended operations; they should be reviewed for least privilege after submission.
- **Open/unverified:** full history beyond 100 retrieved commits, dependency vulnerability advisories (`npm audit`), GitHub secret-scanning/branch-protection settings, and sensitive data beyond known patterns. No changes made to gameplay, licensing, assets, or Devpost submission.


## Security audit — workflow behavior and release safeguards (2026-10-25)
- Inspected complete current content of all three identified workflows. `lec-laboratorio-copia.yml` runs on a daily schedule or manual dispatch, checks out full history, creates a backup branch and a separate laboratory branch, and pushes the laboratory branch using `--force-with-lease`. Its requested `contents: write` is consistent with branch creation; the workflow does not directly push to `main` in the inspected commands.
- `aa-lf-informe-diario.yml` is manually dispatched, writes a dated documentation report and uses `git pull --rebase` and `git push` on the checked-out branch. Its `contents: write` is operationally relevant, but review whether direct writes to `main` should require approval after the contest.
- `aa-auditoria-universal.yml` triggers on `push`, manual dispatch and a daily schedule. It checks repository files, uploads an audit artifact and may create a GitHub issue using the automatically provided `${{ github.token }}`. It requests `contents: read` and `issues: write`, consistent with these tasks. Consider trigger scoping, branch protection and permissions review after the submission.
- None of the three workflows explicitly references `secrets.*` or uses `pull_request_target`. Third-party GitHub actions are referenced by version tags (`actions/checkout@v4`, `actions/upload-artifact@v4`), not immutable commit SHAs; pinning may improve supply-chain resilience in a future maintenance pass.
- `.gitignore` contains `.env` and `.env.*` patterns and ignores `devpost/learner-profile.md`, but ignore rules do not erase already committed history. No GitHub branch-protection or secret-scanning settings could be verified with the currently available connector actions.
- Combined commit status API for the documentation update returned an empty status list; this does **not** establish that all GitHub Actions checks passed or failed. No `npm audit` execution or vulnerability advisory result has been obtained.
- Security recommendation only; no release code, license, assets or submission changed.


## Security audit — dependency advisory finding (2026-10-25)
- Read `azheryn-v2/package-lock.json` (lockfile v3): 49 package entries; all recorded `resolved` URLs use `https://registry.npmjs.org/`; all downloadable entries with a `resolved` URL have integrity metadata. One optional `fsevents` package declares an install script. These are supply-chain inventory checks, not proof that dependencies are free of vulnerabilities.
- Locked versions include `vite@8.3.2`, `react@19.3.0`, `react-dom@19.3.0`, `typescript@6.0.3`, and `@vitejs/plugin-react@6.1.1`.
- **Confirmed actionable advisory match:** `vite@8.3.2` is within the affected range for GitHub-reviewed GHSA-rq7h-c2jc-7f22 (file access outside configured allowlist under certain project path conditions; fixed in Vite 8.3.3), and GHSA-9jrq-w75r-8gcw (cross-origin script execution through Vite custom middleware; fixed in Vite 8.3.3). References: https://github.com/advisories/GHSA-rq7h-c2jc-7f22 and https://github.com/advisories/GHSA-9jrq-w75r-8gcw . Both primarily concern development-server exposure; exploitability for this game's configuration has **not** been established.
- **Recommended post-submission remediation:** update Vite to a currently patched compatible version (at least 8.3.3), regenerate lockfile, run `npm audit`, TypeScript/build/test suite and Windows/mobile smoke tests, and review dev-server exposure. Do not change the submitted game without explicit authorization.
- Full `npm audit` and GitHub repository secret-scanning/branch-protection status remain unverified. No gameplay, assets, license or Devpost submission changed in this audit.


## Skill 6 — shipping walkthrough closure (2026-10-25)
**Status: CLOSED as a guided submission milestone**, based on the owner's Devpost screenshots and previously documented evidence. This closure does not certify repository security, judging eligibility or external link accessibility.

- Final approved Chapter 1 game was built and tested by the owner on Windows; code and release documentation are present in the public GitHub repository.
- Public GitHub project link was confirmed from the Devpost submission by owner-provided browser screenshots.
- The owner supplied a demo video URL: https://youtu.be/DTPEt2LiVW4 . The URL was provided and recorded; this update does not independently verify anonymous playback, duration or exact video content.
- The project owner supplied original long-form project wording; the Devpost screenshots show the submitted project Story and other filled answers. The exact authorship of every individual submitted field was not independently audited.
- Devpost screenshots show the official project `AZHERYN V2 — Capítulo 1`, status **ENVIADO**, **5/5 steps complete**, and checked eligibility controls; additional-information responses were also visible. These are evidence of completion of the submission workflow, not a guarantee of eligibility or judging outcome.
- The original 6-ship skill has no mandatory peer review, Discord post or deployment requirement. The guided shipping process can therefore be closed without those optional activities.
- **Separate OPEN security follow-up:** complete dependency vulnerability audit, evaluate Vite 8.3.2 advisories and fix after explicit authorization/testing, verify GitHub branch protections/secret scanning, and review history beyond the sampled 100 commits. The 6-ship closure does not supersede these outstanding checks.
- Older `SKILL6_PREVIDEO_PREPARATION.md`, `SKILL6_EVIDENCE_MAP_2026-10-23.md`, and `LEARNER_AUTHORED_DESCRIPTION_2026-10-23.md` contain historical pre-submission pending statements; this dated entry supersedes their shipping-status statements without rewriting their history.
- No game source, license, media or Devpost submission was changed.


## Skill 6 — precise evidence correction (2026-10-25)
- On re-review, the owner's Devpost screenshots **do confirm** a populated project description, multiple additional-information responses, and two checked age/eligibility checkboxes, as well as submitted status `ENVIADO` and 5/5 submission steps.
- **Not independently established:** whether a distinct required *exit survey* was completed, or whether the additional-information questions shown are the entire exit survey. Five completed Devpost steps alone do not prove a separate survey requirement was met.
- Consequently, Skill 6 is **closed for the verified submission workflow**, but its exit-survey subrequirement is **unverified and must not be represented as independently confirmed**. If the official flow has a separate exit survey, the learner should check its completion status. This note refines the previous dated closure without changing game code, submission fields, license or assets.


## Devpost exit survey — owner confirmation (2026-10-25)
- The project owner reported completing and submitting the separate Devpost/ChallengePost Wufoo exit survey for **Build With AI: Basics**.
- The survey included occupation, prior hackathon participation, motivations, approximate time spent, primary AI use, optional experience feedback and feedback-session preference.
- **Evidence level:** owner attestation in conversation; a post-submit confirmation screen or independent receipt was not reviewed. This resolves the previous *owner-confirmation pending* item, without claiming independent verification.
- The guided submission and exit-survey steps are reported complete. Security follow-ups (including Vite advisories) remain open and separate.
- No changes to game code, license, assets, or Devpost submission.


## Security audit continuation — 2026-10-25 (read-only verification)
- Queried GitHub's recursive `main` tree: **548 entries**, `truncated=false`. No paths resembling `.env`, private keys, passwords or credentials were present in the enumerated tree. This is a filename check, not a content or historical secret scan.
- Identified **two** Vite lockfiles using `vite@8.3.2`: `azheryn-v2/package-lock.json` (49 package entries, previously audited) and `azheryn-app/package-lock.json` (71 package entries). Both need advisory remediation assessment; do not change submitted source without owner approval.
- Queried the repository rulesets API: empty list `[]`. Branch-protection endpoint returned HTTP 403 `Resource not accessible by integration`; protection status cannot be independently established from this connection.
- Latest workflow run for documentation commit `6d6a2e4f21766bf84dfc5d13ff5b8f26ac0b8bc9` was `completed/success` (`AA - Auditoria universal segura`, run 40176155649). Inspected its workflow definition: it inventories files and checks selected CSVs, but does **not** perform `npm audit`, secret scanning, dependency CVE scanning, or comprehensive code security testing. Its success is not a clean security audit.
- **Security status: NOT 100% VERIFIED.** The earlier 97% was a progress estimate, not a quantified security assurance. Remaining blockers: execute `npm audit` for both projects, assess/patch Vite and retest; scan full commit history and all relevant files for secrets; verify branch protection and secret scanning with an account possessing permissions; perform reproducible clean build and code/dependency checks. Preserve submitted version unless explicitly authorized to modify.


## Security audit — both lockfiles integrity/origin check (2026-10-25)
- Parsed both lockfile v3 inventories from current default branch: `azheryn-v2` **49** package entries and `azheryn-app` **71** entries (120 combined entries, not necessarily 120 unique packages).
- For both inventories: **zero** downloaded package entries missing `integrity`; **zero** `resolved` download URLs outside `https://registry.npmjs.org/`.
- Both inventories declare `hasInstallScript` only for `node_modules/fsevents` (optional macOS filesystem dependency); this is not an executable script audit.
- Both inventories lock `vite@8.3.2`, previously identified as affected by advisories fixed in 8.3.3. No package updates or build execution performed.
- Attempted isolated shallow clone for deeper local testing, but runtime cannot resolve `github.com`; therefore `npm audit`, history scan and local build remain unexecuted. Do not label this as 100% security verified.


## Security audit — application surface and launcher inspection (2026-10-25)
- Recursive tree: 505 blobs among 548 tree entries. Filename-pattern inspection found no obvious `.env`, private-key or credentials filenames (generic `tsconfig.json` paths were false-positive matches for `config.json`). Filename-only checks cannot establish absence of embedded credentials.
- Reviewed `azheryn-v2/public/sw.js`: GET-only, same-origin and scope-restricted service-worker cache logic; no obvious cross-origin interception in reviewed source. Cache-first static assets may remain stale after updates, so a versioned cache change is advisable with a future patched release.
- Reviewed `src/world/saveTransfer.ts`, `saveRecovery.ts`, `saveSlots.ts`: imported JSON limited to 8,000,000 characters in `decodePortableSave`, guarded by schema checks; storehouse coordinates and progress require finite numbers. `isUsableChapterSave` validates essential character fields but not all nested arrays, lengths or element shapes. This is a **validation-hardening opportunity**, not proof of an exploit.
- Reviewed `INICIAR_JUEGO_WINDOWS.bat`: local-only `127.0.0.1` dev server; it builds before launch, but launches Vite dev mode, exposing the previously identified development-server advisory to the local host context. `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat` serves built output through Vite preview bound to `0.0.0.0` for trusted local Wi-Fi and explicitly warns to use private networks. Preview is not a hardened public production server; avoid public/untrusted network exposure.
- No source, license or launchers changed. No dynamic tests or full-history scans were performed; 100% security certification remains unavailable.


## Security audit — targeted application sink review (2026-10-25)
- Attempted broad per-file scan through GitHub connector; connector execution hit its maximum tool-call limit, so **no full-codebase scan is claimed**.
- Independently inspected targeted text search for high-risk patterns in `azheryn-v2/src/App.tsx`, `src/main.tsx`, `src/ui/IntroStory.tsx`, `src/ui/WorldView.tsx`, `src/world/saveTransfer.ts`, `src/world/saveSlots.ts`, `azheryn-app/src/main.tsx`, and `azheryn-v2/scripts/preflight-offline.cjs`.
- In the checked source files, no literal `dangerouslySetInnerHTML`, `.innerHTML`, `eval(`, `new Function(`, or `fetch(` matches were found. This is only a limited string-pattern review; other network and injection mechanisms were not exhaustively ruled out.
- `WorldView.tsx` includes 12 `localStorage` references and one `URL.createObjectURL` reference; `IntroStory.tsx` references both `localStorage` and `sessionStorage`. These are not vulnerabilities by themselves; full data-flow review remains open.
- `scripts/run-all-tests.cjs` imports `child_process`; test harness process execution is expected, but shell invocation arguments were not exhaustively reviewed.
- Security status remains open: dependency audit, full content/history secret scan, remediation and dynamic verification are still outstanding. No game code modified.


## Security audit — save import/export data-flow review (2026-10-25)
- Read actual `WorldView.tsx` import/export call sites (lines 41–70). Imported files are checked for size <=8,000,000 bytes, parsed through `decodePortableSave`, confirmed by the player before overwriting local progress, installed with backup preservation, then the page reloads. The exported file is created from validated local save JSON using `Blob` + `URL.createObjectURL`, and the object URL is revoked after one second. No remote upload occurs in this reviewed flow.
- Manual save snapshot (around lines 266–270) writes character/world progress and camera data to localStorage. No authentication secrets or remote endpoints were evident in this specific path.
- `IntroStory.tsx` stores language choice in localStorage and intro progress in sessionStorage; this is not evidence of server-side tracking.
- Caveats: `isUsableChapterSave` does not deeply validate all nested save collections, and the maximum text length does not guarantee bounded nested complexity. Future hardening can enforce per-collection limits, numeric bounds and structural schemas. No exploit demonstrated.
- Local clone attempt failed DNS resolution of github.com; no `npm audit`, exhaustive historical secret scan or clean local build can be claimed. No application code changed. Audit remains open.


## Security audit — repository history scope and automation review (2026-10-25)
- GitHub commits listing: page 1 has 100 entries; page 2 has 12, for **112 commits on default branch** at time of query. This establishes enumeration, **not** a complete secret scan of those 112 commit diffs or other branches. Branch listing has 35 branches (main plus 34 other branches).
- Re-read all three workflow definitions. `aa-lf-informe-diario.yml` is manual-only, has `contents: write`, and may commit/push a dated documentation report to the checkout branch after `git pull --rebase`. Recommend restrict to a dedicated documentation branch or require protected review, if future changes authorized.
- `lec-laboratorio-copia.yml` runs scheduled/manually with `contents: write`, creates backup/work branches, and uses `git push --force-with-lease` **only** to its dated laboratory work branch, not directly to main in the inspected commands. Recommend explicit branch naming and permission restrictions.
- `aa-auditoria-universal.yml` has `contents: read` and `issues: write`; no third-party secret exfiltration code evident in the reviewed YAML. These are static observations, not a dynamic compromise assessment.
- `scripts/run-all-tests.cjs` invokes Node with an explicit executable and test-file argument array via `spawnSync` (no shell option set), rather than interpolating test filenames into a shell command. No shell-injection sink evident in this reviewed harness.
- No changes to game, workflow permissions, dependency files, or contest submission. Audit still requires real dependency vulnerability scans, exhaustive history/content checks, branch protection review and tested remediation.


## Security audit — automation status and repository controls (2026-10-25)
- GitHub Actions recent five runs all report `completed/success` for `AA - Auditoria universal segura`, including current documented head `dd8c25bf9aeb15a8c1ba413a094559ea7c76716e`. Its YAML is inventory/CSV validation, not dependency/secret security scanning; passing runs do not close the security audit.
- GitHub `branches/main` endpoint confirms the expected head commit. The commit metadata says `verification.verified=false` / `reason=unsigned`; unsigned commits are not automatically malicious, but verified signing is not established.
- GitHub Actions permissions endpoint was rejected by connector allowlist; branch protection endpoint previously returned 403. Do not claim branch permissions or protection verified.
- Retried local git remote access; host `github.com` cannot resolve in this execution environment. Full local clone, clean build and `npm audit` remain blocked here.
- No game/source or workflow configuration changed. Outstanding vulnerability and history checks remain explicitly open; 100% certification not supported.
