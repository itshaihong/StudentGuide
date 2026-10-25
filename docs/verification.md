# Reorganization verification

Checked on 2026-10-25, Asia/Singapore.

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
