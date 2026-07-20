import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Hermes Plugin', () => {
  const pluginDir = join(projectRoot, 'plugins', 'opentrust');
  
  describe('Plugin Directory', () => {
    it('should exist', () => {
      assert.ok(existsSync(pluginDir), 'Plugin directory should exist');
    });
  });
  
  describe('Plugin Manifest', () => {
    const manifestPath = join(pluginDir, 'plugin.yaml');
    
    it('should exist', () => {
      assert.ok(existsSync(manifestPath), 'Plugin manifest should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.length > 0, 'Plugin manifest should not be empty');
    });
    
    it('should have name property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: opentrust'), 'Plugin should have name property');
    });
    
    it('should have version property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('version: 1.0.0'), 'Plugin should have version property');
    });
    
    it('should have description property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('description:'), 'Plugin should have description property');
    });
    
    it('should have author property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('author:'), 'Plugin should have author property');
    });
  });
  
  describe('Hooks', () => {
    const manifestPath = join(pluginDir, 'plugin.yaml');
    
    it('should have hooks section', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('hooks:'), 'Plugin should have hooks section');
    });
    
    it('should have on_session_start hook', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: on_session_start'), 'Plugin should have on_session_start hook');
    });
    
    it('should have on_session_end hook', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: on_session_end'), 'Plugin should have on_session_end hook');
    });
    
    it('hooks should have command property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('command: python hooks.py'), 'Hooks should have command property');
    });
  });
  
  describe('Tools', () => {
    const manifestPath = join(pluginDir, 'plugin.yaml');
    
    it('should have tools section', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('tools:'), 'Plugin should have tools section');
    });
    
    it('should have ot_explore tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_explore'), 'Plugin should have ot_explore tool');
    });
    
    it('should have ot_propose tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_propose'), 'Plugin should have ot_propose tool');
    });
    
    it('should have ot_apply tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_apply'), 'Plugin should have ot_apply tool');
    });
    
    it('should have ot_review tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_review'), 'Plugin should have ot_review tool');
    });
    
    it('should have ot_ship tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_ship'), 'Plugin should have ot_ship tool');
    });
    
    it('should have ot_status tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_status'), 'Plugin should have ot_status tool');
    });
    
    it('should have ot_incident tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_incident'), 'Plugin should have ot_incident tool');
    });
    
    it('should have ot_synthetize tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_synthetize'), 'Plugin should have ot_synthetize tool');
    });
    
    it('should have ot_create tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_create'), 'Plugin should have ot_create tool');
    });
    
    it('should have ot_goal tool', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: ot_goal'), 'Plugin should have ot_goal tool');
    });
    
    it('tools should have command property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('command: python tools.py'), 'Tools should have command property');
    });
  });
  
  describe('Skills', () => {
    const manifestPath = join(pluginDir, 'plugin.yaml');
    
    it('should have skills section', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('skills:'), 'Plugin should have skills section');
    });
    
    it('should have opentrust_task_contract skill', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: opentrust_task_contract'), 'Plugin should have opentrust_task_contract skill');
    });
    
    it('should have opentrust_reference_research skill', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: opentrust_reference_research'), 'Plugin should have opentrust_reference_research skill');
    });
    
    it('should have opentrust_delivery skill', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('name: opentrust_delivery'), 'Plugin should have opentrust_delivery skill');
    });
    
    it('skills should have file property', () => {
      const content = readFileSync(manifestPath, 'utf-8');
      assert.ok(content.includes('file: skills/'), 'Skills should have file property');
    });
  });
  
  describe('Python Files', () => {
    it('should have __init__.py file', () => {
      const initPath = join(pluginDir, '__init__.py');
      assert.ok(existsSync(initPath), '__init__.py file should exist');
    });
    
    it('should have tools.py file', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      assert.ok(existsSync(toolsPath), 'tools.py file should exist');
    });
    
    it('should have hooks.py file', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      assert.ok(existsSync(hooksPath), 'hooks.py file should exist');
    });
    
    it('__init__.py should have register function', () => {
      const initPath = join(pluginDir, '__init__.py');
      const content = readFileSync(initPath, 'utf-8');
      assert.ok(content.includes('def register(ctx):'), '__init__.py should have register function');
    });
    
    it('__init__.py should register tools', () => {
      const initPath = join(pluginDir, '__init__.py');
      const content = readFileSync(initPath, 'utf-8');
      assert.ok(content.includes('ctx.register_tool'), '__init__.py should register tools');
    });
    
    it('__init__.py should register hooks', () => {
      const initPath = join(pluginDir, '__init__.py');
      const content = readFileSync(initPath, 'utf-8');
      assert.ok(content.includes('ctx.register_hook'), '__init__.py should register hooks');
    });
    
    it('__init__.py should register skills', () => {
      const initPath = join(pluginDir, '__init__.py');
      const content = readFileSync(initPath, 'utf-8');
      assert.ok(content.includes('ctx.register_skill'), '__init__.py should register skills');
    });
    
    it('tools.py should have handle_ot_explore function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_explore'), 'tools.py should have handle_ot_explore function');
    });
    
    it('tools.py should have handle_ot_propose function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_propose'), 'tools.py should have handle_ot_propose function');
    });
    
    it('tools.py should have handle_ot_apply function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_apply'), 'tools.py should have handle_ot_apply function');
    });
    
    it('tools.py should have handle_ot_review function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_review'), 'tools.py should have handle_ot_review function');
    });
    
    it('tools.py should have handle_ot_ship function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_ship'), 'tools.py should have handle_ot_ship function');
    });
    
    it('tools.py should have handle_ot_status function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_status'), 'tools.py should have handle_ot_status function');
    });
    
    it('tools.py should have handle_ot_incident function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_incident'), 'tools.py should have handle_ot_incident function');
    });
    
    it('tools.py should have handle_ot_synthetize function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_synthetize'), 'tools.py should have handle_ot_synthetize function');
    });
    
    it('tools.py should have handle_ot_create function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_create'), 'tools.py should have handle_ot_create function');
    });
    
    it('tools.py should have handle_ot_goal function', () => {
      const toolsPath = join(pluginDir, 'tools.py');
      const content = readFileSync(toolsPath, 'utf-8');
      assert.ok(content.includes('def handle_ot_goal'), 'tools.py should have handle_ot_goal function');
    });
    
    it('hooks.py should have on_session_start function', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('def on_session_start'), 'hooks.py should have on_session_start function');
    });
    
    it('hooks.py should have on_session_end function', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('def on_session_end'), 'hooks.py should have on_session_end function');
    });
    
    it('hooks.py should load agents', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('load_agents'), 'hooks.py should load agents');
    });
    
    it('hooks.py should load skills', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('load_skills'), 'hooks.py should load skills');
    });
    
    it('hooks.py should load context', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('load_context'), 'hooks.py should load context');
    });
    
    it('hooks.py should load commands', () => {
      const hooksPath = join(pluginDir, 'hooks.py');
      const content = readFileSync(hooksPath, 'utf-8');
      assert.ok(content.includes('load_commands'), 'hooks.py should load commands');
    });
  });
});
