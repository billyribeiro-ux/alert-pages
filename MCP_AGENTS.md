# MCP Servers - Agent Guide

> **Last Updated:** January 2026  
> **Standards:** Apple Principal Engineer ICT 7 Grade  
> **Stack:** Svelte 5.49.1 | SvelteKit 2.50.1 | GSAP 3.14.2 | Tailwind CSS 4.x | TypeScript Strict

---

## Critical: Version Compatibility

| Package | Version | Breaking Changes from Previous |
|---------|---------|-------------------------------|
| Svelte | 5.49.1 | Runes required (`$state`, `$derived`, `$effect`, `$props`) |
| SvelteKit | 2.50.1 | File-based routing, `+page.svelte` / `+layout.svelte` |
| GSAP | 3.14.2 | 100% FREE including all plugins (Jan 2025 change) |
| Tailwind | 4.x | New CSS-first config format |
| TypeScript | 5.x | Strict mode required |

⚠️ **NEVER USE:**
- Svelte 4 stores (`writable`, `readable`, `derived` from `svelte/store`)
- Svelte 4 reactive statements (`$:`)
- Svelte 4 prop syntax (`export let`)
- Svelte 4 event syntax (`on:click`)
- Svelte 4 slot syntax (`<slot>`)

---

## MCP Server Configuration

### File Locations

| IDE | Config Path |
|-----|-------------|
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| Cursor | `.mcp.json` (project root) |
| VS Code | `.vscode/mcp.json` |

### Configuration

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
      "command": "npx",
      "env": {},
      "args": ["-y", "@modelcontextprotocol/server-tailwindcss"]
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "env": {},
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    }
  }
}
```

---

## Available MCP Servers

### 1. Svelte MCP Server (`@sveltejs/mcp`)

#### Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `list-sections` | Browse Svelte 5/SvelteKit docs | Start of any Svelte task |
| `get-documentation` | Fetch specific doc sections | After identifying relevant sections |
| `svelte-autofixer` | Validate Svelte code | **MUST** use before sending code to user |

#### Workflow

```
1. list-sections → Discover available documentation
2. Analyze use_cases field for each section
3. get-documentation → Fetch ALL relevant sections
4. Write code using Svelte 5 patterns
5. svelte-autofixer → Validate (iterate until clean)
```

### 2. Tailwind CSS MCP Server

Provides Tailwind CSS v4 class documentation, utilities, and JIT optimizations.

### 3. Postgres MCP Server

Provides schema introspection, query optimization, and migration guidance.

---

## Svelte 5 Runes - Complete Reference

### $state - Reactive State

```typescript
// ✅ Primitive with explicit type
let count = $state<number>(0);

// ✅ Object with interface
interface User {
  id: string;
  name: string;
  role: 'admin' | 'trader' | 'viewer';
}
let user = $state<User | null>(null);

// ✅ Array - deep reactivity by default
let items = $state<string[]>([]);
items.push('new'); // This IS reactive in Svelte 5

// ✅ Map for O(1) lookups on large datasets
let tradersMap = $state<Map<string, Trader>>(new Map());
```

### $state.raw - Non-Reactive (Immutable Pattern)

```typescript
// Use for financial data, audit trails, large datasets you won't mutate
let tradeHistory = $state.raw<Trade[]>([]);
let priceSnapshots = $state.raw<PricePoint[]>([]);

// ❌ This won't work
tradeHistory.push(newTrade);

// ✅ Must reassign entire object
tradeHistory = [...tradeHistory, newTrade];
```

### $state.snapshot - Static Copy

```typescript
// Use when passing state to external libraries that don't expect Proxy
let config = $state({ theme: 'dark' });

$effect(() => {
  // External library gets plain object, not Proxy
  localStorage.setItem('config', JSON.stringify($state.snapshot(config)));
});
```

### $derived - Computed Values

```typescript
// ✅ Simple expression
let doubled = $derived(count * 2);

// ✅ With defensive fallback
let topTrader = $derived(traders[0] ?? null);

