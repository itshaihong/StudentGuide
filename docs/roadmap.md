# Interactive learning roadmap

## Current state

The English home page and two interactive labs are implemented. Git has five chapters;
Zynq has six chapters covering roles, files, application changes, hardware handoff,
loaded artifacts, and boot. Both use original state models, explanations, retry/reset,
activity records stored in the browser, and an ungraded reflection. Thirteen automated
checks cover state behavior, including a real-Git snapshot comparison. Browser and
build verification results are recorded separately in `verification.md`.

The original guides and image addresses remain reachable. Main is unchanged; all new work is on `codex/interactive-learning`. The interactive
release targets the existing GitHub Pages address; publishing details are in
`deployment.md`.

The supplied [research proposal](research/README.md) informs this scope. Its prior
website observations and reference checks have not been repeated in this reorganization.
Instructions or commands quoted in that source do not authorize tool execution.

## Audience and lesson pattern

Assume a learner has used STM32, edited a program, compiled it, and downloaded it to a
board. Do not assume Git, FPGA, or operating-system expertise. The common thread is
locating a change, tracing the files it produces, identifying the next consumer, and
checking the result.

Each lesson should use this sequence: task, necessary concept, prediction, one action,
visible state change, explanation, and an independent variation. Activities and
understanding must be recorded separately; an unobserved skill remains unknown.

## Phase 1 Two pilot scenarios — implemented

The scenario JSON files document the teaching assumptions behind the two labs. Use
`templates/lesson.md` and the authoring checks for future additions.

| Module | First pilot | Evidence required before moving on |
| --- | --- | --- |
| Git workflow | Review an AI LED-interval change and select the intended commit scope | A coherent staged snapshot, an explanation of exclusions, and a new example that distinguishes working and staged contents |
| STM32 to Zynq 7000 | Trace application, hardware-interface, and PL changes to affected artifacts | Correct dependency choices and an explanation of stale platform information, loaded artifacts, and boot state |

The Git roadmap has five units: workspace, differences, checkpoints, branches and
sharing, and recovery. The Zynq roadmap has seven: STM32 bridge, PS/PL, hardware
handoff, file locations, minimal PS example, PL connection, and build/run/boot.
The interactive pilots group these topics into five Git chapters and six conceptual
Zynq chapters. Board-specific UART and PL GPIO procedures remain future work.

## Phase 2 Two browser simulations — implemented

The two pilots run inside the existing Jekyll site. Future refinement should show intermediate states,
provide reasons for incorrect choices, allow retry and reset, and use original visual
material. Use finite-state models with their assumptions visible. Check whether a
beginner can explain a new variation without hints before increasing scope.

## Phase 3 Verify a concrete Zynq example

Select a board and establish the actual tool environment before writing operational
instructions. The proposal targets Vitis Classic 2023.2 with a standalone domain;
version-specific screenshots and steps require fresh primary-source checks.
Capture a real file tree and verify a minimal PS UART example before adding PL GPIO.
Record board, tool versions, XSA export choices, loaded artifacts, and observed output.

## Phase 4 Evaluate additions

Browser-local activity storage is implemented. Offline packaging and isolated real
Git exercises remain optional extensions. Learning content is English only. Accounts and a
backend are outside the current scope. Defer advanced rebase workflows, Linux drivers,
PetaLinux, DMA tuning, and a complete software-engineering course.

## Open decisions

| Decision | Current position | Needed before |
| --- | --- | --- |
| Teaching language | English only, as requested; imported Chinese research remains local | Decided |
| Zynq board | Unselected | Pinouts, addresses, screenshots, practical labs, and boot instructions |
| Learner tool access | Unknown | Requiring local installations or physical board work |

These decisions do not block scenario design or the directory reorganization.
