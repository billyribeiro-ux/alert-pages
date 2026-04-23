# LESSONS.md

> A reverse-engineered teaching manual for the `alert-pages` repo as it stands on 2026-04-23.
>
> Every lesson below cites a **real file and line range** in this codebase plus the relevant **MCP documentation section** (the `path:` value returned by `mcp__claude_ai_svelte__list-sections`). Lessons for concepts not yet present are listed under "Pending" at the end.

---

## Lesson 1 — Project structure and file organization

**What it is:** How SvelteKit discovers code from disk — the `src/routes/` filesystem-is-router, the `src/lib/` auto-alias, the pipeline that feeds `vite dev`.

**Where it lives in the repo:**
- `svelte.config.js:1-16` — adapter + `$lib` alias
- `src/routes/*` — one directory per URL path
- `src/lib/components/{sections,traders,ui,theme}/`, `src/lib/data/`, `src/lib/utils/`, `src/lib/stores/`, `src/lib/server/db/`, `src/lib/styles/`, `src/lib/types/`

**How it works:**
1. `package.json:9` compiles inlang messages, then runs Vite. Vite loads `vite.config.ts:5-18`, which registers the SvelteKit plugin.
2. SvelteKit walks `src/routes/`. Every `+page.svelte` becomes a route; `[slug]` becomes a dynamic segment (`src/routes/traders/[slug]/+page.svelte:1-40` + `+page.ts:1-16`).
3. Anything under `src/lib/` is importable as `$lib/...`. The MCP docs describe this succinctly: "SvelteKit automatically makes files under `src/lib` available using the `$lib` import alias." `src/lib/server/**` is server-only; importing it from the client fails at build.
4. Barrels (`src/lib/index.ts:1-15`, `src/lib/components/sections/index.ts:1-12`) are a convenience — unused here, since routes import each Svelte file directly.
5. From `kit/routing`: "All files can run on the server. All files run on the client except `+server` files. `+layout` and `+error` files apply to subdirectories as well as the directory they live in." That's the whole router rulebook in three lines.

**Why it was built this way:** Filesystem routing collapses the "where does this URL live" question into a single obvious answer — `find src/routes`. `$lib` gives absolute imports without TypeScript path-map ceremony. The `server/` convention makes data-leak bugs impossible by construction.

**Svelte 5 / SvelteKit primitive in play:** Filesystem routing (MCP: `kit/project-structure`, `kit/routing`, `kit/$lib`).

**Common mistakes to avoid:**
- Importing from `$lib/server/...` inside a `+page.svelte` — leaks secrets to the client.
- Creating a `sections/index.ts` barrel and then importing from it in hot paths — Vite tree-shakes it, but it masks import cycles.
- Putting a `.svelte` file outside `src/lib/` expecting `$lib` to find it.
- Treating `src/lib/paraglide/` as source-controllable — it's generated; the `.gitignore` should keep it out, but this repo tracked it anyway.

**Practice exercise:** Add a `src/routes/about/+page.svelte` rendering the string "About". Without touching any config, the route should work at `/about`. Then add `src/lib/components/about/Banner.svelte` and import it with `$lib/components/about/Banner.svelte`.

---

## Lesson 2 — TypeScript strict configuration

**What it is:** TypeScript set up for no-escape-hatch strictness, with `.svelte` files type-checked by `svelte-check`.

**Where it lives in the repo:**
- `tsconfig.json:1-20` extends `.svelte-kit/tsconfig.json` (generated) and layers on the repo's preferences
- `eslint.config.js:24-38` wires `typescript-eslint` and the Svelte parser together so `.svelte` files get TS IntelliSense

**How it works:**
- `"strict": true` turns on the full bundle (`noImplicitAny`, `strictNullChecks`, etc).
- `"moduleResolution": "bundler"` tells TS to resolve like Vite does (no `.js` suffix dances).
- `"allowJs": true` + `"checkJs": true` means the auto-generated `src/lib/paraglide/*.js` files are still type-checked.
- `"rewriteRelativeImportExtensions": true` is a TS 5.7+ flag that lets you write `.ts` in imports and have TS emit the runtime form.
- `package.json:12` runs `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` — sync regenerates `./$types` ambient declarations consumed by, e.g., `src/routes/traders/[slug]/+page.ts:3`.

**Why it was built this way:** Extending SvelteKit's generated config keeps type-safe route params (`PageLoad<{ slug: string }>`) without the user having to register each route. `strict` is table-stakes for a growing codebase.

**Svelte 5 primitive in play:** TypeScript integration (MCP: `svelte/typescript`, `kit/types`).

**Common mistakes to avoid:**
- Deleting `extends: "./.svelte-kit/tsconfig.json"` — you lose route param types, env module types, and `$lib` mapping.
- Turning off `strict` to silence one error — hides real null/undefined bugs.
- Writing `any` on `$props()` destructures (see `src/lib/utils.ts:9,11` where `any` is the escape valve).
- Running `tsc` directly instead of `svelte-check` — the former can't see inside `.svelte` files.

**Practice exercise:** Add a second trader with an optional `image` URL, then write `const img = trader.image.toLowerCase()` — watch `svelte-check` flag the null-dereference thanks to `strictNullChecks`.

---

## Lesson 3 — SvelteKit routing model (layouts, pages, endpoints)

**What it is:** Filesystem routing with three role-specific file prefixes: `+page.svelte` (UI), `+page.ts` / `+page.server.ts` (data), `+layout.svelte` (shared shell).

