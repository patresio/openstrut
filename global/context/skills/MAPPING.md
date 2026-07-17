# SK Selector → Runtime Skill Mapping

This file maps semantic SK## selectors to the actual runtime skill files installed under `global/skills/`.

## Active Mapping

| SK Selector | Runtime Skill | Status |
|-------------|--------------|--------|
| SK01 | opentrust-task-contract | active |
| SK03 | opentrust-observability | active |
| SK05 | opentrust-spec-change | active |
| SK11 | opentrust-tdd | active |
| SK16 | opentrust-tdd | active |
| SK17 | opentrust-review | active |
| SK18 | opentrust-review | active |
| SK19 | opentrust-delivery | active |
| SK23 | opentrust-tdd | active |
| SK26 | opentrust-review | active |
| SK29 | opentrust-reference-research | active |
| SK30 | opentrust-reference-research | active |

## Unmapped SK Selectors

The following SK selectors have semantic catalog files (`global/context/skills/SK*.md`) but no corresponding runtime skill:

- SK02, SK04, SK06–SK10, SK12–SK15, SK20–SK22, SK24–SK25, SK27–SK28, SK31–SK39

These are maintained as semantic reference only. They may be mapped to runtime skills in future releases.

## Notes

- Runtime skills use descriptive names (`opentrust-*`), not numbered selectors
- SK## files in `global/context/skills/` are semantic mapping docs, not executable skills
- All SK## files have status `mapped-runtime-diverged` per DEPRECATIONS.md policy
- Agent reference profiles reference SK## selectors; the actual runtime behavior comes from the mapped skill
