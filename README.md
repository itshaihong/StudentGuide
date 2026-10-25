# StudentGuide

A GitHub Pages learning site at https://itshaihong.github.io/StudentGuide/.
Built with Jekyll, a custom learning layout, and Just the Docs for reference guides.
The repository now has space to plan, build, and check two interactive learning pilots:
Git workflow and the transition from STM32 to Zynq 7000.

The English interactive labs now include five Git chapters and six Zynq chapters.
They use original, finite-state browser simulations with explanatory feedback, reset,
local activity records, and ungraded reflections. No account, terminal, or board is needed.
The original reference guides and their public URLs remain available.

## Find the right place

| Location | Purpose | Published by Jekyll |
| --- | --- | --- |
| `index.md` | Learner home page | Yes |
| `modules/` | English interactive learning paths | Yes |
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

Start with [the project roadmap](docs/roadmap.md) and [the authoring workflow](docs/authoring.md).
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

- **Git workflow:** locate a clone, review and stage changes, inspect an index/working-file
  mismatch, commit and share on a branch, and choose recovery actions. The final example
  asks which version a push actually shares.
- **STM32 to Zynq 7000:** distinguish PS/PL, inspect a file's producer and consumer,
  rebuild an application, repair stale hardware support, load artifacts, and compare
  a JTAG run with power-on boot behavior.

The labs record activity, not mastery. Reflections are ungraded and stored only in the
current browser. Course reset affects only StudentGuide's record for that course.
The Zynq model targets Classic concepts and uses illustrative paths and versions;
board-specific procedures and physical verification remain separate future work.

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

The imported research files remain local and ignored by Git. Only their provenance
note is part of the remote repository. Public learning content is English only.
