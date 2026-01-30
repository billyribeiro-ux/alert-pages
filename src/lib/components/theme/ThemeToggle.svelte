<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  let toggleRef: HTMLButtonElement;
  let sunRef: SVGElement;
  let moonRef: SVGElement;
  let currentTheme: 'dark' | 'light' = $state('dark');
  
  // Subscribe to theme store and update state
  theme.subscribe(value => {
    currentTheme = value;
  });
  
  onMount(() => {
    if (sunRef && moonRef) {
      gsap.set(currentTheme === 'dark' ? sunRef : moonRef, { scale: 0, opacity: 0 });
    }
  });
  
  function handleToggle() {
    const tl = gsap.timeline();
    
    if (currentTheme === 'dark') {
      tl.to(moonRef, { scale: 0, opacity: 0, rotate: -90, duration: 0.3, ease: 'back.in' })
        .to(sunRef, { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out' }, '-=0.1');
    } else {
      tl.to(sunRef, { scale: 0, opacity: 0, rotate: 90, duration: 0.3, ease: 'back.in' })
        .to(moonRef, { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out' }, '-=0.1');
    }
    
    theme.toggle();
  }
</script>

<button
  bind:this={toggleRef}
  onclick={handleToggle}
  class="theme-toggle"
  aria-label="Toggle theme"
>
  <div class="toggle-track">
    <div class="toggle-thumb" class:dark={currentTheme === 'dark'}>
      <svg
        bind:this={sunRef}
        class="icon sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        bind:this={moonRef}
        class="icon moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>
    <div class="toggle-glow"></div>
  </div>
</button>

<style>
  .theme-toggle {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 9999px;
    transition: transform 0.2s ease;
  }
  
  .theme-toggle:hover {
    transform: scale(1.05);
  }
  
  .theme-toggle:active {
    transform: scale(0.95);
  }
  
  .toggle-track {
    position: relative;
    width: 56px;
    height: 28px;
    border-radius: 9999px;
    background: linear-gradient(135deg, 
      var(--color-bg-tertiary) 0%, 
      var(--color-bg-secondary) 100%
    );
    border: 1px solid var(--color-border);
    overflow: hidden;
  }
  
  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-gradient-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 2px 8px rgba(201, 169, 98, 0.4);
  }
  
  .toggle-thumb.dark {
    transform: translateX(28px);
  }
  
  .icon {
    position: absolute;
    width: 14px;
    height: 14px;
    color: var(--color-bg-primary);
  }
  
  .toggle-glow {
    position: absolute;
    inset: -2px;
    border-radius: 9999px;
    background: radial-gradient(circle at 50% 50%, rgba(201, 169, 98, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  .theme-toggle:hover .toggle-glow {
    opacity: 1;
  }
</style>
