---
description: Diagnose and recover from urgent failures.
agent: build
---

# Triage Engineering Incident

**Purpose:** Diagnose, contain, and recover from urgent failures safely.

## Instructions
1. Load the `engineering-incident-triage` skill using your native skill tool.
2. Begin with read-only evidence capture and diagnosis to establish severity, impact, timeline, hypotheses, containment options, rollback options, and the smallest diagnostic.
3. Perform mutation only when the specific action is explicitly authorized.
4. Create or adopt an active Task Plan after approval and before mutation.
5. Do not interpret urgency as blanket approval.
6. Do not perform blind restarts, broad cleanup, destructive recovery, or silent environment/model fallback.
7. Preserve global and project-local instructions.
8. If prerequisites cannot be met, stop and provide a factual report.

**Incident Context:** $ARGUMENTS
