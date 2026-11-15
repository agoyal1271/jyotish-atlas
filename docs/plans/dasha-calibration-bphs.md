# Dasha engine calibration review

This revision distinguishes classical inputs from display heuristics. BPHS-style inputs already used by the engine include Vimshottari periods, house lordship, graha drishti, dignity, avastha, Shadbala-derived Ishta/Kashta fields when supplied, and varga placement. The engine must not represent a composite numeric score as a BPHS prediction formula.

## Changes

- Rahu/Ketu in H3, H6, H10 or H11 receive the existing bounded upachaya support. H6 remains a difficult field even when it supports contest, service and overcoming opposition. No blanket Aquarius, Virgo, Gemini or Capricorn bonus was added because that rule is not universal in BPHS.
- An own/exalted Lagna lord directly aspecting a functional-malefic planet in a kendra can offset 70% of that planet's functional penalty. Relief is capped with any concurrent mitigation so lordship never silently reverses into a full benefic classification.
- Ishta at least 40 with Kashta below 15 can offset 70% of a functional penalty, also subject to the same cap. The existing Ishta/Kashta natal-quality term remains separate. This is a transparent scoring heuristic, not a quoted BPHS weighting formula.
- For the Career focus only, a period lord that is Amatyakaraka, occupies H6/H10, or rules H6/H10 gets a bounded D-10 placement and supportive-Jupiter contact adjustment. D-1 and D-10 career-house analysis stays visible alongside it.

## Test boundaries

`tests/dasha-calibration.cjs` verifies these four cases on controlled chart fixtures. This establishes rule behavior, not predictive validity. Chart-specific accuracy still needs prospective and retrospective event calibration using recorded MD/AD/PD dates and independently computed transits.
