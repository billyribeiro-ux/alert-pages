# PROJECT_INVENTORY.md

> Generated: 2026-04-23. Full reverse-engineering audit of the `alert-pages` repo as-is on branch `main`.

## Directory Tree (depth 4, ignored folders excluded)

```
alert-pages/
├── .claude/
│   └── settings.local.json
├── .cursor/
│   └── mcp.json
├── .vscode/
│   └── settings.json
├── e2e/
│   └── demo.test.ts
├── messages/
│   └── en.json
├── project.inlang/
│   ├── cache/
│   │   └── plugins/
│   │       ├── 2sy648wh9sugi
│   │       └── ygx0uiahq6uw
│   ├── .gitignore
│   ├── .meta.json
│   ├── README.md
│   └── settings.json
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── components/
│   │   │   ├── sections/
│   │   │   ├── theme/
│   │   │   ├── traders/
│   │   │   └── ui/
│   │   ├── data/
│   │   ├── paraglide/          # auto-generated (gitignored in source, tracked here)
│   │   ├── server/
│   │   │   └── db/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── index.ts
│   │   └── utils.ts
│   ├── routes/
│   │   ├── contact/
│   │   ├── demo/
│   │   ├── faq/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   ├── risk-disclosure/
│   │   ├── terms/
│   │   ├── traders/
│   │   │   └── [slug]/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── layout.css
│   │   └── page.svelte.spec.ts
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   └── demo.spec.ts
├── static/
│   └── robots.txt
├── .env.example
├── .gitignore
├── .mcp.json
├── .npmrc
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── CLAUDE.md
├── MCP_AGENTS.md
├── README.md
├── SVELTE5_PRODUCTION_PATTERNS.md
├── components.json
├── compose.yaml
├── drizzle.config.ts
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

## File Count by Layer

| Layer | Count |
|---|---|
| Root config (tooling, docs, MCP, Docker, prettier, eslint, vite, ts, svelte, drizzle, playwright) | 22 |
| Database layer (drizzle config, server/db/*) | 3 |
| Shared libraries (stores, types, utils, data, lib barrel) | 14 |
| Styles (themes.css, app.css, routes/layout.css) | 3 |
| Components — sections | 13 |
| Components — theme | 2 |
| Components — traders | 4 |
| Components — ui | 4 |
| Routes (+layout, +page, subroutes, tests, dynamic slug) | 14 |
| Static / assets / i18n / paraglide / e2e | ~15 (paraglide auto-generated files not individually enumerated) |

## Stack Versions (from `package.json`)

| Tool | Version |
|---|---|
| Svelte | ^5.55.4 |
| SvelteKit | ^2.57.1 |
| @sveltejs/vite-plugin-svelte | ^7.0.0 |
| Vite | ^8.0.10 |
| TypeScript | ^6.0.3 |
| Tailwind CSS | ^4.2.4 |
| @tailwindcss/vite | ^4.2.4 |
| Drizzle ORM / Kit | ^0.45.2 / ^0.31.10 |
| postgres (driver) | ^3.4.9 |
| GSAP | ^3.15.0 |
| Paraglide JS | ^2.16.0 |
| Vitest | ^4.1.5 |
| Playwright | ^1.59.1 |
| ESLint | ^10.2.1 |
| Prettier | ^3.8.3 |
| pnpm (engine) | 10.12.3 |

> ⚠️ `package.json` also lists ~60 frontend libraries (shadcn/skeleton/flowbite/daisyui/ark-ui/melt/sentry/supabase/clerk/better-auth/gsap/tanstack/three/etc) that are **not imported** anywhere in `src/`. They were added by `sv create` flags or left over from scaffolding and currently bloat the dependency graph without affecting runtime. Flagged as ⚠️ in the audit — most should be pruned.

---

# 1. Root Config

### `package.json`

**Purpose:** Package manifest, pnpm scripts (dev/build/check/lint/test/db/*), dep list for the app and all tooling.

**Full contents:**

```json
{
	"name": "alert-pages",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"packageManager": "pnpm@10.12.3",
	"scripts": {
		"dev": "vite dev",
		"build": "paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide && vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write .",
		"test:unit": "vitest",
		"test": "pnpm run test:unit -- --run && pnpm run test:e2e",
		"test:e2e": "playwright test",
		"db:start": "docker compose up",
		"db:push": "drizzle-kit push",
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:studio": "drizzle-kit studio"
	}
	/* devDependencies and dependencies elided for brevity — see file on disk.
	   Runtime actually imports only:
	     svelte, @sveltejs/kit, @sveltejs/adapter-auto, tailwindcss, @tailwindcss/vite,
	     gsap, drizzle-orm, postgres, @inlang/paraglide-js, clsx, tailwind-merge,
	     eslint, prettier, vitest, @playwright/test, typescript, svelte-check.
	   All other listed deps are unused scaffolding — see audit warning above. */
}
```

**Dependencies:** None (manifest).
**Depended on by:** pnpm, every build tool in the repo.

---

### `tsconfig.json`

**Purpose:** Extends SvelteKit's generated tsconfig, enables strict mode, bundler module resolution, JS checking, JSON resolution.

**Full contents:**

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"rewriteRelativeImportExtensions": true,
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```

**Dependencies:** `.svelte-kit/tsconfig.json` (generated by `svelte-kit sync`).
**Depended on by:** `svelte-check`, Vitest TS type-checking, editor TS server.

---

### `svelte.config.js`

**Purpose:** SvelteKit config — adapter-auto, vitePreprocess, `$lib` alias.

