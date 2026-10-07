import { clamp, fbm, lerp, smoothstep } from "./noise";

export const GRID = 128;
export const WATER_LEVEL = 0.2;

// META 1.1.1 — contrato de coordenadas mundiales.
// África es la referencia cartográfica de Eryndor: una latitud/longitud africana
// identifica inicialmente el mismo punto mundial en Eryndor. La capa Eryndor puede
// transformar costa, relieve, hidrografía, vegetación u otros rasgos sin cambiar
// esas coordenadas ni destruir la referencia africana original.
export const ERYNDOR_WORLD_COORDINATES = {
  referenceGeometry: "africa",
  coordinateSystem: "africa_latitude_longitude",
  mapping: "one_to_one",
  eryndorOverridesPhysicalGeography: true,
  preservesAfricanReference: true,
  // V2 scope: only the Academy region and its surroundings are developed now.
  // The continental coordinate architecture remains reserved for future versions.
  v2DevelopedArea: "academy_region_and_surroundings_only",
  // The creator-marked box on the Africa reference map is the maximum
  // geographic reference area for V2. Only the territory actually needed
  // around the Academy is initially built/playable inside that reference area.
  v2ReferenceArea: "creator_marked_academy_box",
  v2ReferenceAreaRole: "maximum_reference_not_fully_developed",
  academyExactCoordinate: { latitude: 0.5, longitude: 29.8 },
  // Initial V2 development envelope around the Academy region.
  // This is a world-space extent, not a requirement to simulate every point
  // at maximum detail simultaneously.
  localPlayableExtentKm: { width: 20, height: 20 },
  localPlayableAreaKm2: 400,
  // Physical elevation contract: use real African DEM elevation as the base
  // at the corresponding world coordinates. Eryndor may apply explicit,
  // canonical terrain overrides later without losing the original base layer.
  elevationBase: "africa_real_dem",
  elevationPreferredDataset: "NASADEM_HGT_1_arc_second",
  elevationResolutionApproxMeters: 30,
  elevationEryndorOverridesAllowed: true,
  elevationOriginalBasePreserved: true,
  // Soil/geology follow the same layered rule as elevation: real African
  // geospatial data is the physical base; explicit Eryndor canon may override
  // it later while preserving the source layer.
  soilGeologyBase: "africa_real_geospatial_data",
  soilGeologyEryndorOverridesAllowed: true,
  soilGeologyOriginalBasePreserved: true,
  // Physical existence and local knowledge are separate gates: a buried
  // resource can exist before Mui or any inhabitant discovers it.
  hiddenResourcesCanPhysicallyPreexistDiscovery: true,
  // Slope is a causal physical property derived from the active elevation
  // layer (African base plus any explicit Eryndor override). Exact gameplay
  // thresholds remain intentionally unfixed until play calibration.
  slopeModel: "derived_from_active_elevation",
  slopeAffects: [
    "movement",
    "transport",
    "construction",
    "water_flow",
    "erosion",
    "exposed_rock",
    "vegetation",
    "future_roads",
    "future_animals",
    "future_agriculture",
    "future_settlements",
  ],
  slopeGameplayThresholds: "pending_play_calibration",
  // Approved META 1.1.1 terrain-state architecture. These contracts do not
  // mutate the current 128×128 generated map; they define how later physical
  // changes and discoveries must be represented.
  terrainModificationModel: "causal_persistent_changes",
  preservesOriginalNaturalTerrain: true,
  terrainStateLayers: ["natural_original", "modification_history", "current_state"],
  terrainModificationRequirements: ["knowledge", "tools", "labor", "time", "resources"],
  arbitraryTerrainModificationForbidden: true,
  // Approved META 1 / 1.1 world rules that were defined in the corpus before
  // this audit but were not yet encoded as explicit V2 game contracts.
  principalGeographyStableBetweenRuns: true,
  phase1BaseGeographyFixed: true,
  futureMinorBaseGeographyRevisionAllowed: true,
  futureBaseGeographyRevisionRequiresExplicitDecision: true,
  naturalBoundariesPreferred: true,
  invisibleWallBoundariesForbidden: true,
  perfectSettlementSiteGuaranteed: false,
  settlementSiteTradeoffs: ["water", "wood", "transport", "humidity", "exposure", "construction_ease"],
  // Continuous-world architecture: the current 128×128 region is only the
  // initial loaded local representation. World coordinates persist independently
  // of zoom/load state; later regions may use LOD without losing historical state.
  worldLoadingModel: "continuous_world_region_streaming",
  mapAppLikeNavigationModel: true,
  physicalWorldScalePreservedAcrossZoom: true,
  renderDetailDependsOnZoomAndLoadedRegion: true,
  zoomDetailModel: "lod_by_zoom",
  preciseObjectPositionsIndependentOfTerrainCellResolution: true,
  unloadedRegionsRetainHistoricalState: true,
  currentGridRole: "initial_local_region_representation",
  continentalExpansion: "future_versions",
} as const;

