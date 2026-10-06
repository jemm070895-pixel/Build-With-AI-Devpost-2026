import assert from 'node:assert/strict'
import test from 'node:test'
import {
  initialGameState,
  isPersonAvailable,
  processGameCommand,
  type ActivityId,
  type GameCommand,
  type GameState,
  type PersonId,
} from '../src/game.ts'

function assignPeople(state: GameState, activityId: ActivityId, personIds: PersonId[]) {
  return processGameCommand(state, { type: 'assignPeople', activityId, personIds })
}

function advanceTime(state: GameState): GameState {
  const result = processGameCommand(state, { type: 'advanceTime' })
  assert.equal(result.ok, true)
  return result.state
}

test('research assignment commits a master and student and marks them unavailable', () => {
  const result = assignPeople(initialGameState, 'research', ['edda', 'mira'])

  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(isPersonAvailable(result.state, 'edda'), false)
  assert.equal(isPersonAvailable(result.state, 'mira'), false)
  assert.equal(isPersonAvailable(result.state, 'joren'), true)
})

test('an assigned person cannot be committed to competing work', () => {
  const firstAssignment = assignPeople(initialGameState, 'research', ['edda', 'mira'])

  assert.equal(firstAssignment.ok, true)
  if (!firstAssignment.ok) return

  const competingAssignment = assignPeople(firstAssignment.state, 'academySupport', ['edda', 'joren'])

  assert.equal(competingAssignment.ok, false)
  if (competingAssignment.ok) return
  assert.equal(competingAssignment.reason, 'unavailable')
  assert.strictEqual(competingAssignment.state, firstAssignment.state)
  assert.deepEqual(competingAssignment.domainEvents, [])
})

test('research requires both roles but does not require a domain specialist', () => {
  const missingRole = assignPeople(initialGameState, 'research', ['edda', 'ilya'])
  const crossDomainTeam = assignPeople(initialGameState, 'research', ['edda', 'joren'])

  assert.equal(missingRole.ok, false)
  if (missingRole.ok) return
  assert.equal(missingRole.reason, 'researchRoles')
  assert.deepEqual(missingRole.domainEvents, [])
  assert.equal(crossDomainTeam.ok, true)
})

test('a failed assignment does not mutate the prior game state', () => {
  const result = assignPeople(initialGameState, 'research', ['mira'])

  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.reason, 'researchRoles')
  assert.strictEqual(result.state, initialGameState)
  assert.deepEqual(result.domainEvents, [])
  assert.deepEqual(initialGameState.assignments, [])
})

