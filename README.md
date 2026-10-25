# StudentGuide

A GitHub Pages learning site at https://itshaihong.github.io/StudentGuide/.
Built with Jekyll, a custom learning layout, and Just the Docs for reference guides.
V2 contains two topics, each with three connected modules and 23 chapters in total.
The Git path moves from a solo project to team integration, then GitHub and AI-assisted
review and delivery. The embedded path moves from project ownership to hardware/software
handoff, then diagnosis and reproducible delivery.

Lessons use original finite-state browser models, contextual definitions, targeted
change highlights, accessible feedback, local activity records, and ungraded reflections.
The original pilot routes and reference guides remain available.

V2 has passed 41 automated checks, a GitHub Actions Jekyll build, and browser
walkthroughs of all six modules. Chapter selection, local resume, drag/drop, editable
inputs, and the interactive PS/PL diagram are included. See `docs/v2/verification.md`
for scope and limits. Publication still requires the owner’s Pages source change;
the checked feature branch and local preview are ready.

## Find the right place

| Location | Purpose | Published by Jekyll |
| --- | --- | --- |
| `index.md` | Learner home page | Yes |
| `topics/` | Topic overview, module sequence, and prerequisites | Yes |
| `modules/` | English interactive modules and compatible original pilots | Yes |
| `_data/` | Authoritative curriculum and shared contextual definitions | Embedded in pages |
| `guides/` | Existing reference guides and their navigation page | Yes |
| `folder/*.png` | Compatibility assets used by the existing coding guide | Yes |
| `exercises/` | Scenario specifications and synthetic exercise fixtures | No |
| `templates/` | Starting points for lessons and interactions | No |
| `docs/` | Research, architecture, authoring process, roadmap, and migration notes | No |
| `assets/` | Learning styles, browser controllers, and state models | Yes |
| `_layouts/`, `_includes/` | Custom learning pages alongside the reference theme | Used in build |
| `tests/` | State-model and isolated real-Git checks | No |
| `scripts/` | Validation and local preview tools | No |
| `.github/workflows/` | Build and validation workflow | No |

Start with [the project memory](PROJECT_MEMORY.md), [V2 product rules](docs/v2/product-rules.md),
and [the curriculum](docs/v2/curriculum.md). Use [the authoring workflow](docs/authoring.md)
for lesson changes.
[Architecture](docs/architecture.md) explains where future browser code and lesson assets belong.
[Migration notes](docs/migration.md) map old file locations to new ones.
The [research record](docs/research/README.md) retains the supplied proposal and its references.
[Verification notes](docs/verification.md) record the checks performed and the outstanding build check.

## Preview and check

Use Ruby 3.4, as recorded in `.ruby-version`, and the Bundler version recorded in
`Gemfile.lock` (currently 4.0.2). Keep the existing lockfile rather than regenerating it
as part of content editing.

```sh
gem install bundler -v 4.0.2
bundle install
ruby scripts/check_structure.rb
node --test tests/*.test.mjs
bundle exec jekyll build --trace
ruby scripts/check_structure.rb --site _site
bundle exec jekyll serve
```

The local site is served under `http://localhost:4000/StudentGuide/`.
The source check uses Ruby's standard library and can run without installing site dependencies.
The build needs the locked gems and access to the remote Just the Docs theme.

## Learning paths

| Topic | Modules in prerequisite order |
| --- | --- |
| Git and GitHub | Own a project with Git → Integrate a teammate’s work → Ship with GitHub and AI |
| STM32 to Zynq 7000 | Take over an embedded project → Coordinate a hardware change → Deliver and diagnose a build |

Each module follows an engineering use case and a teammate-ready outcome. The catalog
in `_data/curriculum.json` owns module identity, routes, order, prerequisites, and chapter
mapping. `_data/terms.json` owns the definitions. Do not duplicate either catalog in UI code.

The labs record activity, not mastery. Reflections are ungraded and browser-local.
Zynq models use Classic 2023.2 concepts and illustrative versions; no physical board
verification or real tool execution is implied.

## Preview from a checked build

The branch validation workflow uploads `studentguide-site` after the Jekyll build and
built-link checks pass. If you download that artifact into `_site/`, preview the actual
built site without a local Ruby installation:

```sh
python3 scripts/serve_preview.py
```

Open `http://localhost:4173/StudentGuide/`. The server binds only to this computer and
serves `_site/`, never the source or local research. This is a development preview only.
The published site uses GitHub Pages, with no separate web server or backend. See
[deployment settings](docs/deployment.md) for the publishing branch and release evidence.

**Release status:** the branch build passes, but publication needs a repository owner
to change the Pages source from `main` to `codex/interactive-learning`. The available
account can push code but cannot change repository options. The current GitHub Pages
site still serves the existing main version.

The imported research files remain local and ignored by Git. Only their provenance
note is part of the remote repository. Public learning content is English only.