// ✅ Complex computation with $derived.by
let portfolioValue = $derived.by(() => {
  if (!positions?.length) return 0;
  
  return positions.reduce((sum, pos) => {
    const price = prices.get(pos.symbol);
    if (typeof price !== 'number' || isNaN(price)) {
      console.warn(`Invalid price for ${pos.symbol}`);
      return sum;
    }
    return sum + (pos.quantity * price);
  }, 0);
});
```

### $effect - Side Effects

```typescript
// ✅ Basic effect with cleanup
$effect(() => {
  const ws = new WebSocket('wss://api.trading.com/feed');
  ws.onmessage = (e) => updatePrices(JSON.parse(e.data));
  
  // REQUIRED: Return cleanup function
  return () => {
    ws.close();
  };
});

// ✅ With browser guard
import { browser } from '$app/environment';

$effect(() => {
  if (!browser) return;
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
});
```

### $effect.pre - Before DOM Updates

```typescript
// Runs BEFORE DOM updates - use for measurements
let container: HTMLDivElement;
let scrollHeight = $state(0);

$effect.pre(() => {
  if (container) {
    scrollHeight = container.scrollHeight;
  }
});
```

### $props - Component Props (January 2026 Syntax)

```typescript
// ✅ CORRECT - Type annotation on destructuring
interface Props {
  traders: Trader[];
  onSelect: (trader: Trader) => void;
  initialIndex?: number;
}

let { 
  traders, 
  onSelect, 
  initialIndex = 0 
}: Props = $props();

// ❌ WRONG - Generic syntax is deprecated
let { traders } = $props<Props>(); // Don't use this
```

### $bindable - Two-Way Binding

```typescript
// Parent can bind to this prop
interface Props {
  value: string;
}

let { value = $bindable('') }: Props = $props();
```

### $inspect - Development Debugging

```typescript
// Only runs in development, removed in production
$inspect(count);
$inspect(user).with(console.trace);
```

---

## TypeScript Patterns

### Component Props Interface

```typescript
// lib/types/components.ts
import type { Snippet } from 'svelte';

export interface TraderCardProps {
  trader: Trader;
  variant?: 'compact' | 'expanded';
  onSelect?: (trader: Trader) => void;
  children?: Snippet;
}
```

### Usage in Component

```svelte
<script lang="ts">
  import type { TraderCardProps } from '$lib/types/components';
  
  let { 
    trader, 
    variant = 'compact',
    onSelect,
    children
  }: TraderCardProps = $props();
</script>
```

### State Module Pattern (`.svelte.ts` files)

```typescript
// lib/stores/trading.svelte.ts
// MUST use .svelte.ts extension for runes outside components

interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
}

class TradingState {
  positions = $state<Position[]>([]);
  prices = $state<Map<string, number>>(new Map());
  
  // Computed
  totalValue = $derived.by(() => {
    return this.positions.reduce((sum, pos) => {
      const price = this.prices.get(pos.symbol) ?? 0;
      return sum + (pos.quantity * price);
    }, 0);
  });
  
  // Actions
  updatePrice(symbol: string, price: number) {
    this.prices.set(symbol, price);
  }
  
  addPosition(position: Position) {
    this.positions = [...this.positions, position];
  }
}

// Export singleton
export const tradingState = new TradingState();
```

---

## GSAP 3.14 Integration (January 2026)

### Proper Cleanup with gsap.context()

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  // Register plugins ONCE
  gsap.registerPlugin(ScrollTrigger);
  
  let container: HTMLDivElement;
  
  onMount(() => {
    // ✅ CORRECT: Use gsap.context() for scoped cleanup
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3
      });
      
      ScrollTrigger.create({
        trigger: '.scroll-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => console.log('entered'),
      });
    }, container); // Scope to container
    
    // REQUIRED: Cleanup on unmount
    return () => {
      ctx.revert(); // Kills ALL animations and ScrollTriggers in context
    };
  });
</script>

<div bind:this={container}>
  <h1 class="hero-title">Welcome</h1>
  <p class="hero-subtitle">Subtitle</p>
</div>
```

### ❌ WRONG: Never Use These Patterns

