# Prompt Builder v2

Implemented a three-part reading preparation flow: question/topic, context/date range, then review/export. The active chart is synchronized with My Charts. Chart names use safe option text and are omitted from generated packets.

The focused packet includes topic houses and relevant vargas, exact supplied period date boundaries overlapping the requested inclusive date range, missing-PD warnings, birth-time certainty, provenance limitations and a start-of-range transit snapshot. SAV/BAV and joint Jupiter–Saturn activation reuse the shared transit evidence helpers. Full chart detail is optional. Copy failure is reported and a text download is available.

Validation: `node tests/prompt-builder.cjs`, `node tests/transit-evidence.cjs`, `git diff --check`. Tests cover end-exclusive period overlap, invalid date ordering, missing transit/PD data, context inclusion, name omission and optional appendix. Browser interaction and visual QA remain unverified in this environment.

Remaining: prediction narrative and this export still have distinct orchestration; the full rule-registry/shared-analysis architecture is not complete. Transit evidence is a single dated snapshot, not a scan of the selected horizon. No remote AI call or account sync is introduced. User-provided context may identify the native even though the chart name is omitted.
