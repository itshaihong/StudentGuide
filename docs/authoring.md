# Authoring a learning lesson

1. Choose a module and one observable task. Start from `templates/lesson.md`.
   Keep the lesson in internal planning until its explanations and sources are reviewed.
2. Describe what the learner should predict, change, and explain. Put a concrete
   scenario specification under `exercises/<module-id>/` using `templates/scenario.json`.
3. Identify state, allowed transitions, reasons for feedback, a reset state, and a new
   variation. A scenario specification is not executable lesson code.
4. Check technical claims against primary sources. Record tool versions and distinguish
   verified observations, simplifications, and untested examples. Update the research
   record by adding a new note rather than altering the supplied original.
5. Add a reviewed lesson beneath `modules/<module-id>/`. Give it an explicit permalink,
   navigation ancestry, and honest status. Link it from the module outline when ready.
6. Implement only the interaction needed for the lesson, using the paths in
   `architecture.md`. Publish only the assets the browser actually needs.
7. Run the source check, site build, built-site check, and the relevant browser checks.
   Record remaining limits rather than calling a lesson tested without evidence.

## Interaction review

- The task and the model's simplifications are visible before the learner acts.
- Predictions come before revealing the result. Feedback explains the cause.
- A state change is visible in every affected view; a stale intermediate state remains inspectable.
- Reset restores the initial state. A second attempt does not inherit an accidental success state.
- Buttons and choices work with a keyboard, focus is visible, and feedback is readable
  without relying only on color. Interactive feedback is announced accessibly.
- The layout remains usable on a narrow screen and at increased text size.
- Completion records an activity. Understanding requires an explanation and an independent variation.

## Git pilot review

Use synthetic files and explicitly fake secret-like data. Identify the current clone.
Show working and staged contents separately, including a further edit after staging.
Check that the intended implementation and corresponding test are selected while an
unrelated README deletion, rebuildable output, and fake local data are excluded in this
scenario. State project-specific tracking rules rather than treating generated files
as universally forbidden. Do not describe `.gitignore` as secret protection.

## Zynq pilot review

State the example's assumptions, tool version, domain, and board status. Explain the
roles of PS, PL, XSA, platform, BSP, application, ELF, bitstream, and boot contents in
context. Do not imply that XSA always includes a bitstream, that every example needs
PL, that driver code creates PL hardware, or that JTAG execution proves power-on boot.
Label directory diagrams as illustrative until checked against an actual project.

## Images and sources

Prefer original diagrams. Record source and license before copying external images.
Learn from interaction patterns without copying paid course material or question banks.
Do not put personal account screenshots into public assets. Capture actual Classic
screens in a verified example rather than presenting older documentation as a new test.