```typescript
// ❌ No cleanup
onMount(() => {
  gsap.to('.box', { x: 100 });
});

// ❌ Incomplete cleanup
onMount(() => {
  gsap.to('.box', { x: 100 });
  return () => {
    gsap.killTweensOf('.box'); // Doesn't clean up ScrollTriggers
  };
});

// ❌ Global scope
gsap.to('.box', { x: 100 }); // Runs during SSR, causes errors
```

### Svelte 5 Attachments (@attach) - New Pattern

```svelte
<script lang="ts">
  import gsap from 'gsap';
  
  // Element-level lifecycle (new in Svelte 5)
  function animateIn(element: HTMLElement) {
    gsap.from(element, { 
      opacity: 0, 
      y: 20, 
      duration: 0.5 
    });
    
    return () => {
      gsap.killTweensOf(element);
    };
  }
</script>

<div {@attach animateIn}>
  Animated content
</div>
```

---

## Event Handlers (Svelte 5 Syntax)

```svelte
<!-- ✅ CORRECT: Svelte 5 -->
<button onclick={() => count++}>Click</button>
<button onclick={handleClick}>Click</button>
<input oninput={(e) => value = e.currentTarget.value} />

<!-- ❌ WRONG: Svelte 4 syntax -->
<button on:click={() => count++}>Click</button>
<button on:click={handleClick}>Click</button>
<input on:input={(e) => value = e.target.value} />
```

### Event Handler Types

```typescript
function handleClick(event: MouseEvent) {
  // ...
}

function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
  const value = event.currentTarget.value;
}

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
}
```

---

## Snippets (Replaces Slots)

```svelte
<!-- ✅ CORRECT: Svelte 5 Snippets -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    header: Snippet;
    children: Snippet;
    footer?: Snippet<[{ year: number }]>;
  }
  
  let { header, children, footer }: Props = $props();
</script>

{@render header()}
<main>
  {@render children()}
</main>
{#if footer}
  {@render footer({ year: 2026 })}
{/if}

<!-- Usage -->
<MyComponent>
  {#snippet header()}
    <h1>Title</h1>
  {/snippet}
  
  <p>Main content (children)</p>
  
  {#snippet footer(props)}
    <footer>© {props.year}</footer>
  {/snippet}
</MyComponent>

<!-- ❌ WRONG: Svelte 4 slots -->
<slot name="header" />
<slot />
<slot name="footer" {year} />
```

---

## File Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI (buttons, inputs, etc.)
│   │   └── features/        # Feature-specific components
│   ├── stores/              # State modules (*.svelte.ts)
│   ├── types/               # TypeScript interfaces
│   │   ├── index.ts         # Re-exports
│   │   ├── api.ts           # API response types
│   │   └── components.ts    # Component prop types
│   ├── utils/               # Pure utility functions
│   │   ├── cn.ts            # Tailwind class merger
│   │   └── format.ts        # Formatters
│   └── server/              # Server-only code
├── routes/
│   ├── (auth)/              # Auth-required routes (group)
│   ├── (public)/            # Public routes (group)
│   ├── api/                 # API endpoints (+server.ts)
│   └── +layout.svelte       # Root layout
└── app.css                  # Global styles
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `trader-card.svelte` |
| State modules | kebab-case + `.svelte.ts` | `trading-state.svelte.ts` |
| Types | kebab-case | `api-types.ts` |
| Utils | kebab-case | `format-currency.ts` |

---

## Code Quality Checklist

| Concern | Required Pattern |
|---------|------------------|
| State typing | `$state<Type>(initial)` - explicit generics |
| Null safety | `$derived(value ?? fallback)` |
| Effect cleanup | Return cleanup function from `$effect` |
| Browser APIs | Guard with `import { browser } from '$app/environment'` |
| Financial data | Use `$state.raw()` for immutable audit trails |
| Large datasets | Use `Map` for O(1) lookups |
| GSAP cleanup | Use `gsap.context()` with `ctx.revert()` |
| Props typing | Interface on destructuring: `}: Props = $props()` |
| Event handlers | Use `onclick`, not `on:click` |
| Children | Use Snippets, not slots |

---

## Error Recovery - MCP Troubleshooting

### If MCP Server Fails

```bash
# Clear npx cache and retry
npx clear-npx-cache
npx -y @sveltejs/mcp list-sections

# Verify Node version (requires 18+)
node --version

# Restart IDE completely (Cmd+Q on macOS)
```

