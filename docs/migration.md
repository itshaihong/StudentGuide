# Directory migration

Reorganized on 2026-10-25. Jekyll still builds from the repository root.

| Previous source | Current source | Public address without the site prefix |
| --- | --- | --- |
| `index.md` | `index.md` | `/` |
| `folder/index.md` | `guides/coding-standards/index.md` | `/folder/` |
| `recomputer/index.md` | `guides/recomputer/index.md` | `/recomputer/` |
| `satcat/index.md` | `guides/satcat/index.md` | `/satcat/` |
| `folder/indentation-1.png` | Unchanged compatibility asset | `/folder/indentation-1.png` |
| `folder/indentation-2.png` | Unchanged compatibility asset | `/folder/indentation-2.png` |

The public prefix remains `/StudentGuide`. Explicit page permalinks retain the guide
addresses while navigation groups them under Reference guides. The coding guide's
relative image links continue to resolve from `/folder/`. New internal links use the
site prefix through `relative_url`.

The staged coding-guide changes present before the reorganization were carried with
the file move. The guide body was not rewritten. Reference guide bodies and images,
`Gemfile`, and `Gemfile.lock` are otherwise unchanged. Source moves were recorded with
`git mv`; further content and configuration edits remain available for review.

New public routes are `/guides/`, `/modules/`, `/modules/git/`, and
`/modules/zynq-7000/`. They provide navigation and module outlines, not functioning
interactive exercises.

Internal research, plans, templates, exercise specifications, and scripts are excluded
from site output. The added GitHub workflow validates and builds; it has no deployment
step. No hosting setting, remote branch, or published site was changed by this work.