export interface WorldCoordinate {
  latitude: number;
  longitude: number;
}

export type TerrainModificationKind =
  | "excavation"
  | "fill"
  | "leveling"
  | "road"
  | "ditch"
  | "construction"
  | "natural_erosion";

export interface TerrainModificationRecord {
  kind: TerrainModificationKind;
  causeId: string;
  sequence: number;
}

export interface PersistentTerrainState<TSnapshot = unknown> {
  naturalOriginal: TSnapshot;
  modificationHistory: TerrainModificationRecord[];
  currentState: TSnapshot;
}

export type ResourceKnowledgeStage =
  | "exists"
  | "discovered"
  | "understood"
  | "extractable"
  | "usable";

export interface HiddenPhysicalResource {
  resourceId: string;
  physicallyExists: boolean;
  knowledgeStage: ResourceKnowledgeStage;
}

export const HIDDEN_RESOURCE_FOUNDATION = {
  enabled: false,
  physicalExistencePrecedesDiscovery: true,
  spawnOnPlayerNeedForbidden: true,
  mayRemainUnknownUnderBuiltTerrain: true,
  chapter1ActiveManagedResources: ["wood"],
  nonWoodResourcesDeferred: true,
  detailedCatalogDeferred: true,
  futureDefinitionsRevisable: true,
} as const;

export const CAUSAL_BIOME_FOUNDATION = {
  enabled: false,
  arbitraryBiomePlacementForbidden: true,
  causalInputs: ["elevation", "water", "humidity", "soil_geology", "slope", "climate", "time"],
  biomesMayChangeWhenCausesChange: true,
  chapter1UsesOnlyRequiredLocalEnvironment: true,
  detailedBiomeSimulationDeferred: true,
  futureDefinitionsRevisable: true,
} as const;

export const PLACE_HISTORY_FOUNDATION = {
  enabled: false,
  identityAnchor: "permanent_world_coordinates",
  placeIdentityPersistsAcrossStateChanges: true,
  significantChangesRetainHistory: true,
  exampleStateSequence: ["original_forest", "cleared", "construction", "abandoned", "ruins", "natural_regrowth"],
  deepHistorySimulationDeferred: true,
  futureDefinitionsRevisable: true,
} as const;

export const APPROVED_LOCAL_MAP_LAYOUT = {
  status: "approved_for_v2",
  normalizedPlanningAxes: { x: [-100, 100], y: [-100, 100] },
  planningAxesAreNotMeters: true,
  centralClearingMetersMax: { width: 20, height: 20 },
  centralClearing: { center: [0, 0], mostlyGrass: true, initialGrassHeight: "around_knee", startingArea: true },
  centralForestBand: { xApprox: [-60, 60], yApprox: [-100, 100], mixedForest: true },
  centralRelief: { lowVariationRadiusNormalized: 20, descendsGentlyTowardSides: true },
  north: { moreIrregularRelief: true, woodedBoundaryHeightsMetersApprox: [20, 30], minorStreams: true },
  northClearing: { large: true, elevated: true, regularGround: true, farFromMainRivers: true, faunaAttractive: true },
  westBoundary: { drier: true, sparseAdaptedTrees: true, largeRocks: true, naturalRockyLimit: true },
  southBoundary: { mostlyGreenOpenBuildableGround: true, scatteredTreeGroups: true },
  eastBoundary: { mainRiverIsNaturalLimit: true, playerInitiallySeesOnlyWaterBeyond: true },
  mainRivers: {
    bothCrossEntireMapNorthToSouth: true,
    west: { approximateX: -60, irregular: true, diagonalTrend: "backslash" },
    east: { approximateX: 100, irregular: true, boundaryRiver: true },
  },
  isolatedInitialPuddles: false,
  northeastLookout: {
    elevationMetersApprox: [80, 100],
    broadEscarpmentNotPointedMountain: true,
    clearLookoutTop: true,
    panoramicViewAcrossPlayableArea: true,
    continuesBeyondNorthBoundary: true,
  },
  settlementChoiceMustHaveTradeoffs: true,
  fixedBuildingsDoNotTeleport: true,
  relocationOptions: ["abandon_and_rebuild_elsewhere", "demolish_recover_possible_materials_and_rebuild"],
  visualReference: "assets/fotos_y_bocetos/Mapa_provisional_Azheryn_V2.jpeg",
} as const;