**Full contents:**

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$lib': './src/lib',
      '$lib/*': './src/lib/*'
    }
  }
};

export default config;
```

⚠️ The `$lib` alias is declared explicitly here, but SvelteKit already provides `$lib` via `files.lib` — the redundant entries are harmless but unnecessary. Flagged as a minor cleanup opportunity.

**Dependencies:** `@sveltejs/adapter-auto`, `@sveltejs/vite-plugin-svelte`.
**Depended on by:** `vite.config.ts`, `eslint.config.js`, SvelteKit build.

---

### `vite.config.ts`

**Purpose:** Vite config — enables SvelteKit plugin, forces GSAP inlining for SSR, sets up scss preprocessing stub.

**Full contents:**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger']
  },
  ssr: {
    noExternal: ['gsap']
  }
});
```

⚠️ `scss.additionalData: ''` has no effect; no `.scss` files exist in the repo. The block is dead config.

**Dependencies:** `@sveltejs/kit/vite`, `vite`.
**Depended on by:** `pnpm dev`, `pnpm build`, `pnpm preview`.

---

### `.env.example`

**Purpose:** Sample env vars for local postgres via docker compose.

**Full contents:**

```
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
```

**Dependencies:** Matches `compose.yaml` credentials.
**Depended on by:** Developer onboarding only.

---

### `.gitignore`

**Purpose:** Ignore builds, OS junk, env files, Vite timestamps, paraglide output.

**Full contents:**

```
test-results
node_modules

# Output
.output
.vercel
.netlify
.wrangler
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

# Paraglide
src/lib/paraglide
project.inlang/cache/
```

**Dependencies:** —
**Depended on by:** `eslint.config.js` (imports it via `includeIgnoreFile`).

---

### `.mcp.json`

**Purpose:** Model Context Protocol servers registered at project root (svelte, tailwind, postgres).

**Full contents:**

```json
{
	"mcpServers": {
		"svelte": {
			"type": "stdio",
			"command": "npx",
			"env": {},
			"args": ["-y", "@sveltejs/mcp"]
		},
		"tailwind": {
			"type": "stdio",
			"command": "pnpm",
			"args": ["dlx", "-y", "@modelcontextprotocol/server-tailwindcss"]
		},
		"postgres": {
			"type": "stdio",
			"command": "pnpm",
			"args": ["dlx", "-y", "@modelcontextprotocol/server-postgres"]
		}
	}
}
```

**Dependencies:** `@sveltejs/mcp`, `@modelcontextprotocol/server-tailwindcss`, `@modelcontextprotocol/server-postgres`.
**Depended on by:** Claude Code / Cursor when operating in this repo.

---

### `.npmrc`

**Purpose:** Force strict engine matching.

**Full contents:**

```
engine-strict=true
```

---

### `.prettierignore`

**Purpose:** Skip formatting for lockfiles, static assets, migrations.

**Full contents:**

```
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lock
bun.lockb

# Miscellaneous
/static/
/drizzle/
```

---

### `.prettierrc`

**Purpose:** Prettier config — tabs, single quotes, svelte & tailwind plugins.

