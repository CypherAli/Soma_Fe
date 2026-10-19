# Quiz and Vision AI release check — 2026-10-13

## Changes

- Quiz assistant restores the shared 112px desktop / 88px mobile launcher. Phones have an opaque assistant dock, with reserved document space, so answers remain readable. Chat stays usable at both sizes.
- Existing PDF/Word, generated quizzes, 3D sources, study plans and AI quiz tools remain accessible. Switching tools preserves the current Hanoi attempt.
- Left-hand navigation no longer triggers snap/two-hand zoom. Unseen hands do not latch navigation during loading. Holding the same gesture still emits only one change.
- All model changes use the same outgoing-particle / incoming-form pipeline. Animation uses elapsed rendered time, so a background tab cannot skip the effect.
- Model and system changes reset zoom, rotation, cut plane, separated parts and selection. Restricted views fit their own original mesh bounds, including exploded offsets, exactly once. Small endocrine and respiratory structures remain centered and visible.
- Full searchable structure list and paginated model labels replace the previous ten-label ceiling. Vietnamese text remains associated with source IDs; English source names are explicitly identified and remain searchable. No replacement anatomy is generated.
- Detail mode renders at 2x resolution. Geometry remains the original mesh. Mobile framing leaves space above the control drawer and bounds local separation to the available width.
- Pose reset is shared; bounds calculations are extracted to the pure `inspection-frame.js` module with source-geometry tests.

## Completed automated checks

- Production Next.js build: success; TypeScript and 666 generated pages.
- Frontend unit tests: 32 passed, 0 failed, including source image feedback gating and attempt recovery/scoring.
- `verify:dr-lam`: 30 PDFs, 2,810 questions and 1,417 image references; pagination and single/multiple-answer scoring passed.
- Hand navigation: physical handedness at 6/9/11/30 FPS, one-shot/release/dropout, first gesture after loading, snap suppression and right-hand isolation.
- Inspection controls: actual 48-piece skull, immutable source geometry, selected/non-selected transforms, masks, precise membership, reassembly and envelope bounds.
- Inspection framing: real endocrine, respiratory and neural source bounds, exploded offsets and cached bounds.
- Localization: 1,450 regional structure occurrences and preserved source names.
- Render quality: explicit detail 2x, automatic native resolution, hysteresis and loading/visibility exclusions.
- Scoped ESLint checks for edited frontend and renderer modules: passed.

## Browser checks and limits

Actual Quiz was inspected in light/dark mode at desktop and 375px width. Chat opened and closed; PDF/Word returned its existing login flow; the 3D quiz source still reported 1,310 questions; returning to Hanoi preserved question 2 and the previous answer. No attempt was reset.

The deterministic renderer fixture exercises actual WebGL meshes and synthetic left-hand landmarks through the application's existing test API. It verifies outgoing particles, incoming solid geometry, pose reset, all 144 neural list entries, label pagination, Vietnamese/English/ID search, exact individual selection, system card reset and real 2x canvas resolution. The fixture is removed from `public` after QA; its generator remains under `scripts` for repeatable checks.

The final fixture also passed the 375×744 iframe check: all projected respiratory source bounds were inside the viewport and above the mobile drawer. Separated neural views passed the check that source framing is applied exactly once.

Screenshots: `quiz-full-bot-final.png`, `quiz-dark-final.png`, `vision-detail-final.png`, and `vision-mobile-final.png` in this audit directory. Vision screenshots include the deterministic test controls; the model and UI underneath are the real renderer.

No live webcam or microphone was enabled. Authenticated document upload and remote AI calls were not submitted. Passing these checks is evidence of the covered behavior, not a measured 98% reliability guarantee.
