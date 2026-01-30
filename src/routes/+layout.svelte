<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';
  import '$lib/styles/themes.css';
  import '../app.css';
  
  let { children } = $props();
  
  onMount(() => {
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark
    
    theme.set(initialTheme);
    document.documentElement.classList.add(initialTheme);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

{@render children()}

<style>
  :global(*),
  :global(*::before),
  :global(*::after) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.4s ease, color 0.4s ease;
  }
  
  :global(h1),
  :global(h2),
  :global(h3),
  :global(h4),
  :global(h5),
  :global(h6) {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  
  :global(a) {
    color: inherit;
    text-decoration: none;
  }
  
  :global(button) {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }
  
  :global(img) {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  :global(ul),
  :global(ol) {
    list-style: none;
  }
  
  :global(::selection) {
    background: rgba(201, 169, 98, 0.3);
    color: var(--color-text-primary);
  }
  
  :global(::-webkit-scrollbar) {
    width: 10px;
  }
  
  :global(::-webkit-scrollbar-track) {
    background: var(--color-bg-secondary);
  }
  
  :global(::-webkit-scrollbar-thumb) {
    background: var(--color-accent-gold-dark);
    border-radius: 5px;
  }
  
  :global(::-webkit-scrollbar-thumb:hover) {
    background: var(--color-accent-gold);
  }
</style>
