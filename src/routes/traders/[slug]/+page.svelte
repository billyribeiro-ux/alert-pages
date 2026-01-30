<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import Nav from '$lib/components/sections/Nav.svelte';
  import Footer from '$lib/components/sections/Footer.svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  
  let headerRef: HTMLElement;
  let avatarRef: HTMLElement;
  let bioRef: HTMLElement;
  let achievementsRef: HTMLElement;
  
  onMount(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(avatarRef,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(headerRef,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(bioRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(achievementsRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
  });
</script>

<svelte:head>
  <title>{data.trader.name} - Explosive Swings</title>
  <meta name="description" content={data.trader.shortBio} />
</svelte:head>

<Nav />

<div class="trader-page">
  <div class="container">
    
    <div class="trader-hero">
      <div bind:this={avatarRef} class="hero-avatar">
        <div class="avatar-glow"></div>
        <div class="avatar-inner">
          <span>{data.trader.initials}</span>
        </div>
      </div>
      
      <div bind:this={headerRef} class="hero-header">
        <h1>{data.trader.name}</h1>
        <p class="hero-title">{data.trader.title}</p>
        <p class="hero-short-bio">{data.trader.shortBio}</p>
      </div>
    </div>
    
    <div bind:this={bioRef} class="bio-section">
      <h2>Full Biography</h2>
      <div class="bio-content">
        {#each data.trader.bio.split('\n\n') as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </div>
    
    <div bind:this={achievementsRef} class="achievements-section">
      <h2>Key Achievements</h2>
      <div class="achievements-grid">
        {#each data.trader.achievements as achievement}
          <div class="achievement-card">
            <div class="achievement-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{achievement}</span>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="cta-section">
      <div class="cta-card">
        <h3>Ready to Follow {data.trader.name.split(' ')[0]}'s Alerts?</h3>
        <p>Join Explosive Swings and get access to real-time trade alerts from our expert team.</p>
        <a href="/#pricing" class="cta-btn">
          <span>View Pricing</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

<Footer />

<style>
  .trader-page {
    min-height: 100vh;
    background: var(--color-bg-primary);
    padding: 120px 0 0;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .trader-hero {
    text-align: center;
    margin-bottom: 80px;
    padding: 0 0 80px;
  }
  
  .hero-avatar {
    width: 160px;
    height: 160px;
    margin: 0 auto 32px;
    position: relative;
  }
  
  .avatar-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(201, 169, 98, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  .avatar-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--color-gradient-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid var(--color-bg-primary);
    box-shadow: 0 20px 60px rgba(201, 169, 98, 0.4);
    position: relative;
    z-index: 1;
  }
  
  .avatar-inner span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 3.5rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .hero-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 12px;
  }
  
  .hero-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    margin-bottom: 20px;
    letter-spacing: 0.05em;
  }
  
  .hero-short-bio {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .bio-section {
    padding: 80px 0;
    background: var(--color-bg-secondary);
    margin: 0 -20px;
  }
  
  .bio-section h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 48px;
    text-align: center;
  }
  
  .bio-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .bio-content p {
    font-size: 1.0625rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: 28px;
  }
  
  .bio-content p:last-child {
    margin-bottom: 0;
  }
  
  .achievements-section {
    padding: 80px 0;
    background: var(--color-bg-primary);
  }
  
  .achievements-section h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 48px;
    text-align: center;
  }
  
  .achievements-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .achievement-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .achievement-card:hover {
    border-color: var(--color-accent-gold);
    transform: translateX(4px);
  }
  
  .achievement-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    color: var(--color-accent-gold);
  }
  
  .achievement-icon svg {
    width: 100%;
    height: 100%;
  }
  
  .achievement-card span {
    font-size: 1rem;
    color: var(--color-text-primary);
    font-weight: 500;
  }
  
  .cta-section {
    padding: 80px 0;
    background: var(--color-bg-secondary);
    margin: 0 -20px;
  }
  
  .cta-card {
    max-width: 800px;
    margin: 0 auto;
    padding: 56px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .cta-card h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 20px;
  }
  
  .cta-card p {
    font-size: 1.0625rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    margin-bottom: 36px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    background: var(--color-gradient-gold);
    color: var(--color-bg-primary);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
  }
  
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(201, 169, 98, 0.4);
  }
  
  .cta-btn svg {
    width: 20px;
    height: 20px;
  }
  
  @media (min-width: 640px) {
    .trader-page {
      padding: 140px 0 0;
    }
    
    .hero-header h1 {
      font-size: 3rem;
    }
    
    .bio-section {
      margin: 0 -40px;
    }
    
    .cta-section {
      margin: 0 -40px;
    }
    
    .achievements-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }
  
  @media (min-width: 1024px) {
    .hero-avatar {
      width: 200px;
      height: 200px;
    }
    
    .avatar-inner span {
      font-size: 4.5rem;
    }
    
    .hero-header h1 {
      font-size: 3.5rem;
    }
  }
</style>
