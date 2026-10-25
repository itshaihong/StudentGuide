# Interaction observations and adopted design

Observed on 2026-10-26, Asia/Singapore, through Microsoft Edge. These are fresh UI
observations for this implementation, distinct from the supplied earlier research.

## Access and scope

Visited the [home page](https://academy.vibetech.tw/home),
[frontend module](https://academy.vibetech.tw/module/2), and an available
[data-fetching lesson](https://academy.vibetech.tw/unit/2-10) using the existing signed-in
browser. The public `robots.txt` disallows `/whitelist`, `/terms`, and `/privacy`.
Those routes were not visited. No account change, payment, hidden endpoint access,
course completion action, or source-code extraction was performed.

## Useful patterns observed

- A module page introduces a coherent topic and groups its lessons into smaller parts.
- The lesson places small operable teaching models beside the explanation.
- A step control pauses between received data, stored state, and visible output. After
  advancing once, the received value changed while the stored state and display were old.
- Switching to an empty-result example changed both the data representation and the
  visible result, with an explanation that emptiness and failure are different states.
- Each teaching model provides a reset rather than requiring a page reload.

These observations concern selected interactions, not a review of the complete course
or evidence about a learner's understanding. The site's wording, questions, images,
video, source code, and visual assets were not reused.

## Original StudentGuide implementation

The interface uses an independent green-and-paper workbench design, original HTML/CSS
diagrams, English embedded-development examples, and original state models. The useful
teaching pattern is a prediction followed by an inspectable change and a new situation.

Git makes a working/index mismatch inspectable. It lets the learner stage inappropriate
content, inspect it, and unstage it, rather than limiting the interface to correct
answers. Checkpoint sharing and recovery target different layers of state.

Zynq makes a stale handoff or BSP visible, allows an application build against old
support data, and separates host files, loaded CPU/PL state, and boot setup. File cards
identify producer, consumer, artifact type, and editing responsibility.

Feedback explains the state transition and stays near its interaction. All controls
are native links, buttons, fields, or checkboxes; all drag-like choices have ordinary
click/keyboard operations. Reduced motion is respected. Reflections are not
automatically graded, and activity completion is not labelled mastery.
