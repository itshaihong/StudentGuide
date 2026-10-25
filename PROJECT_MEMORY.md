# StudentGuide project memory

Read this file after `AGENTS.md`. It is the single maintained project memory, not a
learner record. Update it when decisions, implementation status, or verified limits
change; keep detailed evidence in the linked documents.

## Product direction

- English only. Publish as static GitHub Pages at `https://itshaihong.github.io/StudentGuide/`.
- Work on `codex/interactive-learning`; preserve main and old guide/page/image URLs.
- Prefer clear, concise, adult learning experiences with readable text. Keep navigation
  quiet and the source link in the footer. Use a lively technical workbench character.
- V2 organizes two topics into a few modules each. Each module follows a realistic
  engineering task with prerequisites, decisions, consequences, and a usable outcome.
- Explain technical terms in context. Highlight what changed after an action and use
  restrained purposeful animation, with an equivalent reduced-motion presentation.
- Use meaningful drag/drop and editable inputs, with click/keyboard/touch alternatives.
- A topic opens chapter selection grouped by module, rather than opening a lesson.
  Keep completed/not-completed state and the last visited chapter in local storage.
- Show abbreviation full names nearby. PS is fixed hardware running software; PL is
  configurable hardware implementing digital logic. Use accurate interactive diagrams.
- Add relevant impressive original illustrations to the learning design. Images must
  clarify the actual engineering topic and must not imply unverified physical hardware.
- The learning sequence starts with individual work, then team integration, then
  GitHub and AI-assisted collaboration. Do not substitute a longer list of quizzes.

## Current state

V1 is committed and pushed through `2235359`. It has two independent pilot labs,
five Git chapters and six Zynq chapters. V2 is in progress: all six modules and 23 mapped chapters are implemented in source.
Its durable rules live in `docs/v2/`; `_data/curriculum.json` and `_data/terms.json` own
the structure and definitions. Forty automated checks pass. The actual V2 build
and browser release gates remain pending; do not infer them from source tests.

The first V2 implementation must include all six coherent modules, contextual
definitions, visible state transitions, navigation/prerequisites, model checks,
build checks, and browser walkthroughs. Do not call the work complete after a
visual refresh or a plan alone.

The first V2 source commit `38fbde2` passed its GitHub Actions Jekyll build.
Further source now implements drag/drop staging and classification with button alternatives,
editable Git intervals and validator probes, topic chapter selection with stable-ID resume,
six generated module covers, visible acronym expansions, and an interactive PS/PL diagram.
The diagram distinguishes fixed PS hardware executing software from configured PL digital
logic. Its CPU/register/input model is tested; actual browser release verification remains pending.

## Architecture and evidence

- Jekyll remains the build tool; custom learning layout and Just the Docs references.
- Simulations are synthetic browser models, not real Git, GitHub, Vivado, or Vitis runtimes.
- Activity is not mastery. Reflections are ungraded; unknown understanding stays unknown.
- Zynq teaching boundary: Classic 2023.2, standalone concepts. No board has been selected
  or physically tested. Board procedures require separate primary-source verification.
- Imported Word research and its transcription stay local and ignored by Git.
- V1 verification: `docs/verification.md`; publication details: `docs/deployment.md`.
- Last verified Pages setting on 2026-10-26: main/root, legacy Jekyll publishing.
  API and browser accounts could push but could not change Pages settings. The native
  settings page explicitly denied repository-options access. An owner action is needed
  to publish the feature branch; do not infer deployment from a passing build.

## Working map

- `docs/v2/product-rules.md`: durable content, interaction, and design requirements.
- `docs/v2/curriculum.md`: prerequisite sequence and module outcomes.
- `docs/architecture.md`: implementation boundaries and file ownership.
- `docs/authoring.md`: lesson authoring and review checks.
- `README.md`: setup, repository map, current status.
- Validation: source check, Node model tests, actual Jekyll build, built-site check,
  and desktop/mobile browser checks. Report exact scope and remaining limits.