**Full contents:**

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	],
	"tailwindStylesheet": "./src/routes/layout.css"
}
```

⚠️ Prettier is configured with tabs + single quotes, but every `.svelte` file in `src/lib/components/**` uses 2-space indentation + single quotes. The codebase is inconsistent with its own Prettier config. Running `pnpm run format` will rewrite the component files significantly.

---

### `eslint.config.js`

**Purpose:** Flat-config ESLint — TS + Svelte rules, respects `.gitignore`.

**Full contents:**

```js
import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
```

**Depended on by:** `pnpm lint`.

---

### `playwright.config.ts`

**Purpose:** Playwright E2E config — builds & previews, points to `e2e/`.

**Full contents:**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'pnpm run build && pnpm run preview', port: 4173 },
	testDir: 'e2e'
});
```

---

### `components.json`

**Purpose:** shadcn-svelte registry config — CSS path, path aliases, zinc baseColor.

**Full contents:**

```json
{
	"$schema": "https://shadcn-svelte.com/schema.json",
	"tailwind": {
		"css": "src/routes/layout.css",
		"baseColor": "zinc"
	},
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui",
		"hooks": "$lib/hooks",
		"lib": "$lib"
	},
	"typescript": true,
	"registry": "https://shadcn-svelte.com/registry"
}
```

⚠️ Zero shadcn components have actually been installed — this is an empty registry config waiting for `shadcn-svelte add <component>`.

---

### `compose.yaml`

**Purpose:** Docker compose for local Postgres 16.

**Full contents:**

```yaml
services:
  db:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: local
    volumes:
      - pgdata:/var/lib/postgresql
volumes:
  pgdata:
```

---

### `pnpm-workspace.yaml`

**Purpose:** Workspace settings — allow esbuild's native postinstall.

**Full contents:**

```yaml
onlyBuiltDependencies:
  - esbuild
```

---

### `README.md`

**Purpose:** Default `sv create` scaffold README — generic Svelte CLI docs.

**Full contents:**

```md
# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

(… boilerplate sv create usage …)

```

⚠️ Untouched scaffolded README — does not describe this project ("Explosive Swings" landing page).

---

### `AGENTS.md` and `CLAUDE.md`

**Purpose:** Identical agent instructions pointing at the Svelte MCP (`list-sections`, `get-documentation`, `svelte-autofixer`, `playground-link`). Both files are byte-identical.

**Full contents (shared):**

```md
You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections
(… see file …)

### 2. get-documentation

### 3. svelte-autofixer

### 4. playground-link
```

**Depended on by:** Claude Code / OpenAI-compatible agents that auto-load `AGENTS.md` or `CLAUDE.md`.

---

### `MCP_AGENTS.md`

**Purpose:** ~500-line agent-facing playbook — Svelte 5 runes reference, GSAP cleanup patterns, Tailwind v4 breakpoints, file naming, migration checklist.

**Full contents:** See file on disk (19,921 bytes; dated "January 2026"). Verbatim inclusion omitted for length — key sections: Version Compatibility Table, `$state`/`$derived`/`$effect`/`$props`/`$bindable`/`$inspect` syntax, State Module Pattern (`.svelte.ts` singletons), GSAP `gsap.context()` cleanup, Svelte 5 Snippets (replacing slots), Tailwind v4 breakpoints (sm/md/lg/xl/2xl), Performance (debounce, `Map` for O(1)), Context API, and common mistakes (hydration mismatches, effect loops, missing cleanup).

⚠️ Document claims "Svelte 5.49.1 | SvelteKit 2.50.1 | GSAP 3.14.2" — these versions **do not match** `package.json` (which lists 5.55.4 / 2.57.1 / 3.15.0). The mismatch is cosmetic but misleading.

---

### `SVELTE5_PRODUCTION_PATTERNS.md`

**Purpose:** "Apple Principal Engineer ICT 7" enterprise-grade playbook — type safety, `$state.raw` for immutable audit trails, effect cleanup, `Map`-backed state, context API. Content overlaps with `MCP_AGENTS.md`.

**Full contents:** See file on disk (10,565 bytes). Key patterns: explicit generics on `$state<T>()`, browser-guarded initialization, defensive `$derived(... ?? fallback)`, WebSocket cleanup, singleton class stores, factory-returned counters for testability, a Trading Dashboard example.

---

### `.cursor/mcp.json`

**Purpose:** Cursor-IDE-scoped MCP config (svelte only, via `pnpm exec`).

**Full contents:**

```json
{
	"mcpServers": {
		"svelte": {
			"command": "pnpm",
			"args": ["exec", "svelte-mcp"]
		}
	}
}
```

---

### `.vscode/settings.json`

**Purpose:** Tell VS Code to treat `.css` files as Tailwind CSS (for IntelliSense).

**Full contents:**

```json
{
	"files.associations": {
		"*.css": "tailwindcss"
	}
}
```

---

### `.claude/settings.local.json`

**Purpose:** Per-user Claude Code overrides — disables the three MCP servers from `.mcp.json` and allowlists only `list-sections`.

**Full contents:**

```json
{
  "disabledMcpjsonServers": [
    "svelte",
    "tailwind",
    "postgres"
  ],
  "permissions": {
    "allow": [
      "mcp__claude_ai_svelte__list-sections"
    ]
  }
}
```

---

# 2. Database Layer

### `drizzle.config.ts`

**Purpose:** drizzle-kit config — schema path, postgres dialect, env-driven URL.

**Full contents:**

```ts
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true
});
```

**Dependencies:** `drizzle-kit`, `process.env.DATABASE_URL`.
**Depended on by:** `db:push`, `db:generate`, `db:migrate`, `db:studio` scripts.

---

### `src/lib/server/db/schema.ts`

**Purpose:** Single-table Drizzle schema — placeholder `user` table (id, age).

**Full contents:**

```ts
import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const user = pgTable('user', { id: serial('id').primaryKey(), age: integer('age') });
```

⚠️ Placeholder: app never reads or writes this table. Schema exists only because `sv add drizzle` scaffolded it.

**Dependencies:** `drizzle-orm/pg-core`.
**Depended on by:** `src/lib/server/db/index.ts`, `drizzle.config.ts`.

---

### `src/lib/server/db/index.ts`

**Purpose:** Drizzle client factory — reads `DATABASE_URL` from private env, constructs pg client, wraps in drizzle.

**Full contents:**

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
```

**Dependencies:** `drizzle-orm/postgres-js`, `postgres`, `./schema`, `$env/dynamic/private`.
**Depended on by:** Nothing currently — the `db` export is never imported in `src/`.

---

# 3. Server-only code

No `hooks.server.ts`, no `+server.ts` endpoints, no `+page.server.ts` load functions exist yet. The only server-flagged module is `src/lib/server/db/` above.

---

# 4. Shared Libraries

### `src/lib/index.ts`

**Purpose:** Barrel file re-exporting stores, data, utils, and every component subgroup.

**Full contents:**

```ts
// Stores
export { theme } from './stores/theme';

// Data
export * from './data';

// Utils
export * from './utils';

// Components
export * from './components/sections';
export * from './components/ui';
export * from './components/traders';
export * from './components/theme';
```

**Dependencies:** all `./stores`, `./data`, `./utils`, `./components/*` subtrees.
**Depended on by:** Unused — no file imports `$lib` directly. Routes import the specific modules. ⚠️ Dead barrel; safe to remove.

---

### `src/lib/utils.ts`

**Purpose:** shadcn-style `cn()` helper + generic `Without*` / `WithElementRef` TS helpers.

**Full contents:**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

⚠️ Never imported. Installed proactively by shadcn-svelte's generator.

---

### `src/lib/stores/theme.ts`

**Purpose:** Legacy `svelte/store`-based theme store (dark/light) with localStorage persistence and SSR-safe fallbacks.

**Full contents:**

```ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function safeLocalStorageGet(key: string): string | null {
  if (!browser) return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeLocalStorageSet(key: string, value: string): void {
  if (!browser) return;
  try { localStorage.setItem(key, value); } catch { /* quota or blocked */ }
}

