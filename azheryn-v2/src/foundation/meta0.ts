// AZHERYN V2 — META 0 transversal foundation
// Architectural contracts only. Future systems are OFF by default and must not alter Chapter 1 until explicitly enabled.

export const META0_REFERENCE_YEAR = 700 as const;

export const META0_FEATURES = {
  systemicAI: false,
  consciousnessLayer: false,
  aqd: false,
  deltaE: false,
  evidenceAdmission: false,
  knowledgeCycles: false,
  muiCrossCycleTeaching: false,
  ecologySimulation: false,
  // Base only: future systemic AI may evolve the physical world causally.
  // It must respect world state, geography, physics and knowledge gates rather
  // than inventing arbitrary events. Disabled for the current implementation.
  worldDynamicsAI: false,
  timeAndClimate: false,
  characters: true,
  faunaAndNaturalFood: false,
  managedWoodResources: false,
  needsAndFire: false,
  camp: false,
  toolsAndWork: false,
  settlement: false,
  lightweightKnowledge: false,
  academyRequirements: false,
  firstAcademy: false,
  playerMuiIntuitionCommunication: false,
  muiAutonomousAI: false,
  marketAndExchange: false,
  azherynProgression: false,
  otherAcademies: false,
  rankingAndMultiplayer: false,
  historicalCycles: false,
} as const;

export const FUTURE_WORLD_DYNAMICS_AI = {
  enabled: false,
  foundationOnly: true,
  domains: [
    "geology",
    "climate",
    "weather",
    "seismic_activity",
    "water_and_flood_dynamics",
    "waves_and_storm_surges",
    "erosion_and_sedimentation",
    "ecology_interactions",
    "other_causal_natural_processes",
  ],
  requiresCausalWorldState: true,
  arbitraryEventsForbidden: true,
} as const;

export type KnowledgeLayer = "exists_on_earth" | "exists_in_eryndor" | "locally_known" | "locally_manufacturable";

export interface TechnologyBaseline {
  referenceYearCE: 700;
  watercraft: "canoes_only";
  woodTarKnown: false;
  initialFishing: "spear";
  metallurgy: "crude";
  toolsAndConstruction: "rudimentary";
}

export const TECHNOLOGY_BASELINE: TechnologyBaseline = {
  referenceYearCE: META0_REFERENCE_YEAR,
  watercraft: "canoes_only",
  woodTarKnown: false,
  initialFishing: "spear",
  metallurgy: "crude",
  toolsAndConstruction: "rudimentary",
};

export interface EconomyBaseline {
  currency: "OKEYE";
  monetaryBasis: "silver";
  woodRole: "strategic_resource_and_commodity";
}

export const ECONOMY_BASELINE: EconomyBaseline = {
  currency: "OKEYE",
  monetaryBasis: "silver",
  woodRole: "strategic_resource_and_commodity",
};