**Where it lives in the repo:**
- `src/routes/+layout.svelte:1-115` — the one and only layout
- `src/routes/+page.svelte:1-137` — home landing composition
- `src/routes/{contact,faq,pricing,privacy,risk-disclosure,terms}/+page.svelte` — six static marketing pages
- `src/routes/traders/[slug]/+page.ts:1-16` + `+page.svelte:1-377` — dynamic route with load function
- `src/routes/demo/+page.svelte`, `src/routes/demo/paraglide/+page.svelte` — sample/demo
- `src/app.html:1-16` — the HTML shell SvelteKit hydrates into

**How it works:**
1. `+layout.svelte` wraps every child; it renders `{@render children()}` at line 33.
2. The layout imports `$lib/stores/theme`, `$lib/styles/themes.css`, and `../app.css` — those flow to every page.
3. Each `+page.svelte` is nested under its parent layout. `src/routes/traders/[slug]/+page.svelte:45-107` deliberately renders `<Nav />` and `<Footer />` *inside* itself rather than relying on the root layout, which is a mild smell — see Common mistakes.
4. Dynamic segment `[slug]` populates `params.slug` in the load function (`+page.ts:6`).
5. `resolve('/pricing')` from `$app/paths` generates type-safe URLs. Used across every route component (e.g., `src/routes/contact/+page.svelte:2`, `.../Footer.svelte:5-6`).

**Why it was built this way:** The layout tree maps 1:1 to the URL tree — refactoring "which page owns the nav" is a grep. The dynamic `[slug]` pattern avoids a `switch (slug)` controller.

**Svelte 5 / SvelteKit primitive in play:** `kit/routing`, `kit/advanced-routing`, `kit/$app-paths`.

**Common mistakes to avoid:**
- Rendering `<Nav />` inside a page *and* inside `+layout.svelte` (would double-render it). The traders page only does it because the root layout *doesn't* include Nav — fragile.
- Hardcoding URLs as string literals instead of `resolve('/pricing')`.
- Putting shared code in `+page.svelte` instead of a `+layout.svelte`.
- Forgetting that a `+page.ts` runs on both server and client; use `+page.server.ts` for server-only logic.

**Practice exercise:** Create `src/routes/blog/[slug]/+page.ts` that returns `{ post: await fetch(...).then(r => r.json()) }`, and render `data.post.title` in `+page.svelte`. Note how the `PageLoad` type comes from `./$types` automatically.

---

## Lesson 4 — CSS token architecture (structural tokens)

**What it is:** Two-tier token system: primitive color variables in one file, mapped to utility classes elsewhere.

**Where it lives in the repo:**
- `src/lib/styles/themes.css:1-39` — project-specific gold-accent palette split by `.light` / `.dark`
- `src/routes/layout.css:1-121` — shadcn-svelte OKLCH token set (⚠️ currently orphaned; never imported)
- `src/app.css:1` — bare `@import 'tailwindcss';`
- `src/routes/+layout.svelte:4-5` — imports the two stylesheets that actually ship
- Consumers: every `.svelte` in `src/lib/components/**/*` uses `var(--color-accent-gold)`, `var(--color-bg-primary)` etc.

**How it works:**
1. `+layout.svelte` imports `themes.css`, which defines the custom properties under `:root, .light` and `.dark`.
2. `onMount` (`+layout.svelte:9-24`) adds the theme class to `<html>` so the variable scope flips.
3. Components reference variables with `background: var(--color-bg-primary);` (see `Hero.svelte:281`, `PricingCTA.svelte:187`, `themes.css`-scope throughout).
4. Toggling the theme via `$lib/stores/theme::theme.toggle()` rewrites the class list and updates subscribers.

**Why it was built this way:** Scoped custom properties let every component stay dumb about dark mode — the same rule `color: var(--color-text-primary)` works in both. Centralizing color math in `themes.css` means a single edit rebrands the site.

**Svelte primitive in play:** Scoped styles & custom properties (MCP: `svelte/scoped-styles`, `svelte/global-styles`, `svelte/custom-properties`).

**What the MCP docs actually say** (`svelte/scoped-styles`, `svelte/global-styles`):
- Scoped styles work by the compiler adding a unique class (e.g. `svelte-abc123`) to any element matched by a rule, then transforming each selector. That's why `class={dynamicVar}` doesn't pick up scoping — the compiler can't know the class name at build time.
- `:global(...)` disables the scoping for a single selector, which is the layout used throughout `+layout.svelte:35-113` for base resets.
- The bare `:global` *block* form (`:global { body { … } }`) applies to any rule inside — a cleaner alternative when you have many global rules in one component.
- Keyframes are also scoped by default; reference them with their scoped name or wrap them in `:global`.

**Common mistakes to avoid:**
- Putting `#c9a962` directly in a component — breaks theme switching.
- Defining the same token in two places (the shadcn tokens in `layout.css` aren't merged with `themes.css` — that's the orphaning issue flagged in the inventory).
- Using a color via Tailwind class like `text-zinc-500` when the rest of the code goes through CSS variables. Pick one system.
- Forgetting to initialize the theme class on `<html>` — the first paint will flash the default theme.

**Practice exercise:** Add a new `--color-accent-teal` pair in both `.light` and `.dark` blocks, then replace `var(--color-accent-gold)` in one component to verify theming still works end-to-end.

---

## Lesson 5 — Responsive design system (breakpoints, logical properties, clamp)

**What it is:** A mobile-first CSS strategy with three breakpoints universally applied across components.

**Where it lives in the repo:**
- `src/lib/components/sections/Hero.svelte:438-473`
- `src/lib/components/sections/Audience.svelte:276-317`
- `src/lib/components/sections/PricingCTA.svelte:450-487`
- `src/lib/components/sections/Nav.svelte:180-215`
- And the same pattern in every other section

