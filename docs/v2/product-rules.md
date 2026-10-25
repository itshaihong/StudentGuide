# Product rules for V2 and later

These rules capture the user's direction on 2026-10-26. Apply them to new content
and revisions, and maintain the project organization as the curriculum grows.

## Learning structure

A **topic** is a broad learning path. A **module** is a coherent engineering task
within that topic. A **chapter** is one meaningful step toward the module's outcome.
Use a few well-connected modules, with only the chapters needed for essential skills.
The topic → module → chapter hierarchy must be visible in navigation and data.

Begin with prerequisites. A learner should manage their own work before integrating
someone else's work, and understand Git's local state before using GitHub's review
and automation features. AI comes with that workflow: context, constrained requests,
independent checks, reviewed changes, and accountable handoff.

Each module follows a realistic software or embedded engineering use case. Establish
the starting situation, the requested change, acceptance criteria, and what a teammate
needs at the end. Chapters advance that situation; independent checkpoint states
must be explained. Avoid children's stories, decorative analogies, and disconnected
terminology tests.

## Explanations

Explain unfamiliar terms at first use, in the context of the task. Provide a concise
definition and a concrete example through an operable inline control. Definitions
must work with click, keyboard, and touch, rather than depending on hover.

Keep the main explanation concise without omitting why a step matters. Prefer one
useful decision, visible result, and explanation to many shallow interactions. Include
an independent variation or handoff check. Completion and understanding are separate.

## Interaction feedback

After an action, show which state or artifact changed, what stayed unchanged, and why.
Use targeted highlights, an explicit Changed marker, or short purposeful animation.
Do not rely on color alone. Preserve intermediate states long enough to inspect them.
Do not animate unrelated regions or add continuous decorative movement.

Honor reduced-motion preferences with static emphasis and readable feedback. Preserve
keyboard focus through redraws. Reset must restore the stated initial conditions.
Incorrect actions should expose a useful consequence and an achievable repair.

## Visual direction

Use an energized technical workbench palette with strong contrast and clear active
states. Avoid the pale washed-out V1 appearance. Use restrained schematics and actual
artifact relationships to create exploration and engineering character.

Retain the user's earlier corrections: a centered reading column, comfortable text,
generous space, concise navigation, and a quiet footer source link. Avoid small dense
labels, a persistent sidebar, ornamental marketing copy, and distracting chrome.
Fit the phone layout by simplifying or stacking, never by shrinking the text.

## Organization and evidence

Keep one authoritative curriculum catalog. Centralize shared term definitions and
interaction feedback. Separate domain models from rendering and test domain behavior
against meaningful invariants and real Git where useful.

Keep root `AGENTS.md` as a short entry point, use scoped instructions where the work
needs them, and maintain `PROJECT_MEMORY.md` as the single current project memory.
Update architecture, curriculum status, and verification together with implementation.
Do not create dated copies of the memory or leave obsolete plans presented as current.

Preserve existing public links. Keep English-only static delivery on GitHub Pages.
Respect published bot restrictions when inspecting the academy. Borrow interaction
principles; create original explanations, exercises, diagrams, and code.