export const META2_TIME_BASE = {
  status: "approved_phase1",
  metaClosed: true,
  consistencyAuditPassed: true,
  continuousWorldClock: true,
  realMinutesPerFullGameDay: 24,
  realSecondsPerGameHour: 60,
  dayNightCycle: true,
  gradualLightCycle: ["dawn", "day", "dusk", "night"] as const,
  abruptDayNightTransitionForbidden: true,
  phase1ApproxDaylightHours: 12,
  phase1ApproxNightHours: 12,
  futureSeasonalDaylightVariationPrepared: true,
  phase1Weather: ["clear", "cloudy", "light_rain", "heavy_rain", "storm"] as const,
  weatherIsCausalNotPurelyVisualRandom: true,
  gradualWeatherTransitions: true,
  weatherHasPersistentDuration: true,
  phase1WeatherEffects: "primarily_visual_and_ambient",
  futureWeatherWorldEffectsPrepared: true,
  rainMoistensGroundProgressively: true,
  groundMoisturePersistsAfterRain: true,
  groundDriesProgressivelyOverTime: true,
  phase1GroundMoistureEffects: "primarily_visual_and_ambient",
  complexMudDeferred: true,
  floodingDeferred: true,
  dynamicRiverResponseDeferred: true,
  weatherCanBeLocalByRegion: true,
  wholeMapWeatherUniformityNotRequired: true,
  weatherSystemsMayMoveAcrossRegions: true,
  phase1RegionalWeatherModel: "simple",
  scientificMeteorologySimulationDeferred: true,
  weatherRespondsToTerrainAndEnvironment: true,
  elevationMayInfluenceCloudAndRainPatterns: true,
  forestAndMoistureMayInfluenceLocalHumidity: true,
  dryOpenTerrainMayDifferClimatically: true,
  phase1TerrainWeatherCoupling: "lightweight_causal",
  futureMeteorologicalPrecisionCanIncreaseWithoutReplacingFoundation: true,
  modernWeatherForecastInitiallyForbidden: true,
  playerWeatherKnowledgeMustFollowCharacterKnowledge: true,
  initialForecastSources: ["visible_clouds", "wind_observation", "animal_behavior", "accumulated_experience"] as const,
  futureForecastInstrumentsRequireDiscovery: true,
  elapsedDaysCountFromMuiArrival: true,
  initialTimeDisplay: "day_number_and_clock",
  initialNativeEryndorCalendarUnknown: true,
  calendarKnowledgeMustBeDiscoveredOrDeveloped: true,
  futureCalendarUiMayEvolveWithKnowledge: true,
  phase1OfflineWorldProgression: false,
  closingGameFreezesWorldState: true,
  resumeContinuesFromSavedWorldTime: true,
  futureLimitedOfflineProgressionMayBeEvaluated: true,
  phase1ArrivalDay: 1,
  phase1ArrivalTime: "08:00",
  arrivalOccursInDaylight: true,
  firstNightOccursAfterInitialExplorationWindow: true,
  phase1InitialClimate: "temperate_and_relatively_stable",
  initialNamedSeasonDeferred: true,
  extremeStartingClimate: false,
  futureSeasonsMustDevelopCausally: true,
  weatherSequenceMayVaryBetweenRuns: true,
  weatherMustRemainCausallyConstrained: true,
  fixedDayWeatherScriptForbidden: true,
  phase1OpeningWeatherFairnessGuardrails: true,
  absurdOrExtremeOpeningWeatherPrevented: true,
  deterministicWeatherSeedPerRun: true,
  weatherSeedHiddenFromNormalPlayerUi: true,
  sameWeatherSeedSupportsExactWeatherReproductionForTesting: true,
  saveRestoresExactWorldTimeState: true,
  saveRestoresWeatherEvolutionState: true,
  savedWeatherStateIncludes: ["region", "intensity", "progress", "duration_state", "seed_or_rng_state"] as const,
  saveRestoresGroundMoistureState: true,
  saveRestoresLightCycleState: true,
  weatherMustNotRestartOrRerollOnLoad: true,
  criticalEventsMayInterruptFastForward: true,
  importantEventSpeedResponse: "return_to_x1_or_pause_by_severity",
  routineEventsDoNotInterruptTimeSpeed: true,
  interruptionMustRequireMeaningfulPlayerAttention: true,
  causalAmbientAudio: true,
  ambientAudioRespondsToTimeOfDay: true,
  ambientAudioRespondsToWeather: true,
  ambientAudioRespondsToLocalEnvironment: true,
  phase1AmbientAudioScope: "simple_foundation",
  largeAudioCatalogDeferred: true,
  nightMeaningfullyReducesVisibility: true,
  nightIsNotDayWithColorFilter: true,
  initialNightExplorationIsHarderWithoutArtificialLight: true,
  naturalNightLightAllowsLimitedNearbyPerception: true,
  futureArtificialLightMayExpandVisibility: true,
  completeBlackoutByDefault: false,
  physicalNightSkyFoundation: true,
  moonAndStarsExistInWorld: true,
  moonAndSkyMayInfluenceNightIllumination: true,
  cloudCoverMayReduceNaturalNightLight: true,
  exactMoonPhasesDeferred: true,
  constellationsDeferred: true,
  lunarCalendarDeferred: true,
  complexAstronomyDeferred: true,
  sunLinkedDynamicShadows: true,
  shadowDirectionChangesWithWorldTime: true,
  shadowLengthChangesWithWorldTime: true,
  phase1SolarShadowModel: "efficient_visual_approximation",
  exactSolarAstronomyDeferred: true,
  independentDecorativeShadowAnimationForbidden: true,
  cloudCoverAffectsLocalIllumination: true,
  cloudCoverMaySoftenShadows: true,
  stormsMayDarkenLocalEnvironment: true,
  phase1CloudLightingModel: "weather_mass_region_based",
  perCloudPhysicalSimulationDeferred: true,
  weatherLightingAndShadowsShareWorldState: true,
  internalAmbientTemperature: true,
  temperatureRespondsToTimeOfDay: true,
  temperatureRespondsToWeather: true,
  temperatureRespondsToElevation: true,
  temperatureRespondsToLocalEnvironment: true,
  phase1TemperatureEffects: "limited_foundation",
  hypothermiaDeferred: true,
  heatStressDeferred: true,
  complexBodyTemperatureSimulationDeferred: true,
  regionalWind: true,
  windHasDirectionAndIntensity: true,
  windChangesGradually: true,
  windCoupledToWeather: true,
  phase1WindIsEnvironmental: true,
  futureWindMechanicsDeferred: true,
  stormLightningAndThunder: true,
  lightningBeforeThunder: true,
  thunderDelayUsesApproximateDistance: true,
  phase1LightningIsEnvironmental: true,
  lightningDamageDeferred: true,
  causalFog: true,
  fogDependsOnHumidityTemperatureTimeAndWaterProximity: true,
  fogReducesVisibility: true,
  lowAreasAndWaterMarginsMayFavorFog: true,
  decorativeRandomFogForbidden: true,
  causalGroundDrying: true,
  groundDryingRespondsToSunTemperatureWindShadeAndHumidity: true,
  phase1EvaporationModel: "simple_causal",
  advancedHydrologyDeferred: true,
  localMicroclimates: true,
  microclimatesShareTheSameWorldWeatherSystem: true,
  microclimateFactors: ["forest", "clearing", "elevation", "river_margin", "dry_west"] as const,
  recentWeatherHasPersistentInfluence: true,
  weatherHistoryAffectsCurrentMoistureState: true,
  weatherStateMustNotForgetRecentConditionsInstantly: true,
  temporaryRainPuddlesMayFormCausally: true,
  puddlesRequireTerrainAndRainConditions: true,
  puddlesMayDisappearByInfiltrationOrEvaporation: true,
  wetVegetationState: true,
  phase1WetVegetationEffects: "primarily_visual",
  futureWetVegetationMechanicsPrepared: true,
  waterSurfaceRespondsVisuallyToTimeSkyRainAndWind: true,
  phase1WaterRenderingOptimizedForTopDownView: true,
  excessiveWaterSimulationDeferred: true,
  approachingWeatherHasNaturalPerceptibleSignals: true,
  stormSignalsMayPrecedeLocalArrival: true,
  modernAutomaticWeatherAlertInitiallyForbidden: true,
  temporaryWeatherTracksOnWetGround: true,
  phase1DeepTrackingMechanicsDeferred: true,
  naturalTerrainMayProvidePartialWeatherShelter: true,
  shelterEffectDependsOnLocalFeatures: true,
  perceivedTemperatureFoundation: true,
  perceivedTemperatureFactors: ["air_temperature", "wind", "rain", "humidity", "sun"] as const,
  complexBodyTemperatureConsequencesDeferred: true,
  weatherHasGradualSpatialTransitions: true,
  abruptInvisibleWeatherBordersForbidden: true,
  weatherRegionsBlendAcrossSpace: true,
  elevationAffectsLocalWeatherExposure: true,
  higherTerrainMayDifferInTemperatureWindFogAndExposure: true,
  forestCanopyInterceptsSomeRainfall: true,
  canopyDripMayContinueAfterDirectRain: true,
  phase1CanopyHydrologySimplified: true,
  groundDryingVariesBySunAndShade: true,
  moistureStateIsSpatiallyLocalNotMapUniform: true,
  offscreenRegionsUseSimplifiedClimateEvolution: true,
  detailedClimateSimulationPrioritizesRelevantLoadedAreas: true,
  returningToRegionReflectsElapsedInGameClimate: true,
  offlineGameClosureStillFreezesWorld: true,
  sunriseLightingRespondsToReliefAndOcclusion: true,
  elevatedTerrainMayReceiveDirectMorningLightEarlier: true,
  valleysAndDenseForestMayRemainShadedLonger: true,
  sunsetLightingRespondsToReliefAndOcclusion: true,
  terrainAndVegetationMayRemoveDirectEveningLightEarlier: true,
  causalDewFoundation: true,
  dewMayWetVegetationWithoutRain: true,
  dewDependsOnNightMorningHumidityAndTemperature: true,
  phase1DewModel: "simple_causal",
  sharedQueryableClimateState: true,
  sharedClimateStateFields: ["world_time", "light", "temperature", "humidity", "wind", "clouds", "precipitation", "fog"] as const,
  futureSystemsMustReadSharedClimateStateInsteadOfInventingIndependentWeather: true,
  climateDetailPrioritizesRelevantPlayerAreas: true,
  distantClimateUsesPerformanceSafeApproximation: true,
  visualWeatherMustRespectPerformanceBudget: true,
  pauseFreezesAllClimateEvolution: true,
  pauseFreezesCloudRainMoistureWindAndStormState: true,
  timeSpeedScalesSameClimateSimulation: true,
  changingTimeSpeedMustNotRerollWeather: true,
  changingTimeSpeedMustNotArbitrarilySkipClimateState: true,
  climateSimulationSeparatedFromRendering: true,
  visualWeatherCanImproveWithoutChangingPhysicalHistory: true,
  significantWeatherEventsCanBeRecordedInPlaceHistory: true,
  trivialWeatherNoiseNeedNotBeHistoricallyRecorded: true,
  physicalClimateTruthIsIndependentOfCharacterKnowledge: true,
  weatherUiRevealsOnlyObservedOrKnownInformation: true,
  phase1ClimatePrecisionLimitedToMeaningfulGameplayOrVisualValue: true,
  scientificMeteorologyBeyondPhase1Deferred: true,
  climateFoundationSupportsFutureExtensionsWithoutReplacement: true,
  futureClimateExtensions: ["seasons", "drought", "flooding", "snow", "weather_related_fire", "advanced_weather_phenomena"] as const,
  manualPauseAllowed: true,
  playerTimeSpeeds: [0, 1, 2, 4] as const,
  defaultTimeSpeed: 1,
  higherSpeedsDeferredUntilPlaytesting: true,
  pauseStopsWorldClock: true,
  pauseStopsTimeDependentSimulation: true,
  ordinaryMenusDoNotAutoPause: true,
  characterSelectionDoesNotAutoPause: true,
  tuningAfterPlaytestAllowed: true,
} as const;

