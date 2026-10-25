# Project architecture

## Delivery

Keep Jekyll and Just the Docs, with the repository root as the site source. This
preserves the existing deployment model and avoids requiring a JavaScript application,
account system, backend, or new hosting service for the first two pilots.

Public content is separated by purpose:

- `modules/<module-id>/index.md` is a learning path. Add reviewed lessons beneath the
  same directory, with explicit permalinks and the appropriate navigation parent.
- `guides/<guide-id>/index.md` is reference material. Existing guide bodies remain
  intact; source locations and navigation can change independently of their URLs.
- `folder/` contains only two legacy images. Their locations are deliberate compatibility
  paths, not the place for new lesson content.

The public hierarchy is Home, Learning modules, and Reference guides. A reference
does not become an interactive lesson merely by moving it into a new directory.

## Authoring and exercise sources

`docs/research/` retains the supplied research as an immutable source copy and a
searchable transcription. `docs/roadmap.md` records adopted scope and open decisions.
`templates/` holds reusable authoring formats. `exercises/<module-id>/` contains
scenario specifications and, when needed, synthetic files used to construct a lesson.
These directories are excluded from Jekyll output, including the original Word file.

Scenario JSON files are **design specifications** accompanying the implemented browser runtime
; neither is a complete Git/Vitis model. They record the task, initial state, intended transitions,
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
| `assets/images/modules/<module-id>/` | Original diagrams and licensed lesson assets |
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
See [the migration map](migration.md). The repository's existing hosting settings
were not changed by this reorganization. The new workflow builds and checks the site;
it does not deploy it.

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
