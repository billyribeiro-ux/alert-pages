<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let cardsRef: HTMLElement[] = [];
  
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
    
    // Cards stagger animation
    cardsRef.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="solution">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">The Solution</span>
      <h2 class="section-title">Complete Trade Plans, Delivered Weekly</h2>
      <p class="section-text">Every setup comes with everything you need to execute with confidence.</p>
    </div>
    
    <div class="solution-grid">
      <div bind:this={cardsRef[0]} class="solution-card">
        <div class="solution-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <h3>Precise Entry Points</h3>
        <p>No guessing. Know exactly where to enter your position for optimal risk-to-reward. Both equity and options entries provided.</p>
      </div>
      
      <div bind:this={cardsRef[1]} class="solution-card">
        <div class="solution-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
        </div>
        <h3>Multiple Targets + Runners</h3>
        <p>First, second, and third profit targets clearly defined. Let your winners run with trailing positions while locking in gains.</p>
      </div>
      
      <div bind:this={cardsRef[2]} class="solution-card">
        <div class="solution-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h3>Defined Risk</h3>
        <p>Every trade has a clear stop loss. Know your maximum risk before you enter. No surprises, no blown accounts.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .solution {
    padding: 80px 0;
    background: var(--color-bg-primary);
    position: relative;
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
    margin: 0 auto 56px;
  }
  
  .section-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
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
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    color: var(--color-text-primary);
  }
  
  .section-text {
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
    line-height: 1.7;
  }
  
  .solution-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .solution-card {
    padding: 32px 28px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .solution-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-gradient-gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  .solution-card:hover {
    border-color: var(--color-accent-gold);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(201, 169, 98, 0.15);
  }
  
  .solution-card:hover::before {
    transform: scaleX(1);
  }
  
  .solution-icon {
    width: 56px;
    height: 56px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: var(--color-accent-gold);
    transition: all 0.3s ease;
  }
  
  .solution-card:hover .solution-icon {
    background: rgba(201, 169, 98, 0.15);
    transform: scale(1.08);
  }
  
  .solution-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .solution-card h3 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 14px;
    color: var(--color-text-primary);
  }
  
  .solution-card p {
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.7;
  }
  
  @media (min-width: 640px) {
    .solution {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .solution-card:last-child {
      grid-column: span 2;
      max-width: 50%;
      margin: 0 auto;
    }
  }
  
  @media (min-width: 1024px) {
    .solution {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 72px;
    }
    
    .solution-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .solution-card:last-child {
      grid-column: auto;
      max-width: none;
    }
    
    .solution-card {
      padding: 36px 32px;
    }
  }
</style>
