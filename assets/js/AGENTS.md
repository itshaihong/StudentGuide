# Learning interactions

Follow root `AGENTS.md` and `docs/v2/product-rules.md`. Domain transitions belong in
testable model files; browser rendering and event binding belong in controllers.
The shared runtime owns navigation, activity storage, definitions, and change feedback.

Give important state displays stable `data-state` keys and descriptive labels so
redraws highlight actual changes. Do not flash the whole lesson. Reduced motion must
keep a static Changed marker and the same explanatory feedback.

Preserve keyboard focus and reflection drafts through redraws. Keep runtime modules
small enough to inspect by responsibility; add a new module controller rather than
growing one giant conditional. Never execute arbitrary learner commands or send
exercise data to external services.