export const FUTURE_META_BASES = {
  meta2: { enabled: false, scope: "time_and_basic_climate" },
  meta3: { enabled: true, muiPlusGuardsTotal: 8, guards: 7, guardsAreMen: true, formerRole: "royal_guards", earlierOccupation: "hunters" },
  meta4: { enabled: false, scope: "causal_fauna_and_natural_food" },
  meta5: { enabled: false, initiallyManagedResource: "wood_only", woodBehaviors: ["light", "resistant", "flexible"], discoveryIsGradual: true },
  meta6: { enabled: false, scope: "needs_and_fire" },
  meta7: { enabled: false, scope: "camp" },
  meta8: { enabled: false, scope: "tools_and_work" },
  meta9: { enabled: false, scope: "settlement", relocationHasCost: true, fixedStructuresTeleport: false },
  postContest: { enabled: false, scope: "future_development_after_first_functional_storage_building" },
  // Historical META 10–12 planning was removed from the active contract.
  // "META 12 = First Academy = contest vertical slice" is obsolete.
  // Current contest Chapter 1 stops after the first functional storage building.
  later: {
    enabled: false,
    playerMuiCommunication: "intuition_not_direct_orders",
    marketInitiallyLocked: true,
    progression: "azheryn_specific_not_conventional_levels",
    advancedKnowledgeLossTransmission: false,
    deepExpeditions: false,
    extensiveInjuryAndDeathSystems: false,
    largeSocialSystems: false,
    otherAcademies: false,
    rankingAndMultiplayer: false,
    historicalCycles: false,
  },
} as const;

