import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Codex Plugin', () => {
  const pluginPath = join(projectRoot, '.codex-plugin', 'plugin.json');
  
  describe('Plugin Manifest', () => {
    it('should exist', () => {
      assert.ok(existsSync(pluginPath), 'Plugin manifest should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.length > 0, 'Plugin manifest should not be empty');
    });
    
    it('should be valid JSON', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.doesNotThrow(() => JSON.parse(content), 'Plugin manifest should be valid JSON');
    });
    
    it('should have name property', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.equal(manifest.name, 'opentrust', 'Plugin should have name property');
    });
    
    it('should have version property', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.equal(manifest.version, '1.0.0', 'Plugin should have version property');
    });
    
    it('should have description property', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(manifest.description, 'Plugin should have description property');
    });
    
    it('should have author property', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.equal(manifest.author, 'OpenTrust Team', 'Plugin should have author property');
    });
  });
  
  describe('Skills', () => {
    it('should have skills array', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.skills), 'Plugin should have skills array');
    });
    
    it('should have at least 10 skills', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(manifest.skills.length >= 10, 'Plugin should have at least 10 skills');
    });
    
    it('should have opentrust-task-contract skill', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const skill = manifest.skills.find(s => s.name === 'opentrust-task-contract');
      assert.ok(skill, 'Plugin should have opentrust-task-contract skill');
    });
    
    it('should have opentrust-reference-research skill', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const skill = manifest.skills.find(s => s.name === 'opentrust-reference-research');
      assert.ok(skill, 'Plugin should have opentrust-reference-research skill');
    });
    
    it('should have opentrust-delivery skill', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const skill = manifest.skills.find(s => s.name === 'opentrust-delivery');
      assert.ok(skill, 'Plugin should have opentrust-delivery skill');
    });
    
    it('skills should have required properties', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      manifest.skills.forEach(skill => {
        assert.ok(skill.name, 'Skill should have name');
        assert.ok(skill.path, 'Skill should have path');
        assert.ok(skill.description, 'Skill should have description');
      });
    });
  });
  
  describe('Apps', () => {
    it('should have apps array', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.apps), 'Plugin should have apps array');
    });
    
    it('should have opentrust-bootstrap app', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const app = manifest.apps.find(a => a.name === 'opentrust-bootstrap');
      assert.ok(app, 'Plugin should have opentrust-bootstrap app');
    });
    
    it('should have opentrust-status app', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const app = manifest.apps.find(a => a.name === 'opentrust-status');
      assert.ok(app, 'Plugin should have opentrust-status app');
    });
    
    it('apps should have required properties', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      manifest.apps.forEach(app => {
        assert.ok(app.name, 'App should have name');
        assert.ok(app.entrypoint, 'App should have entrypoint');
        assert.ok(app.description, 'App should have description');
      });
    });
  });
  
  describe('Permissions', () => {
    it('should have permissions object', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(manifest.permissions, 'Plugin should have permissions object');
    });
    
    it('should have fileSystem permissions', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(manifest.permissions.fileSystem, 'Plugin should have fileSystem permissions');
    });
    
    it('should have read permissions', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.permissions.fileSystem.read), 'Plugin should have read permissions');
    });
    
    it('should have write permissions', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.permissions.fileSystem.write), 'Plugin should have write permissions');
    });
    
    it('should have git permissions', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(manifest.permissions.git, 'Plugin should have git permissions');
    });
  });
  
  describe('Bootstrap File', () => {
    it('should have bootstrap.js file', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      assert.ok(existsSync(bootstrapPath), 'bootstrap.js file should exist');
    });
    
    it('bootstrap.js should have content', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.length > 0, 'bootstrap.js should have content');
    });
    
    it('bootstrap.js should export bootstrap function', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('export async function bootstrap'), 'bootstrap.js should export bootstrap function');
    });
    
    it('bootstrap.js should load agents', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('loadAgents'), 'bootstrap.js should load agents');
    });
    
    it('bootstrap.js should load skills', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('loadSkills'), 'bootstrap.js should load skills');
    });
    
    it('bootstrap.js should load context', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('loadContext'), 'bootstrap.js should load context');
    });
    
    it('bootstrap.js should load commands', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('loadCommands'), 'bootstrap.js should load commands');
    });
    
    it('bootstrap.js should register tools', () => {
      const bootstrapPath = join(projectRoot, '.codex-plugin', 'bootstrap.js');
      const content = readFileSync(bootstrapPath, 'utf-8');
      assert.ok(content.includes('session.registerTool'), 'bootstrap.js should register tools');
    });
  });
  
  describe('Skills Directory', () => {
    it('should have skills directory', () => {
      const skillsDir = join(projectRoot, '.codex-plugin', 'skills');
      assert.ok(existsSync(skillsDir), 'Skills directory should exist');
    });
  });
});
