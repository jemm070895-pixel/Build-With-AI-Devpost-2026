---
doc: v2-reconciliation
status: approved
date: 2026-10-05
---

# AZHERYN V2 — Devpost Learn Skill Pack reconciliation

## Purpose
This document reconciles the Devpost Learn Skill Pack artifacts already present in this repository with the current AZHERYN V2 contest build.

Public Devpost artifacts describe only the current contest slice; superseded/internal design history is retained privately.

## Current source of implementation truth
The active contest implementation is `azheryn-v2/`.

The installed Devpost Learn Skill Pack remains in `.agents/skills/` with the six-step flow:
1. 1-start
2. 2-scope
3. 3-prd
4. 4-spec
5. 5-build
6. 6-ship

`skills-lock.json` remains evidence of the installed pack.

## Current contest scope — Chapter 1
The contest slice is a small end-to-end founding chapter:

**Mui + seven former guards arrive/start in or near a central clearing → establish themselves → cut trees → obtain wood while freeing terrain → choose where to build → construct → finish the first functional warehouse/storage building.**

The goal is to demonstrate a complete playable chain rather than finish the full future game.

## Current starting group
- Mui.
- Seven male NPCs, formerly guards of the King.
- Eight people total.
- The guards begin with defense experience and can learn other work.
- Each guard has a rustic knife gifted by Mui.
- The knife material is intentionally unnamed for now and must not be canonized by this Devpost documentation.

## Initial managed resource
WOOD is the first managed resource for the Chapter 1 economy.

Water, food, stone, and other materials may exist physically in the world, but they are not automatically part of the initial managed-resource system. Their later gameplay treatment remains separate work.

Cutting trees has two linked effects:
1. obtains wood;
2. frees physical terrain for settlement expansion.

## World and geography
The initial playable environment is a broad wooded valley with a permanent river and a roughly central, irregular clearing surrounded almost completely by forest.

The river has variable width and depth. Some sections are shallow/narrow enough to cross on foot. Forest distribution and the clearing must remain irregular and natural rather than geometric.

The Saga is a coherence/reference source, not an absolute restriction on every unresolved game-design detail. The game may resolve gaps through creator-approved design decisions.

## Current development state
### META 0 — Base técnica V2
CLOSED and synchronized.

### META 1 — Mundo y geografía
ACTIVE.

### META 1.1 — Terreno base
APPROVED and CLOSED.

Approved commit:
`fbc7ea3b941d259db81cfa266306b1be1b037a71`
— `AZHERYN: Meta 1.1 terreno base aprobado`

### META 1.2 — Río y agua geográfica
NEXT implementation submeta.

Approved scope:
- permanent river;
- variable width;
- variable depth;
- walkable fords/shallow crossings;
- riverbanks;
- wet areas/minor watercourses where appropriate.

Do not advance camera, terrain appearance, forest taxonomy, Flora, Fauna, characters, buildings, or later systems as part of META 1.2 unless a real regression blocks it.

## Later META 1 work already separated
- META 1.3 — Camera and visualization.
- META 1.4 — Natural terrain appearance.
- META 1.5 — Structural forest distribution.
- META 1.6 — Integration and testing.
- Flora and Fauna are later separate metas.

## Camera direction already decided
The game should eventually support close inspection sufficient to distinguish characters, clothing, conversations, knives, wood, and tools. The previously considered 180-degree rotation is postponed.

This direction does not authorize implementing META 1.3 during META 1.2.

## Contest visual strategy
Develop Chapter 1 initially to G1: attractive, readable, rustic/isometric strategy presentation with coherent scale and acceptable performance.

After Chapter 1 works end-to-end, perform a contest polish phase toward G2 or better if time allows.

The demo should prioritize a clear 1–3 minute judge experience.

## Beyond the contest slice
The Academy is not required to finish the contest Chapter 1. It belongs to later development and may be mentioned only at a high level as a subsequent chapter.

The full AZHERYN project continues after the hackathon regardless of contest result.

## Supersession rule
Private earlier prototypes do not define the current public V2 contest target.

## Devpost submission gates added 2026-10-05
Before final submission:
- answer the required question explaining briefly how the Devpost Learn Skill Pack was used;
- complete the required age-of-majority checkbox;
- verify the public repository link is in the “Try it out” field;
- save the submission before the deadline: October 26, 2026, 5:00 PM ET.

The Learn Skill Pack is now MIT-licensed according to Devpost's official notification.

## How the Skill Pack is being used
The Skill Pack provided the structured progression from starting profile and scope through PRD, technical specification, build checklist, and shipping preparation. AZHERYN used that structure during its earlier prototype and is now preserving those artifacts while reconciling them with the active V2 implementation instead of falsely rewriting development history.

This reconciliation is part of that evidence: the project learned from the first implementation, deliberately reset the technical/gameplay direction into V2, preserved the earlier work, and kept the official Skill Pack workflow available for the active build.

## Next exact step
Resume V2 at **META 1.2 — Río y agua geográfica** using the approved limited scope above.

Do not restart V2, do not rebuild V1, and do not treat the old Academy MVP documents as the current contest target.