export const INITIAL_GAME_VIEW = {
  currentVersions: "top_down_only",
  existingInclinedMapPresentationPreserved: true,
  thirdPerson: "future_version_only",
  thirdPersonEnabled: false,
} as const;

export const CONTEST_STORY_BOUNDARY = {
  enabled: true,
  stopAfter: "first_functional_storage_building",
  phase: "contest_vertical_slice",
  afterStop: "visual_and_graphical_deepening",
  furtherStoryRequiresExplicitAuthorization: true,
} as const;

export const MUI_EXCEPTIONAL_SHORT_BLADE = {
  enabled: false,
  implementationMeta: "future_character_object_work",
  definitiveObjectName: "Fehe",
  definitiveMineralName: null,
  totalLengthCm: 30,
  bladeLengthCm: 17,
  handleLengthCm: 13,
  bladePoints: { total: 13, frontal: 1, perSide: 6 },
  geometryGuide: "imaginary_equilateral_triangle",
  lateralPointsDoNotExceedGuide: true,
  bladeAndHandleCoreSameMaterial: true,
  mineralVisibleColor: "dark_violet",
  handleWrap: { material: "resistant_plant_fiber", color: "dark_brown" },
  bladeCenterThicknessCmApprox: 3,
  pointThicknessCmApprox: 0.5,
  handleThicknessCmApprox: 3,
  visualGeometryApproved: true,
  approvedVisualReference: "assets/fotos_y_bocetos/Fehe.jpeg",
  visualReferenceHasObsoleteDimensions: true,
  visualReferenceDimensionsCm: { total: 25, blade: 17, handle: 8 },
  dimensionalPrecedence: "30_total_17_blade_13_handle",
} as const;

