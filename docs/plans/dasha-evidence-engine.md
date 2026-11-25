# Dasha evidence engine

The Dasha Prediction Engine displays the selected MD, AD and available PD with their D-1 house connections, aspects and nakshatra lords; relevant natal houses and SAV; D-9 and topic-varga ascendants, house lords and period-lord placements; and a dated Jupiter/Saturn/node transit snapshot. It marks incomplete inputs, missing periods and unassessed birth-time sensitivity. Source labels distinguish calculations and conventions. It does not expose the former numerical verdict, hard cap or 70% functional penalty relief.

The Life Predictor lists actual supplied periods and opens the same evidence view. The Bhava Mandala's active-phase card no longer derives a good/bad verdict from the legacy score.

## Boundaries

- Birth-time perturbation is not implemented; the interface says sensitivity was not assessed.
- Transit evidence is one snapshot (today for an active interval; midpoint for another selected interval), not a complete transit schedule or a predicted event window.
- Topic houses are a starting convention. Direct connections are occupancy, rulership or Atlas graha aspects, not a calibrated probability or a claim that unconnected topics are inactive.
- Qualitative supporting/complicating labels are limited to disclosed dignity, combustion and house indicators; they do not constitute a whole-chart verdict.
- Legacy scoring functions remain in the source for other legacy views such as Life Outlook; they do not drive the new Dasha Prediction Engine or Life Predictor. Those views need a separate migration.
- Node aspects use Atlas's 5th/7th/9th convention, which is not universal. D-1 SAV and BAV are correlated and not applied to divisional houses.
- Dates use the chart's supplied numeric boundaries; UTC formatting can differ from the calendar date in the source timezone. Do not infer missing periods.

Run `node tests/dasha-evidence.cjs` and the transit, prompt and navigation suites. The evidence tests validate output for controlled fixtures; they do not validate future event predictions.