function createThemeStore() {
  const defaultTheme: Theme = 'dark';
  const initial = (safeLocalStorageGet('theme') as Theme) || defaultTheme;
  const { subscribe, set, update } = writable<Theme>(initial);

  return {
    subscribe,
    toggle: () => {
      update(current => {
        const next = current === 'dark' ? 'light' : 'dark';
        if (browser) {
          safeLocalStorageSet('theme', next);
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(next);
        }
        return next;
      });
    },
    set: (theme: Theme) => {
      if (browser) {
        safeLocalStorageSet('theme', theme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
```

⚠️ This uses Svelte 4 `writable` stores. The repo's own playbooks (`MCP_AGENTS.md`, `SVELTE5_PRODUCTION_PATTERNS.md`) mark `svelte/store` as "NEVER USE". Should be migrated to a `.svelte.ts` rune-backed module.

**Dependencies:** `svelte/store`, `$app/environment`.
**Depended on by:** `src/routes/+layout.svelte`, `src/lib/components/theme/ThemeToggle.svelte`.

---

### `src/lib/types/index.ts`

**Purpose:** Central TS interfaces — `Trader`, `Testimonial`, `FAQ`, `Feature`, `TimeLeft`, `Theme`.

**Full contents:**

```ts
export interface Trader {
  id: string;
  name: string;
  title: string;
  initials: string;
  image?: string;
  bio: string;
  shortBio: string;
  achievements: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  title: string;
  initials: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type Theme = 'dark' | 'light';
```

⚠️ Duplicated contracts: each `data/*.ts` file re-declares the same interface inline. Nothing actually imports from `$lib/types`. Consider consolidating.

---

### `src/lib/utils/index.ts`

**Purpose:** Barrel — re-exports animations, countdown, gsap helpers.

**Full contents:**

```ts
export * from './animations';
export * from './countdown';
export * from './gsap';
```

---

### `src/lib/utils/animations.ts`

**Purpose:** GSAP animation helpers — `fadeInUp`, `staggerFadeIn`, `countUp`, `createScrollTrigger`, `magneticEffect`.

**Full contents:**

```ts
import { gsap, ScrollTrigger } from './gsap';

export function fadeInUp(element: Element, delay = 0) { /* fromTo opacity/y */ }
export function staggerFadeIn(elements: Element[], stagger = 0.1) { /* stagger fromTo */ }
export function countUp(element: Element, target: number, duration = 2) { /* tween obj.value, write textContent */ }
export function createScrollTrigger(trigger: Element, animation: gsap.core.Tween, start = 'top 80%') {
  return ScrollTrigger.create({ trigger, start, onEnter: () => animation.play(), once: true });
}
export function magneticEffect(element: HTMLElement, strength = 0.3) { /* adds mousemove/mouseleave listeners, returns cleanup */ }
```

⚠️ **Unused.** Every section component re-implements these inline. No file imports from `$lib/utils/animations`.

---

### `src/lib/utils/countdown.ts`

**Purpose:** Pure function `calculateTimeLeft(targetDate) → {days, hours, minutes, seconds}`.

**Full contents:**

```ts
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
}
```

**Depended on by:** `src/lib/components/sections/PricingCTA.svelte`.

---

### `src/lib/utils/gsap.ts`

**Purpose:** GSAP initializer — registers ScrollTrigger plugin once, sets defaults.

**Full contents:**

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGSAP() {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });
  }
}

export { gsap, ScrollTrigger };
```

⚠️ `initGSAP()` is defined but never called. Every component calls `gsap.registerPlugin(ScrollTrigger)` inside its own `onMount` instead.

---

### `src/lib/data/index.ts`

**Purpose:** Barrel — traders, testimonials, faqs, features, socialProof.

**Full contents:**

```ts
export * from './traders';
export * from './testimonials';
export * from './faqs';
export * from './features';
export * from './socialProof';
```

---

### `src/lib/data/traders.ts`

**Purpose:** Static data — two traders (Billy Ribeiro, Freddie Ferber) with bio/achievements. Re-declares `Trader` interface.

**Full contents:** Two-entry `export const traders: Trader[] = [...]` (see file — ~55 lines). Shape matches `$lib/types/index.ts::Trader`.

**Dependencies:** —
**Depended on by:** `TradersBubble.svelte`, `TradersModal.svelte`, `TradersSection.svelte`, `routes/traders/[slug]/+page.ts`.

---

### `src/lib/data/testimonials.ts`

**Purpose:** Three customer testimonial objects.

**Full contents:** `testimonials: Testimonial[]` with id/text/author/title/initials/rating.

**Depended on by:** `src/lib/components/sections/Testimonials.svelte`.

---

### `src/lib/data/faqs.ts`

**Purpose:** Six FAQ Q&A pairs.

**Depended on by:** `src/lib/components/sections/FAQ.svelte`.

---

### `src/lib/data/features.ts`

**Purpose:** Four feature card objects (icon/title/description).

⚠️ Duplicated: `Features.svelte` declares the **same** array inline and ignores this file.

---

### `src/lib/data/socialProof.ts`

**Purpose:** Broker/media/partner list for social proof row.

⚠️ **Unused.** `SocialProof.svelte` hardcodes its own broker list (and uses a different schema).

---

# 5. Styles

### `src/lib/styles/themes.css`

**Purpose:** Light/dark CSS custom properties — gold accent palette, surface colors, shadows, gradients.

**Full contents:**

```css
:root,
.light {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f7f7f9;
  --color-bg-tertiary: #ededf2;
  --color-accent-gold: #c9a962;
  --color-accent-gold-light: #e4d4a5;
  --color-accent-gold-dark: #9a7d3f;
  --color-text-primary: #1a1a1f;
  --color-text-secondary: #52525c;
  --color-text-muted: #8a8a96;
  --color-success: #34d399;
  --color-danger: #ef4444;
  --color-border: rgba(201, 169, 98, 0.2);
  --color-gradient-gold: linear-gradient(135deg, #c9a962 0%, #e4d4a5 50%, #c9a962 100%);
  --shadow-gold: 0 0 60px rgba(201, 169, 98, 0.15);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.08);
  --nav-bg: rgba(255, 255, 255, 0.95);
}

.dark {
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-bg-tertiary: #1a1a26;
  --color-accent-gold: #c9a962;
  --color-accent-gold-light: #e4d4a5;
  --color-accent-gold-dark: #9a7d3f;
  --color-text-primary: #f5f5f7;
  --color-text-secondary: #a0a0a8;
  --color-text-muted: #6b6b75;
  --color-success: #34d399;
  --color-danger: #ef4444;
  --color-border: rgba(201, 169, 98, 0.15);
  --color-gradient-gold: linear-gradient(135deg, #c9a962 0%, #e4d4a5 50%, #c9a962 100%);
  --shadow-gold: 0 0 60px rgba(201, 169, 98, 0.15);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --nav-bg: rgba(10, 10, 15, 0.9);
}
```

**Depended on by:** `src/routes/+layout.svelte` (imports directly).

---

### `src/app.css`

**Purpose:** Global stylesheet — single `@import 'tailwindcss';`.

**Full contents:**

```css
@import 'tailwindcss';
```

**Depended on by:** `src/routes/+layout.svelte` (imported as `../app.css`).

---

### `src/routes/layout.css`

**Purpose:** Shadcn-svelte-generated Tailwind v4 design tokens — radii, OKLCH surface/fg palette, dark-mode overrides, `@theme inline` mapping, `@layer base` defaults.

**Full contents:** (112 lines; OKLCH-based palette — see file). Contains `@import "tailwindcss";`, `@import "tw-animate-css";`, `@custom-variant dark`, `:root { --radius, --background, ... }`, `.dark { ... }`, `@theme inline { --color-* → var(--…) }`, and `@layer base { * { @apply border-border outline-ring/50 }; body { @apply bg-background text-foreground } }`.

⚠️ `layout.css` is **never imported** by any route or component. Only `app.css` and `themes.css` are imported in `+layout.svelte`. The file is configured as Prettier's `tailwindStylesheet` and as shadcn's `tailwind.css`, but its tokens don't reach the rendered page. The two token systems (`themes.css` variables vs `layout.css` shadcn tokens) are not aligned.

---

# 6. Components

### `src/lib/components/theme/index.ts`

**Purpose:** Barrel for the theme subtree.

**Full contents:**

```ts
export { default as ThemeToggle } from './ThemeToggle.svelte';
```

---

### `src/lib/components/theme/ThemeToggle.svelte`

**Purpose:** Animated sun/moon toggle wired to `$lib/stores/theme`.

**Full contents:** See file (150 lines). Key runtime behavior:

```svelte
<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let currentTheme: 'dark' | 'light' = $state('dark');

  theme.subscribe(value => { currentTheme = value; });

  onMount(() => { /* gsap.set hidden icon to scale 0 */ });

  function handleToggle() {
    /* GSAP timeline swaps sun/moon, then theme.toggle() */
  }
</script>

<button onclick={handleToggle} class="theme-toggle" aria-label="Toggle theme">
  <div class="toggle-track">
    <div class="toggle-thumb" class:dark={currentTheme === 'dark'}>
      <svg bind:this={sunRef} class="icon sun">…</svg>
      <svg bind:this={moonRef} class="icon moon">…</svg>
    </div>
    <div class="toggle-glow"></div>
  </div>
</button>

<style> /* scoped track/thumb/icon/glow */ </style>
```

⚠️ Mixes Svelte 5 `$state` with Svelte 4 `store.subscribe()` — fragile hybrid. Should read `$theme` directly once the store is migrated to a rune-backed module.

**Dependencies:** `$lib/stores/theme`, `gsap`, `svelte`.
**Depended on by:** `src/lib/components/sections/Nav.svelte`.

---

### `src/lib/components/sections/index.ts`

**Purpose:** Barrel for all 11 marketing-page sections + `Footer` + `Nav`.

**Full contents:**

```ts
export { default as Nav } from './Nav.svelte';
export { default as Hero } from './Hero.svelte';
export { default as Problem } from './Problem.svelte';
export { default as Solution } from './Solution.svelte';
export { default as HowItWorks } from './HowItWorks.svelte';
export { default as Credentials } from './Credentials.svelte';
export { default as Features } from './Features.svelte';
export { default as Audience } from './Audience.svelte';
export { default as Testimonials } from './Testimonials.svelte';
export { default as FAQ } from './FAQ.svelte';
export { default as PricingCTA } from './PricingCTA.svelte';
export { default as Footer } from './Footer.svelte';
```

**Depended on by:** Only `src/lib/index.ts` (which itself is unused). Routes import each Svelte file directly.

---

### `src/lib/components/sections/Nav.svelte`

**Purpose:** Fixed top nav with `scrolled` shadow/backdrop blur, logo, `ThemeToggle`, "Get Started" CTA. Uses `$state(false)` for the scroll flag, GSAP for entrance.

**Full contents:** See file (217 lines). `<script>`: `scrolled = $state(false)`; `onMount` binds `window.scroll` listener and fires a GSAP `fromTo` on the nav; returns a cleanup removing the listener. `<nav class="nav" class:scrolled>` with conditional `.scrolled` styling.

**Dependencies:** `gsap`, `$app/paths` `resolve`, `$lib/components/theme/ThemeToggle.svelte`.
**Depended on by:** `src/routes/+page.svelte`, `src/routes/traders/[slug]/+page.svelte`.

---

### `src/lib/components/sections/Hero.svelte`

**Purpose:** Landing hero — eyebrow → title → subtitle → three GSAP-counted stats → CTA → note. Renders an animated canvas chart in the background.

**Full contents:** See file (475 lines). Contains pure-Canvas 2D rendering loop (`animateChart`) with `requestAnimationFrame` and a 3-second re-generation cycle. Stats (`setupsCount`, `profitCount`, `priceCount`) are `$state(0)` values tweened with GSAP's `onUpdate`.

⚠️ Raw canvas animation has no cleanup. If the hero unmounts mid-cycle, the `requestAnimationFrame` loop leaks. On a single-route landing page the leak is harmless, but it breaks the patterns documented in `SVELTE5_PRODUCTION_PATTERNS.md`.

**Dependencies:** `gsap`.
**Depended on by:** `src/routes/+page.svelte`.

---

### `src/lib/components/sections/Problem.svelte`

**Purpose:** "The Reality" section — intro copy + three pain-point cards with icon + title + body. GSAP scroll-triggered entrance.

**Full contents:** See file (~245 lines). Standard pattern: `let sectionRef, headerRef, painPointsRef: HTMLElement[] = []`; `onMount → gsap.registerPlugin(ScrollTrigger) → fromTo()` twice. Styled with `.problem` / `.pain-point` scoped selectors using the theme CSS variables.

**Dependencies:** `gsap`, `gsap/ScrollTrigger`.
**Depended on by:** `src/routes/+page.svelte`.

---

### `src/lib/components/sections/Solution.svelte`

**Purpose:** Three-card "complete trade plans" section, mirrors `Problem.svelte` structure.

**Full contents:** See file (~265 lines). Same GSAP registration pattern. Three hard-coded cards (Entries / Targets / Defined Risk).

---

### `src/lib/components/sections/HowItWorks.svelte`

**Purpose:** Four-step process visualization — numbered circles, connecting line on `lg:`+, back-out `step-number` animation.

**Full contents:** See file (~338 lines). Uses `gsap.fromTo(number, { scale: 0, rotation: -180 }, { …, ease: 'back.out(1.7)' })`.

---

### `src/lib/components/sections/Credentials.svelte`

**Purpose:** "Your Edge" section — Billy Ribeiro headline, McGoldrick quote, bio, 5 track-record cards.

**Full contents:** See file (~405 lines). GSAP fromTo for header/quote/bio + per-card stagger.

---

### `src/lib/components/sections/Features.svelte`

**Purpose:** 4-feature grid (Watchlist / Real-Time Updates / Commentary / Education).

**Full contents:** See file (~287 lines). Inlines the feature list; inline SVG icons switched by `{#if feature.icon === 'chart'}…{:else if feature.icon === 'bell'}…`.

⚠️ Duplicates `src/lib/data/features.ts`; could be `{#each features}` sourced from the data module.

---

### `src/lib/components/sections/Audience.svelte`

**Purpose:** Two persona cards (Busy Professionals / Aspiring Traders), GSAP entrance.

**Full contents:** See file (~318 lines). Familiar pattern: `gsap.registerPlugin(ScrollTrigger)` in `onMount`; card `fromTo` on scroll.

---

### `src/lib/components/sections/Testimonials.svelte`

**Purpose:** Testimonial grid backed by `$lib/data/testimonials`. Each card: stars → quote → avatar + author.

**Full contents:** See file (~292 lines). `{#each testimonials as testimonial, index (testimonial.author)}`; each card gets its own GSAP `fromTo` with `rotateX: 10` entrance.

**Dependencies:** `$lib/data/testimonials`, `gsap`, `gsap/ScrollTrigger`.

---

### `src/lib/components/sections/FAQ.svelte`

**Purpose:** Accordion FAQ — `openIndex = $state<number | null>(null)` drives single-open behavior.

**Full contents:** See file (~288 lines). `{#each faqs as faq, index (faq.question)}` — uses `onclick={() => toggleFaq(index)}` and `aria-expanded`.

**Dependencies:** `$lib/data/faqs`, `gsap`, `gsap/ScrollTrigger`.

---

### `src/lib/components/sections/PricingCTA.svelte`

**Purpose:** "Launch Special" section — giant `$49` price card, 7-day countdown, CTA, trust badges.

**Full contents:** See file (~488 lines). Uses `$lib/utils/countdown::calculateTimeLeft`, `timeLeft = $state<TimeLeft>({…})`, a `setInterval(updateCountdown, 1000)`, and GSAP fromTo entrances per element. Cleanup via `return () => clearInterval(interval);`.

---

### `src/lib/components/sections/Footer.svelte`

**Purpose:** Three-column link grid, social icons, copyright, long risk disclaimer.

**Full contents:** See file (~281 lines). Uses `$app/paths::resolve` for all internal links. GSAP entrance on scroll.

---

### `src/lib/components/traders/index.ts`

**Full contents:**

```ts
export { default as TradersBubble } from './TradersBubble.svelte';
export { default as TradersModal } from './TradersModal.svelte';
export { default as TradersSection } from './TradersSection.svelte';
```

---

### `src/lib/components/traders/TradersBubble.svelte`

**Purpose:** Floating "Meet The Traders" bubble (bottom-left), opens `TradersModal`. Has magnetic-cursor interaction + floating GSAP loop + `svelte:window keydown` Escape handler.

**Full contents:** See file (~336 lines). Notable:
- `isModalOpen = $state(false)`.
- `onMount` runs `entranceTween`, a looping `floatTween` (`yoyo`, `repeat: -1`), and binds `mousemove` with magnetic threshold/strength constants.
- Cleanup kills both tweens + removes the listener + restores `body.style.overflow` if unmounted while open.
- Renders `<TradersModal onClose={closeModal} />` behind `{#if isModalOpen}`.

**Dependencies:** `gsap`, `$lib/data/traders`, `./TradersModal.svelte`.
**Depended on by:** `src/routes/+page.svelte`.

---

### `src/lib/components/traders/TradersModal.svelte`

**Purpose:** Full-screen modal listing traders + particle background + per-card entrance animations.

**Full contents:** See file (~680 lines). Accepts `{ onClose }: Props = $props()`; generates 30 particle positions up-front (not in DOM loop); GSAP timeline on `onMount` with cascading fromTo; `handleClose()` animates out then calls `onClose`; uses `svelte:window onkeydown` for Escape.

---

### `src/lib/components/traders/TradersSection.svelte`

**Purpose:** Alternative inline Version B — trigger card + right-side slide-over panel with trader selector and detail view.

**Full contents:** See file (~855 lines). Key Svelte 5 idioms:
- `panelRef = $state<HTMLElement | undefined>(undefined)` — uses `$state` on the `bind:this` target so that it becomes reactive only after the conditional block mounts.
- `await tick()` inside `openPanel()` before invoking `gsap.fromTo(panelRef, …)`.
- Guards against `null/undefined` refs and `isAnimating` double-click lock.

**Depended on by:** Nothing (commented out in `+page.svelte`).

---

### `src/lib/components/ui/index.ts`

**Full contents:**

```ts
export { default as Ticker } from './Ticker.svelte';
export { default as EmailCapture } from './EmailCapture.svelte';
export { default as SocialProof } from './SocialProof.svelte';
```

---

### `src/lib/components/ui/Ticker.svelte`

**Purpose:** Auto-scrolling CSS-animated ticker of fake alert entries (AAPL, NVDA, etc). Pauses on `hover/focus` via `isPaused = $state(false)`.

**Full contents:** See file (~266 lines). Duplicates the item list for seamless scroll, uses `@keyframes scroll` translating `-50%`.

---

### `src/lib/components/ui/SocialProof.svelte`

**Purpose:** "Works with all major brokers" row — 8 hardcoded broker pills, GSAP stagger on scroll.

**Full contents:** See file (~189 lines). Does **not** use `$lib/data/socialProof.ts`.

---

### `src/lib/components/ui/EmailCapture.svelte`

**Purpose:** Email-subscribe card — validates email contains `@`, fakes 1.5s API, shows success state or shakes input on error.

**Full contents:** See file (~400 lines). Key `$state`: `formRef`, `inputRef`, `email`, `isSubmitting`, `isSuccess`, `errorMessage`.

---

# 7. Routes

### `src/app.html`

**Purpose:** Root HTML shell — Paraglide language attribute, SvelteKit head/body, preload-on-hover.

**Full contents:**

```html
<!doctype html>

<html lang="%paraglide.lang%">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>

	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

---

### `src/app.d.ts`

**Purpose:** App-wide TS ambient declarations (Error/Locals/PageData/PageState/Platform — all left commented).

**Full contents:**

```ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```

---

### `src/routes/+layout.svelte`

**Purpose:** Root layout — initializes theme class on the `<html>` element, imports globals, preloads Google fonts, includes scoped global resets.

**Full contents:** See file (~115 lines). Imports `$lib/stores/theme`, `$lib/styles/themes.css`, `../app.css`. Renders `{@render children()}`. Uses `<svelte:head>` to preconnect Google Fonts and pull Playfair Display + Source Sans 3.

**Dependencies:** `$lib/stores/theme`, `$lib/styles/themes.css`, `src/app.css`.

---

### `src/routes/+page.svelte`

**Purpose:** Landing page — composes every marketing section in order, sets SEO `<svelte:head>`, registers GSAP ScrollTrigger.

**Full contents:** See file (137 lines). Section order: `<Nav /> → <Hero /> → <Ticker /> → <Problem /> → <Solution /> → <HowItWorks /> → <Credentials /> → <Features /> → <Audience /> → <SocialProof /> → <Testimonials /> → <FAQ /> → <EmailCapture /> → <PricingCTA /> → <Footer />`, plus `<TradersBubble />` anchored at the end.

---

### `src/routes/page.svelte.spec.ts`

**Purpose:** Vitest-browser-svelte smoke test — renders the home page and asserts an `<h1>` is present.

**Full contents:**

```ts
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);
		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
```

---

### `src/demo.spec.ts`

**Purpose:** Trivial Vitest spec, proves the runner is wired up.

**Full contents:**

```ts
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => { expect(1 + 2).toBe(3); });
});
```

---

### `src/routes/contact/+page.svelte`, `faq/+page.svelte`, `pricing/+page.svelte`, `privacy/+page.svelte`, `risk-disclosure/+page.svelte`, `terms/+page.svelte`

**Purpose (shared):** Placeholder "full copy goes here" legal/support stubs. Each has `<svelte:head><title>…</title></svelte:head>`, a `<main class="prose">` with a back-to-home link, and the same `.prose { max-width: 720px; padding: 120px 20px 80px; }` scoped style.

**Representative (`src/routes/pricing/+page.svelte`):**

```svelte
<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Pricing | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Pricing</h1>
  <p>Pricing details match the home page section; refine this page when ready.</p>
