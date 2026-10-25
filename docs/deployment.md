# Publishing with GitHub Pages

The published address is **https://itshaihong.github.io/StudentGuide/**.
This is a static GitHub Pages site, built by GitHub's native Jekyll branch publishing.
The learning interactions run in the visitor's browser. No standalone server, API,
database, account service, or external runtime is required.

## Release configuration

- Repository: `itshaihong/StudentGuide`.
- Source: deploy from branch `codex/interactive-learning`, root directory `/`.
- Origin: `https://itshaihong.github.io`.
- Site prefix: `/StudentGuide`.
- Reference theme: Just the Docs; interactive pages use the local `learning` layout.
- `main` is preserved. Changes and commits stay on the dedicated feature branch.

The repository's validation workflow runs model tests, builds Jekyll, checks generated
links and exclusions, and saves a build artifact. GitHub Pages performs its native
build and deployment from the configured source branch. The local Python preview
script is a development convenience and is not part of hosting.

## Public routes to preserve

- `/StudentGuide/`
- `/StudentGuide/folder/` and `/StudentGuide/folder/index.html`
- `/StudentGuide/recomputer/` and `/StudentGuide/recomputer/index.html`
- `/StudentGuide/satcat/` and `/StudentGuide/satcat/index.html`
- Both original `/StudentGuide/folder/indentation-*.png` image URLs

Learning routes are `/StudentGuide/modules/`, `/StudentGuide/modules/git/`, and
`/StudentGuide/modules/zynq-7000/`. Their HTML, styles, and module scripts must load
from the same site prefix.

## Source boundaries

Imported research files are ignored by Git. All research, planning, templates,
exercise specifications, tests, and scripts are excluded from the generated site.
The public simulations contain synthetic examples only. The provenance note remains
in Git without publishing the imported Word file or its full transcription.

## Release evidence

Record the GitHub Pages source, deployed commit, build result, and live route and
interaction checks here after publication. Historical local and browser evidence is
in `verification.md`.