export interface FoundingGuardBaseline {
  count: 7;
  formerOccupation: "hunter";
  royalRole: "guard";
  initialWorkResistance: true;
  muiGift: {
    kind: "exceptional_short_blade";
    name: "Fehe";
    material: null;
    finalGeometry: "approved_13_point_equilateral_triangle_guided_geometry";
  };
}

export const FOUNDING_GUARDS: FoundingGuardBaseline = {
  count: 7,
  formerOccupation: "hunter",
  royalRole: "guard",
  initialWorkResistance: true,
  muiGift: { kind: "exceptional_short_blade", name: "Fehe", material: null, finalGeometry: "approved_13_point_equilateral_triangle_guided_geometry" },
};

export const PROLOGUE_BEATS = [
  "outsider_meets_king_about_future_academy",
  "king_assigns_seven_guards_to_mui",
  "guards_initially_resist_construction_and_felling",
  "mui_gives_exceptional_short_blades",
  "mui_and_guards_depart",
  "arrival_starts_chapter_1",
] as const;

export interface AgentKnowledgeGate {
  perceived: boolean;
  conceptAvailable: boolean;
  learnedOrInferred: boolean;
  toolAccess: boolean;
}

export interface DiscoveryCandidate {
  observation: string;
  question?: string;
  hypothesis?: string;
  evidenceIds: string[];
}