</main>

<style>
  .prose { max-width: 720px; margin: 0 auto; padding: 120px 20px 80px; }
</style>
```

⚠️ Six near-duplicate files. A shared `<Prose>` snippet component + data-driven titles would dedupe them.

---

### `src/routes/demo/+page.svelte`

**Purpose:** Demo index — link to paraglide demo.

**Full contents:**

```svelte
<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a href={resolve('/demo/paraglide')}>paraglide</a>
```

---

### `src/routes/demo/paraglide/+page.svelte`

**Purpose:** Paraglide message demo — renders `m.hello_world({ name })` and a locale-switch button.

**Full contents:**

```svelte
<script lang="ts">
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => setLocale('en')}>en</button>
</div>
<p>
	If you use VSCode, install the
	<a href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension" target="_blank">
		Sherlock i18n extension
	</a>
	for a better i18n experience.
</p>
```

---

### `src/routes/traders/[slug]/+page.ts`

**Purpose:** Universal load — looks up a trader by `params.slug` in static data, throws `error(404)` if missing.

**Full contents:**

```ts
import { error } from '@sveltejs/kit';
import { traders } from '$lib/data/traders';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const trader = traders.find(t => t.id === params.slug);
  if (!trader) { throw error(404, 'Trader not found'); }
  return { trader };
};
```

**Dependencies:** `$lib/data/traders`, `@sveltejs/kit::error`, generated `./$types::PageLoad`.
**Depended on by:** `src/routes/traders/[slug]/+page.svelte` reads `data.trader`.

---

### `src/routes/traders/[slug]/+page.svelte`

**Purpose:** Individual trader bio page — hero with initials avatar, full bio (`\n\n`-split paragraphs), achievements grid, CTA card. Renders `<Nav />` and `<Footer />` itself (outside `+layout`).

**Full contents:** See file (377 lines). Consumes `data.trader` from the load function.

**Dependencies:** `$app/paths::resolve`, `gsap`, `$lib/components/sections/Nav.svelte`, `…/Footer.svelte`, `./$types::PageData`.

---

# 8. Static assets, E2E, Paraglide, Messages

### `static/robots.txt`

**Full contents:**

```
# allow crawling everything by default
User-agent: *
Disallow:
```

---

### `src/lib/assets/favicon.svg`

**Purpose:** Original Svelte-logo SVG from `sv create`. ~1 KB; renders the default red-and-white Svelte mark. Not imported anywhere (SvelteKit auto-serves `static/favicon.*` instead, which is missing here).

---

### `e2e/demo.test.ts`

**Purpose:** Playwright smoke — home page shows a visible `<h1>`.

**Full contents:**

```ts
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

