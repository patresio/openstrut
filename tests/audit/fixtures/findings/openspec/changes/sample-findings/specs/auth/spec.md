# Password Recovery

## US-002: Recover password via email

As a user, I want to recover my password so that I can regain access to my account.

- AC-003: Given a registered email, when I request recovery, then the system sends a reset link.
- **AC-004:** Given an expired token, when I use the link, then the system refuses.

## Assumptions

- ASM-002: The email service is available in the target environment.

## Open Questions

- Q-002: What is the token validity window?