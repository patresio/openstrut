/**
 * Change Execution Manifest generator.
 *
 * Orchestrates the full workflow:
 *   1. Read and parse proposal.md and tasks.md from the change directory.
 *   2. Load agent and skill inventories.
 *   3. Validate all constraints; collect all blocking errors.
 *   4. If errors: return { ok: false, errors }.
 *   5. Topologically sort tasks.
 *   6. Serialize to deterministic YAML.
 *   7. Write execution-manifest.yaml atomically.
 *   8. Return { ok: true, path }.
 *
 * No timestamps in manifest content. No LLM output. No external file mutations.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseFrontmatter, parseTasks } from './parse.js';
import { collectErrors } from './validate.js';
import { topoSort } from './order.js';
import { serializeManifest } from './serialize.js';
import { VALID_AGENTS } from './agents.js';
import { loadSkillInventory } from './skills.js';

/**
 * Generates the execution manifest for an approved OpenSpec change.
 *
 * @param {{
 *   changeDir: string,   Absolute path to the change directory.
 *   packageRoot: string, Absolute path to the harness package root.
 * }} opts
 * @returns {{ ok: true, path: string, yaml: string } | { ok: false, errors: string[] }}
 */
export function generate({ changeDir, packageRoot }) {
  // ── 1. Read source files & Structural validation ────────────────────────────
  let realChangeDir;
  try {
    realChangeDir = fs.realpathSync(changeDir);
    if (!fs.statSync(realChangeDir).isDirectory()) {
      throw new Error('Not a directory');
    }
  } catch (err) {
    return { ok: false, errors: [`BLOCKED — INVALID PATH: change directory does not exist or is not a directory`] };
  }

  const proposalPath = path.join(realChangeDir, 'proposal.md');
  const tasksPath = path.join(realChangeDir, 'tasks.md');
  const specsDir = path.join(realChangeDir, 'specs');

  let proposalSrc, tasksSrc;
  try {
    proposalSrc = fs.readFileSync(proposalPath, 'utf8');
  } catch (err) {
    return { ok: false, errors: [`BLOCKED — PROPOSAL REQUIRED: cannot read proposal.md: ${err.message}`] };
  }
  
  try {
    tasksSrc = fs.readFileSync(tasksPath, 'utf8');
  } catch (err) {
    return { ok: false, errors: [`BLOCKED — TASKS REQUIRED: cannot read tasks.md: ${err.message}`] };
  }

  // Check specs/ directory and at least one specs/<capability>/spec.md
  let hasValidSpec = false;
  if (fs.existsSync(specsDir) && fs.statSync(specsDir).isDirectory()) {
    const caps = fs.readdirSync(specsDir, { withFileTypes: true });
    for (const cap of caps) {
      if (cap.isDirectory()) {
        const specMdPath = path.join(specsDir, cap.name, 'spec.md');
        if (fs.existsSync(specMdPath) && fs.statSync(specMdPath).isFile()) {
          hasValidSpec = true;
          break;
        }
      }
    }
  }
  if (!hasValidSpec) {
    return { ok: false, errors: ['BLOCKED — SPEC REQUIRED: missing specs/<capability>/spec.md'] };
  }

  // ── 2. Parse ────────────────────────────────────────────────────────────────
  let frontmatter, tasks;
  try {
    frontmatter = parseFrontmatter(proposalSrc);
    tasks = parseTasks(tasksSrc);
  } catch (err) {
    return { ok: false, errors: [err.message] };
  }

  // Validate change identity (basename == change_id)
  const changeDirName = path.basename(realChangeDir);
  if (frontmatter && frontmatter.change_id) {
    if (/[/\\:]/.test(frontmatter.change_id) || frontmatter.change_id === '..' || frontmatter.change_id === '.') {
      return { ok: false, errors: ['BLOCKED — INVALID CHANGE ID FORMAT'] };
    }
    if (frontmatter.change_id !== changeDirName) {
      return { ok: false, errors: [`BLOCKED — CHANGE ID PATH MISMATCH: proposal change_id "${frontmatter.change_id}" does not match directory name "${changeDirName}"`] };
    }
  }

  // ── 3. Load inventories ─────────────────────────────────────────────────────
  const agentList = VALID_AGENTS;
  const skillInventory = loadSkillInventory(packageRoot);

  // ── 4. Validate ─────────────────────────────────────────────────────────────
  const errors = collectErrors({ frontmatter, tasks, agentList, skillInventory });
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // ── 5. Topological sort ─────────────────────────────────────────────────────
  let sortedTasks;
  try {
    sortedTasks = topoSort(tasks);
  } catch (err) {
    return { ok: false, errors: [err.message] };
  }

  // ── 6. Serialize ────────────────────────────────────────────────────────────
  const changePath = `openspec/changes/${changeDirName}`;

  const yaml = serializeManifest({
    change: {
      id: frontmatter.change_id,
      path: changePath,
      approval: {
        status: frontmatter.status,
        approved_by: frontmatter.approved_by,
        approved_at: frontmatter.approved_at,
      },
    },
    tasks: sortedTasks.map(t => ({
      id: t.id,
      title: t.title,
      heading: t.heading,
      agent: t.agent,
      skills: t.skills,
      dependsOn: t.dependsOn,
      parallelGroup: t.parallelGroup,
    })),
  });

  // ── 7. Write atomically ─────────────────────────────────────────────────────
  const manifestPath = path.join(realChangeDir, 'execution-manifest.yaml');
  const tmpPath = manifestPath + '.' + crypto.randomBytes(8).toString('hex') + '.tmp';

  try {
    fs.writeFileSync(tmpPath, yaml, { encoding: 'utf8', mode: 0o644 });
    fs.renameSync(tmpPath, manifestPath);
  } catch (err) {
    // Clean up temp file if rename failed
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    return { ok: false, errors: [`Failed to write execution-manifest.yaml: ${err.message}`] };
  }

  return { ok: true, path: manifestPath, yaml };
}
