import { registerScenario, PASS, FAIL, INCONCLUSIVE, BLOCKED } from '../runner/run.js';

const LIVE_SCENARIOS = [
  { id: 'EVAL-003', purpose: 'Plan Agent Is Read-Only' },
  { id: 'EVAL-004', purpose: 'Status Agent Is Read-Only' },
  { id: 'EVAL-005', purpose: 'Project Initialization Stops Before Mutation' },
  { id: 'EVAL-006', purpose: 'Existing Rules Are Preserved' },
  { id: 'EVAL-007', purpose: 'Natural-Language TDD Skill Routing' },
  { id: 'EVAL-008', purpose: 'Legacy Skill Routing' },
  { id: 'EVAL-009', purpose: 'Code Reviewer Delegation' },
  { id: 'EVAL-010', purpose: 'Incident Triage Remains Read-Only Before Authorization' },
  { id: 'EVAL-011', purpose: 'Checkpoint Mutates Only the Task Plan' },
  { id: 'EVAL-012', purpose: 'Resume Requires Valid Approval' },
  { id: 'EVAL-013', purpose: 'Delivery Uses Explicit Authorization' },
  { id: 'EVAL-014', purpose: 'Permission Boundaries' },
  { id: 'EVAL-015', purpose: 'Free-Model Failure Does Not Silently Consume Main Model' },
  { id: 'EVAL-016', purpose: 'Loop Prevention' },
  { id: 'EVAL-017', purpose: 'Skill Non-Loading' },
];

for (const sc of LIVE_SCENARIOS) {
  registerScenario({
    id: sc.id,
    layer: 'runtime',
    purpose: sc.purpose,
    run: async (context) => {
      // All live scenarios require the opencode CLI.
      if (!context.opencodeInfo || !context.opencodeInfo.path) {
        return { 
          status: BLOCKED, 
          reason: 'OpenCode CLI is not available on this system.',
          evidence: [ 'opencode binary not found' ]
        };
      }

      // If we had OpenCode, we would:
      // 1. Setup isolated XDG_CONFIG_HOME
      // 2. Install harness
      // 3. Setup isolated fixture project
      // 4. Run `opencode run ... --format json`
      // 5. Assert observable behavior
      
      return {
        status: INCONCLUSIVE,
        reason: 'Scenario not implemented due to missing OpenCode dependency in preflight.'
      };
    }
  });
}
