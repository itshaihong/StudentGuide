# V2 original illustrations and teaching diagram

Six cover illustrations were generated with the built-in `image_gen` tool on
2026-10-26 and copied into `assets/images/modules/`. Original generated files remain
in the generation directory. These are conceptual editorial illustrations, not
photographs of a verified setup, hardware topology, or measured results. Covers use
empty alternative text because nearby headings describe the module; precise teaching
relationships use HTML diagrams with readable labels and interactive state.

Shared prompt: stylized conceptual, wide 3:2 editorial illustration for an adult
engineering learning website; polished isometric technical scene, brushed metal and
glass, cobalt and electric cyan with restrained amber on deep navy; focused scene,
generous edges, no faces, mascots, fantasy, code text, lettering, logos or watermarks;
concept illustration rather than a factual hardware diagram or screenshot.

| Saved asset | Subject added to the shared prompt |
| --- | --- |
| `assets/images/modules/git-solo.png` | Engineering laptop with abstract code bars, project folder, three chronological snapshot plates. |
| `assets/images/modules/git-team.png` | Two engineering workstations; distinct commit paths converge at a central integration node. |
| `assets/images/modules/github-ai.png` | Patch review magnifier, test matrix with an amber boundary case, subordinate assistant node; no robot. |
| `assets/images/modules/zynq-foundations.png` | Generic conceptual board, CPU-like block beside configurable logic grid and connections; no actual pinout or vendor claims. |
| `assets/images/modules/zynq-handoff.png` | Generic board and artifact plates; stale handoff replaced by a matching handoff; no actual pinout. |
| `assets/images/modules/zynq-delivery.png` | Generic test bench, probe, simple oscilloscope trace, conceptual delivery manifest; no physical test claims. |

All six were visually inspected. The PS/PL teaching diagram is separately authored
in `assets/js/modules/zynq-7000/roles.mjs`; its finite-state behavior lives in
`execution-model.mjs`. It shows an illustrative control register and combinational
AND gate. It abstracts clocking, reset, bus timing, addresses, and electrical details.
The target program memory label does not place all memory inside the PS. A software
step cannot create an absent PL peripheral; a configured circuit can respond to an
external input while CPU instruction stepping is paused.

Primary checks: [AMD Zynq embedded-design introduction](https://github.com/Xilinx/Embedded-Design-Tutorials/blob/master/docs/Getting_Started/Zynq7000-EDT/1-introduction.rst)
for the PS/PL device structure and hardware/software separation;
[AMD UG1400 2023.2: XSA export](https://docs.amd.com/r/2023.2-English/ug1400-vitis-embedded/Creating-a-Hardware-Design-XSA-File)
for Xilinx Shell Archive terminology. The AND circuit is an original teaching example,
not an asserted board-specific peripheral or universal PS/PL architecture.
