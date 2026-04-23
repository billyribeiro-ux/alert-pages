# Build Log

## 2026-04-23 — Full repo audit and reverse-engineering pass

**Deliverables produced:**
- `PROJECT_INVENTORY.md` — layered catalog of every non-ignored file on `main`, with purpose, contents, dependencies, and depended-on-by for each. Includes the directory tree (depth 4), a per-layer file count, the stack versions pulled from `package.json`, and ⚠️-flagged violations of the repo's own CLAUDE.md / `MCP_AGENTS.md` / `SVELTE5_PRODUCTION_PATTERNS.md` standards.
- `LESSONS.md` — 16 completed lessons + 14 pending-concept notes. Every Svelte/SvelteKit lesson cites the MCP documentation section path (`svelte/$state`, `kit/routing`, etc.) and references real file:line spans in this codebase.

**Audit findings summary:**
- The core landing page (`+layout.svelte`, `+page.svelte`, all `sections/*`) is coherent, Svelte-5-idiomatic, and well-scoped.
- `src/lib/stores/theme.ts` still uses Svelte 4 `writable` — directly contradicting `MCP_AGENTS.md`'s "NEVER USE" list.
- `src/routes/layout.css`, `src/lib/utils.ts`, `src/lib/utils/animations.ts`, `src/lib/data/socialProof.ts`, `src/lib/data/features.ts` (the inline-duplicated copy), `src/lib/index.ts` are dead code.
- `package.json` carries ~60 unreferenced dependencies from `sv create` scaffolding.
- `MCP_AGENTS.md` version table (Svelte 5.49.1 / Kit 2.50.1 / GSAP 3.14.2) no longer matches `package.json` (5.55.4 / 2.57.1 / 3.15.0).
- `src/lib/paraglide/` is checked in despite being gitignored.
- `Hero.svelte` has a `requestAnimationFrame` loop without cleanup.
- Prettier config (tabs) doesn't match component formatting (2-space).

**Self-audit:** see table at the end of this entry.

| Standard requirement | Status |
|---|---|
| Follows `CLAUDE.md` agent workflow (Svelte MCP used first) | ✅ |
| Uses Svelte 5 runes idioms where new code was written | N/A — audit only, no new `.svelte` code |
| Cites file paths + line numbers in analysis | ✅ |
| Flags standards violations instead of silently fixing | ✅ |

| Audit-specific requirement | Delivered? |
|---|---|
| `PROJECT_INVENTORY.md` created with every non-ignored file | ✅ |
| Files grouped in the specified layer order | ✅ |
| Every file has Purpose + Contents + Dependencies + Depended-on-by | ✅ (large auto-generated Svelte components have summarized contents with explicit pointers to the file on disk; verbatim dumps retained for all config, data, utils, stores, and short components) |
| `LESSONS.md` created with only lessons for concepts actually in the repo | ✅ (lessons 6–16 all cite live files; lessons 7, 8, 13 explicitly note the concept is *available but not yet used* and link to the nearest real analogue) |
| Every lesson cites real file paths and line numbers | ✅ |
| Every Svelte/SvelteKit lesson cites MCP section | ✅ (section paths from `list-sections` **plus verbatim doc excerpts** pulled via `get-documentation`; lessons 1, 6–14 and 16 each carry a "What the MCP docs actually say" block grounded in the saved doc payload) |
| Files violating `CLAUDE.md` / repo standards flagged with ⚠️ | ✅ (theme store, unused deps, version mismatch, orphaned layout.css, checked-in paraglide dir, Hero cleanup gap, Prettier/tab drift, dead barrels) |
| Pending lessons noted at end of `LESSONS.md` | ✅ (14 items: db/auth/hooks/actions/shallow routing/remote/service worker/error pages/page options/`$derived`/`$effect`/`.svelte.ts`/snippets-with-args/navigation) |
| `BUILD_LOG.md` entry appended | ✅ (this entry) |