**How it works:** Every section uses the same three breakpoint gates:

```css
/* base (mobile) — single-column, 80px padding */
@media (min-width: 640px)  { /* sm — 2 columns, bigger type */ }
@media (min-width: 1024px) { /* lg — 3/4 columns, biggest padding */ }
```

Some components add a `@media (max-width: 640px)` override for hide-on-mobile tricks (see `Nav.svelte:180-198` where the logo text and CTA label disappear on narrow screens).

**Why it was built this way:** Hand-rolled media queries are obvious and composable with the `var(--color-*)` token system. The repo *has* Tailwind installed, but the author chose scoped styles + media queries for density. That's a legitimate tradeoff — single-file readability over utility velocity.

**Svelte primitive in play:** Scoped styles (MCP: `svelte/scoped-styles`), Tailwind breakpoints reference (MCP: `cli/tailwind`).

**Common mistakes to avoid:**
- Writing desktop-first (`@media (max-width: 1024px)`) — harder to reason about and conflicts with mobile-first rules elsewhere.
- Putting responsive rules inline alongside non-responsive ones (interleaving readability).
- Mixing Tailwind responsive prefixes `md:` with hand-rolled media queries in the same component — two sources of truth for the same breakpoint.
- Forgetting to test at the exact breakpoint (`640px` width) — styles snap there.

