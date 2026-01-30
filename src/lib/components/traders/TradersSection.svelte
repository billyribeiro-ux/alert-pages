<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { traders } from '$lib/data/traders';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let triggerRef: HTMLElement;
  let panelRef: HTMLElement;
  let panelContentRef: HTMLElement;
  let cardsRef: HTMLElement[] = [];
  
  let isPanelOpen = $state(false);
  let activeTrader = $state(0);
  
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Header animation
    gsap.fromTo(headerRef,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef,
          start: 'top 85%',
          once: true
        }
      }
    );
    
    // Trigger card animation
    gsap.fromTo(triggerRef,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerRef,
          start: 'top 85%',
          once: true
        }
      }
    );
  });
  
  function openPanel() {
    isPanelOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Animate panel entrance
    gsap.fromTo(panelRef,
      { x: '100%' },
      { x: '0%', duration: 0.5, ease: 'power3.out' }
    );
    
    gsap.fromTo(panelContentRef,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' }
    );
  }
  
  function closePanel() {
    gsap.to(panelRef, {
      x: '100%',
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        isPanelOpen = false;
        document.body.style.overflow = '';
      }
    });
  }
  
  function selectTrader(index: number) {
    if (activeTrader === index) return;
    
    // Fade out current content
    gsap.to(cardsRef[activeTrader], {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        activeTrader = index;
        
        // Fade in new content
        gsap.fromTo(cardsRef[index],
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
        );
      }
    });
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isPanelOpen) {
      closePanel();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section bind:this={sectionRef} class="traders-section">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">Your Guides</span>
      <h2 class="section-title">Meet The Traders</h2>
      <p class="section-text">The experience and expertise behind every alert.</p>
    </div>
    
    <button bind:this={triggerRef} class="trigger-card" onclick={openPanel}>
      <div class="trigger-glow"></div>
      
      <div class="trigger-avatars">
        {#each traders as trader, index}
          <div class="trigger-avatar" style="z-index: {traders.length - index};">
            <span>{trader.initials}</span>
          </div>
        {/each}
      </div>
      
      <div class="trigger-content">
        <h3>Billy Ribeiro & Freddie Ferber</h3>
        <p>Wall Street trained. Battle tested. Click to learn our story.</p>
      </div>
      
      <div class="trigger-action">
        <span>Meet Us</span>
        <div class="action-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      
      <div class="trigger-decoration">
        <div class="deco-line"></div>
        <div class="deco-dot"></div>
      </div>
    </button>
  </div>
</section>

<!-- Slide Panel -->
{#if isPanelOpen}
  <button type="button" class="panel-overlay" onclick={closePanel} aria-label="Close panel"></button>
  
  <div bind:this={panelRef} class="slide-panel">
    <div bind:this={panelContentRef} class="panel-content">
      <button class="panel-close" onclick={closePanel} aria-label="Close panel">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="panel-header">
        <span class="panel-eyebrow">The Team</span>
        <h2 class="panel-title">Meet The Traders</h2>
      </div>
      
      <!-- Trader Selector -->
      <div class="trader-selector">
        {#each traders as trader, index}
          <button 
            class="selector-btn"
            class:active={activeTrader === index}
            onclick={() => selectTrader(index)}
          >
            <div class="selector-avatar">
              <span>{trader.initials}</span>
            </div>
            <span class="selector-name">{trader.name.split(' ')[0]}</span>
          </button>
        {/each}
      </div>
      
      <!-- Trader Cards -->
      <div class="trader-cards">
        {#each traders as trader, index}
          <div 
            bind:this={cardsRef[index]}
            class="trader-detail"
            class:active={activeTrader === index}
          >
            <div class="detail-avatar">
              <div class="avatar-glow"></div>
              <div class="avatar-inner">
                <span>{trader.initials}</span>
              </div>
            </div>
            
            <div class="detail-info">
              <h3>{trader.name}</h3>
              <p class="detail-title">{trader.title}</p>
            </div>
            
            <div class="detail-bio">
              {#each trader.bio.split('\n\n') as paragraph}
                <p>{paragraph}</p>
              {/each}
            </div>
            
            <div class="detail-achievements">
              <h4>Highlights</h4>
              <div class="achievements-grid">
                {#each trader.achievements as achievement}
                  <div class="achievement-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{achievement}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="panel-footer">
        <a href="#pricing" class="panel-cta" onclick={closePanel}>
          <span>Join Our Team</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .traders-section {
    padding: 80px 0;
    background: var(--color-bg-secondary);
    position: relative;
    overflow: hidden;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .section-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 48px;
  }
  
  .section-eyebrow {
    display: inline-flex;
    color: var(--color-accent-gold);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 16px;
  }
  
  .section-text {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }
  
  /* Trigger Card */
  .trigger-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 32px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  
  .trigger-card:hover {
    border-color: var(--color-accent-gold);
    transform: translateY(-6px);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.2),
      0 0 60px rgba(201, 169, 98, 0.15);
  }
  
  .trigger-glow {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  .trigger-card:hover .trigger-glow {
    opacity: 1;
  }
  
  .trigger-avatars {
    display: flex;
    justify-content: center;
  }
  
  .trigger-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--color-gradient-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--color-bg-primary);
    box-shadow: 0 8px 25px rgba(201, 169, 98, 0.3);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .trigger-avatar:not(:first-child) {
    margin-left: -20px;
  }
  
  .trigger-card:hover .trigger-avatar:first-child {
    transform: translateX(-12px) scale(1.05);
  }
  
  .trigger-card:hover .trigger-avatar:last-child {
    transform: translateX(12px) scale(1.05);
  }
  
  .trigger-avatar span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .trigger-content h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.375rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }
  
  .trigger-card:hover .trigger-content h3 {
    color: var(--color-accent-gold);
  }
  
  .trigger-content p {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  .trigger-action {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .trigger-action span {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .action-icon {
    width: 36px;
    height: 36px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-gold);
    transition: all 0.3s ease;
  }
  
  .trigger-card:hover .action-icon {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: translateX(6px);
  }
  
  .action-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .trigger-decoration {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .deco-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--color-accent-gold), transparent);
    opacity: 0.3;
  }
  
  .deco-dot {
    width: 6px;
    height: 6px;
    background: var(--color-accent-gold);
    border-radius: 50%;
    opacity: 0.5;
  }
  
  /* Panel Overlay */
  .panel-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(4px);
    z-index: 998;
    border: none;
    cursor: pointer;
  }
  
  /* Slide Panel */
  .slide-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 560px;
    background: var(--color-bg-primary);
    border-left: 1px solid var(--color-border);
    z-index: 999;
    overflow-y: auto;
    transform: translateX(100%);
  }
  
  .panel-content {
    padding: 32px 24px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .panel-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
  }
  
  .panel-close:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-accent-gold);
  }
  
  .panel-close svg {
    width: 20px;
    height: 20px;
  }
  
  .panel-header {
    text-align: center;
    margin-bottom: 32px;
    padding-top: 20px;
  }
  
  .panel-eyebrow {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 10px;
  }
  
  .panel-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }
  
  /* Trader Selector */
  .trader-selector {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
  }
  
  .selector-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .selector-btn:hover,
  .selector-btn.active {
    border-color: var(--color-accent-gold);
    background: rgba(201, 169, 98, 0.05);
  }
  
  .selector-btn.active {
    box-shadow: 0 4px 20px rgba(201, 169, 98, 0.2);
  }
  
  .selector-avatar {
    width: 48px;
    height: 48px;
    background: var(--color-gradient-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  
  .selector-btn.active .selector-avatar {
    transform: scale(1.1);
  }
  
  .selector-avatar span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .selector-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-muted);
    transition: color 0.3s ease;
  }
  
  .selector-btn.active .selector-name {
    color: var(--color-accent-gold);
  }
  
  /* Trader Detail */
  .trader-cards {
    flex: 1;
    position: relative;
  }
  
  .trader-detail {
    display: none;
    flex-direction: column;
    align-items: center;
  }
  
  .trader-detail.active {
    display: flex;
  }
  
  .detail-avatar {
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }
  
  .avatar-glow {
    position: absolute;
    inset: -15px;
    background: radial-gradient(circle, rgba(201, 169, 98, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  .detail-avatar .avatar-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--color-gradient-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 40px rgba(201, 169, 98, 0.4);
  }
  
  .detail-avatar .avatar-inner span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .detail-info {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .detail-info h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 6px;
  }
  
  .detail-title {
    font-size: 0.9375rem;
    color: var(--color-accent-gold);
    font-weight: 500;
  }
  
  .detail-bio {
    margin-bottom: 28px;
  }
  
  .detail-bio p {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 16px;
  }
  
  .detail-bio p:last-child {
    margin-bottom: 0;
  }
  
  .detail-achievements {
    width: 100%;
    padding: 24px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 16px;
  }
  
  .detail-achievements h4 {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .achievements-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .achievement-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .achievement-item svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--color-success);
  }
  
  /* Panel Footer */
  .panel-footer {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }
  
  .panel-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    background: var(--color-gradient-gold);
    color: var(--color-bg-primary);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.4s ease;
    box-shadow: 0 6px 25px rgba(201, 169, 98, 0.35);
  }
  
  .panel-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 35px rgba(201, 169, 98, 0.45);
  }
  
  .panel-cta svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
  
  .panel-cta:hover svg {
    transform: translateX(4px);
  }
  
  @media (min-width: 640px) {
    .traders-section {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .trigger-card {
      padding: 48px 40px;
    }
    
    .trigger-avatar {
      width: 80px;
      height: 80px;
    }
    
    .trigger-content h3 {
      font-size: 1.5rem;
    }
    
    .panel-content {
      padding: 40px 32px;
    }
    
    .panel-title {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 1024px) {
    .traders-section {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
  }
</style>
