# opentrust-diagnose

## When to Use

For hard bugs, performance regressions, and mysterious failures. A 6-phase disciplined approach that builds evidence before theorizing.

## Workflow

### Phase 1: Build Feedback Loop
Before theorizing, get a red-capable test:
- Reproduce the failure with a command or test
- If no test exists, create the smallest one that fails
- **Rule: never proceed without a feedback loop**

### Phase 2: Reproduce and Minimize
- Find the smallest failing case
- Remove variables one at a time
- Document the exact reproduction steps
- If intermittent: add logging to understand frequency

### Phase 3: Hypothesize
- One hypothesis at a time
- Record each hypothesis (even wrong ones)
- Predict what should change if hypothesis is correct
- **Rule: change one thing between hypothesis tests**

### Phase 4: Instrument
- Add logging, assertions, traces
- Use `console.error` for quick diagnosis (remove before fix)
- Check assumptions — print the values, don't assume them
- Profile if performance-related

### Phase 5: Fix
- Minimal change to pass the test
- No "while I'm here" cleanup
- Verify the fix passes the original failing test
- Verify no regressions (run full test suite)

### Phase 6: Cleanup
- Remove debug code
- Commit the fix with clear message
- Update task plan with evidence
- If the root cause is systemic, note it for follow-up

## Anti-Patterns

- Theorizing without a failing test
- Changing multiple things at once
- "It works on my machine" without understanding why
- Skipping instrumentation to save time
- Fixing the symptom instead of the cause

## Rules

- Never skip Phase 1 (feedback loop)
- Record every hypothesis, even wrong ones
- Change one thing at a time
- Minimal fix — don't refactor during diagnosis
- If stuck after 3 hypothesis rounds, escalate or take a break

## Output

- Root cause identified with evidence
- Fix implemented and tested
- Task plan updated with diagnosis trail
- Commit with clear message explaining the bug and fix

## References

- CTX17 (implementation), CTX23 (code quality)
- `opentrust-tdd` — for writing the regression test
- `opentrust-review` — for reviewing the fix
