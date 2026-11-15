# Single-viewport workspaces

Desktop uses a fixed 244px navigation rail and a 72px toolbar. The remaining viewport is the scrollable main stage. At 900px and below, a native workspace picker replaces the rail, with the same destinations. Appearance and search remain available in the toolbar.

Only one direct section of the main stage is visible. Sections stay mounted to preserve chart selections, input drafts and event handlers. Learn has topic navigation, with one lesson visible at a time. The previous journey rail and stacked-page footer are retired from this layout.

Hash URLs identify workspaces or elements inside them. The router supports browser back/forward, deep links, focus transfer and per-workspace scroll restoration. Chart actions, command-palette results and guided lesson steps use the same router. Modals remain outside the scrollable stage.

Validation: `node tests/app-shell.cjs` checks isolation, nested destinations, history behavior, focus and scroll restoration. Run the existing almanac, transit and prompt-builder suites as regression checks. Browser preview was unavailable during implementation; touch and visual checks remain outstanding.
