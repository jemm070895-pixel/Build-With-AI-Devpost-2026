---
doc: spec
status: approved
version: v2
---

# AZHERYN V2 — Technical Specification

## Plain-language architecture
AZHERYN V2 is a browser strategy prototype built with React, TypeScript and Vite. The active implementation lives in `azheryn-v2/`.

The current priority is a deterministic, performant world foundation that can later support characters, resources and construction without rebuilding the map.

## Current stack
- React 19
- TypeScript
- Vite
- Browser Canvas-based world rendering
- Deterministic procedural world generation

## Current world implementation
The V2 world uses a 128×128 logical grid with numeric height data. World generation is deterministic from its seed.

Current rendering supports:
- isometric projection;
- height lift and slope/side shading;
- baked overview rendering;
- detailed redraw at closer zoom;
- camera pan and pointer-centered zoom.

Current camera range is approximately 0.7–8 zoom. High-detail rendering performance must be watched as later content is added.

## Development state
META 1.1 terrain base is approved and closed at commit:
`fbc7ea3b941d259db81cfa266306b1be1b037a71`.

META 1.2 is the next implementation scope.

## META 1.2 technical contract — river and geographic water
Implement/refine only what is necessary for:
- a permanent river entering from geographic north and descending toward geographic south;\n- fixed cardinal convention: top=N, bottom=S, left=O/W, right=E, even when the isometric projection makes the river appear diagonal;\n- a visible cardinal-direction indicator in the world view;
- variable width;
- variable depth;
- shallow/narrow walkable crossings/fords;
- riverbanks;
- wet areas and minor watercourses where appropriate.

The water must fit the terrain rather than read as a geometric overlay.

Do not use META 1.2 as permission to implement camera polish, forest taxonomy, Flora, Fauna, characters, resource economy, buildings or later gameplay unless a real regression blocks water work.

## Existing terrain contract
Terrain should remain a broad valley with natural multi-scale relief, lower areas associated with the river, gently rising sides, irregular clearing geometry and no giant initial mountain walls.

The central clearing remains small, irregular and not perfectly flat.

## Future Chapter 1 systems
After world/geography reaches its required gate, later systems will add:
- Mui and seven guards;
- tree interaction/felling;
- persistent removal of trees;
- wood as the first managed resource;
- freed settlement space;
- building-site choice;
- construction work;
- first functional warehouse/storage structure.

These systems must be implemented incrementally and tested rather than all at once.

## State principles
World changes important to gameplay must be representable in authoritative game state. Visual effects alone must not pretend that a tree was removed, wood was gained, or a building became functional.

Future AI/narrative features may enrich presentation but must not silently override game truth.

## Performance
Performance is a gate, not decoration. If close-detail rendering becomes too slow, optimize before layering substantial new simulation content on top of it.

## Validation method
For each submeta:
theory → limited implementation → run/build → visual/play check → correct regressions → user approval → mini-gate → persist/commit → next.

The user’s local visual inspection remains important because localhost is not directly visible from this chat unless a reachable deployment is deliberately created later.

## Historical evidence
The previous Academy-first technical spec remains in `devpost/v1-history/spec.md` and Git history.

