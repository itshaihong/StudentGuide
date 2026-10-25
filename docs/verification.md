# Verification record

This is a chronological record. The interactive release evidence below supersedes
the initial build limitation.

Initial directory reorganization checked on 2026-10-25, Asia/Singapore.

## Passed locally

- Source validation: eight public pages, two scenario specifications, unique routes,
  navigation ancestry and ordering, public Markdown links, and authoring exclusions.
- Ruby syntax check for `scripts/check_structure.rb`.
- Validator smoke checks using temporary HTML fixtures: valid output, a relative image,
  a missing page, an incorrect site prefix, and leaked internal material. These test
  the validator; the fixtures are not output from Jekyll.
- Whitespace checks on both staged and unstaged tracked changes.
- Content preservation: all three guide bodies match their starting contents;
  the coding-guide staged contents match the pre-move snapshot exactly.
- Both original images, `Gemfile`, and `Gemfile.lock` match their original Git contents.
- The retained Word document matches the supplied file byte for byte. Its transcription
  retains all 106 paragraphs and 28 external hyperlinks; the source contains no tables.

## Not verified

`bundle exec jekyll build --trace` could not start because the available system Ruby is
2.6.10 and cannot supply the project's locked Bundler 4.0.2 environment. The repository
now records Ruby 3.4 and has a validation workflow that installs the locked dependencies,
builds the site, and checks generated output. That workflow has not been run remotely.

No rendered-site browser inspection, hosting deployment, learner trial, or hardware
execution was performed. Module pages are outlines and scenario files are design
specifications. Their presence is not evidence of working interactions or learning.

## Finish build verification in a suitable environment

Follow the setup in the root README, then run:

```sh
ruby scripts/check_structure.rb
bundle exec jekyll build --trace
ruby scripts/check_structure.rb --site _site
```

Inspect the home page, both navigation groups, both module outlines, all three old
guide URLs, and the coding-guide images. Confirm that research, templates, exercise
specifications, and scripts are absent from the generated site.


## Interactive release checks on 2026-10-26

Branch: `codex/interactive-learning`. English-only learning UI, using static Jekyll
pages and browser JavaScript. The imported Word document and transcription are ignored
by Git and excluded from the public build.

### Automated evidence

- Thirteen model checks pass locally, including an isolated real-Git comparison of
  the staged snapshot and later working edit.
- The initial reorganization build passed in GitHub Actions run `40210557106`.
- The interactive build passed in run `40211843384`.
- The simplified reading layout passed in run `40212980834` at commit `aac8f0a`.
- Downloaded actual Jekyll artifacts pass the built-route, link, image, and exclusion
  checker locally. This preview is built output, not a hand-made replacement renderer.

### Browser evidence

Walked all five Git chapters and all six Zynq chapters through their controls in Edge.

- Git: workspace identification; wrong-answer explanation and retry; rejecting an
  unrelated README change; unstaging that path and passing the scope check; observing
  working 250 ms versus staged 500 ms; checking, committing, and sharing; all three
  recovery situations; the transfer question; and a saved ungraded reflection.
- Confirmed the Git practice record and reflection survive reload. Verified five
  chapters recorded in the chapter menu. This is activity evidence, not learner mastery.
- Zynq: both PS/PL paths, all six file cards, linker placement, loading a stale ELF,
  application rebuild and load, rebuilding against a stale BSP, repairing the hardware
  handoff chain, loading matching artifacts, observing the old boot version after a
  power cycle, updating the model's boot setup, and observing the new version after
  another power cycle. Completed the final question and reflection.
- Verified reflection draft text survives experiment redraws before saving.
- Verified reset cancellation and confirmation. Course reset returned the Zynq lab to
  chapter one. No browser error or warning logs were reported in that walkthrough.
- Checked desktop rendering and a 390 by 844 phone viewport. The phone home and boot
  chapter both report a 390 px document width, with no horizontal page overflow.
  Visible controls use 14–17 px text in the checked mobile boot chapter; the reading
  text is larger. The viewport override was restored after testing.

The user requested concise, intuitive lessons with readable text and a restrained
technology/workbench character. The revised design uses a centered reading column,
collapsible chapter navigation, inline experiments, and large plain controls. It
removes the previous decorative hero and persistent sidebar.

### Remaining release checks

The final accessibility candidate passed run `40215024562` at commit `6c2492e`.
In its actual built output, keyboard Enter activation advanced focus from creating a
branch to the staged check, and from commit to push. The primary lesson heading is
level one, the lab and question headings level two, and lab details level three.
The source link was then moved from the header to a quiet footer link at the user’s
request. GitHub Pages publication and live smoke checks are recorded in `deployment.md`. No physical
Zynq board test or real Vitis/Vivado execution is claimed.


## Final release status

The quieter header/footer candidate `963531e` passed run `40215269661`. The Pages
source update was attempted through the official API and the native repository UI.
Both confirm that publishing settings require permissions unavailable to this account.
The new experience is therefore delivered as a pushed, checked GitHub Pages branch
with a localhost preview, using the fallback authorized in the goal. `deployment.md`
records the owner action. Live publication is not claimed.
