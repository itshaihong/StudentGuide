# Project roadmap

## Current V2 work

V2 implements two topics with three modules each, following the sequence in
`_data/curriculum.json` and `docs/v2/curriculum.md`. The durable product rules are in
`docs/v2/product-rules.md`, and the single current project memory is `PROJECT_MEMORY.md`.

The six modules, 23 mapped chapters, contextual definitions, and change-emphasis runtime
are implemented in source. Thirty-six automated checks pass locally. Actual V2 Jekyll
build and desktop/mobile browser verification are the next release gates.

After those gates pass, record the actual evidence and deliver the checked preview.
Publishing at the existing GitHub Pages address still requires an owner to change the
source setting, as last verified in `docs/deployment.md`. Main remains untouched.

## Deferred practical work

Select a real Zynq board and verify exact tool setup, project tree, UART, PL GPIO,
JTAG, and power-on boot before publishing board-specific instructions. The current
curriculum teaches artifact and collaboration concepts without fabricating a lab run.

Evaluate more modules only when a missing prerequisite or a useful project outcome
justifies them. Offline packaging, isolated real tool runtimes, and further project
integration remain optional. English is the only learning language.

## V1 evidence

The compatible original pilots remain available at their old routes. Their release
record is in `docs/verification.md`. V2 supersedes the old two-pilot roadmap; its source
research remains local and is described in `docs/research/README.md`.
