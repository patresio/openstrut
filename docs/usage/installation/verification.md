# Verification

Use these checks after copying or installing a release.

## Release File Verification

From the client release directory:

```bash
sha256sum -c SHA256SUMS
```

Expected:

```text
patrese-opencode-engineering-harness-0.1.0.tgz: OK
```

## Harness Check

```bash
npm exec \
  --yes \
  --package="$tarball" \
  -- opencode-engineering-harness \
  check \
  --target "$HOME/.config/opencode"
```

Expected:

```text
All managed artifacts match the installed version.
```

## Expected Managed Artifacts

Key installed files should include:

```text
AGENTS.md
opencode.json
agents/code-reviewer.md
agents/project-rules-auditor.md
agents/sdd.md
agents/documentation-generator.md
agents/harness-generator.md
commands/eng-spec-change.md
skills/engineering-sdd-change/SKILL.md
skills/engineering-documentation/SKILL.md
skills/harness-generation/SKILL.md
templates/project/AGENTS.md
workflows/project-documentation.yaml
workflows/harness-generation.yaml
```

## OpenCode Verification

After install:

```bash
opencode agent list
```

You should see the installed harness-managed agents in addition to native OpenCode agents.

## Troubleshooting

If `check` reports drift:

1. do not overwrite manually;
2. inspect the conflict;
3. run `plan` again;
4. preserve local config and secrets;
5. resolve unmanaged files intentionally.

If checksum fails:

1. delete the copied files;
2. copy again with SCP;
3. re-run `sha256sum -c SHA256SUMS`;
4. do not install until checksum passes.