export interface AQDAdapter {
  propose(input: DiscoveryCandidate): DiscoveryCandidate;
}

export interface DeltaEAdapter {
  stressTest(input: DiscoveryCandidate): { robust: boolean; failureBoundaries: string[] };
}

export interface EvidenceAdmissionAdapter {
  assess(input: DiscoveryCandidate): { admissible: boolean; reasons: string[] };
}

export interface KnowledgeCycleState {
  run: number;
  playerKnowledgeIds: string[];
  muiKnowledgeIds: string[];
  npcKnowledgeIds: string[];
  muiCrossCycleTeachingUnlocked: boolean;
}

export interface EcologyClassification {
  provenance: "local_plausible" | "transported_or_traded" | "contemporary_elsewhere" | "extinct_today_alive_then";
  naturalBehaviorRequired: true;
}

// Future causal simulation contract: combine agents, rules/state machines and
// ecology/physics as appropriate. Do not create one LLM per entity.
export interface CausalEntityContract {
  entityId: string;
  kind: "human" | "animal" | "plant" | "tree" | "object";
  autonomous: boolean;
  knowledgeGate?: AgentKnowledgeGate;
}

// Mui is the principal catalyst; the Academy later preserves/transmits knowledge.
// No future engine may bypass local perception, learning, materials, tools or organization.


export const META3_FOUNDING_CONTROL = {
  enabled: true,
  phase: "oleada_1_g1",
  arrival: {
    transition: "days_later",
    location: "central_clearing",
    mui: 1,
    formerGuards: 7,
    startState: "idle_available",
  },
  onboardingSpeaker: "game_system",
  muiRole: "player_world_extrapolation",
  playerMuiRelation: "bidirectional_gameplay_abstraction",
  orders: {
    playerCanSelectGroup: true,
    playerCanSelectIndividual: true,
    playerCanDesignateDestinationOrWorkZone: true,
    muiMayPhysicallyRelayNearbyOrders: true,
    muiPhysicalPresenceRequiredForRemoteOrders: false,
    remotePlayerOrdersActAsMuiCatalyst: true,
    literalTelepathyImplied: false,
    futureContractualOrderPatternsPrepared: true,
  },
  autonomy: {
    playerSetsObjective: true,
    charactersResolveMinorMovementAndExecution: true,
  },
  openingDialogueLiteralFrozen: false,
} as const;


export const META3_SELECTION_AND_MOVEMENT = {
  enabled: true,
  selection: {
    individual: true,
    multiple: true,
    visualIndicator: "subtle_ground_circle",
    indicatorShownForEverySelectedCharacter: true,
  },
  movementOrder: {
    terrainClickSetsDestination: true,
    selectedCharactersMoveAutomatically: true,
    basicObstacleAvoidanceRequired: true,
    foundationForFutureWorkZoneOrders: true,
  },
  groupMovement: {
    rigidMilitaryFormation: false,
    naturalSpacing: true,
    eachCharacterResolvesNearbyDestinationPosition: true,
  },
} as const;


export const META3_G1_HUMAN_VALIDATION = {
  validatedOn: "2026-10-06",
  result: "PASS",
  observed: ["eight_founding_characters_visible","individual_selection_indicator_visible","selected_character_moves_to_terrain_destination"],
  selectionBox: "deferred_to_wave_2",
  note: "Human laptop validation accepted current founding-character interaction as G1.",
} as const;
