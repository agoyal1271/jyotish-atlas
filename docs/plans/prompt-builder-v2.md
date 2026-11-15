# Prompt Builder v2

Implemented a three-part reading preparation flow: question/topic, context/date range, then review/export. The active chart is synchronized with My Charts. Chart names use safe option text and are omitted from generated packets.

The focused packet includes topic houses and relevant vargas, exact supplied period date boundaries overlapping the requested inclusive date range, missing-PD warnings, birth-time certainty, provenance limitations and a start-of-range transit snapshot. SAV/BAV and joint Jupiter–Saturn activation reuse the shared transit evidence helpers. Full chart detail is optional. Copy failure is reported and a text download is available.

Validation: `node tests/prompt-builder.cjs`, `node tests/transit-evidence.cjs`, `git diff --check`. Tests cover end-exclusive period overlap, invalid date ordering, missing transit/PD data, context inclusion, name omission and optional appendix. Browser interaction and visual QA remain unverified in this environment.

Remaining: prediction narrative and this export still have distinct orchestration; the full rule-registry/shared-analysis architecture is not complete. Transit evidence is a single dated snapshot, not a scan of the selected horizon. No remote AI call or account sync is introduced. User-provided context may identify the native even though the chart name is omitted.

## Version 3 follow-up

Supersedes the snapshot limitation above. The export now provides compressed daily UTC samples for Jupiter, Saturn and nodes over the selected range, with explicit data gaps and end-exclusive boundaries. These are approximate daily transitions, not exact ingress/contact times. Windows are capped at 1,830 days and schedules are cached against dates and natal placements to avoid recomputing when editing question text.

Added validated placement preflight, default full D1 facts and D9 plus career D10, five structured answer sections, separate data-reliability and astrological-support assessments, and rules distinguishing capacity, expression and ease. Simple “next N years/months” questions (digits or one through five) are compared against the export window using its start as the disclosed anchor. Other wording retains an explicit instruction to reconcile scope; this is not comprehensive natural-language understanding.

Export tests cover missing placements, two-year/one-year mismatch, D9/D10 inclusion, supplied versus missing PD, sign-state interval grouping and calculation gaps. Existing engine test suite also passes. The shared evidence helper is reused, but a unified interpretation engine and browser visual QA remain outstanding.
