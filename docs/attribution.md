# Attribution

OpenStrut's spec-anchored audit gate adapts patterns from **onp-spec-driven**
(MIT © Vitor Manoel — O Novo Programador). The source project is used as provenance only, never as a runtime interface.

Patterns adapted (not copied):

- spec-anchored audit gate — the machine audits the spec via exit code;
- traceability model (US → AC → T → test);
- executable definition of done;
- assumptions and open questions as first-class spec citizens;
- cost-control confirmation (model/effort per task before mutation);
- `agent:` platform-variant marker for multi-platform skills.

Adapted in:

- `docs/design/012-spec-anchored-gate.md`
- `global/skills/opentrust-spec-anchored/SKILL.md`
- `global/commands/ot-audit.md`
- `src/audit/`