import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Claude Code Plugin', () => {
  const pluginPath = join(projectRoot, '.claude-plugin', 'plugin.json');
  
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
  
  describe('Hooks', () => {
    it('should have hooks array', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.hooks), 'Plugin should have hooks array');
    });
    
    it('should have onSessionStart hook', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const hook = manifest.hooks.find(h => h.event === 'onSessionStart');
      assert.ok(hook, 'Plugin should have onSessionStart hook');
    });
    
    it('should have onSessionEnd hook', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const hook = manifest.hooks.find(h => h.event === 'onSessionEnd');
      assert.ok(hook, 'Plugin should have onSessionEnd hook');
    });
    
    it('hooks should have required properties', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      manifest.hooks.forEach(hook => {
        assert.ok(hook.name, 'Hook should have name');
        assert.ok(hook.event, 'Hook should have event');
        assert.ok(hook.action, 'Hook should have action');
      });
    });
  });
  
  describe('Agents', () => {
    it('should have agents array', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.ok(Array.isArray(manifest.agents), 'Plugin should have agents array');
    });
    
    it('should have 9 lead agents', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      assert.equal(manifest.agents.length, 9, 'Plugin should have 9 lead agents');
    });
    
    it('should have trust-lead agent', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const agent = manifest.agents.find(a => a.name === 'trust-lead');
      assert.ok(agent, 'Plugin should have trust-lead agent');
    });
    
    it('should have engineering-lead agent', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      const agent = manifest.agents.find(a => a.name === 'engineering-lead');
      assert.ok(agent, 'Plugin should have engineering-lead agent');
    });
    
    it('agents should have required properties', () => {
      const manifest = JSON.parse(readFileSync(pluginPath, 'utf-8'));
      manifest.agents.forEach(agent => {
        assert.ok(agent.name, 'Agent should have name');
        assert.ok(agent.path, 'Agent should have path');
        assert.ok(agent.description, 'Agent should have description');
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
  
  describe('Skills Directory', () => {
    it('should have skills directory', () => {
      const skillsDir = join(projectRoot, '.claude-plugin', 'skills');
      assert.ok(existsSync(skillsDir), 'Skills directory should exist');
    });
    
    it('should have opentrust-task-contract skill file', () => {
      const skillPath = join(projectRoot, '.claude-plugin', 'skills', 'opentrust-task-contract', 'SKILL.md');
      assert.ok(existsSync(skillPath), 'opentrust-task-contract skill file should exist');
    });
    
    it('should have opentrust-reference-research skill file', () => {
      const skillPath = join(projectRoot, '.claude-plugin', 'skills', 'opentrust-reference-research', 'SKILL.md');
      assert.ok(existsSync(skillPath), 'opentrust-reference-research skill file should exist');
    });
    
    it('skill files should have content', () => {
      const skillPath = join(projectRoot, '.claude-plugin', 'skills', 'opentrust-task-contract', 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8');
      assert.ok(content.length > 0, 'Skill file should have content');
    });
  });
});
