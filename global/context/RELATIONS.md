# Relations

## Base Relations
- CTX files describe semantic domains.
- SK files map reusable skill IDs to semantic roles and runtime status.
- AG files map selector IDs to semantic/runtime roles only.
- B files group related CTX selectors when evidence exists.
- DOC files map symbolic doc selectors to repo-local files.

## Runtime Separation
- `global/agents/*.md` are executable runtime prompts.
- `global/skills/*/SKILL.md` are executable runtime skills.
- `global/context/**` is reference content only.
