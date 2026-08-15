---
name: plan-creator
description: This skill should be used when the agent is in plan mode and needs to create a structured plan for a new feature or task. It ensures the plan is always written to .kilo/plans/ using a consistent format.
---

# Plan Creator

This skill provides a standardized workflow for creating feature plans when operating in plan mode.

## When to Use

Use this skill whenever the agent is in plan mode and needs to document a planned feature, refactor, or task. The skill ensures plans are stored consistently in `.kilo/plans/` with a predictable structure.

## Plan Location

Always create plans in `.kilo/plans/`. Create this directory if it does not exist.

## Plan Naming

Use kebab-case filenames with a descriptive title and sequential numbering when needed. Example:

- `add-dark-mode.md`
- `refactor-auth-flow.md`
- `1-add-dark-mode.md` (for first plan in a series)

## Plan Template

Every plan must follow this structure:

```markdown
# Plan: <Title>

## Summary
One-paragraph overview of the feature or change.

## Motivation
Why this work is needed. Include user value, technical debt, or business rationale.

## Approach
Detailed steps for implementation. Break into numbered items or phases.

## Files to Modify
- `path/to/file1.ts` — change description
- `path/to/file2.ts` — change description

## Files to Create
- `path/to/newfile.ts` — purpose

## Risks / Open Questions
Any blockers, assumptions, or decisions needed before implementation.
```

## Usage Instructions

1. When entering plan mode for a new feature or task, load this skill.
2. Read any relevant project context needed to draft an accurate plan.
3. Create the plan file in `.kilo/plans/` using the template above.
4. Review the plan for completeness before presenting it to the user.
5. After the plan is approved and implemented, remove the plan file or move it to an archive if requested.
