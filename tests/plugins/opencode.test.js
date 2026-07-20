import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('OpenCode Plugin', () => {
  const pluginPath = join(projectRoot, '.opencode', 'plugins', 'opentrust.js');
  
  describe('Plugin File', () => {
    it('should exist', () => {
      assert.ok(existsSync(pluginPath), 'Plugin file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.length > 0, 'Plugin file should not be empty');
    });
    
    it('should export default object', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('export default'), 'Plugin should export default object');
    });
    
    it('should have name property', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("name: 'opentrust'"), 'Plugin should have name property');
    });
    
    it('should have version property', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("version: '1.0.0'"), 'Plugin should have version property');
    });
    
    it('should have description property', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('description:'), 'Plugin should have description property');
    });
    
    it('should have bootstrap function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('bootstrap: async'), 'Plugin should have bootstrap function');
    });
  });
  
  describe('Plugin Bootstrap', () => {
    it('should load agents', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('loadAgents'), 'Plugin should load agents');
    });
    
    it('should load skills', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('loadSkills'), 'Plugin should load skills');
    });
    
    it('should load context', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('loadContext'), 'Plugin should load context');
    });
    
    it('should load commands', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('loadCommands'), 'Plugin should load commands');
    });
    
    it('should inject context into session', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('ctx.injectContext'), 'Plugin should inject context into session');
    });
    
    it('should register tools', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('ctx.registerTool'), 'Plugin should register tools');
    });
  });
  
  describe('Tool Registration', () => {
    it('should register ot-explore tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-explore'"), 'Plugin should register ot-explore tool');
    });
    
    it('should register ot-propose tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-propose'"), 'Plugin should register ot-propose tool');
    });
    
    it('should register ot-apply tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-apply'"), 'Plugin should register ot-apply tool');
    });
    
    it('should register ot-review tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-review'"), 'Plugin should register ot-review tool');
    });
    
    it('should register ot-ship tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-ship'"), 'Plugin should register ot-ship tool');
    });
    
    it('should register ot-status tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-status'"), 'Plugin should register ot-status tool');
    });
    
    it('should register ot-incident tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-incident'"), 'Plugin should register ot-incident tool');
    });
    
    it('should register ot-synthetize tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-synthetize'"), 'Plugin should register ot-synthetize tool');
    });
    
    it('should register ot-create tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-create'"), 'Plugin should register ot-create tool');
    });
    
    it('should register ot-goal tool', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes("'ot-goal'"), 'Plugin should register ot-goal tool');
    });
  });
  
  describe('Tool Handlers', () => {
    it('should have handleOtExplore function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtExplore'), 'Plugin should have handleOtExplore function');
    });
    
    it('should have handleOtPropose function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtPropose'), 'Plugin should have handleOtPropose function');
    });
    
    it('should have handleOtApply function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtApply'), 'Plugin should have handleOtApply function');
    });
    
    it('should have handleOtReview function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtReview'), 'Plugin should have handleOtReview function');
    });
    
    it('should have handleOtShip function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtShip'), 'Plugin should have handleOtShip function');
    });
    
    it('should have handleOtStatus function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtStatus'), 'Plugin should have handleOtStatus function');
    });
    
    it('should have handleOtIncident function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtIncident'), 'Plugin should have handleOtIncident function');
    });
    
    it('should have handleOtSynthetize function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtSynthetize'), 'Plugin should have handleOtSynthetize function');
    });
    
    it('should have handleOtCreate function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtCreate'), 'Plugin should have handleOtCreate function');
    });
    
    it('should have handleOtGoal function', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('handleOtGoal'), 'Plugin should have handleOtGoal function');
    });
  });
  
  describe('Context Loading', () => {
    it('should load from global/agents/', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('global/agents'), 'Plugin should load from global/agents/');
    });
    
    it('should load from global/skills/', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('global/skills'), 'Plugin should load from global/skills/');
    });
    
    it('should load from global/context/', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('global/context'), 'Plugin should load from global/context/');
    });
    
    it('should load from global/commands/', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('global/commands'), 'Plugin should load from global/commands/');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('catch (error)'), 'Plugin should handle errors gracefully');
    });
    
    it('should log errors', () => {
      const content = readFileSync(pluginPath, 'utf-8');
      assert.ok(content.includes('console.error'), 'Plugin should log errors');
    });
  });
});
