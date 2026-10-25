# V2 verification · 2026-10-26

V2 is ready as a checked static preview on `codex/interactive-learning`. It has two
topics, six connected modules, and 23 mapped chapters. This record describes what
was actually checked; activity completion is not evidence of learner mastery.

## Build and automated evidence

- Source validation passes for 16 public pages, two retained scenario specifications,
  navigation, links, compatibility routes, and internal-source exclusions.
- Forty-one Node checks pass. They cover domain transitions, stale evidence and build
  inputs, resume ID validation, abbreviation boundaries across separate DOM labels,
  and curriculum integrity. Snapshot and independent-file integration invariants also
  agree with real Git in isolated temporary repositories.
- [Build for `1749fa3`](https://github.com/itshaihong/StudentGuide/actions/runs/40222364760)
  passed the source checks, model checks, actual Jekyll build, and built-site checks.
  Its `studentguide-site` artifact was downloaded to `_site/` for browser verification.
- Built-site checking also passed locally against that artifact: required routes,
  local links and images, and exclusions. No research source, project memory, or
  scoped AGENTS file is included in the public output.

## Desktop browser walkthroughs

The actual Jekyll build was exercised in Microsoft Edge at the `/StudentGuide/`
base path. Each module reached its final activity outcome, including wrong paths and
repairs. Test reflections and completion records were then removed with each module’s
own reset dialog; earlier legacy activity was not cleared.

| Module | Observed behavior |
| --- | --- |
| Own a project with Git | Init creates management without a commit; baseline survives later edits. Native drag staging captures source content without removing the file. The equivalent button stages the test. An unrelated README change fails the scope check and can be unstaged. Entering 125 ms changes the working file while the index stays 500 ms; another add captures 125 ms. Branch, check, commit, push, three recovery cases, and reflection finish. |
| Integrate a teammate’s work | Fetch advances tracking without changing the feature. Divergence rejects fast-forward. The merge includes both changes. Keeping one side of the cadence conflict fails the two requirements; separating settings passes. Current integration checks precede sharing and handoff. |
| Ship with GitHub and AI | Project surfaces match the four tasks. Missing context and fake credential inclusion are rejected. Entering 10 exposes the proposed exclusive-boundary defect. Added boundary checks fail, the fix passes, and current review completes. A later README edit makes merge evidence stale; refreshed checks/review permit merge. Tagging old r1 fails, then the tested revision and release handoff finish. |
| Take over an embedded project | CPU software can set a local value before PL configuration; the register write is blocked until the required circuit exists. After the write, toggling the external input changes PL output while CPU instruction count stays at two. Artifact cards, linker distinction, native drag classification, direct classification buttons, and all seven ownership decisions work. |
| Coordinate a hardware change | Loading old host artifacts preserves a mismatch. Rebuilding against stale support keeps old hardware assumptions. Updating handoff/support/build/configuration and then loading aligns the model. A v2 filename is rejected as proof; aligning the inspected package permits host acceptance. A reflection draft survives redraws and is saved. |
| Deliver and diagnose a build | Power-on initially restores the old program, and installing a matching example boot setup changes the next result. Diagnosis requires relevant observations in all three cases. Clean rebuild exposes stale maintained settings. Updating settings and recording sources/environment/honest limits produces the delivery; an unsupported physical boot claim fails validation. |

## Navigation, accessibility, and visual checks

- Clicking a topic opens chapter selection grouped by three modules. Practiced marks
  and counts reflect the module records. The Continue link returns to the last visited
  chapter; opening a module without a hash restores that chapter by stable ID.
- Reopening retains the saved reflection and activity, while the experiment restarts.
  Reset clears only the selected module, restores chapter one, and removes its reflection.
- At a 390 × 844 viewport, the PS/PL diagram stacks with readable HTML labels and no
  document overflow. The working-interval input and topic selection also fit without
  horizontal document scrolling. This is a phone-size browser check, not a physical
  touch-device test of every chapter.
- With reduced motion requested, affected displays retain Changed markers and outlines
  while computed animation is `none`. The external-input action highlights the input,
  output, and result, without marking CPU state as changed.
- Inline definitions open by click and dismiss with Escape, returning focus to their
  opener. Numeric input 0 is invalid for the working interval and leaves state unchanged;
  Enter submits a valid 750 ms experiment. Ordinary buttons provide drag alternatives.
- Visible abbreviation notes cover terms outside the preferred glossary list, including
  file/state headings. Full names in closed details do not suppress visible notes.
- All six generated covers were visually inspected. The foundations cover was corrected
  to one shared conceptual chip package, avoiding a PS/PL two-chip implication. Asset
  purpose, prompts, and sources are in [visual assets](visual-assets.md).
- The final diagram page reported no browser console errors. A stale preview stylesheet
  discovered during review was corrected with a hard refresh; the layout now uses a
  build-versioned stylesheet URL to avoid that ambiguity.
- Existing pilot hash routes remain functional, including `/modules/git/#chapter-3`.
  Original guide and image routes pass built-link validation.

## Limits and publication

The models are synthetic. They do not run arbitrary Git, GitHub, an AI service, Vivado,
or Vitis, and no physical board has been selected or tested. Saved reflections are
ungraded. Phone testing was targeted; no blanket physical-device or assistive-technology
certification is claimed.

The existing public GitHub Pages source was last verified as main/root. The available
account can push this feature branch but could not change the repository’s Pages
setting. Publishing still needs the repository owner’s source-setting action described
in [deployment](../deployment.md). Passing validation and updating the local preview
do not establish that the public site has changed.
