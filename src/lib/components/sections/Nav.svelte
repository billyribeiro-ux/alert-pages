<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
  
  let navRef: HTMLElement;
  let scrolled = $state(false);
  
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial animation
    gsap.fromTo(
      navRef,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<nav bind:this={navRef} class="nav" class:scrolled>
  <div class="container nav-inner">
    <a href="/" class="logo">
      <div class="logo-icon">⚡</div>
      <span class="logo-text">Explosive Swings</span>
    </a>
    
    <div class="nav-right">
      <ThemeToggle />
      <a href="#pricing" class="nav-cta">
        <span>Get Started</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 20px 0;
    background: transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .nav.scrolled {
    padding: 12px 0;
    background: var(--nav-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: transform 0.3s ease;
  }
  
  .logo:hover {
    transform: scale(1.02);
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: var(--color-gradient-gold);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: 0 4px 15px rgba(201, 169, 98, 0.3);
    transition: all 0.3s ease;
  }
  
  .logo:hover .logo-icon {
    box-shadow: 0 6px 25px rgba(201, 169, 98, 0.5);
    transform: translateY(-2px);
  }
  
  .logo-text {
    background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid var(--color-accent-gold);
    color: var(--color-accent-gold);
    padding: 10px 20px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
  }
  
  .nav-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-gradient-gold);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .nav-cta:hover {
    color: var(--color-bg-primary);
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(201, 169, 98, 0.4);
  }
  
  .nav-cta:hover::before {
    opacity: 1;
  }
  
  .nav-cta svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }
  
  .nav-cta:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: 640px) {
    .logo-text {
      display: none;
    }
    
    .nav-cta span {
      display: none;
    }
    
    .nav-cta {
      padding: 10px;
      border-radius: 50%;
    }
    
    .nav-cta svg {
      width: 20px;
      height: 20px;
    }
  }
  
  @media (min-width: 1024px) {
    .logo {
      font-size: 1.5rem;
    }
    
    .logo-icon {
      width: 44px;
      height: 44px;
      font-size: 1.375rem;
    }
    
    .nav-cta {
      padding: 12px 24px;
      font-size: 0.8125rem;
    }
  }
</style>
