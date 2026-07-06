# HARNESS-026: Skill-Creator Agent

## Status
DONE

## Classification
implementation

## Objective
Create a `skill-creator` subagent (AG18) that generates new skills following the established SKILL.md pattern, with proper x-harness metadata, Barsa routing, and inventory updates.

## Approved Scope
- Create `global/agents/skill-creator.md` (AG18)
- Update `docs/barsa/ctx-routing.md` with complete CTX documentation for CTX01, CTX02, CTX03, CTX09, CTX15, CTX20
- Add AG18 to inventory.js
- Update tests for 18 agents / 73 artifacts

## CTX Mapping
| CTX | Topic | Role in skill-creator |
|-----|-------|----------------------|
| CTX14 | Software Architecture | Structure and design patterns |
| CTX23 | Code Quality & Testing | Validation, TDD, quality criteria |
| CTX20 | DevOps & Infrastructure | Git workflow, branches, commits |

## Microincrements
1. [x] Create `global/agents/skill-creator.md`
2. [x] Update `docs/barsa/ctx-routing.md` with CTX01, CTX02, CTX03, CTX09, CTX15, CTX20 + CTX14/23/20 agent refs
3. [x] Add AG18 to `src/installer/inventory.js`
4. [x] Update test counts (metadata.test.js, installer.test.js)
5. [x] Validate and run `npm test` — 492 pass, 0 fail

## Evidence
- [x] Agent file created at `global/agents/skill-creator.md`
- [x] ctx-routing.md updated with 6 new CTX definitions + skill-creator agent references
- [x] inventory.js now includes AG18 (73 artifacts, 18 agents)
- [x] metadata.test.js: 17->18 agents; installer.test.js: 72->73 artifacts, 17->18 agents
- [x] npm test: 492 pass, 0 fail
