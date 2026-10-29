# Development process

## Starting idea

I wanted to create a virtual paper workspace where beginners could explore folding and paper crafts. My initial idea included different paper sizes, dragging to fold, cutting along creases and a learning section.

I proposed using the left mouse button to drag paper, Space to confirm a fold and the right mouse button to rotate the view. Separating preview from confirmation was important to me: an exploratory drag should not leave an unwanted crease.

## Development timeline

The project is organised into the following development stages. v4 and v5 are my working labels for these stages, rather than GitHub release tags. Later stages are updated as observations and changes are recorded; version labels are not a claim that every proposed feature is implemented.

| Dates (2026) | Development stage | Status |
| --- | --- | --- |
| 15–20 October | Decide on the concept and explore the interaction through early prototypes. | Completed |
| 20–23 October | Develop the initial website prototype through repeated testing, debugging and feature revisions, reaching v4. | Completed |
| 24–26 October | Refine v4 and adjust its features, producing the v5 working version. | Completed |
| 27–28 October | Let four participants explore first, then give small tasks and collect feedback. | Completed |
| 29–30 October | Add a replayable introduction and clearer confirmation cues; document folding and cutting limitations. | Introduction implemented on 29 October; follow-up trial pending |
| 31 October | Make the final updates to the GitHub repository and finish the submission documentation. | Planned |

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

The narrow strip exposed a problem I had not noticed with A4 paper: the contact rule made a plausible fold impossible. I kept snapping as an alignment aid, but removed it as a condition for confirming a fold.

### Additional workspace features

I requested saved projects and folders so that users could retain their work. I also requested adjustable glue painting, flipping, circular cutting, themes and language choices. My priority for the next trial is whether someone can understand and complete a fold, rather than whether they discover every tool.

## Trial with four participants

I invited four people to try Paper Room: two classmates, one participant around 50 and one around 16. The sessions took place on 27–28 October 2026. I first let participants explore freely, before giving small tasks such as folding a triangle, cutting, gluing, adding a sheet and changing colours. I reported the observations on 29 October.

All four could locate the relevant buttons and complete basic operations, although they needed some time to explore and become familiar with the interaction rules. Younger participants noticed the confirmation prompt more quickly. The participant around 50 had more difficulty noticing that clicking Confirm or pressing Space was required before continuing. This is an observation from this small group, not a general conclusion about age or ability.

### Decision: make confirmation something users practise

The feedback suggested an interactive introduction on first opening, with a way to replay it through Tutorial / Help, or a short demonstration video. I chose a hands-on introduction because the difficulty concerned a decision the user needs to make during an action: a visible preview still needs confirmation.

The introduction uses a separate practice sheet. It asks users to drag, cancel the first preview, drag again, confirm and unfold. Instructions change after each action, and the next relevant button is shown explicitly. It can be closed, restarted or reopened without changing the user's current project. The workspace confirmation bar is also more prominent.

This change was implemented on 29 October with Codex assistance. Automated checks cover the practice sequence, replay, display preferences and preservation of the current project. A browser check also exercised dragging, cancellation, Space confirmation, unfolding and dismissal persistence. A follow-up trial has not yet established whether it resolves the original difficulty.

### Decision: offer adjustable display settings

The older participant also asked for clear controls for text size, pointer size and dashed-line thickness and colour. I added a labelled Display settings button with three text sizes, optional larger workspace pointer rings, adjustable dashed guides and a reset button. These preferences are saved in the browser.

Some folds were difficult to align, and a small overhang was not always visible from one side. I added an optional translucent-layer view so that users can inspect overlaps without making the default view visually busy. This is a viewing aid, not a correction to the geometry or a claim that alignment problems have been solved. The reported alignment difficulty still needs a reproducible example and further investigation.

### Folding limitations exposed by the trial

Trying to make recognisable objects highlighted a gap between the three-dimensional view and the folding model. A crane requires opening individual layers, and a strip star starts with a knot. The current model moves layers together in flat folds; rotating the view does not make layer selection or knotting possible.

I retained the current folding model for this submission and documented this limitation. Individual-layer manipulation and flexible paper would require a substantial change to the geometry and interaction, rather than an additional camera control.

### Request for more expressive cutting

Participants wanted freer cutting for paper-cut patterns, complex outlines and curves, while retaining cuts along creases. One proposed interaction was to draw a dashed cutting path, select it with Scissors, preview the result and confirm with Space or the confirmation button.

This is recorded as a future development direction, not an implemented feature. The current version still supports crease cuts and circular guides. Open versus closed paths, self-intersections and partial cuts need clear behaviour before freehand cutting can be added reliably. For this iteration, I prioritised the confirmation difficulty observed during basic use.

### Follow-up still needed

- Ask a participant to try the revised introduction and record whether confirmation is easier to understand.
- Record any further change or the reason for retaining the revised design.

## AI use

I used OpenAI Codex to discuss scope, generate and revise HTML/CSS/JavaScript, work on geometry, create checks, prepare documentation and publish the website.

I supplied the concept and interaction requirements, tried the prototype, provided screenshots and requested revisions. Codex generated and revised much of the code. My work centred on defining the interaction, trying the results and deciding what needed to change. Codex also helped organise and edit these English project notes from our conversation.

- **Suggestion kept:** start with constrained straight-fold geometry rather than a full flexible-paper simulation.
- **Suggestion or implementation changed:** the paper-contact requirement for confirming folds was too restrictive, especially for narrow strips. I requested outward folding while keeping snapping optional.
- **Design requirement originating from me:** Space confirms a preview so that exploratory dragging does not immediately leave creases.

## A piece of the program to explain

The folding interaction connects three parts of the code:

1. Pointer events in `dist/app.js` record a drag's start and target positions.
2. `foldPlan` in `dist/engine.js` places a fold line halfway between them, perpendicular to the drag direction. It checks whether the line divides material and prepares a preview.
3. Confirming calls `fold`, which divides the affected polygons, reflects the moving side across the line and records the crease. Cancelling discards the preview without changing the paper.

The important distinction is between previewing and committing: dragging prepares a possible change, while confirmation changes the stored paper geometry. This is how the code implements my requirement that trying a fold should not immediately leave a crease.

## Verification and limits

Geometry checks cover folding, area conservation, partial and complete cuts, circular holes, separate scraps, glue and input validation. Additional checks cover outward folding on all five paper sizes and agreement between the preview and confirmed geometry.

Application-state checks cover saved projects, timestamps, folders, recycle-bin actions, undo, themes, languages, persistence and storage-failure protection. They use a minimal DOM substitute, not a real browser.

Earlier browser inspection confirmed the workspace layout and paper rendering. Neither that inspection nor the automated checks replace the user trial or the final fresh-terminal run required before submission.

## Development history

This repository carries forward three existing development commits from the local Sites source repository, followed by preparation of the English submission files. The earlier commit messages are generic, but their diffs record the initial prototype, the expanded workspace and outward-fold correction.

The original development snapshots and dates are retained. Commit contact information was replaced with the repository owner's GitHub no-reply address before public upload. Historical snapshots may contain the earlier Chinese documentation; the current submission documentation is in English. The documentation was assembled on 26 October from the earlier work, rather than written alongside every development step.

## Remaining submission tasks

- Record a follow-up observation of the revised introduction and display settings.
- Run the README instructions from a fresh terminal and test the main action and an error case.
- Check that the public repository opens while signed out.
- Submit the repository URL on Canvas before 1 November 2026, 23:59 Hong Kong time.
