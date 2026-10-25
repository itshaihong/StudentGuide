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

V2 is implemented on `codex/interactive-learning`: two topics, six coherent modules,
23 chapters, and 41 passing automated checks. Actual GitHub Actions Jekyll builds
and built-site validation pass. All six modules have desktop browser walkthroughs;
phone, keyboard, numeric input, actual native drag/drop, local resume, saved reflection,
reset, and reduced-motion checks are recorded in `docs/v2/verification.md`.

The topic page opens chapter selection grouped by module. Practice and last-chapter
IDs persist in browser-local storage; experiment state restarts. Git staging and
source classification support drag/drop and direct buttons. Inputs let learners
change the working interval and probe a proposed validator. Abbreviation full names
are visible beside the task; definitions provide optional extra context.

The PS/PL diagram shows separate application and bitstream paths, CPU instructions,
a memory-mapped control register, and configured digital logic responding to an
external input while CPU stepping is paused. Both PS and PL are hardware. Six original
module covers are in use; the foundations cover depicts one shared chip package.

The runtime was verified through `1749fa3` after the first V2 implementation at
`38fbde2`. The checked preview is ready; it is not yet the live Pages site. Detailed
evidence and image provenance are linked below. Maintain this memory in place.

## Architecture and evidence

- Jekyll remains the build tool; custom learning layout and Just the Docs references.
- Simulations are synthetic browser models, not real Git, GitHub, Vivado, or Vitis runtimes.
- Activity is not mastery. Reflections are ungraded; unknown understanding stays unknown.
- Zynq teaching boundary: Classic 2023.2, standalone concepts. No board has been selected
  or physically tested. Board procedures require separate primary-source verification.
- Imported Word research and its transcription stay local and ignored by Git.
- V2 verification: `docs/v2/verification.md`; V1 chronology: `docs/verification.md`;
  publication details: `docs/deployment.md`.
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
