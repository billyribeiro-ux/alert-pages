# Svelte 5 Production Patterns - Apple Principal Engineer ICT 7 Grade

Enterprise-grade patterns for production Svelte 5 applications with TypeScript, focusing on type safety, performance, and maintainability.

## Table of Contents
- [Type Safety First](#type-safety-first)
- [State Management](#state-management)
- [Memory Management](#memory-management)
- [Performance Patterns](#performance-patterns)
- [State Architecture](#state-architecture)
- [Testing Considerations](#testing-considerations)

---

## Type Safety First

### ❌ Avoid - Implicit Any
```typescript
let user = $state({});
```

### ✅ Explicit Typing with Interface
```typescript
interface User {
  id: string;
  name: string;
  role: 'admin' | 'trader' | 'viewer';
  preferences: UserPreferences;
}

let user = $state<User | null>(null);
```

---

## State Management

### Immutability for Critical State

For financial data, audit trails, trade history - use `$state.raw()` to prevent accidental mutations:

```typescript
// Forces explicit updates - easier to trace in production
let tradeHistory = $state.raw<Trade[]>([]);
let priceSnapshots = $state.raw<PricePoint[]>([]);

function recordTrade(trade: Trade) {
  tradeHistory = [...tradeHistory, trade];
}
```

**Benefits:**
- Prevents accidental mutations
- Better debugging
- Predictable behavior
- Easier audit trails

### State Initialization Guards

#### ❌ Dangerous - Hydration Mismatches
```typescript
let timestamp = $state(Date.now());
let windowWidth = $state(window.innerWidth);
```

#### ✅ Safe Initialization with Browser Check
```typescript
import { browser } from '$app/environment';

let timestamp = $state<number>(0);
let windowWidth = $state<number>(0);

$effect(() => {
  if (browser) {
    timestamp = Date.now();
    windowWidth = window.innerWidth;
  }
});
```

### Derived State with Error Boundaries

#### ❌ Will Throw if Empty
```typescript
let topTrader = $derived(traders[0]);
```

#### ✅ Defensive Derived with Fallback
```typescript
let topTrader = $derived(traders[0] ?? null);
```

#### ✅ Complex Derived with Validation
```typescript
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

---

## Memory Management

### Cleanup in $effect

#### ❌ Memory Leak - No Cleanup
```typescript
$effect(() => {
  const ws = new WebSocket('wss://api.trading.com/feed');
  ws.onmessage = (e) => updatePrices(JSON.parse(e.data));
});
```

#### ✅ Proper Cleanup with Return Function
```typescript
$effect(() => {
  const ws = new WebSocket('wss://api.trading.com/feed');
  ws.onmessage = (e) => updatePrices(JSON.parse(e.data));
  
  return () => {
    ws.close();
  };
});
```

### Avoiding Effect Cascades

#### ❌ Infinite Loop
```typescript
let count = $state(0);
$effect(() => {
  count = count + 1; // DON'T DO THIS
});
```

#### ❌ Hidden Cascade
```typescript
$effect(() => { a = b + 1; });
$effect(() => { b = a + 1; });
```

#### ✅ Use $derived for Computed Values
```typescript
let doubled = $derived(count * 2);
```

---

## Performance Patterns

### Granular State for Large Lists

#### ❌ Re-renders Entire List
```typescript
let traders = $state<Trader[]>(data);
```

#### ✅ Use Map for O(1) Updates
```typescript
let tradersMap = $state<Map<string, Trader>>(new Map());

function updateTrader(id: string, updates: Partial<Trader>) {
  const trader = tradersMap.get(id);
  if (trader) {
    tradersMap.set(id, { ...trader, ...updates });
  }
}
```

### Debounced Effects for Expensive Operations

```typescript
import { untrack } from 'svelte';

let searchQuery = $state('');
let debouncedQuery = $state('');

$effect(() => {
  const query = searchQuery; // Track this
  
  const timeout = setTimeout(() => {
    untrack(() => {
      debouncedQuery = query;
    });
  }, 300);
  
  return () => clearTimeout(timeout);
});
```

### $effect.pre for DOM Measurements

```typescript
let container: HTMLDivElement;
let scrollHeight = $state(0);

// Runs BEFORE DOM updates - use for measurements
$effect.pre(() => {
  if (container) {
    scrollHeight = container.scrollHeight;
  }
});
```

---

## State Architecture

### Singleton State Module Pattern

```typescript
// lib/stores/trading.svelte.ts
class TradingState {
  positions = $state<Position[]>([]);
  prices = $state<Map<string, number>>(new Map());
  
  // Computed
  totalValue = $derived.by(() => {
    return this.positions.reduce((sum, pos) => {
      return sum + (pos.quantity * (this.prices.get(pos.symbol) ?? 0));
    }, 0);
  });
  
  // Actions - single source of truth for mutations
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

### Context for Scoped State

Avoid prop drilling in deep component trees:

```typescript
// lib/context/trading.ts
import { getContext, setContext } from 'svelte';

const TRADING_KEY = Symbol('trading');

export function setTradingContext(state: TradingState) {
  setContext(TRADING_KEY, state);
}

export function getTradingContext(): TradingState {
  const ctx = getContext<TradingState>(TRADING_KEY);
  if (!ctx) throw new Error('TradingContext not found');
  return ctx;
}
```

---

## Testing Considerations

State should be testable in isolation:

```typescript
// lib/stores/counter.svelte.ts
export function createCounter(initial = 0) {
  let count = $state(initial);
  
  return {
    get count() { return count; },
    increment: () => count++,
    decrement: () => count--,
    reset: () => count = initial
  };
}
```

```typescript
// counter.test.ts
import { createCounter } from './counter.svelte';

test('increments', () => {
  const counter = createCounter(0);
  counter.increment();
  expect(counter.count).toBe(1);
});
```

---

## Summary Checklist

| Concern | Pattern |
|---------|---------|
| **Type safety** | Explicit generics on `$state<T>()` |
| **Financial/audit data** | `$state.raw()` for immutability |
| **Browser APIs** | Guard with `$app/environment` browser check |
| **WebSocket/timers** | Return cleanup function from `$effect` |
| **Large lists** | Use `Map` for O(1) updates |
| **Expensive ops** | Debounce with `untrack()` |
| **DOM measurements** | `$effect.pre()` |
| **Global state** | Class-based singleton with `$state` fields |
| **Scoped state** | Svelte context API |
| **Testability** | Factory functions returning state objects |

---

## Real-World Example: Trading Dashboard

```typescript
// lib/stores/trading.svelte.ts
import { browser } from '$app/environment';
import type { Position, Trade, PricePoint } from '$lib/types';

class TradingDashboard {
  // Immutable audit trail
  tradeHistory = $state.raw<Trade[]>([]);
  priceSnapshots = $state.raw<PricePoint[]>([]);
  
  // Mutable working state
  positions = $state<Map<string, Position>>(new Map());
  prices = $state<Map<string, number>>(new Map());
  
  // Browser-safe initialization
  lastUpdate = $state<number>(0);
  
  // Derived with error boundaries
  totalValue = $derived.by(() => {
    if (!this.positions.size) return 0;
    
    let total = 0;
    for (const [symbol, position] of this.positions) {
      const price = this.prices.get(symbol);
      if (typeof price === 'number' && !isNaN(price)) {
        total += position.quantity * price;
      }
    }
    return total;
  });
  
  // Actions with validation
  recordTrade(trade: Trade) {
    // Immutable append
    this.tradeHistory = [...this.tradeHistory, trade];
    
    // Update position
    const existing = this.positions.get(trade.symbol);
    if (existing) {
      this.positions.set(trade.symbol, {
        ...existing,
        quantity: existing.quantity + trade.quantity
      });
    } else {
      this.positions.set(trade.symbol, {
        symbol: trade.symbol,
        quantity: trade.quantity
      });
    }
  }
  
  updatePrice(symbol: string, price: number) {
    if (typeof price !== 'number' || isNaN(price)) {
      console.warn(`Invalid price for ${symbol}:`, price);
      return;
    }
    
    this.prices.set(symbol, price);
    
    if (browser) {
      this.lastUpdate = Date.now();
    }
    
    // Immutable snapshot
    this.priceSnapshots = [...this.priceSnapshots, {
      symbol,
      price,
      timestamp: this.lastUpdate
    }];
  }
}

export const tradingDashboard = new TradingDashboard();
```

```svelte
<!-- routes/dashboard/+page.svelte -->
<script lang="ts">
  import { tradingDashboard } from '$lib/stores/trading.svelte';
  import { browser } from '$app/environment';
  
  let ws: WebSocket | null = null;
  
  // WebSocket with cleanup
  $effect(() => {
    if (!browser) return;
    
    ws = new WebSocket('wss://api.trading.com/feed');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      tradingDashboard.updatePrice(data.symbol, data.price);
    };
    
    return () => {
      ws?.close();
    };
  });
</script>

<div class="dashboard">
  <h1>Portfolio Value: ${tradingDashboard.totalValue.toFixed(2)}</h1>
  
  <div class="positions">
    {#each [...tradingDashboard.positions.values()] as position}
      <div class="position">
        <span>{position.symbol}</span>
        <span>{position.quantity} shares</span>
        <span>${(tradingDashboard.prices.get(position.symbol) ?? 0).toFixed(2)}</span>
      </div>
    {/each}
  </div>
</div>
```

---

## Migration from Svelte 4

| Svelte 4 | Svelte 5 |
|----------|----------|
| `let count = 0` | `let count = $state(0)` |
| `$: doubled = count * 2` | `let doubled = $derived(count * 2)` |
| `$: { console.log(count) }` | `$effect(() => { console.log(count) })` |
| `export let prop` | `let { prop } = $props()` |
| `writable(0)` | `$state(0)` in `.svelte.ts` |
| `readable(0)` | `$state.raw(0)` in `.svelte.ts` |

---

## Additional Resources

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/$state)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GSAP 3 Documentation](https://gsap.com/docs/v3/)

---

**Last Updated:** January 31, 2026  
**Author:** Apple Principal Engineer ICT 7 Grade Standards  
**Project:** alert-pages / Revolution Trading Pros
