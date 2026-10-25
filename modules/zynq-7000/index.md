---
layout: default
title: From STM32 to Zynq 7000
parent: Learning modules
nav_order: 2
permalink: /modules/zynq-7000/
module_id: zynq-7000
status: outline
---

# From STM32 to Zynq 7000

This planned module connects familiar STM32 development to the roles of the Zynq
processing system, programmable logic, hardware handoff, and application build.
The first activities will use conceptual file maps before asking you to install tools.

The proposed demonstration environment is **Vitis Classic 2023.2 with a standalone
domain**. The board has not been selected. Board-specific steps and hardware results
are not available yet.

## Planned learning path

| Unit | What you should be able to do |
| --- | --- |
| 1. Start from STM32 | Locate application code, drivers, board support, and hardware in a familiar project. |
| 2. Understand PS and PL | Explain the distinct roles of software execution and programmable logic. |
| 3. Follow the hardware handoff | Trace the planned XSA, platform, domain, BSP, and application relationships. |
| 4. Locate the files | Identify source, configuration, handoff, and generated artifacts and their consumers. |
| 5. Begin with PS | Trace a minimal UART application's build and execution path. |
| 6. Connect PL | Explain the intended role of an AXI GPIO example before choosing board details. |
| 7. Separate build, run, and boot | Explain why a host artifact, loaded program, and power-on boot setup are different. |

## First planned activity

**What changed, and which artifacts need updating?**

You will compare an application-only change, a hardware interface change, and a PL
change. The planned interaction will let you predict the affected artifacts,
inspect their dependency paths, and explain where stale information could remain.

The exercise will label its simplified assumptions. Actual build dependencies,
file locations, board connections, and boot contents must be checked against the
selected example before a practical lab is published.
