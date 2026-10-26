# Development process

## Starting idea

I wanted to create a virtual paper workspace where beginners could explore folding and paper crafts. My initial idea included different paper sizes, dragging to fold, cutting along creases and a learning section.

I proposed using the left mouse button to drag paper, Space to confirm a fold and the right mouse button to rotate the view. Separating preview from confirmation was important to me: an exploratory drag should not leave an unwanted crease.

## Scope decision

The initial discussion included fully free folding and tutorials for objects such as a paper crane. I accepted Codex's recommendation to start with constrained straight-fold geometry instead of attempting a complete flexible-paper physics simulation. This made a working interaction more achievable and explainable.

The current implementation uses polygon splitting and flat folding. More complex physical behaviours remain limitations, rather than being presented as completed features.

## Changes made during development

### Preview before confirmation

Dragging shows the proposed shape. Releasing the mouse retains the preview; Space commits it and Esc cancels it. This gives users an opportunity to inspect the response and choose their next action.

### Cut marks that remained in empty space

While using the first version, I noticed that lines remained suspended in the workspace after paper was cut and moved. I provided a screenshot and requested a correction.

The implementation was changed so that each piece owns its marks. Marks are clipped to that piece's material, and severed cut/crease markers are removed. Internal mesh edges are also suppressed to reduce harsh lines.

### Recycle-bin management

The first recycle-bin action immediately restored the most recent piece. I asked for a separate window so that users could choose a specific piece, restore all pieces or delete unwanted pieces. This made the outcome of opening the bin clearer.

### Outward folds on narrow strips

A later version required the dragged point to contact the remaining paper before a fold could be confirmed. When I tried the narrow star-strip paper, I found that this prevented ordinary outward and diagonal folds.

I rejected that restriction and requested that snapping assist alignment without controlling whether a fold is permitted. The revised version allows outward folds when the fold line actually crosses the material. The preview shows the same flat-fold geometry that confirmation produces.

This is a concrete example of using my own trial of the prototype to question and revise an AI-generated implementation.

### Additional workspace features

I requested saved projects and folders so that users could retain their work. I also requested adjustable glue painting, flipping, circular cutting, themes and language choices. These support the core activity, but their quantity is not evidence of usability on its own.

## Trial with another person — not yet completed

The observations above are the author's own feedback during development. They are not claimed as the assignment's required trial with another person.

Before submission, ask at least one other person to try the experience before explaining the controls. Record actual observations below; do not invent results or identify the participant.

- **Date:** To be completed.
- **Task given before explaining the controls:** To be completed.
- **What the participant attempted first:** To be completed.
- **Where they hesitated or made a mistake:** To be completed.
- **Whether they understood the feedback:** To be completed.
- **One change made in response, or a reason for keeping the design:** To be completed.
- **Result after the decision:** To be completed.

A suitable trial task is to fold the paper, unfold it and try cutting it into two pieces. Observe before offering help.

## AI use

I used OpenAI Codex to discuss scope, generate and revise HTML/CSS/JavaScript, work on geometry, create checks, prepare documentation and publish the website.

I supplied the concept and interaction requirements, tried the prototype, provided screenshots and requested revisions. Much of the implementation was generated and modified with Codex; I do not claim that I independently wrote all of the code.

- **Suggestion kept:** start with constrained straight-fold geometry rather than a full flexible-paper simulation.
- **Suggestion or implementation changed:** the paper-contact requirement for confirming folds was too restrictive, especially for narrow strips. I requested outward folding while keeping snapping optional.
- **Design requirement originating from me:** Space confirms a preview so that exploratory dragging does not immediately leave creases.

## A piece of the program to explain

The folding interaction connects three parts of the code:

1. Pointer events in `dist/app.js` record a drag's start and target positions.
2. `foldPlan` in `dist/engine.js` places a fold line halfway between them, perpendicular to the drag direction. It checks whether the line divides material and prepares a preview.
3. Confirming calls `fold`, which divides the affected polygons, reflects the moving side across the line and records the crease. Cancelling discards the preview without changing the paper.

Before submission, I need to be able to explain this connection in my own words, rather than only repeat the function names.

## Verification and limits

Geometry checks cover folding, area conservation, partial and complete cuts, circular holes, separate scraps, glue and input validation. Additional checks cover outward folding on all five paper sizes and agreement between the preview and confirmed geometry.

Application-state checks cover saved projects, timestamps, folders, recycle-bin actions, undo, themes, languages, persistence and storage-failure protection. They use a minimal DOM substitute, not a real browser.

Earlier browser inspection confirmed the workspace layout and paper rendering. Neither that inspection nor the automated checks replace the user trial or the final fresh-terminal run required before submission.

## Development history

This repository carries forward three existing development commits from the local Sites source repository, followed by preparation of the English submission files. The earlier commit messages are generic, but their diffs record the initial prototype, the expanded workspace and outward-fold correction.

The original development snapshots and dates are retained. Commit contact information was replaced with the repository owner's GitHub no-reply address before public upload. Historical snapshots may contain the earlier Chinese documentation; the current submission documentation is in English. No development dates or user-trial results have been fabricated.

## Remaining submission tasks

- Complete and document the trial with another person.
- Make a change based on that trial, or explain why the design was retained.
- Run the README instructions from a fresh terminal and test the main action and an error case.
- Check that the public repository opens while signed out.
- Submit the repository URL on Canvas before 1 November 2026, 23:59 Hong Kong time.