### Fallback Resources

If MCP unavailable, reference directly:
- Svelte 5: https://svelte.dev/docs/svelte
- SvelteKit: https://svelte.dev/docs/kit
- GSAP: https://gsap.com/docs/v3/

---

## Testing Commands

```bash
npm run check      # TypeScript type checking
npm run build      # Production build
npm run dev        # Development server (port 5173)
npm run preview    # Preview production build
npm run lint       # ESLint + Prettier
npm run test       # Vitest unit tests
npm run test:e2e   # Playwright E2E tests
```

---

## Common Mistakes to Avoid

### 1. Hydration Mismatches

```typescript
// ❌ WRONG: Different values server vs client
let timestamp = $state(Date.now());

// ✅ CORRECT: Initialize safely
import { browser } from '$app/environment';
let timestamp = $state<number>(0);

$effect(() => {
  if (browser) {
    timestamp = Date.now();
  }
});
```

### 2. Effect Infinite Loops

```typescript
// ❌ WRONG: Effect writes to its own dependency
let count = $state(0);
$effect(() => {
  count = count + 1; // Infinite loop!
});

// ✅ CORRECT: Use $derived for computed values
let doubled = $derived(count * 2);
```

### 3. Destructuring Breaks Reactivity

```typescript
// ❌ WRONG: Loses reactivity
let todos = $state([{ done: false, text: 'test' }]);
let { done, text } = todos[0];
todos[0].done = true; // `done` variable won't update

// ✅ CORRECT: Access directly
let todos = $state([{ done: false, text: 'test' }]);
// Use todos[0].done directly in template
```

### 4. Missing Cleanup

```typescript
// ❌ WRONG: Memory leak
$effect(() => {
  const interval = setInterval(() => tick++, 1000);
});

// ✅ CORRECT: Return cleanup
$effect(() => {
  const interval = setInterval(() => tick++, 1000);
  return () => clearInterval(interval);
});
```

---

## Performance Patterns

### Debounced Effects

```typescript
import { untrack } from 'svelte';

let searchQuery = $state('');
let debouncedQuery = $state('');

$effect(() => {
  const query = searchQuery; // Track this
  
  const timeout = setTimeout(() => {
    untrack(() => {
      debouncedQuery = query; // Don't track this write
    });
  }, 300);
  
  return () => clearTimeout(timeout);
});
```

### Granular Updates for Large Lists

```typescript
// ❌ Inefficient: Re-renders entire list
let traders = $state<Trader[]>(data);

// ✅ Efficient: O(1) updates
let tradersMap = $state<Map<string, Trader>>(new Map(
  data.map(t => [t.id, t])
));

function updateTrader(id: string, updates: Partial<Trader>) {
  const trader = tradersMap.get(id);
  if (trader) {
    tradersMap.set(id, { ...trader, ...updates });
  }
}
```

---

## Context API for Scoped State

```typescript
// lib/context/trading.ts
import { getContext, setContext } from 'svelte';
import type { TradingState } from '$lib/stores/trading.svelte';

const TRADING_KEY = Symbol('trading');

export function setTradingContext(state: TradingState) {
  setContext(TRADING_KEY, state);
}

export function getTradingContext(): TradingState {
  const ctx = getContext<TradingState>(TRADING_KEY);
  if (!ctx) {
    throw new Error('TradingContext not found. Did you forget to call setTradingContext in a parent component?');
  }
  return ctx;
}
```

---

## Summary: Agent Workflow

1. **Read MCP docs first** - Always `list-sections` then `get-documentation`
2. **Use correct syntax** - Svelte 5 runes, not Svelte 4
3. **Type everything** - Explicit generics on `$state`, interfaces on `$props`
4. **Clean up effects** - Return cleanup functions
5. **Guard browser APIs** - Check `browser` before DOM/window access
6. **Scope GSAP** - Use `gsap.context()` with `ctx.revert()`
7. **Validate with autofixer** - Run until zero issues
8. **Test before shipping** - `npm run check && npm run build`

---

*This guide reflects January 2026 best practices. When in doubt, query the Svelte MCP server for authoritative documentation.*