---

### `messages/en.json`

**Purpose:** Inlang translation source for the `hello_world` bundle.

**Full contents:**

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"hello_world": "Hello, {name} from en!"
}
```

---

### `project.inlang/settings.json`

**Purpose:** Inlang project — messageFormat + m-function-matcher plugins, `en` as base and only locale.

**Full contents:**

```json
{
	"$schema": "https://inlang.com/schema/project-settings",
	"modules": [
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
	],
	"plugin.inlang.messageFormat": {
		"pathPattern": "./messages/{locale}.json"
	},
	"baseLocale": "en",
	"locales": ["en"]
}
```

---

### `project.inlang/README.md`, `project.inlang/.gitignore`, `project.inlang/.meta.json`

**Purpose:** Inlang scaffolding. `README.md` documents inlang; `.gitignore` hides everything except `settings.json` (auto-managed by inlang ≥2.5); `.meta.json` records `{"highestSdkVersion": "2.6.2"}`.

---

### `project.inlang/cache/plugins/2sy648wh9sugi`, `ygx0uiahq6uw`

**Purpose:** Inlang plugin bytecode caches — opaque binary/JSON blobs keyed by plugin hash. Gitignored in normal operation; tracked here accidentally (or via the cache's own presence before `.gitignore` took hold).

---

### `src/lib/paraglide/*` (auto-generated by `paraglide-js compile`)

| File | Purpose |
|---|---|
| `messages.js` | Re-exports every compiled message function as `* as m`. |
| `messages/_index.js` | Per-message aggregation. |
| `messages/hello_world.js` | Compiled `hello_world(params)` function for the one translation key. |
| `registry.js` | Core runtime helpers (encode, fallback). |
| `runtime.js` | Locale detection strategy (cookie → globalVariable → baseLocale), URL patterns, `setLocale`, `getLocale`. |
| `server.js` | SvelteKit hook-style server middleware for locale negotiation (~9.6 KB). |
| `README.md`, `.gitignore`, `.prettierignore` | Inlang-managed guardrails. |

**Dependencies:** Compiled from `project.inlang/settings.json` + `messages/en.json` by the `build` npm script.
**Depended on by:** `src/routes/demo/paraglide/+page.svelte` imports `$lib/paraglide/runtime::setLocale` and `$lib/paraglide/messages::m`.

⚠️ `.gitignore` lists `src/lib/paraglide` as ignored, but the directory is checked into the repo anyway — git is tracking pre-existing paths, so adding the ignore rule after-the-fact had no effect. Either run `git rm -r --cached src/lib/paraglide` or remove the ignore entry.
