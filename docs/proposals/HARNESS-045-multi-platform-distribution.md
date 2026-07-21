# Proposal: Multi-Platform Distribution Model

**Status:** Draft  
**Date:** 2026-07-20  
**Author:** trust-lead  
**Classification:** implementation (proposal phase)

## Objective

Analyze Superpowers' distribution model and propose how OpenTrust/OpenStrut can distribute agents, skills, and workflows to multiple AI coding platforms, including hermes-agent.

## Analysis: Superpowers Architecture

### What Superpowers Does Well

1. **Multi-platform distribution** — Same skills work across Claude Code, Codex, Cursor, OpenCode, Pi, and others
2. **Plugin-based architecture** — Each platform has a thin plugin that injects skills and bootstrap context
3. **Skill format standardization** — All skills use `SKILL.md` with frontmatter (name, description)
4. **Automatic activation** — Skills trigger based on context, not manual invocation
5. **Bootstrap injection** — Plugin injects "using-superpowers" context at session start

### How Superpowers Distributes

```
[Superpowers Repository]
    ↓
[Platform-Specific Plugins]
    ├── .claude-plugin/
    ├── .codex-plugin/
    ├── .opencode/plugins/superpowers.js
    ├── .pi/extensions/superpowers.ts
    └── .cursor-plugin/
    ↓
[Skills Library] (shared across platforms)
    └── skills/
        ├── brainstorming/SKILL.md
        ├── test-driven-development/SKILL.md
        └── ... (13 skills total)
```

### Key Insight: Skills Are Platform-Agnostic

Superpowers skills are written in natural language with tool mappings handled by plugins. The same `SKILL.md` file works across all platforms because:

1. Skills describe **what** to do, not **how** to call tools
2. Plugins map skill actions to platform-specific tools
3. Bootstrap context tells agents about available skills

## Current OpenTrust/OpenStrut State

### What We Have

| Component | Count | Description |
|-----------|-------|-------------|
| Commands | 10 | ot-explore, ot-propose, ot-apply, ot-review, ot-ship, ot-status, ot-incident, ot-synthetize, ot-create, ot-goal |
| Skills | 11 | opentrust-*, covering TDD, review, delivery, handoff, etc. |
| Agents | 40 | 9 leads + 31 subagents across 9 teams |
| Workflows | 0 | Legacy workflows not installed |
| Contexts | 32 | CTX01-CTX32 semantic selectors |
| Bundles | 24 | B01-B24 grouped contexts |

### How We Currently Install

Our installer (`bin/openstrut.js`) copies artifacts to `~/.config/opencode/`:

```
~/.config/opencode/
├── commands/ot-*.md
├── skills/opentrust-*/SKILL.md
├── agents/*.md
├── context/contexts/CTX01-32.md
├── context/bundles/B01-24.md
└── ...
```

### Limitation: OpenCode-Only

Currently, OpenTrust only installs to OpenCode. We don't support:

- Claude Code
- Codex
- Cursor
- Pi
- hermes-agent
- Other platforms

## Proposal: Multi-Platform Distribution

### Option A: Plugin-Based Distribution (Like Superpowers)

**Approach:** Create platform-specific plugins that inject OpenTrust skills and context.

**Structure:**

```
[OpenTrust Repository]
    ↓
[Platform Plugins]
    ├── .opencode/plugins/opentrust.js
    ├── .claude-plugin/opentrust.json
    ├── .codex-plugin/opentrust.json
    ├── .pi/extensions/opentrust.ts
    └── .cursor-plugin/opentrust.json
    ↓
[Shared Skills Library]
    └── global/skills/opentrust-*/SKILL.md
    ↓
[Shared Agents Library]
    └── global/agents/*.md
    ↓
[Shared Context Library]
    └── global/context/**/*.md
```

**Pros:**
- Same architecture as Superpowers (proven pattern)
- Skills are platform-agnostic
- Easy to add new platforms
- Can leverage existing plugin ecosystems

**Cons:**
- Requires maintaining multiple plugin implementations
- Plugin APIs differ across platforms
- Some platforms may not support plugins

### Option B: Package-Based Distribution (npm/pip/etc.)

**Approach:** Publish OpenTrust as a package that can be installed via package managers.

**Structure:**

```
[OpenTrust Package]
    ↓
[npm install opentrust]
    ↓
[Installation Script]
    ├── Detect platform (opencode, claude, codex, etc.)
    ├── Copy skills to platform-specific location
    ├── Register agents if platform supports it
    └── Inject bootstrap context
```

**Pros:**
- Standard installation method
- Version management via package managers
- Can support multiple platforms with one package

**Cons:**
- More complex installer logic
- Platform detection can be fragile
- Less control over plugin lifecycle

### Option C: Hybrid Approach (Recommended)

**Approach:** Combine package distribution with platform-specific adapters.

**Structure:**

```
[OpenTrust NPM Package]
    ├── global/           # Platform-agnostic artifacts
    │   ├── skills/
    │   ├── agents/
    │   ├── commands/
    │   └── context/
    ├── adapters/         # Platform-specific adapters
    │   ├── opencode.js
    │   ├── claude.js
    │   ├── codex.js
    │   └── hermes.js
    ├── bin/openstrut.js  # CLI installer
    └── package.json
```

