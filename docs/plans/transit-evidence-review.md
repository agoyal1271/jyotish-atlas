# Transit evidence correction

Implemented in the shared Dasha Prediction Engine / Life Predictor transit layer:

- SAV travels with each transit's own BAV; zero is preserved and missing values remain unknown.
- SAV above 28 and own BAV above 4 are supportive evidence; disagreement is mixed. The SAV reference is Phaladeepika chapter 23 verse 20 (https://www.wisdomlib.org/hinduism/book/phaladeepika-by-mantreswara-text-and-translation/d/doc1621595.html). BAV bands are the app's simplified display convention.
- SAV and BAV are displayed together, not added as independent bonuses: SAV contains those BAV totals.
- Removed the invented Sade Sati Resilience Score and its unverified BPHS attribution. Sade Sati and Dhaiya describe Moon-relative pressure separately, without forcing a scalar penalty. This is an application design decision, not a claim that classical texts declare these transits neutral.
- Double transit now means intersection of houses occupied/aspected by Jupiter (1/5/7/9) and Saturn (1/3/7/10), counted from Lagna. The detailed panel explicitly checks its selected primary topic house. This implementation does not yet evaluate common activation of the topic lord as a separate significator.
- Both panels expose the same shared evidence. Removed probability/act-now language from the double-transit banner.

Validation: `node tests/transit-evidence.cjs` covers the production dpLayer3 function, supportive/conflicting/missing/zero AV values, house wrapping, absence of shared activation, and all inline JavaScript syntax.

Remaining limitations: timeline and detailed panel still use different date/topic/granularity inputs; legacy overall scores, debilitation caps, avastha weights and other tools' SAV display bands are not rewritten by this patch. The timeline now states this limitation. Whole-house double transit is a transparent timing indicator, not event validation. No browser interaction or screenshot QA was available for this change.