export interface Tile {
  h: number;
  water: boolean;
  depth: number;
  forest: number;
  meadow: number;
  wet: number;
  rock: number;
  clear: number;
}

export interface World {
  size: number;
  seed: number;
  tiles: Tile[];
  clearing: { x: number; y: number; radius: number };
}

export interface PersistentWorldObjectPosition {
  objectId: string;
  coordinate: WorldCoordinate;
  localOffsetMeters: { east: number; north: number };
}

export interface WorldRegionState<TState = unknown> {
  regionId: string;
  loaded: boolean;
  lod: number;
  historicalState: TState;
}

export function tileAt(world: World, x: number, y: number): Tile | undefined {
  if (x < 0 || y < 0 || x >= world.size || y >= world.size) return undefined;
  return world.tiles[y * world.size + x];
}

const gauss = (dx: number, dy: number, sigma: number) =>
  Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));

export function createWorld(seed = 7): World {
  const N = GRID;

  // Orientación geográfica fija del mundo:
  // arriba = NORTE, abajo = SUR, izquierda = OESTE, derecha = ESTE.
  // La proyección isométrica inclina visualmente el cauce, pero no cambia esos puntos cardinales.
  //
  // El río entra por el NORTE y desciende hacia el SUR hasta salir del mapa.
  // Su recorrido puede verse inclinado en pantalla (aprox. \\), pero el flujo geográfico es N → S.
  const riverX = (gy: number) =>
    N * 0.2 +
    N * 0.055 * Math.sin((gy / N) * Math.PI * 1.9 - 1.41) +
    (fbm(gy * 0.035, 17.3, seed + 5) - 0.5) * N * 0.055 +
    (fbm(gy * 0.1, 41.7, seed + 8) - 0.5) * N * 0.025;

  // Río oriental: límite natural pegado a +X, según el mapa visual aprobado.
  const eastRiverX = (gy: number) =>
    N * 0.985 +
    N * 0.02 * Math.sin((gy / N) * Math.PI * 1.35 + 0.7) +
    (fbm(gy * 0.045, 27.1, seed + 75) - 0.5) * N * 0.025;

  // Vados: tramos más anchos y someros a lo largo del descenso norte-sur.
  const fordYs = [N * 0.2, N * 0.56, N * 0.86];
  const fordness = (gy: number) =>
    fordYs.reduce((m, f) => Math.max(m, Math.exp(-((gy - f) ** 2) / (2 * 3.5 * 3.5))), 0);
  // Anchura irregular a lo largo del recorrido.
  const riverHalfWidth = (gy: number) =>
    lerp(1.3, 2.0, clamp(gy / N, 0, 1)) *
    lerp(0.65, 1.45, smoothstep(0.3, 0.7, fbm(gy * 0.06, 8.2, seed + 11))) *
    (1 + 0.3 * fordness(gy));
  // Profundidad irregular: pozas profundas y fondos someros en los vados.
  const riverBed = (gy: number) =>
    lerp(
      lerp(0.055, 0.13, smoothstep(0.25, 0.75, fbm(gy * 0.05 + 30, 2.7, seed + 13))),
      0.172,
      fordness(gy),
    );

  const STEP = 0.5;
  const START = -8;
  const count = Math.ceil((N + 16) / STEP) + 1;
  const sampleX = new Float32Array(count);
  const sampleY = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sampleY[i] = START + i * STEP;
    sampleX[i] = riverX(sampleY[i]);
  }
  const riverDistance = (x: number, y: number) => {
    const lo = Math.max(0, Math.floor((y - 14 - START) / STEP));
    const hi = Math.min(count - 1, Math.ceil((y + 14 - START) / STEP));
    let best = Infinity;
    for (let i = lo; i <= hi; i++) {
      const dx = x - sampleX[i];
      const dy = y - sampleY[i];
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  };

  // Distancia al río oriental de borde. Su trazado es casi vertical y queda
  // parcialmente fuera de la malla para que el límite +X se lea como agua.
  const eastRiverDistance = (x: number, y: number) => Math.abs(x - eastRiverX(y));

  // Pequeños cursos del límite montañoso norte, visibles en la referencia canónica.
  const northStreamDistance = (x: number, y: number) => {
    if (y > N * 0.28) return Infinity;
    const streamA = N * 0.16 + y * 0.28 + Math.sin(y * 0.18) * 1.8;
    const streamB = N * 0.66 - y * 0.22 + Math.sin(y * 0.14 + 1.1) * 1.6;
    return Math.min(Math.abs(x - streamA), Math.abs(x - streamB));
  };

  // Claro inicial: en el centro del área jugable, pequeño e irregular.
  const cx = N / 2;
  const cy = N / 2 - 4;
  const clearingRadius = 8;
  // Distancia con signo al borde del claro (negativa = dentro).
  const clearingEdge = (x: number, y: number) => {
    const dx = x - cx;
    const dy = y - cy;
    const ang = Math.atan2(dy, dx);
    const r =
      8.5 +
      (fbm(Math.cos(ang) * 2.2 + 3, Math.sin(ang) * 2.2 + 3, seed + 30) - 0.5) * 9 +
      (fbm(x * 0.15, y * 0.15, seed + 31) - 0.5) * 3;
    return Math.hypot(dx, dy) - r;
  };
  // Pequeños claros sueltos entre el bosque.
  const glades = [
    { x: cx - 22, y: cy - 12, r: 4 },
    { x: cx + 26, y: cy - 10, r: 4 },
    { x: cx - 20, y: cy + 10, r: 3.2 },
  ];
  const gladeAt = (x: number, y: number) =>
    glades.reduce((m, g) => Math.max(m, smoothstep(g.r + 1.5, g.r - 1.5, Math.hypot(x - g.x, y - g.y))), 0);

  // Cuencas húmedas (zonas encharcadas).
  const basins = [
    { x: N * 0.72, y: N * 0.72, sigma: 7 },
    { x: N * 0.25, y: N * 0.25, sigma: 5 },
  ];
  const basinAt = (x: number, y: number) =>
    basins.reduce((m, b) => Math.max(m, gauss(x - b.x, y - b.y, b.sigma)), 0);

  const size = N * N;
  const heights = new Float32Array(size);
  const ridges = new Float32Array(size);
  const dists = new Float32Array(size);
  const clears = new Float32Array(size);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const edge = Math.min(x, y, N - 1 - x, N - 1 - y);
      const edgeD = edge + (fbm(x * 0.05 + 3, y * 0.05 + 9, seed + 9) - 0.5) * 16;
      const ridge = smoothstep(26, 3, edgeD);

      // Valle: el fondo es más bajo cerca del río y las laderas suben suavemente hacia los lados.
      const riverDist = riverDistance(x, y);
      const eastDist = eastRiverDistance(x, y);
      const streamDist = northStreamDistance(x, y);
      const waterDist = Math.min(riverDist, eastDist);
      let h = 0.31 + smoothstep(8, 40, waterDist) * 0.1;
      // Ondulaciones de varias escalas, con ejes deformados para evitar patrones regulares.
      const rx = x + (fbm(x * 0.03 + 20, y * 0.03, seed + 60) - 0.5) * 18;
      const ry = y + (fbm(x * 0.03, y * 0.03 + 20, seed + 61) - 0.5) * 18;
      h += (fbm(rx * 0.03, ry * 0.03, seed) - 0.5) * 0.2;
      h += (fbm(rx * 0.065, ry * 0.065, seed + 62) - 0.5) * 0.13;
      // Lomas suaves y hondonadas pequeñas.
      h += (smoothstep(0.5, 0.78, fbm(rx * 0.05 + 3, ry * 0.05 + 8, seed + 63)) - 0.2) * 0.09;
      h += (fbm(x * 0.1, y * 0.1, seed + 2) - 0.5) * 0.04;
      h += ridge * (0.42 + fbm(x * 0.08, y * 0.08, seed + 4) * 0.28) * smoothstep(0, 7, edge);
      h += smoothstep(0.55, 0.8, fbm(x * 0.025 + 7, y * 0.025 + 2, seed + 6)) * 0.12 * (1 - ridge);
      h -= basinAt(x, y) * 0.13;

      const dist = riverDist;
      h -= smoothstep(22, 0, dist) * 0.06 * (1 - ridge);

      const nd = dist / riverHalfWidth(y);
      const carve = smoothstep(2.2, 0.6, nd);
      const fz = fordness(y);
      const bed = riverBed(y) + (fbm(x * 0.2, y * 0.2, seed + 7) - 0.5) * (0.03 + fz * 0.04);
      h = lerp(h, bed, carve);

      const eastWidth = lerp(2.2, 3.4, smoothstep(0.25, 0.75, fbm(y * 0.055, 19.4, seed + 76)));
      const eastCarve = smoothstep(2.1, 0.55, eastDist / eastWidth);
      const eastBed = lerp(0.045, 0.115, smoothstep(0.25, 0.75, fbm(y * 0.05, 31.2, seed + 77)));
      h = lerp(h, eastBed, eastCarve);

      const streamCarve = smoothstep(1.55, 0.3, streamDist);
      const streamBed = 0.182 + (fbm(x * 0.23, y * 0.23, seed + 79) - 0.5) * 0.012;
      h = lerp(h, streamBed, streamCarve);

      const clear = smoothstep(2, -2, clearingEdge(x, y));
      // El claro es cómodo pero no una explanada: se suaviza el relieve sin aplanarlo del todo.
      h = lerp(h, 0.34 + (h - 0.34) * 0.3, clear);

      heights[i] = h;
      ridges[i] = ridge;
      dists[i] = dist;
      clears[i] = clear;
    }
  }

  const hAt = (x: number, y: number) =>
    heights[clamp(y, 0, N - 1) * N + clamp(x, 0, N - 1)];

  const tiles: Tile[] = new Array(size);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const h = heights[i];
      const dist = dists[i];
      const ridge = ridges[i];
      const clear = clears[i];
      const water = h < WATER_LEVEL;

      const slope = Math.abs(hAt(x + 1, y) - hAt(x - 1, y)) + Math.abs(hAt(x, y + 1) - hAt(x, y - 1));
      const rock = clamp(
        smoothstep(0.62, 0.78, h) + smoothstep(0.14, 0.28, slope) * 0.8,
        0,
        1,
      );

      const lowness = smoothstep(WATER_LEVEL + 0.09, WATER_LEVEL + 0.015, h);
      const wetGate = smoothstep(
        0.3,
        0.5,
        fbm(x * 0.08, y * 0.08, seed + 10) + smoothstep(9, 2, dist) * 0.25,
      );
      const wet = water ? 0 : clamp(lowness * clamp(wetGate + basinAt(x, y), 0, 1), 0, 1);

      // Bosque irregular: ruido deformado, densidades distintas y pequeños huecos internos.
      const wx = x + (fbm(x * 0.04, y * 0.04, seed + 40) - 0.5) * 14;
      const wy = y + (fbm(x * 0.04 + 9, y * 0.04, seed + 44) - 0.5) * 14;
      let forest = smoothstep(0.34, 0.6, fbm(wx * 0.06 + 11, wy * 0.06 + 5, seed + 3));
      forest *= 1 - smoothstep(0.68, 0.82, fbm(wx * 0.16, wy * 0.16, seed + 41)) * 0.8;
      forest *= lerp(0.6, 1, smoothstep(0.3, 0.7, fbm(x * 0.09 + 4, y * 0.09, seed + 42)));
      // Anillo de bosque alrededor del claro, con entrantes y huecos irregulares.
      const sd = clearingEdge(x, y);
      const ring =
        smoothstep(0, 3, sd) *
        smoothstep(22, 11, sd) *
        (1 - 0.7 * smoothstep(0.62, 0.8, fbm(x * 0.13 + 90, y * 0.13, seed + 43)));
      forest = Math.max(forest, ring * 0.95);
      forest += ridge * 0.5 * (1 - rock);
      const glade = gladeAt(x, y);
      forest *= 1 - glade;
      forest *= lerp(0.55, 1, smoothstep(2.5, 8, dist));
      forest *= (1 - wet * 0.8) * (1 - rock * 0.9) * (1 - clear);
      if (water) forest = 0;
      forest = clamp(forest, 0, 1);

      let meadow =
        smoothstep(0.2, 0.04, forest) *
        smoothstep(0.4, 0.6, fbm(x * 0.1 + 51, y * 0.1 + 7, seed + 12)) *
        (1 - rock) *
        (1 - wet);
      meadow = clamp(Math.max(meadow, glade * 0.9) + clear * 0.6, 0, 1);
      if (water) meadow = 0;

      tiles[i] = {
        h,
        water,
        depth: water ? WATER_LEVEL - h : 0,
        forest,
        meadow,
        wet,
        rock: water ? 0 : rock,
        clear,
      };
    }
  }

  return { size: N, seed, tiles, clearing: { x: cx, y: cy, radius: clearingRadius } };
}