**Installation:**

```bash
# Install globally
npm install -g opentrust

# Install for specific platform
opentrust install --platform opencode
opentrust install --platform claude
opentrust install --platform hermes

# Auto-detect platform
opentrust install
```

**Pros:**
- Single package for all platforms
- Clean separation of concerns
- Easy to extend with new adapters
- Maintains current installer pattern

**Cons:**
- Need to write platform adapters
- Some platforms may need workarounds

## Hermes-Agent Integration

### What is Hermes-Agent?

Hermes-agent is an AI coding agent that likely has its own configuration format and skill system. To integrate OpenTrust:

### Step 1: Understand Hermes Configuration

We need to understand:

1. Where does hermes-agent store its configuration?
2. What format does it use for agents/skills?
3. Does it support plugins or extensions?
4. How does it discover and load skills?

### Step 2: Create Hermes Adapter

```javascript
// adapters/hermes.js
export const HermesAdapter = {
  name: 'hermes',
  
  // Detect if running in hermes context
  detect: () => {
    return process.env.HERMES_AGENT || fs.existsSync('~/.hermes');
  },
  
  // Get installation path
  getInstallPath: () => {
    return path.join(os.homedir(), '.hermes', 'skills');
  },
  
  // Install skills
  install: async (artifacts) => {
    const target = this.getInstallPath();
    // Copy skills, agents, context to target
    await copyArtifacts(artifacts, target);
  },
  
  // Generate bootstrap context
  getBootstrap: () => {
    return `
You have OpenTrust engineering harness installed.

Available commands:
- ot-explore: Explore codebase
- ot-propose: Create task contract
- ot-apply: Implement changes
- ot-review: Review changes
- ot-ship: Deliver changes
- ot-status: Check status
- ot-incident: Handle incidents
- ot-synthetize: Refine ideas
- ot-create: Analyze project gaps
- ot-goal: Process pending tasks

Use these commands to follow the OpenTrust workflow.
    `;
  }
};
```

### Step 3: Update Installer

```javascript
// bin/openstrut.js
const adapters = {
  opencode: opencodeAdapter,
  claude: claudeAdapter,
  codex: codexAdapter,
  hermes: hermesAdapter,
};

async function install(platform) {
  const adapter = adapters[platform] || detectPlatform();
  await adapter.install(artifacts);
  console.log(`Installed for ${adapter.name}`);
}
```

## Comparative Analysis

| Feature | Superpowers | OpenTrust (Proposed) |
|---------|-------------|---------------------|
| Platforms | 10+ | 4+ (OpenCode, Claude, Codex, Hermes) |
| Skills | 13 | 11 |
| Agents | 0 | 40 |
| Commands | 0 | 10 |
| Contexts | 0 | 32 |
| Installation | Plugin-based | Package + adapters |
| Activation | Automatic | Manual commands |
| Focus | Individual developer | Team coordination |

## Key Differences

### Superpowers Focus
- Individual developer productivity
- TDD, debugging, brainstorming skills
- Automatic skill triggering
- No agent topology

### OpenTrust Focus
- Team coordination (9 teams, 40 agents)
- Engineering workflow (explore, propose, apply, review, ship)
- Retrieval context (CTX, SK, B, DOC selectors)
- Permission model and safety gates

## Recommendation

### Phase 1: Research (1-2 days)

1. Investigate hermes-agent configuration format
2. Investigate Claude Code plugin system
3. Investigate Codex plugin system
4. Document platform differences

### Phase 2: Adapter Design (2-3 days)

1. Define adapter interface
2. Create adapter for OpenCode (existing)
3. Create adapter for hermes-agent
4. Create adapter for Claude Code

### Phase 3: Implementation (3-5 days)

1. Refactor installer to support multiple platforms
2. Implement adapter pattern
3. Add platform detection
4. Test across platforms

### Phase 4: Distribution (1-2 days)

1. Update package.json for npm publication
2. Create installation documentation
3. Test installation across platforms
4. Publish to npm

## Open Questions

1. **Hermes Configuration:** Where does hermes-agent store its configuration? What format does it use?
2. **Plugin Support:** Does hermes-agent support plugins or extensions?
3. **Skill Discovery:** How does hermes-agent discover and load skills?
4. **Agent Support:** Can hermes-agent load custom agents from files?
5. **Bootstrap Injection:** How can we inject context at session start in hermes-agent?

## Next Steps

1. Research hermes-agent architecture
2. Research Claude Code plugin system
3. Create adapter interface specification
4. Implement prototype adapter for hermes-agent

## References

- Superpowers: https://github.com/obra/superpowers
- Superpowers OpenCode Install: https://raw.githubusercontent.com/obra/superpowers/main/.opencode/INSTALL.md
- Superpowers Plugin: https://raw.githubusercontent.com/obra/superpowers/main/.opencode/plugins/superpowers.js
- OpenTrust Workflow: docs/opencode/WORKFLOW.md
- OpenTrust Task Contract: docs/opencode/TASK_CONTRACT.md
