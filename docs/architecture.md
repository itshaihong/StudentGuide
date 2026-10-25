# Project architecture

## Delivery

Keep Jekyll and Just the Docs, with the repository root as the site source. This
preserves the existing deployment model and avoids requiring a JavaScript application,
account system, backend, or new hosting service for the learning site.

Public content is separated by purpose:

- `topics/<topic-id>/index.md` opens chapter selection, grouped by module, with
  prerequisites, local progress, and a validated last-chapter Continue link.
- `modules/<topic-id>/<module-name>/index.md` hosts an interactive module. Its mapped
  chapters come from `_data/curriculum.json`; URLs and activity IDs remain stable.
- The original `modules/git/` and `modules/zynq-7000/` pilots retain their old URLs and
  hash chapters, with separate compatibility activity records.
- `guides/<guide-id>/index.md` is reference material. Existing guide bodies remain
  intact; source locations and navigation can change independently of their URLs.
- `folder/` contains only two legacy images. Their locations are deliberate compatibility
  paths, not the place for new lesson content.

The public hierarchy is Learning paths → Topic → Module → Chapter, alongside Reference guides. A reference
does not become an interactive lesson merely by moving it into a new directory.

## Authoring and exercise sources

`docs/research/` retains the supplied research as an immutable source copy and a
searchable transcription. `docs/roadmap.md` records adopted scope and open decisions.
`templates/` holds reusable authoring formats. `exercises/<module-id>/` contains
scenario specifications and, when needed, synthetic files used to construct a lesson.
These directories are excluded from Jekyll output, including the original Word file.

Scenario JSON files are **design specifications** accompanying the implemented browser runtime;
neither is a complete Git/Vitis model. They record the task, initial state, intended transitions,
feedback, reset behavior, and evidence to collect. Do not load an internal specification
through a public URL: it is intentionally absent from the site build.

## Learning implementation

The custom `learning` layout serves the home, catalog, and course pages. The original
Just the Docs layout continues serving reference guides. The implemented paths and
reserved asset locations are:

| Path | Responsibility |
| --- | --- |
| `_includes/learning/` | Reusable semantic HTML for lesson controls and state displays |
| `assets/js/learning/` | Shared browser behavior such as reset and feedback |
| `assets/js/modules/<module-id>/` | Small, module-specific state transitions |
| `assets/css/learning/` | Styles for the learning controls and diagrams |
| `assets/images/modules/` | Original conceptual module covers; precise diagrams use HTML/SVG |
| `assets/data/<module-id>/` | Explicitly selected public data for a reviewed lesson |

Do not create a framework or unused asset tree in advance. Keep lesson meaning in
the lesson and state transitions in the relevant interaction code. Shared components
should emerge from the two pilots rather than from a speculative general engine.

The interactions run entirely in the browser and have deterministic
reset behavior. Git must show working files, staged snapshots, commits, and remote
state separately. Zynq must distinguish host files, loaded PS memory, PL configuration,
and board storage. Neither simulation executes arbitrary learner commands.

## URLs and deployment

`url` is the origin `https://itshaihong.github.io`; `baseurl` is `/StudentGuide`.
Use the Liquid `relative_url` filter for internal public links. Each content page
has an explicit permalink, so moving a Markdown source does not move its public URL.

Keep `/folder/`, `/recomputer/`, `/satcat/`, and the two `/folder/*.png` image URLs.
See [the migration map](migration.md). For the interactive release, publish the dedicated branch through GitHub Pages at
this existing address. Main stays unchanged. GitHub's native branch publishing builds
and hosts the site; the validation workflow separately tests and builds it.
See `deployment.md` for settings and release evidence.

## Validation boundaries

`scripts/check_structure.rb` checks source navigation, routes, page links, scenario
specifications, and the exclusion of authoring material. Its optional `--site` check
also verifies built routes, links, images, and output exclusions. A passing source
check does not prove that a Jekyll build or browser interaction works.

State-model tests are in `tests/`, including an isolated real-Git snapshot check.
For further implementation, add tests that exercise state transitions and the relevant
acceptance criteria. Verify actual browser behavior, keyboard use, reset, and mobile
readability. Hardware steps require separate evidence from the selected board and tools.

Configuration references: [Jekyll options](https://jekyllrb.com/docs/configuration/options/),
[Jekyll permalinks](https://jekyllrb.com/docs/permalinks/), and
[Just the Docs navigation](https://just-the-docs.com/docs/navigation/main/).


## V2 runtime ownership

- `_data/curriculum.json` is the only structural curriculum catalog. Jekyll uses it for
  topic/module pages and embeds it into the learning layout for browser navigation.
- `_data/terms.json` contains definitions and contextual examples. The runtime explains
  preferred chapter terms at first use, with an inline fallback when the term appears
  only inside an interactive artifact or command.
- `registry.mjs` maps known controller identifiers to lazy imports. The runtime loads
  the controllers needed by the selected module, rather than all topics at once.
- `curriculum.mjs` normalizes stable activity IDs and module metadata. V1 index-based
  activity stays compatible on the original pilot routes; V2 stores stable chapter IDs.
- `changes.mjs` compares stable `data-state` displays between redraws. Changed markers
  and outlines persist until the next redraw; short animations respect reduced motion.
- `terms.mjs` owns definition controls, dismissal, and keyboard behavior. Domain models
  never read the DOM. Controllers bind actions and render the model's current state.
- New collaboration controllers live in `git-solo`, `git-team`, `github-ai`, and
  `embedded-team`; the tested V1 Git/Zynq transitions remain reusable building blocks.

Root and scoped AGENTS files plus `PROJECT_MEMORY.md` are authoring material and are
excluded from Jekyll output. Maintain the single memory in place and link detailed
verification records; do not create parallel current-state files.

- `activity.mjs` validates stable chapter/module IDs for resume links. `course.mjs`
  owns each module’s completion, saved reflection, and last chapter; `progress.mjs`
  reads those records on topic pages. V2 activity keys are
  `studentguide:activity:v2:<module-id>`; topic resume keys are
  `studentguide:resume:v2:<topic-id>`. Exercises restart on reopening.
- `drag.mjs` binds native drag/drop to the same domain actions as buttons. Git staging
  copies content into the index; it does not move the working file. Classification
  also has direct buttons for keyboard and touch. External drops are not accepted.
- `terms.mjs` shows abbreviation expansions in visible notes, unless the full name
  is already visible. Optional definitions add context rather than hiding full names.
- `zynq-7000/execution-model.mjs` isolates the conceptual CPU/register/AND-circuit
  model. Its renderer in `roles.mjs` is shared by the retained pilot and V2 foundations.
- `docs/v2/visual-assets.md` records cover prompts, intended use, and diagram sources.
