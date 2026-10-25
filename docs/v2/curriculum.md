# V2 curriculum

Two topics, each with three modules. The route and lesson catalog in
`_data/curriculum.json` is the authority for implemented navigation. This document
explains the sequence and acceptance criteria.

## Git and GitHub

The continuing project is a small device-diagnostics repository. A solo maintainer
first ships a deliberate change. Two engineers then integrate concurrent work. The
team finally uses GitHub and AI to review, verify, and hand off the next change.

| Order | Module | Essential outcome |
| --- | --- | --- |
| 1 | Own a project with Git | Locate the clone, inspect and stage a coherent change, understand snapshots, create a checked checkpoint, and recover the appropriate layer. |
| 2 | Integrate a teammate's work | Distinguish branches and clones, fetch without changing working files, integrate distinct changes, resolve a meaningful conflict, and share a tested result. |
| 3 | Ship with GitHub and AI | Find the purpose of repository features, write acceptance criteria and bounded AI context, review a proposal, interpret CI and review feedback, and connect a merged change to a release handoff. |

Module 2 requires module 1. Module 3 requires module 2. Prerequisites are explanatory
links rather than account-based locks; a learner may revisit any chapter.

## STM32 to Zynq 7000

The continuing project is a board-diagnostics application. The learner takes over its
files, coordinates a software-visible hardware change with another engineer, and
prepares a reproducible delivery with explicit evidence about loaded and boot state.

| Order | Module | Essential outcome |
| --- | --- | --- |
| 1 | Take over an embedded project | Distinguish PS/PL, identify each file's producer and consumer, and separate maintained sources from generated artifacts and board state under an explicit project policy. |
| 2 | Coordinate a hardware change | Trace application-only and hardware-interface changes, repair stale platform information, load matching artifacts, and verify a versioned hardware/software handoff. |
| 3 | Deliver and diagnose a build | Distinguish run and boot, investigate the first failing layer using observations, and prepare a reproducible release manifest and teammate handoff. |

Modules 2 and 3 require the preceding Zynq module. Git module 1 is recommended for
source-control decisions. The lab remains a synthetic conceptual model: board type,
physical UART settings, pin assignments, and actual tool procedures are not invented.

## Release acceptance

- All six modules have functioning chapters, a coherent use case, and a final outcome.
- Topic pages expose the sequence, prerequisites, purpose, and next module.
- Important terms have in-context definitions. No hover-only teaching dependency.
- Meaningful state changes have visible emphasis and explanatory feedback; reduced
  motion preserves the information.
- Old pilot URLs and original guide/image URLs continue working.
- Source, model, curriculum-integrity, and built-site checks pass. Exercise each new
  module through both a useful wrong path and the intended repair in the browser.
- Confirm desktop and phone readability and update the single project memory with
  verified implementation status. Plans alone are not completion evidence.
