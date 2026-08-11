import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync } from 'node:fs';
import { installPlugin } from '../../src/plugins/plugin-installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Plugin Installer', () => {
  describe('Plugin Installer Module', () => {
    const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
    
    it('should exist', () => {
      assert.ok(existsSync(pluginInstallerPath), 'Plugin installer file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.length > 0, 'Plugin installer file should not be empty');
    });
    
    it('should export installPlugin function', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes('export function installPlugin'), 'Plugin installer should export installPlugin function');
    });
    
    it('should export getPluginFiles function', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes('export function getPluginFiles'), 'Plugin installer should export getPluginFiles function');
    });
    
    it('should export getPlatforms function', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes('export function getPlatforms'), 'Plugin installer should export getPlatforms function');
    });
    
    it('should export getPluginConfig function', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes('export function getPluginConfig'), 'Plugin installer should export getPluginConfig function');
    });
    
    it('should have PLUGIN_CONFIGS constant', () => {
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes('const PLUGIN_CONFIGS'), 'Plugin installer should have PLUGIN_CONFIGS constant');
    });
  });
  
  describe('Plugin Configurations', () => {
    const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
    const content = readFileSync(pluginInstallerPath, 'utf-8');
    
    it('should have OpenCode configuration', () => {
      assert.ok(content.includes("opencode:"), 'Plugin installer should have OpenCode configuration');
    });
    
    it('should have Claude Code configuration', () => {
      assert.ok(content.includes("claude:"), 'Plugin installer should have Claude Code configuration');
    });
    
    it('should have Codex configuration', () => {
      assert.ok(content.includes("codex:"), 'Plugin installer should have Codex configuration');
    });
    
    it('should have Hermes configuration', () => {
      assert.ok(content.includes("hermes:"), 'Plugin installer should have Hermes configuration');
    });
    
    it('OpenCode should have correct pluginDir', () => {
      assert.ok(content.includes("pluginDir: '.opencode/plugins'"), 'OpenCode should have correct pluginDir');
    });
    
    it('Claude should have correct pluginDir', () => {
      assert.ok(content.includes("pluginDir: '.claude-plugin'"), 'Claude should have correct pluginDir');
    });
    
    it('Codex should have correct pluginDir', () => {
      assert.ok(content.includes("pluginDir: '.codex-plugin'"), 'Codex should have correct pluginDir');
    });
    
    it('Hermes should have correct pluginDir', () => {
      assert.ok(content.includes("pluginDir: 'plugins/opentrust'"), 'Hermes should have correct pluginDir');
    });
  });
  
  describe('Setup Integration', () => {
    const setupIndexPath = join(projectRoot, 'src', 'setup', 'index.js');
    
    it('should exist', () => {
      assert.ok(existsSync(setupIndexPath), 'Setup index file should exist');
    });
    
    it('should import installPlugin', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes("import { installPlugin"), 'Setup should import installPlugin');
    });
    
    it('should import getPluginPlatforms', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes("import { installPlugin, getPlatforms as getPluginPlatforms }"), 'Setup should import getPluginPlatforms');
    });
    
    it('should handle --platform flag', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes('opts.platform'), 'Setup should handle --platform flag');
    });
    
    it('should call installPlugin when platform is specified', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes('installPlugin(platform, {'), 'Setup should call installPlugin when platform is specified');
    });
    
    it('should export installPlugin', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes('installPlugin,'), 'Setup should export installPlugin');
    });
    
    it('should export getPluginPlatforms', () => {
      const content = readFileSync(setupIndexPath, 'utf-8');
      assert.ok(content.includes('getPluginPlatforms,'), 'Setup should export getPluginPlatforms');
    });
  });
  
  describe('Platform Support', () => {
    it('should support OpenCode platform', () => {
      const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes("opencode: {"), 'Should support OpenCode platform');
    });
    
    it('should support Claude Code platform', () => {
      const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes("claude: {"), 'Should support Claude Code platform');
    });
    
    it('should support Codex platform', () => {
      const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes("codex: {"), 'Should support Codex platform');
    });
    
    it('should support Hermes platform', () => {
      const pluginInstallerPath = join(projectRoot, 'src', 'plugins', 'plugin-installer.js');
      const content = readFileSync(pluginInstallerPath, 'utf-8');
      assert.ok(content.includes("hermes: {"), 'Should support Hermes platform');
    });
  });

  describe('Hermes installed plugin self-sufficiency (AC2/AC7)', () => {
    let tmpHome = '';

    before(() => {
      tmpHome = mkdtempSync(join(tmpdir(), 'opentrust-installer-'));
    });

    after(() => {
      if (tmpHome) rmSync(tmpHome, { recursive: true, force: true });
    });

    it('installed Hermes plugin ships skills/ populated from global/skills', () => {
      const result = installPlugin('hermes', { targetDir: tmpHome });
      assert.equal(result.ok, true, `installPlugin should succeed: ${result.error || ''}`);
      const installed = join(tmpHome, 'plugins', 'opentrust');
      const installedSkills = join(installed, 'skills');
      assert.ok(existsSync(join(installed, 'plugin.yaml')), 'installed plugin.yaml should exist');
      assert.ok(existsSync(installedSkills), 'installed plugin should ship skills/ (self-sufficient)');
      const canonicalSkills = [];
      const globalSkills = join(projectRoot, 'global', 'skills');
      for (const child of readdirSync(globalSkills)) {
        if (statSync(join(globalSkills, child)).isDirectory()
            && existsSync(join(globalSkills, child, 'SKILL.md'))) {
          canonicalSkills.push(child);
        }
      }
      assert.ok(canonicalSkills.length >= 11, `canonical skills >= 11, got ${canonicalSkills.length}`);
      for (const name of canonicalSkills) {
        assert.ok(existsSync(join(installedSkills, name, 'SKILL.md')),
          `installed plugin should ship skill "${name}"`);
      }
    });

    it('installed Hermes plugin copies canonical skills to flat skills tree', () => {
      const result = installPlugin('hermes', { targetDir: tmpHome });
      assert.equal(result.ok, true, `installPlugin should succeed: ${result.error || ''}`);
      const flatSkills = join(tmpHome, 'skills');
      assert.ok(existsSync(flatSkills), 'target dir should ship flat skills/ tree');
      const canonicalSkills = [];
      const globalSkills = join(projectRoot, 'global', 'skills');
      for (const child of readdirSync(globalSkills)) {
        if (statSync(join(globalSkills, child)).isDirectory()
            && existsSync(join(globalSkills, child, 'SKILL.md'))) {
          canonicalSkills.push(child);
        }
      }
      assert.ok(canonicalSkills.length >= 11, `canonical skills >= 11, got ${canonicalSkills.length}`);
      for (const name of canonicalSkills) {
        assert.ok(existsSync(join(flatSkills, name, 'SKILL.md')),
          `flat skills tree should ship skill "${name}"`);
      }
      const installedSkills = join(tmpHome, 'plugins', 'opentrust', 'skills');
      for (const name of canonicalSkills) {
        assert.ok(existsSync(join(installedSkills, name, 'SKILL.md')),
          `installed plugin should still ship skill "${name}"`);
      }
    });
  });
});
