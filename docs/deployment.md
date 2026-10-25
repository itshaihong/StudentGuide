# Publishing with GitHub Pages

The published address is **https://itshaihong.github.io/StudentGuide/**.
This is a static GitHub Pages site, built by GitHub's native Jekyll branch publishing.
The learning interactions run in the visitor's browser. No standalone server, API,
database, account service, or external runtime is required.

## Required release configuration

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

## Release evidence on 2026-10-26

- Candidate commit `963531e` passed GitHub Actions run `40215269661`, including the
  thirteen model checks, actual Jekyll build, and generated-route/link/exclusion checks.
- An earlier candidate's actual build was exercised through all eleven chapters in
  Edge. The final keyboard refinements were checked in the built `6c2492e` candidate.
- The native Pages API reports the current source as `main`, root `/`, build type
  `legacy`. An authorized attempt to update the source to `codex/interactive-learning`
  returned HTTP 404. No source change was applied.
- The signed-in browser's repository settings explicitly say that repository options
  are unavailable to the account. Pages settings also return 404. This confirms a
  publishing-permission limit rather than a site-build failure.
- All implementation commits are pushed on `codex/interactive-learning`. Main remains
  at `b84208cc18e5dca68d045ecd19670390324c2871`.

The new interactive release is **not yet live on GitHub Pages**. The existing published
site remains served from main. A checked-build localhost preview is available through
`python3 scripts/serve_preview.py` at `http://localhost:4173/StudentGuide/`.
Historical local and browser evidence is in `verification.md`.

## Owner action to publish

A repository owner or an account with Pages settings permission should open repository
Settings → Pages. Under Build and deployment, use Deploy from a branch, choose
`codex/interactive-learning` and `/ (root)`, then Save. The existing public URL stays
`https://itshaihong.github.io/StudentGuide/`. This uses GitHub's Jekyll build and hosting;
no separate server is involved and main does not need to be merged or modified.

After the native Pages deployment succeeds, check the learning home, both module
scripts, the three original guides, and both image URLs listed above. Live interactive
checks are still required after an owner performs this setting change.

Official reference: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