test('one time step creates a sourced observation and keeps research assigned', () => {
  const assignment = assignPeople(initialGameState, 'research', ['teren', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const advanced = advanceTime(assignment.state)
  const observation = advanced.research.observations[0]

  assert.equal(advanced.timeStep, 1)
  assert.equal(advanced.research.stage, 'observation')
  assert.equal(advanced.research.hypotheses.length, 0)
  assert.equal(advanced.research.results.length, 0)
  assert.equal(advanced.research.knowledge.length, 0)
  assert.equal(advanced.assignments.length, 1)
  assert.equal(isPersonAvailable(advanced, 'teren'), false)
  assert.ok(observation)
  assert.equal(observation.sourceEventId, advanced.worldEvents[0]?.id)
  assert.equal(observation.observedAt, advanced.timeStep)
  assert.deepEqual(observation.observerIds, ['teren', 'joren'])
  assert.equal(observation.contribution, 'domainRelevant')
})

test('a specialist forms a hypothesis on a later tick, not during observation', () => {
  const assignment = assignPeople(initialGameState, 'research', ['teren', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const observed = advanceTime(assignment.state)
  const hypothesized = advanceTime(observed)

  assert.equal(hypothesized.timeStep, 2)
  assert.equal(hypothesized.research.stage, 'hypothesis')
  assert.equal(hypothesized.research.hypotheses.length, 1)
  assert.deepEqual(
    hypothesized.research.hypotheses[0]?.observationIds,
    hypothesized.research.observations.map((item) => item.id),
  )
  assert.equal(hypothesized.research.results.length, 0)
  assert.equal(hypothesized.assignments.length, 1)
})

test('research resolves on a later test and does not automatically create knowledge', () => {
  const assignment = assignPeople(initialGameState, 'research', ['teren', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const observed = advanceTime(assignment.state)
  const hypothesized = advanceTime(observed)
  const resolved = advanceTime(hypothesized)
  const result = resolved.research.results[0]

  assert.equal(resolved.timeStep, 3)
  assert.equal(resolved.research.stage, 'result')
  assert.equal(resolved.research.tests.length, 1)
  assert.ok(result)
  assert.equal(result.outcome, 'partial')
  assert.equal(result.hypothesisId, resolved.research.hypotheses[0]?.id)
  assert.equal(result.testId, resolved.research.tests[0]?.id)
  assert.deepEqual(result.observationIds, resolved.research.hypotheses[0]?.observationIds)
  assert.deepEqual(result.recordIds, [])
  assert.equal(resolved.research.knowledge.length, 0)
  assert.equal(resolved.assignments.length, 0)
  assert.equal(isPersonAvailable(resolved, 'teren'), true)
})

test('cross-domain work contributes contextual observations and remains assignable', () => {
  const assignment = assignPeople(initialGameState, 'research', ['edda', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const firstTick = advanceTime(assignment.state)
  const secondTick = advanceTime(firstTick)
  const result = advanceTime(secondTick)

  assert.equal(firstTick.research.observations[0]?.contribution, 'crossDomain')
  assert.equal(secondTick.research.stage, 'hypothesis')
  assert.equal(secondTick.research.hypotheses.length, 1)
  assert.equal(result.research.results[0]?.outcome, 'inconclusive')
  assert.equal(result.research.stage, 'result')
})

test('a preserved record supports later cross-domain research by explicit references', () => {
  const stateWithRecord: GameState = {
    ...initialGameState,
    research: {
      ...initialGameState.research,
      stage: 'observation',
      observations: [
        {
          id: 'observation-prior-activity',
          sourceEventId: 'event-prior-activity',
          domain: 'astronomy',
          observerIds: ['teren'],
          observedAt: 0,
          contribution: 'domainRelevant',
          status: 'lost',
          visibility: 'player',
        },
      ],
      records: [
        {
          id: 'record-prior-observation',
          observationIds: ['observation-prior-activity'],
          domain: 'astronomy',
          recordedBy: ['teren'],
          recordedAt: 0,
          visibility: 'player',
        },
      ],
    },
  }
  const assignment = assignPeople(stateWithRecord, 'research', ['edda', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const hypothesized = advanceTime(assignment.state)
  const resolved = advanceTime(hypothesized)
  const hypothesis = resolved.research.hypotheses[0]
  const result = resolved.research.results[0]

  assert.equal(hypothesis?.recordIds.includes('record-prior-observation'), true)
  assert.equal(hypothesis?.observationIds.includes('observation-prior-activity'), true)
  assert.equal(result?.outcome, 'supported')
  assert.equal(result?.recordIds.includes('record-prior-observation'), true)
  assert.equal(result?.observationIds.includes('observation-prior-activity'), true)
  assert.equal(resolved.research.knowledge.length, 0)
})

test('a lost observation without a preserved record cannot support a hypothesis', () => {
  const stateWithLostObservation: GameState = {
    ...initialGameState,
    research: {
      ...initialGameState.research,
      stage: 'observation',
      observations: [
        {
          id: 'observation-lost',
          sourceEventId: 'event-lost',
          domain: 'astronomy',
          observerIds: ['teren'],
          observedAt: 0,
          contribution: 'domainRelevant',
          status: 'lost',
          visibility: 'player',
        },
      ],
    },
  }
  const assignment = assignPeople(stateWithLostObservation, 'research', ['edda', 'joren'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const firstTick = advanceTime(assignment.state)
  assert.equal(firstTick.research.stage, 'observation')
  assert.equal(firstTick.research.hypotheses.length, 0)
  assert.equal(firstTick.research.observations.length, 2)

  const secondTick = advanceTime(firstTick)
  const hypothesis = secondTick.research.hypotheses[0]

  assert.equal(secondTick.research.stage, 'hypothesis')
  assert.ok(hypothesis)
  assert.equal(hypothesis.observationIds.includes('observation-lost'), false)
  assert.deepEqual(
    hypothesis.observationIds,
    secondTick.research.observations
      .filter((observation) => observation.status === 'present')
      .map((observation) => observation.id),
  )
})

test('a rediscovered observation is directly available to later research', () => {
  const stateWithRediscoveredObservation: GameState = {
    ...initialGameState,
    research: {
      ...initialGameState.research,
      stage: 'observation',
      observations: [
        {
          id: 'observation-rediscovered',
          sourceEventId: 'event-rediscovered',
          domain: 'astronomy',
          observerIds: ['teren'],
          observedAt: 0,
          contribution: 'domainRelevant',
          status: 'rediscovered',
          visibility: 'player',
        },
      ],
    },
  }
  const assignment = assignPeople(
    stateWithRediscoveredObservation,
    'research',
    ['edda', 'joren'],
  )

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const advanced = advanceTime(assignment.state)
  const hypothesis = advanced.research.hypotheses[0]

  assert.equal(advanced.research.stage, 'hypothesis')
  assert.ok(hypothesis)
  assert.ok(hypothesis.observationIds.includes('observation-rediscovered'))
})

test('Academy support resolves in one tick without advancing research', () => {
  const assignment = assignPeople(initialGameState, 'academySupport', ['edda'])

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return

  const advanced = advanceTime(assignment.state)

  assert.equal(advanced.timeStep, 1)
  assert.equal(advanced.research.stage, 'question')
  assert.equal(advanced.research.observations.length, 0)
  assert.equal(advanced.lastResolutions[0]?.outcome, 'supportResolved')
  assert.equal(isPersonAvailable(advanced, 'edda'), true)
})

test('time advances one deterministic tick without active work or evidence creation', () => {
  const firstTick = advanceTime(initialGameState)
  const secondTick = advanceTime(firstTick)

  assert.equal(firstTick.timeStep, 1)
  assert.equal(secondTick.timeStep, 2)
  assert.equal(secondTick.research.stage, 'question')
  assert.equal(secondTick.worldEvents.length, 0)
})

test('a resolved question cannot accept another research assignment', () => {
  const resolvedState: GameState = {
    ...initialGameState,
    research: { ...initialGameState.research, stage: 'result' },
  }

  const result = assignPeople(resolvedState, 'research', ['teren', 'joren'])

  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.reason, 'researchResolved')
  assert.strictEqual(result.state, resolvedState)
  assert.deepEqual(result.domainEvents, [])
})

test('an unknown command is rejected without changing state or emitting events', () => {
  const invalidCommand = { type: 'teleportPeople' } as unknown as GameCommand
  const result = processGameCommand(initialGameState, invalidCommand)

  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.reason, 'invalidCommand')
  assert.strictEqual(result.state, initialGameState)
  assert.deepEqual(result.domainEvents, [])
})

test('the same command sequence deterministically returns the same state and events', () => {
  function runSequence() {
    const assignment = processGameCommand(initialGameState, {
      type: 'assignPeople',
      activityId: 'research',
      personIds: ['teren', 'joren'],
    })
    assert.equal(assignment.ok, true)
    if (!assignment.ok) return assignment

    const tick = processGameCommand(assignment.state, { type: 'advanceTime' })
    return {
      state: tick.state,
      domainEvents: [...assignment.domainEvents, ...tick.domainEvents],
    }
  }

  assert.deepEqual(runSequence(), runSequence())
})

test('successful commands do not mutate the previous state and emit domain events', () => {
  const previousState = structuredClone(initialGameState)
  const assignment = processGameCommand(initialGameState, {
    type: 'assignPeople',
    activityId: 'research',
    personIds: ['teren', 'joren'],
  })

  assert.equal(assignment.ok, true)
  assert.deepEqual(initialGameState, previousState)
  if (!assignment.ok) return
  assert.deepEqual(assignment.domainEvents.map((event) => event.type), ['assignment.committed'])

  const tick = processGameCommand(assignment.state, { type: 'advanceTime' })

  assert.equal(tick.ok, true)
  if (!tick.ok) return
  assert.deepEqual(
    tick.domainEvents.map((event) => event.type),
    ['time.advanced', 'world.activityOccurred', 'research.observationRecorded', 'activity.resolved'],
  )
})

test('mutating returned domain-event payloads cannot mutate authoritative state', () => {
  const assignment = processGameCommand(initialGameState, {
    type: 'assignPeople',
    activityId: 'research',
    personIds: ['teren', 'joren'],
  })

  assert.equal(assignment.ok, true)
  if (!assignment.ok) return
  const assignmentEvent = assignment.domainEvents[0]
  assert.equal(assignmentEvent?.type, 'assignment.committed')
  if (assignmentEvent?.type !== 'assignment.committed') return
  assignmentEvent.personIds.pop()
  assert.deepEqual(assignment.state.assignments[0]?.personIds, ['teren', 'joren'])

  const tick = processGameCommand(assignment.state, { type: 'advanceTime' })

  assert.equal(tick.ok, true)
  if (!tick.ok) return
  const observationEvent = tick.domainEvents.find((event) => event.type === 'research.observationRecorded')
  assert.equal(observationEvent?.type, 'research.observationRecorded')
  if (observationEvent?.type !== 'research.observationRecorded') return
  observationEvent.observation.observerIds.pop()
  assert.deepEqual(tick.state.research.observations[0]?.observerIds, ['teren', 'joren'])
})