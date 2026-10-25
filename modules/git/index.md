---
layout: default
title: Git workflow
parent: Learning modules
nav_order: 1
permalink: /modules/git/
module_id: git
status: outline
---

# Git workflow

This planned module is for students who can edit and build a small embedded program
and are starting to use Git or an AI coding assistant.

By the end, you should be able to explain where a change lives, inspect what an AI
changed, choose what belongs in a commit, and distinguish local history from a remote repository.
The interactive activities below are planned and have not been implemented yet.

## Planned learning path

| Unit | What you should be able to do |
| --- | --- |
| 1. Locate the workspace | Identify the current clone, branch, working files, and remote. |
| 2. Inspect a change | Explain the difference between a working diff and a staged diff. |
| 3. Make a checkpoint | Stage a coherent set of changes, check it, and commit it. |
| 4. Experiment and share | Explain the roles of a branch, fetch, pull, push, and a pull request. |
| 5. Choose a recovery action | Distinguish unstaging, discarding local edits, and reversing a shared commit. |

## First planned activity

**Let AI change an LED interval, then submit only the intended changes.**

You will review a synthetic set of edits, predict which changes belong together,
and inspect the resulting staged snapshot. A follow-up change will help check
whether you can explain why staging does not continuously follow the working file.

The intended evidence of understanding is a correct state plus an explanation,
followed by a new variation without hints. Completing a screen alone will not
establish mastery.

See the [coding standards and Git conventions reference]({{ '/folder/' | relative_url }})
for the existing project conventions.
