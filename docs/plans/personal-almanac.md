# Personal almanac and observatory foundation

The returning-chart prediction view begins with current sky essentials, the supplied active MD/AD/PD and an optional journal reflection. Existing reading, question and prediction-engine actions remain below it. Light, Dark and System are persistent appearance options; system appearance follows operating-system changes.

The palette uses warm ivory and dark ink in light mode, velvet indigo and brass in dark mode. Responsive sky columns stack on narrow screens. Inputs use 16px text and controls have 44px minimum height. Decorative geometry is static; the short entrance animation respects reduced motion. This is a progressive visual migration, not a complete replacement of legacy analysis screens.

## Calculation and privacy boundaries

- Instant tithi uses normalized Sun–Moon elongation; this is a partial almanac, not a sunrise-based Panchanga calendar.
- Hora is explicitly unavailable until current location and sunrise/sunset are implemented. Browser timezone labels display times and is not treated as current geographical location.
- Period selection uses supplied start-inclusive/end-exclusive boundaries. Missing PD is shown as unavailable. Progress measures elapsed time, never planetary strength.
- The brief theme names the active period lord's natal occupied house. It does not claim a full chart synthesis or predict daily events.
- Reflections append to the existing local Life Journal with timestamp, timezone, available transit snapshot and active period names. Failed writes preserve the draft. Existing name-keyed chart storage remains; identically named charts share that journal key.

## Verification

Node checks cover lunar elongation wrap, Moon-relative houses, dasha boundaries, missing periods, theme persistence and OS preference changes. Existing transit-evidence and prompt-builder suites remain required. Browser visual and touch testing is still needed; the available browser runtime was unavailable during this implementation.
