import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { mkdtempSync, cpSync, rmSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');
const pluginDir = join(projectRoot, 'plugins', 'opentrust');
const globalSkillsDir = join(projectRoot, 'global', 'skills');

/**
 * Parse top-level YAML keys from a manifest using line-anchored regex.
 * Project has zero deps, so no YAML library is available. Only top-level
 * scalar keys are needed for structural assertions.
 * @param {string} text
 * @returns {Record<string, string>}
 */
function parseTopLevelYaml(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const m = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/**
 * Extract registered skill names from __init__.py register() calls.
 * @param {string} initSource
 * @returns {string[]}
 */
function extractRegisterSkillNames(initSource) {
  const names = [];
  for (const m of initSource.matchAll(/register_skill\(\s*["']([^"']+)["']/g)) {
    names.push(m[1]);
  }
  return names;
}

/**
 * Extract tool names from schemas in tools.py: {"name": "ot_..."}
 * @param {string} toolsSource
 * @returns {string[]}
 */
function extractSchemaToolNames(toolsSource) {
  const names = [];
  for (const m of toolsSource.matchAll(/"name"\s*:\s*"(ot_[a-z_]+)"/g)) {
    names.push(m[1]);
  }
  return [...new Set(names)];
}

describe('Hermes Plugin (structural contract)', () => {
  describe('Plugin Directory', () => {
    it('should exist', () => {
      assert.ok(existsSync(pluginDir), 'Plugin directory should exist');
    });
  });

  describe('Manifest (plugin.yaml native format)', () => {
    const manifestPath = join(pluginDir, 'plugin.yaml');
    let source = '';
    let manifest = {};

    before(() => {
      source = readFileSync(manifestPath, 'utf-8');
      manifest = parseTopLevelYaml(source);
    });

    it('should exist', () => {
      assert.ok(existsSync(manifestPath), 'plugin.yaml should exist');
    });

    it('should declare name', () => {
      assert.equal(manifest.name, 'opentrust');
    });

    it('should declare version', () => {
      assert.ok(manifest.version && /^\d+\.\d+\.\d+$/.test(manifest.version.trim()),
        `version should be semver, got: ${manifest.version}`);
    });

    it('should declare description', () => {
      assert.ok(manifest.description && manifest.description.length > 0,
        'description should be present and non-empty');
    });

    it('should declare author', () => {
      assert.ok(manifest.author && manifest.author.length > 0,
        'author should be present and non-empty');
    });

    it('should NOT use legacy `command:` field (native plugin does not shell out)', () => {
      assert.ok(!/^\s*command:\s*python/.test(source),
        'native Hermes plugins do not use command: python <file>');
    });
  });

  describe('Tools (schemas + handlers contract)', () => {
    const initPath = join(pluginDir, '__init__.py');
    const toolsPath = join(pluginDir, 'tools.py');
    let initSource = '';
    let toolsSource = '';

    before(() => {
      initSource = readFileSync(initPath, 'utf-8');
      toolsSource = readFileSync(toolsPath, 'utf-8');
    });

    it('should have __init__.py with def register(ctx)', () => {
      assert.ok(/def register\(ctx\)/.test(initSource),
        '__init__.py should define register(ctx)');
    });

    it('should register tools with native signature name/toolset/schema/handler', () => {
      const callCount = (initSource.match(/register_tool\(/g) || []).length;
      assert.ok(callCount >= 10, `expected >=10 register_tool calls, got ${callCount}`);
      assert.ok(/register_tool\(\s*name=/.test(initSource),
        'register_tool should use name= keyword');
      assert.ok(/register_tool\([\s\S]*toolset=/.test(initSource),
        'register_tool should use toolset= keyword');
      assert.ok(/register_tool\([\s\S]*schema=/.test(initSource),
        'register_tool should use schema= keyword');
      assert.ok(/register_tool\([\s\S]*handler=/.test(initSource),
        'register_tool should use handler= keyword');
    });

    it('should register the 10 ot_* tools', () => {
      const expected = [
        'ot_explore', 'ot_propose', 'ot_apply', 'ot_review', 'ot_ship',
        'ot_status', 'ot_incident', 'ot_synthetize', 'ot_create', 'ot_goal',
      ];
      for (const tool of expected) {
        assert.ok(initSource.includes(`"${tool}"`) || initSource.includes(`'${tool}'`),
          `register should reference ${tool}`);
      }
    });

    it('tools.py should define schemas with name and parameters for each ot_* tool', () => {
      const schemaNames = extractSchemaToolNames(toolsSource);
      const expected = [
        'ot_explore', 'ot_propose', 'ot_apply', 'ot_review', 'ot_ship',
        'ot_status', 'ot_incident', 'ot_synthetize', 'ot_create', 'ot_goal',
      ];
      for (const tool of expected) {
        assert.ok(schemaNames.includes(tool), `schema for ${tool} should exist in tools.py`);
      }
      assert.ok(/parameters\s*:\s*\{/.test(toolsSource) || /"parameters"\s*:/.test(toolsSource),
        'schemas should declare parameters');
    });

    it('handlers should use real contract signature (args: dict, **kwargs) -> JSON string', () => {
      for (const tool of [
        'ot_explore', 'ot_propose', 'ot_apply', 'ot_review', 'ot_ship',
        'ot_status', 'ot_incident', 'ot_synthetize', 'ot_create', 'ot_goal',
      ]) {
        const handlerName = `handle_${tool}`;
        assert.ok(new RegExp(`def ${handlerName}\\(\\s*args\\s*(,\\s*\\*\\*kwargs\\s*)?\\)`).test(toolsSource),
          `handler ${handlerName} should accept args (and **kwargs)`);
      }
      assert.ok(/json\.dumps/.test(toolsSource),
        'handlers should return JSON strings via json.dumps');
      assert.ok(!/def handle_ot_apply\(session, task, project\)/.test(toolsSource),
        'legacy (session, task, project) handler signature must be gone');
    });
  });

  describe('Skills (resource_loader dynamic discovery, no magic number)', () => {
    const initPath = join(pluginDir, '__init__.py');
    const loaderPath = join(pluginDir, 'resource_loader.py');
    let initSource = '';
    let loaderSource = '';

    before(() => {
      initSource = readFileSync(initPath, 'utf-8');
      loaderSource = readFileSync(loaderPath, 'utf-8');
    });

    it('should ship a resource_loader.py with load_skills(ctx)', () => {
      assert.ok(existsSync(loaderPath), 'plugin should ship resource_loader.py');
      assert.ok(/def load_skills\(ctx\)/.test(loaderSource),
        'resource_loader.py should define load_skills(ctx)');
      assert.ok(/def discover_skills\(/.test(loaderSource),
        'resource_loader.py should define discover_skills(...)');
    });

    it('load_skills should register every discovered skill via ctx.register_skill(name, Path)', () => {
      assert.ok(/ctx\.register_skill\(/.test(loaderSource),
        'load_skills should call ctx.register_skill(...)');
      assert.ok(/register_skill\(\s*name\s*,\s*skills_dir\s*\/\s*name\s*\/\s*"SKILL\.md"\)/.test(loaderSource)
        || /register_skill\([^)]*SKILL\.md[^)]*\)/.test(loaderSource),
        'register_skill should point at <skills_dir>/<name>/SKILL.md');
    });

    it('discover_skills should scan subdirectories */SKILL.md without a magic count', () => {
      assert.ok(/iterdir\(\)/.test(loaderSource),
        'discover_skills should use iterdir() over the skills dir');
      assert.ok(/SKILL\.md/.test(loaderSource),
        'discover_skills should look for SKILL.md files');
      const magicCountPatterns = [
        /len\(skills\)\s*==\s*11/,
        /skills\s*=\s*11/,
        /for\s+i\s+in\s+range\(11\)/,
        /range\(11\)/,
      ];
      for (const p of magicCountPatterns) {
        assert.ok(!p.test(initSource) && !p.test(loaderSource),
          `magic count pattern not allowed: ${p}`);
      }
    });

    it('should resolve resources via Path(__file__).parent (installed) or OPENSTRUST_ROOT (dev)', () => {
      assert.ok(/Path\(__file__\)/.test(loaderSource),
        'resource_loader should resolve from the plugin directory');
      assert.ok(/OPENSTRUST_ROOT/.test(loaderSource),
        'resource_loader should support OPENSTRUST_ROOT as the explicit dev source');
      assert.ok(!loaderSource.includes('parent.parent.parent'),
        'resource_loader must not resolve via parent.parent.parent');
      assert.ok(!/\.\.\/global/.test(loaderSource),
        'resource_loader must not reference ../../global relative paths');
    });

    it('should NOT hardcode a magic skill count in __init__.py or tools.py', () => {
      const magicCountPatterns = [
        /register_skill\(\s*["']opentrust_[a-z_]+["']\s*,\s*["']skills\//,
        /for\s+range\(11\)/,
      ];
      for (const p of magicCountPatterns) {
        assert.ok(!p.test(initSource),
          `magic count / legacy registration pattern not allowed: ${p}`);
      }
    });

    it('canonical global/skills source should have >=11 skills available', () => {
      const canonicalNames = [];
      if (existsSync(globalSkillsDir)) {
        for (const child of readdirSync(globalSkillsDir)) {
          if (statSync(join(globalSkillsDir, child)).isDirectory()
              && existsSync(join(globalSkillsDir, child, 'SKILL.md'))) {
            canonicalNames.push(child);
          }
        }
      }
      assert.ok(canonicalNames.length >= 11,
        `canonical global/skills should have >=11 skills, got ${canonicalNames.length}`);
    });
  });

  describe('Hooks (real events only, no session.context injection)', () => {
    const initPath = join(pluginDir, '__init__.py');
    let initSource = '';
    let hooksSource = '';

    before(() => {
      initSource = readFileSync(initPath, 'utf-8');
      const hooksPath = join(pluginDir, 'hooks.py');
      hooksSource = existsSync(hooksPath) ? readFileSync(hooksPath, 'utf-8') : '';
    });

    it('should NOT reference legacy session.context injection', () => {
      assert.ok(!initSource.includes('session.context'),
        '__init__.py must not use session.context (API does not exist)');
      assert.ok(!hooksSource.includes('session.context'),
        'hooks.py must not use session.context (API does not exist)');
    });

    it('should NOT register the fake on_session_start hook', () => {
      assert.ok(!/register_hook\(\s*["']on_session_start["']/.test(initSource),
        'on_session_start is not a native plugin hook event');
    });

    it('any registered hook must use a real event name', () => {
      const hookEvents = [];
      for (const m of initSource.matchAll(/register_hook\(\s*["']([^"']+)["']/g)) {
        hookEvents.push(m[1]);
      }
      const allowed = new Set([
        'post_tool_call', 'on_session_end', 'pre_tool_call',
        'agent_start', 'agent_end', 'agent_step',
      ]);
      for (const ev of hookEvents) {
        assert.ok(allowed.has(ev), `hook event "${ev}" must be a real Hermes event`);
      }
    });
  });

  describe('Isolation (installed plugin must be self-sufficient)', () => {
    let tmpHome = '';

    before(() => {
      tmpHome = mkdtempSync(join(tmpdir(), 'opentrust-plugin-'));
    });

    after(() => {
      if (tmpHome) rmSync(tmpHome, { recursive: true, force: true });
    });

    it('installed plugin resolves resources from its own skills/ dir (Path(__file__).parent)', () => {
      // Simulate an installed plugin: copy the plugin source and populate
      // skills/ from canonical global/skills (as the installer does).
      const installed = join(tmpHome, 'opentrust');
      cpSync(pluginDir, installed, { recursive: true });
      const installedSkills = join(installed, 'skills');
      if (existsSync(globalSkillsDir)) {
        for (const child of readdirSync(globalSkillsDir)) {
          const skillMd = join(globalSkillsDir, child, 'SKILL.md');
          if (statSync(join(globalSkillsDir, child)).isDirectory() && existsSync(skillMd)) {
            cpSync(join(globalSkillsDir, child), join(installedSkills, child), { recursive: true });
          }
        }
      }
      assert.ok(existsSync(join(installed, 'plugin.yaml')), 'installed plugin.yaml should exist');
      assert.ok(existsSync(installedSkills), 'installed plugin should ship skills/ populated by installer');
      // Resource loading must be relative to the plugin dir (Path(__file__).parent),
      // and must not use repo-relative traversal.
      for (const f of ['__init__.py', 'tools.py', 'resource_loader.py']) {
        const src = readFileSync(join(installed, f), 'utf-8');
        assert.ok(!src.includes('parent.parent.parent'),
          `${f} must not resolve resources via parent.parent.parent`);
        assert.ok(!/\.\.\/global/.test(src),
          `${f} must not reference ../../global relative paths`);
      }
    });
  });
});
