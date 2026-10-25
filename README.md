# StudentGuide

A Jekyll and Just the Docs site for student learning modules and reference guides.
The repository now has space to plan, build, and check two interactive learning pilots:
Git workflow and the transition from STM32 to Zynq 7000.

The module pages are outlines. No interactive engine, progress tracking, real terminal,
or hardware experiment has been implemented by this reorganization.

## Find the right place

| Location | Purpose | Published by Jekyll |
| --- | --- | --- |
| `index.md` | Learner home page | Yes |
| `modules/` | Learning paths and, later, reviewed lessons | Yes |
| `guides/` | Existing reference guides and their navigation page | Yes |
| `folder/*.png` | Compatibility assets used by the existing coding guide | Yes |
| `exercises/` | Scenario specifications and synthetic exercise fixtures | No |
| `templates/` | Starting points for lessons and interactions | No |
| `docs/` | Research, architecture, authoring process, roadmap, and migration notes | No |
| `scripts/` | Repository and built-site checks | No |
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
bundle exec jekyll build --trace
ruby scripts/check_structure.rb --site _site
bundle exec jekyll serve
```

The local site is served under `http://localhost:4000/StudentGuide/`.
The source check uses Ruby's standard library and can run without installing site dependencies.
The build needs the locked gems and access to the remote Just the Docs theme.

## First development tasks

1. Draft the Git lesson about reviewing an AI change and selecting a commit's scope.
2. Draft the Zynq lesson about which artifacts need updating after a change.
3. Review the explanations and scenario specifications before implementing the two browser simulations.

The intended delivery remains a static site. Language, exact Zynq board, and learner
tool access still need a decision before writing board-specific instructions.
