import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
});
