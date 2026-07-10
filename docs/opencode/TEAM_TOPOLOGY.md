# OpenTrust Team Topology

## Overview

OpenTrust organizes AI-assisted engineering into 9 specialized teams. Each team has one lead agent and a team of subagents. Teams are autonomous within their scope and coordinate through explicit contracts (task contracts and reference profiles).

Total: 9 leads + 31 subagents = **40 agents** (final approved topology).

## Teams

### 1. Trust Coordination

| Role | Agent |
|------|-------|
| Lead | trust-lead |
| Subagents | coordination-facilitator, meeting-scribe, decision-logger |

Coordinates cross-team communication, decision logging, meeting facilitation, and overall process health. Owns the workflow itself.

### 2. Product / Discovery

| Role | Agent |
|------|-------|
| Lead | product-lead |
| Subagents | product-discovery, requirements-analyzer, story-slicer |

Product strategy, discovery, requirements, acceptance criteria, and story slicing. Transforms vague requests into actionable, testable tasks.

### 3. Architecture

| Role | Agent |
|------|-------|
| Lead | architecture-lead |
| Subagents | architecture-decision-designer, domain-modeler, api-database-designer, distributed-systems-reviewer |

Structural decisions, domain modeling, API and database contracts, distributed systems review, and Architecture Decision Records.

### 4. Engineering

| Role | Agent |
|------|-------|
| Lead | engineering-lead |
| Subagents | feature-implementer, code-refactoring-specialist, performance-engineer, security-reviewer, privacy-reviewer |

Implementation, refactoring, performance, security, and privacy. The primary implementation team.

### 5. Testing / Quality

| Role | Agent |
|------|-------|
| Lead | quality-lead |
| Subagents | tdd-engineer, integration-tester, testing-strategy-designer |

Test strategy, TDD, integration tests, end-to-end tests, and quality gates.

### 6. Review / Governance

| Role | Agent |
|------|-------|
| Lead | review-lead |
| Subagents | code-reviewer, compliance-auditor, ux-accessibility-reviewer, workflow-governance-auditor |

Independent review, compliance, frontend/UX review, accessibility, and workflow-governance audit. Gating function before delivery.

### 7. DevOps / SRE

| Role | Agent |
|------|-------|
| Lead | devops-lead |
| Subagents | ci-cd-infrastructure-engineer, observability-designer, incident-triage-specialist |

CI/CD, infrastructure, observability, and incident response.

### 8. Delivery / Release

| Role | Agent |
|------|-------|
| Lead | delivery-lead |
| Subagents | release-manager, changelog-writer, issue-pr-coordinator |

Release management, versioning, changelog, deployment coordination, and issue/PR traceability.

### 9. Knowledge / Context

| Role | Agent |
|------|-------|
| Lead | knowledge-lead |
| Subagents | context-historian, reference-librarian, documentation-skill-creator |

Context retrieval, reference library management, documentation generation, and skill creation. Transforms retrieval selector queries into applicable synthesis.

## Team Interaction Model

```
Product → Architecture → Engineering → Review → DevOps → Delivery
   ↑                        |               ↑
   |                        ↓               |
   +--------- Testing ------+---------------+
   |
   +--------- Knowledge (feeds all teams with retrieval)
   |
   +--------- Trust Coordination (oversees all)
```

Each team communicates via task contracts with a Retrieval Context section. Teams use the local selector catalog during runtime; any external research must be written back into Markdown before it becomes operationally relevant.