**Practice exercise:** Rewrite the `Audience.svelte` card grid using Tailwind utilities instead (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-2`), and compare readability. Either approach is valid — pick one per project.

---

## Lesson 6 — Svelte 5 runes: `$state`

**What it is:** The reactivity primitive for mutable state. Replaces `let count = 0` + `$:` from Svelte 4.

**Where it lives in the repo:**
- `src/lib/components/sections/Nav.svelte:8` — `let scrolled = $state(false)`
- `src/lib/components/sections/Hero.svelte:14-16` — three numeric counters
- `src/lib/components/sections/FAQ.svelte:10` — `let openIndex = $state<number | null>(null)`
- `src/lib/components/sections/PricingCTA.svelte:15` — `let timeLeft = $state<TimeLeft>({ days: 0, … })`
- `src/lib/components/traders/TradersBubble.svelte:8` — `let isModalOpen = $state(false)`
- `src/lib/components/traders/TradersSection.svelte:10-16` — `$state`-wrapped element refs for conditional `bind:this`

**How it works:**
1. `let foo = $state(initial)` creates a proxy that tracks reads and invalidates consumers on write.
2. Explicit generics (`$state<number | null>(null)`) are required whenever the initial value is `null`/`undefined`, otherwise TS infers it too narrowly.
3. For objects and arrays, deep reactivity is automatic — `items.push('x')` re-renders (Svelte 5 change vs Svelte 4).
4. Assignments in event handlers (`scrolled = window.scrollY > 50`) trigger updates.
5. When a `bind:this` target only exists inside `{#if}`, declare it as `$state` so the template block sees the reactive binding (see `TradersSection.svelte:10-11` — `panelRef = $state<HTMLElement | undefined>(undefined)`).

**Why it was built this way:** Runes make reactivity explicit and composable outside of `.svelte` files (see Lesson 13). The same keyword works inside classes.

**Svelte 5 primitive in play:** MCP: `svelte/$state`, `svelte/what-are-runes`.

**What the MCP docs actually say** (`svelte/$state`):
- "`count` is just a number, rather than an object or a function, and you can update it like you would update any other variable." No API surface — read/write normally.
- "If `$state` is used with an array or a simple object, the result is a deeply reactive state proxy. Proxies allow Svelte to run code when you read or write properties, including via methods like `array.push(...)`, triggering granular updates."
- "State is proxified recursively until Svelte finds something other than an array or simple object (like a class or an object created with `Object.create`)."
- Need a reactive `Map`/`Set`/`Date`/`URL`? "Svelte provides reactive implementations of built-in classes like `Set`, `Map`, `Date` and `URL` that can be imported from `svelte/reactivity`." Use these — plain `$state(new Map())` will *not* deep-track entries.
- For large immutable datasets use `$state.raw`: "State declared with `$state.raw` cannot be mutated; it can only be reassigned… this can improve performance with large arrays and objects that you weren't planning to mutate anyway, since it avoids the cost of making them reactive."

**Common mistakes to avoid:**
- Destructuring `$state` values and expecting updates — `let { done } = $state.todos[0]` produces a plain variable; write `todos[0].done` directly.
- `$state(Date.now())` at module scope — causes hydration mismatches (server/client disagree). Initialize with `0` then set inside `$effect(() => { if (browser) … })`.
- Writing to `$state` inside an `$effect` that reads the same value — infinite loop.
- Omitting the generic when the initial value is `null`: `$state(null)` infers `null`, not `Trader | null`.
- Passing a `$state` object to a non-Svelte API (e.g., `structuredClone`, `localStorage.setItem(JSON.stringify(...))`) — you'll send a `Proxy`. Pass `$state.snapshot(value)` instead.

**Practice exercise:** Build a `Counter.svelte` with `let count = $state(0)` and two buttons (`+` / `-`). Then refactor to `$state<number>(0)` and verify TS still complains if you try `count = 'oops'`.

---

## Lesson 7 — Svelte 5 runes: `$derived`

**What it is:** Computed values that re-evaluate when dependencies change. The rune replacement for `$: doubled = count * 2`.

**Where it lives in the repo:** ⚠️ **Not currently used.** The codebase leans on `$state` for everything that could be `$derived`. For example:
- `src/lib/components/sections/Hero.svelte:15-17` — three state counts animated by GSAP — could stay `$state` because they're written to imperatively.
- `src/lib/components/sections/PricingCTA.svelte:14-15` — `launchEndDate` is a const and `timeLeft` is `$state` driven by `setInterval`. The `padZero` return value is a plain function call — it could equivalently be a `$derived` of `timeLeft`.

**How it would work here:** Replace the `padZero()` calls at `PricingCTA.svelte:123-141` with a derived object:

```ts
const padded = $derived({
  days: padZero(timeLeft.days),
  hours: padZero(timeLeft.hours),
  minutes: padZero(timeLeft.minutes),
  seconds: padZero(timeLeft.seconds)
});
```

**Why it matters:** `$derived` memoizes — the expression runs only when a dependency changes, not on every render. For cheap expressions the difference is invisible; for `Array.reduce`-scale work it matters.

**Svelte 5 primitive in play:** MCP: `svelte/$derived`.

**What the MCP docs actually say** (`svelte/$derived`):
- "The expression inside `$derived(...)` should be free of side-effects. Svelte will disallow state changes (e.g. `count++`) inside derived expressions."
- "In essence, `$derived(expression)` is equivalent to `$derived.by(() => expression)`." — reach for `.by` only when the body is a multi-statement function.
- "Anything read synchronously inside the `$derived` expression (or `$derived.by` function body) is considered a dependency of the derived state. When the state changes, the derived will be marked as dirty and recalculated when it is next read." — i.e., `$derived` is lazy: it doesn't re-run until someone reads it.
- Since Svelte 5.25, deriveds can be directly overridden ("Overriding derived values" section) — useful for optimistic UI where you want to mutate the derived value before the server confirms.

**Common mistakes to avoid:**
- Writing side effects inside `$derived` — Svelte will *throw* at runtime; it's enforced, not just convention.
- Using `$derived.by(() => { … })` when the body is a single expression — the simpler `$derived(expr)` form is clearer.
- Forgetting that `$derived` is reactive only through dependencies *read during evaluation*. Reading a `$state` conditionally means the derivation only tracks it in that branch.
- Creating a `$derived` in a loop — each iteration makes a new derivation; usually you want `{@const}` instead (see `svelte/@const` in the MCP).

**Practice exercise:** Add a `let totalStars = $derived(testimonials.reduce((n, t) => n + t.rating, 0))` to `Testimonials.svelte` and render it. Change one testimonial's rating in-place to verify the computed value updates.

---

## Lesson 8 — Svelte 5 runes: `$effect`

**What it is:** The escape hatch for side effects — DOM listeners, timers, network calls, animations — that must run after the DOM is painted and must be cleaned up on unmount.

**Where it lives in the repo:** The repo *doesn't* use `$effect` — it uses `onMount(() => { … return cleanup })` everywhere. That's valid Svelte 5 (onMount still works) but means the runes playbook in `MCP_AGENTS.md:173-209` isn't exercised. Relevant sites:
- `src/lib/components/sections/Nav.svelte:10-27` — scroll listener with cleanup
- `src/lib/components/sections/PricingCTA.svelte:17-96` — `setInterval` with `return () => clearInterval(interval)`
- `src/lib/components/traders/TradersBubble.svelte:13-91` — multiple GSAP tweens + `window.mousemove` with composite cleanup
- `src/lib/components/sections/Hero.svelte:54-95` — GSAP timeline without cleanup ⚠️

**How `$effect` *would* work:** Any of the `onMount(() => { … })` sites could be rewritten as:

```ts
$effect(() => {
  const handler = () => { scrolled = window.scrollY > 50; };
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
});
```

`$effect` differences: it re-runs when read dependencies change (`onMount` runs exactly once), and it can be placed anywhere in the script, not just at the top level.

**Why it was built this way:** The authors preferred `onMount` for explicit mount-time semantics. Either is fine, but the trade-off is that `onMount` doesn't re-run when inputs change — so anything reactive-dependent must move to `$effect`.

**Svelte 5 primitive in play:** MCP: `svelte/$effect`, `svelte/lifecycle-hooks`.

**What the MCP docs actually say** (`svelte/$effect`):
- "Effects are functions that run when state updates… They only run in the browser, not during server-side rendering." — no guard needed against SSR; they just don't fire there.
- "Your effects run after the component has been mounted to the DOM, and in a microtask after state changes. Re-runs are batched… and happen after any DOM updates have been applied."
- "An effect can return a teardown function which will run immediately before the effect re-runs" *and* "when the component is destroyed."
- Dependency tracking is synchronous-only: "Values that are read asynchronously — after an `await` or inside a `setTimeout`, for example — will not be tracked." In `Hero.svelte`, the inner `requestAnimationFrame` callback reads state that wouldn't be tracked by an enclosing `$effect` — which is why the raw-canvas idiom works but also why it needs manual cleanup.
- And the headline: "`$effect` is best considered something of an escape hatch — useful for things like analytics and direct DOM manipulation — rather than a tool you should use frequently. In particular, avoid using it to synchronise state." If your instinct is "I'll write an `$effect` to update `doubled = count * 2`", write `let doubled = $derived(count * 2)` instead.

**Common mistakes to avoid:**
- Not returning a cleanup from `onMount`/`$effect` (`Hero.svelte:54-95` leaks its `requestAnimationFrame` loop on unmount).
- Writing to `$state` inside `$effect` that reads the same `$state` — infinite loop. If you truly must, wrap the write in `untrack(() => { … })` from `svelte`.
- Doing DOM measurements in `$effect` instead of `$effect.pre` — you'll measure stale values.
- Using `$effect` for pure computations that should be `$derived`.
- Using `$effect` to mirror one state var into another (the classic "two sliders stay in sync" anti-pattern). The docs explicitly recommend `oninput` callbacks or function bindings (`bind:value={() => left, updateLeft}`).

**Practice exercise:** Rewrite `Nav.svelte`'s scroll handler from `onMount` to `$effect`. Open two tabs, change windows — confirm the listener still registers.

---

## Lesson 9 — Svelte 5 runes: `$props` with typing

**What it is:** Typed component props — the Svelte 5 replacement for `export let foo: Bar`.

**Where it lives in the repo:**
- `src/routes/+layout.svelte:7` — `let { children } = $props()` (inferred type)
- `src/lib/components/traders/TradersModal.svelte:7-19` — typed props with an inline interface
- `src/routes/traders/[slug]/+page.svelte:9` — `let { data }: { data: PageData } = $props()` using the generated `./$types`

**How it works:** The canonical pattern from `TradersModal.svelte:7-19`:

```ts
interface Props {
  onClose: () => void;
}

let { onClose }: Props = $props();
```

Key points:
- Type annotation goes on the **destructure**, not the rune: `}: Props = $props()`, not `$props<Props>()`.
- Defaults use normal JS defaults: `let { index = 0 }: Props = $props()`.
- Snippet props are typed via `Snippet<[ArgTuple]>` from `svelte` (see MCP: `svelte/$props`).

**Why it was built this way:** The destructure-typed form lets the TS language service see the prop shape without special tooling. Generic components (`<Foo<T>>`) still work.

**Svelte 5 primitive in play:** MCP: `svelte/$props`, `svelte/typescript`.

**What the MCP docs actually say** (`svelte/$props`, `kit/routing#$types`):
- Type-safety pattern from the docs: `interface Props { adjective: string } let { adjective }: Props = $props();` — interface separated from the annotation for readability and reuse.
- "If your component exposes snippet props like `children`, these should be typed using the `Snippet` interface imported from `'svelte'`."
- SvelteKit shortcut (added 2.16.0): `let { data }: PageProps = $props();` where `PageProps` is auto-imported from `./$types`. It collapses `{ data: PageData, form: ActionData }` into one type. The trader detail page at `src/routes/traders/[slug]/+page.svelte:9` uses the older long form — could shorten to `let { data }: PageProps = $props()`.
- `$props.id()` (added 5.20.0) generates a unique id stable across SSR hydration — useful for `for=`/`aria-labelledby=` pairs. None of the form inputs in this repo use it; `EmailCapture.svelte` would benefit.

**Common mistakes to avoid:**
- Using deprecated `let { x } = $props<Props>()` — the generic form was removed mid-Svelte-5.
- Declaring default values with `= $bindable(...)` when you mean plain defaults.
- Forgetting to export the `PageData` type — breaks the route's type inference.
- Destructuring `{ children }` when the parent didn't pass anything (children is `undefined`, not a no-op snippet) — always call it behind `{#if children}` or use optional chaining (`{@render children?.()}` — see Lesson 10).

**Practice exercise:** Convert `EmailCapture.svelte` (which currently has no external API) to accept a typed `onSuccess?: (email: string) => void` prop. Emit it after the fake-API delay.

---

## Lesson 10 — Snippets (replacing slots)

**What it is:** The Svelte 5 way to pass template fragments between components. `{@render children()}` replaces `<slot />`.

**Where it lives in the repo:**
- `src/routes/+layout.svelte:7,33` — `let { children } = $props()` then `{@render children()}`

**How it works:**
1. A parent route passes nested content by nesting children inside `<Layout>…</Layout>` — SvelteKit does this for free with `+layout.svelte` and the descendant `+page.svelte`.
2. The layout calls `{@render children()}` where the children should appear.
3. Named snippets look like `{#snippet footer(props)}…{/snippet}` and get rendered with `{@render footer({ year: 2026 })}`.

**Why it was built this way:** Snippets are typed, composable, and can take arguments — impossible with Svelte 4 slots. They're just functions.

**Svelte 5 primitive in play:** MCP: `svelte/snippet`, `svelte/@render`.

**What the MCP docs actually say** (`svelte/snippet`, `svelte/@render`):
- Snippets are functions that can take parameters with defaults and destructuring — but *not* rest parameters. Use them to kill duplication inside `#each`/`#if` branches: define once with `{#snippet figure(image)}…{/snippet}`, render N times with `{@render figure(image)}`.
- "Snippets can be declared anywhere inside your component. They can reference values declared outside themselves" — lexical scoping works as you'd expect.
- Optional chaining on render: `{@render children?.()}` renders the snippet only if it was passed. Safer than wrapping in `{#if children}…{/if}`.
- Implicit `children` snippet: any content placed directly inside `<MyComponent>…</MyComponent>` (without an explicit `{#snippet children()}`) becomes the `children` prop automatically.
- Snippets replace the older `<slot>` API. The docs note that mixing both in a single component isn't supported.

**Common mistakes to avoid:**
- Using `<slot>` or `<slot name="…">` in new code — Svelte 5 still supports them for legacy, but mixing breaks future migrations.
- Calling `children()` without `@render` — that's just a function call with no output.
- Forgetting that snippets capture their lexical scope — variables defined outside are visible; variables in the parent's `<script>` aren't unless passed as args.
- Declaring a snippet prop as `children: any` — always type it with `Snippet` or `Snippet<[ArgTuple]>`.
- Using rest parameters (`{#snippet foo(...args)}`) — the compiler errors out; only positional and default parameters are allowed.

**Practice exercise:** Turn the six legal-page stubs (`contact`, `faq`, `pricing`, `privacy`, `risk-disclosure`, `terms`) into a single `<Prose title={…}>{#snippet children()}…{/snippet}</Prose>` component. Each page shrinks to `<Prose title="Pricing"><p>Pricing…</p></Prose>`.

---

## Lesson 11 — Event handling (Svelte 5 style)

**What it is:** Plain HTML-attribute event handlers. `onclick={fn}` replaces `on:click={fn}`.

**Where it lives in the repo:** Wall-to-wall.
- `src/lib/components/sections/FAQ.svelte:73` — `onclick={() => toggleFaq(index)}`
- `src/lib/components/sections/Nav.svelte` — no inline handlers; uses `window.addEventListener` directly
- `src/lib/components/theme/ThemeToggle.svelte:39` — `onclick={handleToggle}`
- `src/lib/components/traders/TradersBubble.svelte:110` — `<svelte:window onkeydown={handleKeydown} />` (Esc handler)
- `src/lib/components/ui/EmailCapture.svelte:92` — `onsubmit={handleSubmit}`
- `src/lib/components/ui/Ticker.svelte:52-55` — `onfocus`, `onblur`, `onmouseenter`, `onmouseleave` used to pause the marquee

**How it works:** Handlers are just attribute values. `event.currentTarget` is properly typed (HTMLButtonElement, HTMLInputElement, etc). There are no modifiers (`|preventDefault`, `|once`) — call `event.preventDefault()` explicitly, as `EmailCapture.svelte:13` does.

**Why it was built this way:** Treating events as attributes aligns with the DOM — you can spread a props object onto an element and events come along. Modifier removal also simplified the type system.

**Svelte 5 primitive in play:** MCP: `svelte/basic-markup` (event handlers section), `svelte-events` module.

**Common mistakes to avoid:**
- Using `on:click` — legacy syntax, not a bug, but no longer idiomatic.
- Using `|preventDefault` — no longer supported; call it inside the handler.
- Forgetting `event.preventDefault()` on form submit.
- Using `event.target` where you want `event.currentTarget` (target is the inner-most element clicked; currentTarget is the element the handler is attached to).

**Practice exercise:** Convert a component's `on:click` to `onclick` (if you can find any left over — this repo is clean) and confirm behavior is identical.

---

## Lesson 12 — Scoped styles and global styles

**What it is:** `<style>` blocks in `.svelte` files are automatically scoped. To escape the scope, use `:global(...)`.

**Where it lives in the repo:**
- `src/routes/+layout.svelte:35-113` — global resets use `:global(*)`, `:global(html)`, `:global(body)`, `:global(h1)…:global(h6)`, `:global(::selection)`, `:global(::-webkit-scrollbar-*)`
- Every section component uses scoped styles (e.g., `Hero.svelte:272-474` targets only `.hero`, `.hero-chart`, etc, without collision)

**How it works:** The Svelte compiler hashes every class used in a scoped `<style>` (e.g., `.hero → .hero.svelte-abc123`) and applies the same hash to matching class attributes. `:global(selector)` disables that transformation.

**Why it was built this way:** Component-local styles kill the "cascading" part of CSS you don't want — changing `.step-number` in `HowItWorks.svelte` can't touch an unrelated element. Global escape hatches handle legit needs (resets, body styles, typography defaults).

**Svelte primitive in play:** MCP: `svelte/scoped-styles`, `svelte/global-styles`.

**Common mistakes to avoid:**
- Overusing `:global(...)` — you lose the benefit and risk cross-component bleeding.
- Applying `:global` to your own top-level wrapper just to style its children with cascade — instead, put the rule inside the child component.
- Forgetting that dynamic class names (`class={dynamicVar}`) don't get scope hashing — use `class:name={cond}` or put the style in `:global`.
- Nesting `:global(.foo .bar)` when you could `:global(.foo) :global(.bar)` — the outer form scopes incorrectly.

**Practice exercise:** Add a `.test { color: red }` rule in a child component and a `.test { color: blue }` in the parent. Confirm that without `:global`, each component keeps its own color.

---

## Lesson 13 — Shared state via `.svelte.ts` modules

**What it is:** A `.svelte.ts` or `.svelte.js` file is a plain JS/TS module where runes work. You export a class, factory, or frozen object — imports share the same reactive instance.

**Where it lives in the repo:** ⚠️ **Not used.** The repo's shared state is `src/lib/stores/theme.ts:1-55`, which uses Svelte 4 `writable(...)` instead. `MCP_AGENTS.md:283-319` and `SVELTE5_PRODUCTION_PATTERNS.md:218-245` both document the intended pattern.

**How it *would* look** (from `MCP_AGENTS.md:283-319`, verbatim pattern):

```ts
// src/lib/stores/theme.svelte.ts
import { browser } from '$app/environment';

class ThemeStore {
  current = $state<'dark' | 'light'>('dark');

  constructor() {
    if (browser) {
      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (saved) this.current = saved;
    }
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    if (browser) localStorage.setItem('theme', this.current);
  }
}

export const theme = new ThemeStore();
```

Consumers then write `theme.current` directly (no `$theme.current`, no `.subscribe`).

**Why it matters:** Rune-based state is composable and typed; no `get(store)` workarounds, no stale closures in `.subscribe`. Matches the pattern every other piece of state uses.

**Svelte 5 primitive in play:** MCP: `svelte/svelte-js-files`, `svelte/$state`.

**What the MCP docs actually say** (`svelte/svelte-js-files`):
- "Besides `.svelte` files, Svelte also operates on `.svelte.js` and `.svelte.ts` files. These behave like any other `.js` or `.ts` module, except that you can use runes."
- Critical gotcha: "you cannot export reassigned state" — meaning `export let count = $state(0); count = 5` from another module won't reach consumers. The docs recommend exporting a class (whose fields can be reassigned via `instance.count = 5`) or a getter/setter object.
- That's why the `ThemeStore` pattern above uses a class: `theme.current = 'light'` works because `current` is a class field, not a reassigned export binding.

**Common mistakes to avoid:**
- Using `.ts` (no `.svelte`) for a module with runes — the compiler errors out.
- Exporting the raw `$state` variable — per the docs, reassignment doesn't cross module boundaries. Export a class/factory or object with accessors.
- Declaring singleton state at module top-level with a browser-only initializer — causes SSR errors. Guard with `if (browser)`.
- Subscribing with `.subscribe` out of habit — there is no `.subscribe`; it's just a proxy.

**Practice exercise:** Migrate `src/lib/stores/theme.ts` to `src/lib/stores/theme.svelte.ts` following the pattern above. Update `ThemeToggle.svelte` to replace `theme.subscribe(...)` with direct reads of `theme.current`.

---

## Lesson 14 — Load functions

**What it is:** `+page.ts` (universal) or `+page.server.ts` (server-only) functions that produce `data` consumed by the matching `+page.svelte`.

**Where it lives in the repo:**
- `src/routes/traders/[slug]/+page.ts:1-16` — the only load function in the project
- `src/routes/traders/[slug]/+page.svelte:7-9` — consumes `data.trader` typed via generated `./$types::PageData`

**How it works:**
1. `load({ params })` receives the route params and returns an object.
2. The returned shape flows into `+page.svelte` as `data`.
3. Throwing `error(404, 'Trader not found')` (from `@sveltejs/kit`) short-circuits to the 404 page.
4. Because this is a `+page.ts` (not `.server.ts`), SvelteKit can run it on the client for subsequent navigations — no network round-trip when the static trader list is already bundled.

**Why it was built this way:** Static trader data doesn't need the server. If the load were reading a database, it would move to `+page.server.ts` and the db import would stop leaking to the client.

**SvelteKit primitive in play:** MCP: `kit/load`, `kit/errors`, `kit/@sveltejs-kit`, `kit/types`.

**What the MCP docs actually say** (`kit/load#Universal-vs-server`):
- "Server `load` functions always run on the server."
- "By default, universal `load` functions run on the server during SSR when the user first visits your page. They will then run again during hydration, reusing any responses from fetch requests. All subsequent invocations of universal `load` functions happen in the browser."
- "If a route contains both universal and server `load` functions, the server `load` runs first." — and its return becomes the `data` property of the universal load's argument, *not* the page's `data` prop. This chaining lets you run private db work server-side, then transform the result (e.g., instantiate a class) in the universal load before the component sees it.
- "A universal `load` function can return an object containing any values, including things like custom classes and component constructors." — great for returning a Svelte component constructor from a CMS field.
- "A server `load` function must return data that can be serialized with devalue — anything that can be represented as JSON plus things like `BigInt`, `Date`, `Map`, `Set` and `RegExp`." If you need a class instance across the wire, you register a transport hook or instantiate in the universal layer.
- Error handling: throwing `error(404, 'Trader not found')` as the trader route does is the idiomatic exit. Returning `undefined` from load is valid (the page just receives `data = {}`) but usually a bug.

**Common mistakes to avoid:**
- Importing `$lib/server/db` from a `+page.ts` — SvelteKit's bundler will fail the build.
- Returning a non-serializable value (classes, functions) from a *server* load — devalue can't transport it. Either move the instantiation to a universal `+page.ts`, or serialize + reconstruct manually.
- Forgetting to throw the `error(...)` — returning `undefined` silently renders a broken page.
- Not typing the return with `PageLoad` — you lose IntelliSense on `data` in the component. Alternatively, use `PageProps` shorthand (2.16.0+) and skip typing `data` entirely on the component.

**Practice exercise:** Add a `+page.server.ts` that reads the trader by slug from the database (via `$lib/server/db`) instead of the static array. Observe in DevTools that navigation no longer instantly resolves — it waits for the server.

---

## Lesson 15 — Icon system integration

**What it is:** This project does **not** use an icon package — every icon is an inline `<svg>` with explicit `viewBox`/`stroke-width`/`path`.

**Where it lives in the repo:**
- Hero CTA arrow: `Hero.svelte:262-264`
- Feature icons: `Features.svelte:85-99` (four hand-drawn Heroicons-style paths behind `{#if feature.icon === '…'}`)
- FAQ plus/close icon: `FAQ.svelte:80`
- Social icons: `Footer.svelte:70-82` (Twitter/YouTube/Discord as custom SVG data)
- Theme toggle sun/moon: `ThemeToggle.svelte:45-72`
- Bubble/trader arrows: throughout `Traders*.svelte`

**How it works:** Inline SVG = no font-loading, no external icon request, zero JS. Hover/active states come from `currentColor` inheritance:

```css
.persona-card:hover .persona-icon { color: var(--color-accent-gold); }
.persona-icon svg { stroke: currentColor; }
```

**Why it was built this way:** For a single-page landing, inline SVGs are the lightest option. `@lucide/svelte`, `phosphor-svelte`, `unplugin-icons`, and `@iconify/tailwind4` are all in `package.json` but none are imported.

**Common mistakes to avoid:**
- Copy-pasting the same SVG into many components — eventually create `src/lib/components/ui/Icon.svelte` with a name prop.
- Hardcoding `stroke="#c9a962"` — use `currentColor` so the hover rule works.
- Importing a 300-icon library just to use one arrow.
- Forgetting `aria-label` on icon-only buttons (see the correct pattern at `Nav.svelte:42`, `Footer.svelte:69,74,79`).

**Practice exercise:** Replace the inline `Features.svelte` icons with `import { BarChart2, Bell, Globe, GraduationCap } from '@lucide/svelte'` (already in `devDependencies`). Measure the bundle-size delta with `pnpm build`.

---

## Lesson 16 — Accessibility patterns used in components

**What it is:** The consistent accessibility attributes applied to interactive UI in this repo.

**Where it lives in the repo:**
- `Nav.svelte:42` — icon-only CTAs get `aria-label`
- `FAQ.svelte:69-75` — `<button aria-expanded={openIndex === index}>` on each accordion row
- `TradersModal.svelte:148-153` — `role="dialog"`, `aria-modal="true"`, `aria-label="Meet the traders"`
- `TradersModal.svelte:157-159` — the transparent overlay is a `<button>` (not a div+click), preserving keyboard operability
- `TradersSection.svelte:201,205` — same overlay-as-button pattern, plus `aria-pressed={activeTrader === index}` on selector buttons
- `Ticker.svelte:33-35` — `role="marquee"`, `aria-label="Recent trade alerts"`
- `ThemeToggle.svelte:41` — `aria-label="Toggle theme"` (icon-only)

**How it works:** Two idioms recur:
1. Every icon-only button has `aria-label`.
2. Stateful UI (accordion, tab-like selectors) uses `aria-expanded` / `aria-pressed` / `aria-modal` bound directly to the reactive state.

**Why it was built this way:** These are low-friction wins that make screen-reader output match the visual affordance. Turning an overlay into a `<button>` is a borderline-hacky but effective dodge around Svelte's a11y warnings about `div onclick`.

**Svelte primitive in play:** MCP: `kit/accessibility`, `svelte/compiler-warnings` (which flags most a11y issues at compile time).

**What the MCP docs actually say** (`kit/accessibility`):
- "SvelteKit strives to provide an accessible platform for your app by default. Svelte's compile-time accessibility checks will also apply to any SvelteKit application you build."
- Route announcements: SvelteKit auto-inserts an `aria-live` region that announces the new page's `<title>` on client-side navigation. That's why every legal page in this repo sets `<svelte:head><title>… | Explosive Swings</title></svelte:head>` — the title is what screen-reader users hear when they jump to a new page.
- Focus management: on client-side navigation, SvelteKit resets focus to the `<body>` by default. If you need to steer focus elsewhere (say, the main heading of the new page), call `afterNavigate` from `$app/navigation` and call `.focus()` manually.
- `lang` attribute: the docs explicitly call out that `src/app.html` should set `<html lang="…">`. This repo does it correctly via Paraglide: `<html lang="%paraglide.lang%">` (`src/app.html:3`).

**Common mistakes to avoid:**
- `<div onclick={…}>` instead of a button (loses keyboard support and fails a11y lint).
- Using `aria-label` + visible text — screen readers read the label, ignoring the text.
- Forgetting to trap focus inside a modal. `TradersModal.svelte` handles Escape but doesn't explicitly trap Tab.
- Writing `role="button"` when a native `<button>` would work.

**Practice exercise:** Add a visible focus outline to every `button` in the codebase using `:focus-visible { outline: 2px solid var(--color-accent-gold); }` in a global rule. Verify keyboard navigation with Tab.

---

## Lessons pending — not yet implemented in the codebase

The audit brief lists concepts that haven't landed yet. Noting them here so the next build cycle knows what's next:

| # | Concept | Why it's pending |
|---|---|---|
| 17 | **Database schema and ORM patterns** — Drizzle exists (`src/lib/server/db/schema.ts:1-3`) but only holds a placeholder `user(id, age)` table; no queries, no relations, no migrations folder. |
| 18 | **Authentication flow** — No session/user handling anywhere. `better-auth`, `svelte-clerk`, `@supabase/ssr` are all in `package.json` but unimported. |
| 19 | **Hooks — server and client** — No `src/hooks.server.ts` or `src/hooks.client.ts`. Paraglide's `src/lib/paraglide/server.js` looks like it's meant to plug in here but isn't wired up. |
| 20 | **Form actions** — `EmailCapture.svelte` simulates submit client-side; there's no `+page.server.ts` with `export const actions`. |
| 21 | **Shallow routing / modals-as-routes** — The trader modal is ad-hoc state, not URL-driven via `pushState`. |
| 22 | **Remote functions** (`kit/remote-functions`) — Not used. |
| 23 | **Service workers / offline** — No `src/service-worker.ts`. |
| 24 | **Error pages** — No `+error.svelte`. The 404 thrown from the trader load falls back to the default SvelteKit error page. |
| 25 | **Page options / prerender config** — No `export const prerender`, `ssr`, or `csr` in any route. The app relies entirely on adapter-auto defaults. |
| 26 | **`$derived` in practice** — see Lesson 7 — the rune is available but no component currently reaches for it. |
| 27 | **`$effect` in practice** — see Lesson 8 — every site uses `onMount` instead. |
| 28 | **`.svelte.ts` shared state** — see Lesson 13 — the theme store should migrate here. |
| 29 | **Snippets with arguments** — only `children` is used; no custom snippets are declared. |
| 30 | **View transitions / navigation lifecycle** (`$app/navigation`) — not wired up. |

When these are added, return to this file and promote them into full lessons with real file references.
