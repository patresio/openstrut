import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Tool Mapping Layer', () => {
  describe('Tool Mapping Interface', () => {
    const toolMappingPath = join(projectRoot, 'src', 'plugins', 'tool-mapping.js');
    
    it('should exist', () => {
      assert.ok(existsSync(toolMappingPath), 'Tool mapping file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.length > 0, 'Tool mapping file should not be empty');
    });
    
    it('should export ToolMapping class', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('export class ToolMapping'), 'Tool mapping should export ToolMapping class');
    });
    
    it('should export createToolMapping function', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('export function createToolMapping'), 'Tool mapping should export createToolMapping function');
    });
    
    it('should export getPlatforms function', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('export function getPlatforms'), 'Tool mapping should export getPlatforms function');
    });
    
    it('should export getTools function', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('export function getTools'), 'Tool mapping should export getTools function');
    });
    
    it('should have TOOL_MAPPINGS constant', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('const TOOL_MAPPINGS'), 'Tool mapping should have TOOL_MAPPINGS constant');
    });
    
    it('should have PARAMETER_TRANSFORMS constant', () => {
      const content = readFileSync(toolMappingPath, 'utf-8');
      assert.ok(content.includes('const PARAMETER_TRANSFORMS'), 'Tool mapping should have PARAMETER_TRANSFORMS constant');
    });
  });
  
  describe('OpenCode Mapping', () => {
    const opencodeMappingPath = join(projectRoot, 'src', 'plugins', 'opencode-mapping.js');
    
    it('should exist', () => {
      assert.ok(existsSync(opencodeMappingPath), 'OpenCode mapping file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.length > 0, 'OpenCode mapping file should not be empty');
    });
    
    it('should export OpenCodeToolMapping class', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.includes('export class OpenCodeToolMapping'), 'OpenCode mapping should export OpenCodeToolMapping class');
    });
    
    it('should export createOpenCodeToolMapping function', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.includes('export function createOpenCodeToolMapping'), 'OpenCode mapping should export createOpenCodeToolMapping function');
    });
    
    it('should map ot-explore to read', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-explore': 'read'"), 'OpenCode mapping should map ot-explore to read');
    });
    
    it('should map ot-propose to write', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-propose': 'write'"), 'OpenCode mapping should map ot-propose to write');
    });
    
    it('should map ot-apply to bash', () => {
      const content = readFileSync(opencodeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-apply': 'bash'"), 'OpenCode mapping should map ot-apply to bash');
    });
  });
  
  describe('Claude Mapping', () => {
    const claudeMappingPath = join(projectRoot, 'src', 'plugins', 'claude-mapping.js');
    
    it('should exist', () => {
      assert.ok(existsSync(claudeMappingPath), 'Claude mapping file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.length > 0, 'Claude mapping file should not be empty');
    });
    
    it('should export ClaudeToolMapping class', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.includes('export class ClaudeToolMapping'), 'Claude mapping should export ClaudeToolMapping class');
    });
    
    it('should export createClaudeToolMapping function', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.includes('export function createClaudeToolMapping'), 'Claude mapping should export createClaudeToolMapping function');
    });
    
    it('should map ot-explore to Read', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-explore': 'Read'"), 'Claude mapping should map ot-explore to Read');
    });
    
    it('should map ot-propose to Write', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-propose': 'Write'"), 'Claude mapping should map ot-propose to Write');
    });
    
    it('should map ot-apply to Bash', () => {
      const content = readFileSync(claudeMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-apply': 'Bash'"), 'Claude mapping should map ot-apply to Bash');
    });
  });
  
  describe('Codex Mapping', () => {
    const codexMappingPath = join(projectRoot, 'src', 'plugins', 'codex-mapping.js');
    
    it('should exist', () => {
      assert.ok(existsSync(codexMappingPath), 'Codex mapping file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.length > 0, 'Codex mapping file should not be empty');
    });
    
    it('should export CodexToolMapping class', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.includes('export class CodexToolMapping'), 'Codex mapping should export CodexToolMapping class');
    });
    
    it('should export createCodexToolMapping function', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.includes('export function createCodexToolMapping'), 'Codex mapping should export createCodexToolMapping function');
    });
    
    it('should map ot-explore to read', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-explore': 'read'"), 'Codex mapping should map ot-explore to read');
    });
    
    it('should map ot-propose to write', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-propose': 'write'"), 'Codex mapping should map ot-propose to write');
    });
    
    it('should map ot-apply to bash', () => {
      const content = readFileSync(codexMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-apply': 'bash'"), 'Codex mapping should map ot-apply to bash');
    });
  });
  
  describe('Hermes Mapping', () => {
    const hermesMappingPath = join(projectRoot, 'src', 'plugins', 'hermes-mapping.js');
    
    it('should exist', () => {
      assert.ok(existsSync(hermesMappingPath), 'Hermes mapping file should exist');
    });
    
    it('should be readable', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.length > 0, 'Hermes mapping file should not be empty');
    });
    
    it('should export HermesToolMapping class', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes('export class HermesToolMapping'), 'Hermes mapping should export HermesToolMapping class');
    });
    
    it('should export createHermesToolMapping function', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes('export function createHermesToolMapping'), 'Hermes mapping should export createHermesToolMapping function');
    });
    
    it('should map ot-explore to read_file', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-explore': 'read_file'"), 'Hermes mapping should map ot-explore to read_file');
    });
    
    it('should map ot-propose to write_file', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-propose': 'write_file'"), 'Hermes mapping should map ot-propose to write_file');
    });
    
    it('should map ot-apply to execute_command', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes("'ot-apply': 'execute_command'"), 'Hermes mapping should map ot-apply to execute_command');
    });
    
    it('should transform parameters to snake_case', () => {
      const content = readFileSync(hermesMappingPath, 'utf-8');
      assert.ok(content.includes("k.replace(/([A-Z])/g, '_$1').toLowerCase()"), 'Hermes mapping should transform parameters to snake_case');
    });
  });
  
  describe('Cross-Platform Consistency', () => {
    it('all platforms should map ot-explore', () => {
      const opencodePath = join(projectRoot, 'src', 'plugins', 'opencode-mapping.js');
      const claudePath = join(projectRoot, 'src', 'plugins', 'claude-mapping.js');
      const codexPath = join(projectRoot, 'src', 'plugins', 'codex-mapping.js');
      const hermesPath = join(projectRoot, 'src', 'plugins', 'hermes-mapping.js');
      
      const opencode = readFileSync(opencodePath, 'utf-8');
      const claude = readFileSync(claudePath, 'utf-8');
      const codex = readFileSync(codexPath, 'utf-8');
      const hermes = readFileSync(hermesPath, 'utf-8');
      
      assert.ok(opencode.includes("'ot-explore'"), 'OpenCode should map ot-explore');
      assert.ok(claude.includes("'ot-explore'"), 'Claude should map ot-explore');
      assert.ok(codex.includes("'ot-explore'"), 'Codex should map ot-explore');
      assert.ok(hermes.includes("'ot-explore'"), 'Hermes should map ot-explore');
    });
    
    it('all platforms should map ot-apply', () => {
      const opencodePath = join(projectRoot, 'src', 'plugins', 'opencode-mapping.js');
      const claudePath = join(projectRoot, 'src', 'plugins', 'claude-mapping.js');
      const codexPath = join(projectRoot, 'src', 'plugins', 'codex-mapping.js');
      const hermesPath = join(projectRoot, 'src', 'plugins', 'hermes-mapping.js');
      
      const opencode = readFileSync(opencodePath, 'utf-8');
      const claude = readFileSync(claudePath, 'utf-8');
      const codex = readFileSync(codexPath, 'utf-8');
      const hermes = readFileSync(hermesPath, 'utf-8');
      
      assert.ok(opencode.includes("'ot-apply'"), 'OpenCode should map ot-apply');
      assert.ok(claude.includes("'ot-apply'"), 'Claude should map ot-apply');
      assert.ok(codex.includes("'ot-apply'"), 'Codex should map ot-apply');
      assert.ok(hermes.includes("'ot-apply'"), 'Hermes should map ot-apply');
    });
    
    it('all platforms should map ot-goal', () => {
      const opencodePath = join(projectRoot, 'src', 'plugins', 'opencode-mapping.js');
      const claudePath = join(projectRoot, 'src', 'plugins', 'claude-mapping.js');
      const codexPath = join(projectRoot, 'src', 'plugins', 'codex-mapping.js');
      const hermesPath = join(projectRoot, 'src', 'plugins', 'hermes-mapping.js');
      
      const opencode = readFileSync(opencodePath, 'utf-8');
      const claude = readFileSync(claudePath, 'utf-8');
      const codex = readFileSync(codexPath, 'utf-8');
      const hermes = readFileSync(hermesPath, 'utf-8');
      
      assert.ok(opencode.includes("'ot-goal'"), 'OpenCode should map ot-goal');
      assert.ok(claude.includes("'ot-goal'"), 'Claude should map ot-goal');
      assert.ok(codex.includes("'ot-goal'"), 'Codex should map ot-goal');
      assert.ok(hermes.includes("'ot-goal'"), 'Hermes should map ot-goal');
    });
  });
});
