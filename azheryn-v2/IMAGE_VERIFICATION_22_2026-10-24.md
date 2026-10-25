# AZHERYN V2 — 22-image GitHub technical verification register

Date: 2026-10-24

## What is certified
Each of the **22 expected image paths** was individually fetched from the connected GitHub repository using binary/base64 mode and returned the Git blob SHA-1 below. This provides a reproducible per-path identity for the current repository content at inspection time. Git blob SHA-1 is **not** the SHA-256 of the raw image and **not** proof of copyright ownership, AI-generation provenance, absence of external reference material, or license clearance. The full repository tree and historic commits were not recursively scanned.

| # | Repository path (under `azheryn-v2/public/`) | Git blob SHA-1 |
|---:|---|---|
| 1 | `characters/mui.webp` | `123d1ade04017478b80fa93e51160d6a83091988` |
| 2 | `characters/guard-1.webp` | `7a4f75f834ab0f90ea47c501f199bc8d3603a762` |
| 3 | `characters/guard-2.webp` | `24fe7c387689be4bf390a45315fe018a3afdff42` |
| 4 | `characters/guard-3.webp` | `2c76bd0ff16536acf03483e2c3122d77b4a25fbe` |
| 5 | `characters/guard-4.webp` | `cf29de602e6cf25a2a1cae0d0e7e6db45715d7d2` |
| 6 | `characters/guard-5.webp` | `2ebe6c4469d4f7559d61bc2426c78fd8f0e92e12` |
| 7 | `characters/guard-6.webp` | `edcd10c8d8c8f001cf59ea6ab22441877bce5bc0` |
| 8 | `characters/guard-7.webp` | `4bcac3afd9f8b77bdd2ef56dd59f20be72550bb4` |
| 9 | `characters/REFERENCIA_PERSONAJES.webp` | `9ad80e32f4ab7e46cc1be885903e77e42c77b1c6` |
| 10 | `characters/FEHE_CANONICA_13_PUNTAS.jpeg` | `cd5e680690b00f5096603cdd40a3d4e279e22823` |
| 11 | `intro/Fehe_original.jpeg` | `cd5e680690b00f5096603cdd40a3d4e279e22823` |
| 12 | `intro/resistencia.webp` | `51f398e9aecb92190f57b6488001af1878d1daf6` |
| 13 | `intro/guardias.webp` | `0a3ebb0aa19de2c1ed91c1ace4cb8abe9e216abd` |
| 14 | `intro/entrega_fehe_canonica.webp` | `c044ca45e24fa9a8f668b25b613186ed07359852` |
| 15 | `intro/Fehe_canonica_30cm.jpeg` | `783e7b5e5f8af4de4ca259f26d7efb5f83ff46d7` |
| 16 | `intro/claro.webp` | `068c81c715d93fcb0cef8c44576bd7c039100018` |
| 17 | `intro/rey.webp` | `75dc58370380ac120cb9db17987b3fcc4ac5e82f` |
| 18 | `intro/partida.webp` | `38d3e0c2b6ebd14df847b3246b9f9e9cdb674921` |
| 19 | `intro/entrega_fehe_original.webp` | `d494b887a3726fe79512f51c4b793a2911b96b62` |
| 20 | `intro/Fehe_detalle_original.webp` | `dc505439d7fbc2ff55d77781e7233a84463af908` |
| 21 | `intro/reino.webp` | `8308179875382771a325d15de95dfbffaf37e71d` |
| 22 | `intro/entrega_fehe_g63119_limpia.webp` | `c044ca45e24fa9a8f668b25b613186ed07359852` |

## Verified byte-identical duplicate pairs
Git returned identical blob IDs for these distinct file paths:

- `characters/FEHE_CANONICA_13_PUNTAS.jpeg` and `intro/Fehe_original.jpeg`.
- `intro/entrega_fehe_canonica.webp` and `intro/entrega_fehe_g63119_limpia.webp`.

Thus the **22 paths represent 20 distinct Git blobs**. This is a concrete technical finding, not an image-similarity judgment. The two duplicates are not missing or corrupt merely because their content matches.

## Provenance and legal status
- The owner states the Fehe design is their own original creation and the game illustrations were generated using ChatGPT following their instructions. This is recorded testimony, not independent generation metadata.
- Project records document the portrait sheet to eight character portraits, Fehe source to handoff composite, and dimension-label corrections. See `ASSET_PROVENANCE_AUDIT.md`.
- No third-party visual source was identified in reviewed project documents. This does not prove that none was used or that images are legally exclusive.
- **Rights clearance / original generation evidence: NOT CERTIFIED.** A claim of 100% independently verified originality would be unsupported.
- Video: owner confirms silent 2:59 YouTube video linked to Devpost, but the exact URL and video frames have not been provided in accessible repository evidence. Its visual contents **cannot yet be independently certified**.

**Technical image-path presence and Git identity: 22/22 VERIFIED.**
**Independently proven creation provenance: OPEN.**

## Legal ownership assessment — 2026-10-24
**Official sources consulted:**
1. OpenAI consumer Terms of Use, https://openai.com/policies/row-terms-of-use/ — “Ownership of content”: as between the user and OpenAI, the user retains their rights in inputs and owns outputs to the extent permitted by law; OpenAI assigns any rights it has in outputs. Terms expressly caution that outputs may not be unique and exclude third-party output.
2. U.S. Copyright Office, January 29, 2025, https://www.copyright.gov/newsnet/2025/1060.html — AI-generated material can qualify for copyright protection when a human has determined sufficient expressive elements, such as protectable human-authored content perceptible in the output or creative arrangements/modifications; prompts alone are insufficient.
3. U.S. Copyright Office AI registration guidance, https://www.copyright.gov/ai/ai_policy_guidance.pdf — AI-generated portions must be distinguished from human-authored material when seeking registration.

**Application to this project (not legal advice):**
- All 22 repository image paths are technically verified. They comprise 20 distinct Git blobs, with two duplicate pairs documented above.
- The owner reports directing ChatGPT to create the artwork and independently designing the Fehe. Under OpenAI's terms, OpenAI does not retain exclusive ownership of the outputs against the user; this supports the owner's right to use and distribute generated illustrations, **subject to third-party rights and applicable law**.
- Human-authored Fehe design details, story, original selection and creative composition may be copyrightable to the extent their human expression meets the applicable legal standard. This does **not** automatically confer exclusive copyright over each entire AI-generated image.
- The 22 files cannot be legally certified as exclusively copyrighted to the owner without original prompt/input records, a review of human creative contributions to each work and, where relevant, third-party source checks. Lack of those records is not evidence of infringement.
- Do not present this report as a copyright registration, a legal opinion, or a guarantee of uniqueness. Preserve the game images; no automatic replacement is indicated.

**Status for each of the 22 listed paths:** technical Git identity VERIFIED; owner claim and OpenAI terms documented; individual exclusive-copyright status NOT INDEPENDENTLY DETERMINED. No third-party source identified in reviewed repository documents. The next meaningful evidence is original generation conversations or source files, not repeated code searches.
