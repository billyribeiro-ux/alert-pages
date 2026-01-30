<script lang="ts">
  import { onMount } from 'svelte';
  
  interface TickerItem {
    symbol: string;
    action: 'BUY' | 'SELL' | 'TARGET HIT' | 'STOPPED';
    price: string;
    change?: string;
    isPositive?: boolean;
  }
  
  const tickerItems: TickerItem[] = [
    { symbol: 'AAPL', action: 'TARGET HIT', price: '$187.50', change: '+12.4%', isPositive: true },
    { symbol: 'NVDA', action: 'BUY', price: '$485.00', change: 'Entry', isPositive: true },
    { symbol: 'SPY', action: 'TARGET HIT', price: '$478.25', change: '+8.7%', isPositive: true },
    { symbol: 'TSLA', action: 'STOPPED', price: '$242.00', change: '-3.2%', isPositive: false },
    { symbol: 'META', action: 'TARGET HIT', price: '$512.80', change: '+15.2%', isPositive: true },
    { symbol: 'AMD', action: 'BUY', price: '$178.50', change: 'Entry', isPositive: true },
    { symbol: 'MSFT', action: 'TARGET HIT', price: '$425.00', change: '+9.8%', isPositive: true },
    { symbol: 'AMZN', action: 'TARGET HIT', price: '$186.40', change: '+11.3%', isPositive: true },
    { symbol: 'GOOGL', action: 'BUY', price: '$142.20', change: 'Entry', isPositive: true },
    { symbol: 'QQQ', action: 'TARGET HIT', price: '$418.75', change: '+7.6%', isPositive: true },
  ];
  
  // Duplicate for seamless loop
  const allItems = [...tickerItems, ...tickerItems];
  
  let tickerRef: HTMLElement;
  let isPaused = $state(false);
</script>

<div 
  class="ticker-wrapper"
  role="marquee"
  aria-label="Recent trade alerts"
>
  <div class="ticker-label">
    <span class="live-dot"></span>
    <span>RECENT ALERTS</span>
  </div>
  
  <div class="ticker-container">
    <div 
      bind:this={tickerRef} 
      class="ticker-track"
      class:paused={isPaused}
    >
      {#each allItems as item}
        <button 
          class="ticker-item"
          type="button"
          onfocus={() => isPaused = true}
          onblur={() => isPaused = false}
          onmouseenter={() => isPaused = true}
          onmouseleave={() => isPaused = false}
        >
          <span class="ticker-symbol">{item.symbol}</span>
          <span 
            class="ticker-action"
            class:buy={item.action === 'BUY'}
            class:sell={item.action === 'SELL'}
            class:target={item.action === 'TARGET HIT'}
            class:stopped={item.action === 'STOPPED'}
          >
            {item.action}
          </span>
          <span class="ticker-price">{item.price}</span>
          {#if item.change}
            <span 
              class="ticker-change"
              class:positive={item.isPositive}
              class:negative={!item.isPositive}
            >
              {item.change}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .ticker-wrapper {
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  
  .ticker-label {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 12px;
    background: var(--color-bg-tertiary);
    border-right: 1px solid var(--color-border);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    text-transform: uppercase;
    z-index: 2;
  }
  
  .ticker-label span:last-child {
    display: none;
  }
  
  .live-dot {
    width: 8px;
    height: 8px;
    background: var(--color-success);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
  
  .ticker-container {
    flex: 1;
    overflow: hidden;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
  }
  
  .ticker-track {
    display: flex;
    gap: 0;
    animation: scroll 40s linear infinite;
    width: fit-content;
  }
  
  .ticker-track.paused {
    animation-play-state: paused;
  }
  
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    border: none;
    border-right: 1px solid var(--color-border);
    background: transparent;
    white-space: nowrap;
    transition: background 0.3s ease;
    cursor: default;
    font-family: inherit;
  }
  
  .ticker-item:hover,
  .ticker-item:focus {
    background: rgba(201, 169, 98, 0.05);
    outline: none;
  }
  
  .ticker-symbol {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }
  
  .ticker-action {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .ticker-action.buy {
    background: rgba(52, 211, 153, 0.15);
    color: var(--color-success);
  }
  
  .ticker-action.sell {
    background: rgba(239, 68, 68, 0.15);
    color: var(--color-danger);
  }
  
  .ticker-action.target {
    background: rgba(201, 169, 98, 0.15);
    color: var(--color-accent-gold);
  }
  
  .ticker-action.stopped {
    background: rgba(239, 68, 68, 0.15);
    color: var(--color-danger);
  }
  
  .ticker-price {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }
  
  .ticker-change {
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .ticker-change.positive {
    color: var(--color-success);
  }
  
  .ticker-change.negative {
    color: var(--color-danger);
  }
  
  @media (min-width: 640px) {
    .ticker-label span:last-child {
      display: inline;
    }
    
    .ticker-label {
      padding: 14px 20px;
    }
    
    .ticker-item {
      padding: 14px 28px;
      gap: 10px;
    }
    
    .ticker-symbol {
      font-size: 0.875rem;
    }
  }
</style>
