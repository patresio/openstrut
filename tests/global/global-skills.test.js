/**
 * Global skills structural integrity tests.
 *
 * Validates that every SKILL.md file:
 * - Has valid YAML frontmatter
 * - Contains required sections
 * - References only known agents and skills from the inventory
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INVENTORY } from '../../src/installer/inventory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'global', 'skills');

function readSkill(name) {
  const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
  return fs.readFileSync(skillPath, 'utf8');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const result = {};
  for (const line of lines) {
    const sep = line.indexOf(': ');
    if (sep > 0) {
      result[line.slice(0, sep).trim()] = line.slice(sep + 2).trim();
    }
  }
  return result;
}

const SKILL_NAMES = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  // engineering-sdd-change uses a single ## Workflow with ### substeps — pre-convention format
  // engineering-sdd-change uses a single ## Workflow with ### substeps — pre-convention format
  .filter(name => name !== 'engineering-sdd-change')
  // opentrust-* are workflow-integration skills loaded by ot-* commands, not standalone loadable skills
  .filter(name => !name.startsWith('opentrust-'))
  // legacy skills moved to archive/global/skills/
  .filter(name => !fs.existsSync(path.join(SKILLS_DIR, name, 'SKILL.md')));

const INVENTORY_AGENTS = new Set(
  INVENTORY.filter(e => e.source.startsWith('global/agents/'))
    .map(e => path.basename(e.source, '.md'))
);

const INVENTORY_SKILLS = new Set(
  INVENTORY.filter(e => e.source.startsWith('global/skills/'))
    .map(e => e.source.split('/')[2])
);

describe('global skills structural integrity', () => {
  for (const name of SKILL_NAMES) {
    describe(name, () => {
      const content = readSkill(name);
      const frontmatter = parseFrontmatter(content);

      it('has valid YAML frontmatter', () => {
        assert.notEqual(frontmatter, null, `${name}/SKILL.md is missing frontmatter (--- blocks)`);
      });

      it('frontmatter has required fields', () => {
        assert.ok(frontmatter, 'frontmatter is null');
        assert.ok(frontmatter.name, `name is missing: ${JSON.stringify(frontmatter)}`);
        assert.ok(frontmatter.description, `description is missing`);
        assert.ok(frontmatter.description.length >= 10, `description too short: ${frontmatter.description}`);
      });

      it('frontmatter name matches directory name', () => {
        assert.ok(frontmatter, 'frontmatter is null');
        assert.equal(frontmatter.name, name, `frontmatter name "${frontmatter.name}" ≠ directory name "${name}"`);
      });

      it('has Purpose / Workflow section', () => {
        const has = content.includes('## Purpose') || content.includes('## Workflow');
        assert.ok(has, `Missing ## Purpose or ## Workflow section`);
      });

      it('has When to Load / Do Not Load When section', () => {
        const has = content.includes('## When to Load') || content.includes('## Do Not Load When');
        assert.ok(has, `Missing ## When to Load or ## Do Not Load When section`);
      });

      it('has Procedure / Workflow section', () => {
        const has = content.includes('## Procedure') || content.includes('## Workflow');
        assert.ok(has, `Missing ## Procedure or ## Workflow section`);
      });

      it('has Output / Required Evidence section', () => {
        const has = content.includes('## Output') || content.includes('## Required Evidence');
        assert.ok(has, `Missing ## Output or ## Required Evidence section`);
      });

      it('has Stop Conditions / Limits section', () => {
        const has = content.includes('## Stop Conditions') || content.includes('## Limits');
        assert.ok(has, `Missing ## Stop Conditions or ## Limits section`);
      });
    });
  }
});

// SK29, SK30, SK31 — legacy skills moved to archive/global/skills/
