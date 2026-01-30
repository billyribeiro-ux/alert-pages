<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let quoteRef: HTMLElement;
  let bioRef: HTMLElement;
  let recordCardsRef: HTMLElement[] = [];
  
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
    
    // Quote animation
    gsap.fromTo(quoteRef,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef,
          start: 'top 85%',
          once: true
        }
      }
    );
    
    // Bio animation
    gsap.fromTo(bioRef,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bioRef,
          start: 'top 85%',
          once: true
        }
      }
    );
    
    // Record cards stagger
    recordCardsRef.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="credentials">
  <div class="glow-left"></div>
  <div class="glow-right"></div>
  
  <div class="container">
    <div class="credentials-content">
      <div class="credentials-text">
        <div bind:this={headerRef} class="text-header">
          <span class="section-eyebrow">Your Edge</span>
          <h2 class="section-title">Billy Ribeiro</h2>
          <p class="founder-title">Founder & Lead Analyst</p>
        </div>
        
        <div bind:this={quoteRef} class="quote-block">
          <blockquote>
            "The market doesn't care about your feelings. It rewards preparation, punishes hesitation, and respects discipline. I teach you all three."
          </blockquote>
          <cite>
            Mark McGoldrick
            <span>Former Partner & Head of Global Securities, Goldman Sachs</span>
          </cite>
        </div>
        
        <div bind:this={bioRef} class="credentials-bio">
          <p>
            Wall Street trained, market battle-tested. Billy spent years learning institutional trading strategies directly from Mark McGoldrick, former Partner and Head of Global Securities at Goldman Sachs.
          </p>
          <p>
            That mentorship shaped a methodology that combines institutional precision with retail accessibility. The same edge Wall Street uses, now available to you.
          </p>
        </div>
      </div>
      
      <div class="track-record">
        <div bind:this={recordCardsRef[0]} class="record-card featured">
          <div class="record-label">Mentorship</div>
          <div class="record-value gold">Mark McGoldrick</div>
          <p class="record-detail">Former Partner & Head of Global Securities at Goldman Sachs. Institutional strategies, retail execution.</p>
        </div>
        
        <div bind:this={recordCardsRef[1]} class="record-card">
          <div class="record-label">Market Calls</div>
          <div class="record-value">COVID Top & Bottom</div>
          <p class="record-detail">Called the 2020 crash and subsequent recovery with precision timing.</p>
        </div>
        
        <div bind:this={recordCardsRef[2]} class="record-card">
          <div class="record-label">Options Trade</div>
          <div class="record-value gold">600% Overnight</div>
          <p class="record-detail">OXY puts captured a massive move. In at close, out at open.</p>
        </div>
        
        <div bind:this={recordCardsRef[3]} class="record-card">
          <div class="record-label">0DTE SPX Trade</div>
          <div class="record-value">$0.23 → $132</div>
          <p class="record-detail">Entry at $0.23 per contract, sold runner for $132. That's 573x on a single position.</p>
        </div>
        
        <div bind:this={recordCardsRef[4]} class="record-card">
          <div class="record-label">Methodology</div>
          <div class="record-value">Wall Street Trained</div>
          <p class="record-detail">Institutional-grade analysis refined over years of real market experience.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .credentials {
    padding: 80px 0;
    background: var(--color-bg-primary);
    position: relative;
    overflow: hidden;
  }
  
  .glow-left {
    position: absolute;
    top: 20%;
    left: -20%;
    width: 50%;
    height: 60%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .glow-right {
    position: absolute;
    bottom: 10%;
    right: -20%;
    width: 50%;
    height: 60%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  .credentials-content {
    display: flex;
    flex-direction: column;
    gap: 56px;
  }
  
  .credentials-text {
    text-align: center;
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
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }
  
  .founder-title {
    font-size: 1.0625rem;
    color: var(--color-accent-gold);
    font-weight: 500;
    margin-bottom: 32px;
  }
  
  .quote-block {
    position: relative;
    padding: 28px;
    background: var(--color-bg-secondary);
    border-left: 3px solid var(--color-accent-gold);
    margin: 0 0 32px 0;
    text-align: left;
    border-radius: 0 12px 12px 0;
  }
  
  .quote-block::before {
    content: '"';
    position: absolute;
    top: 16px;
    left: 20px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 4rem;
    color: var(--color-accent-gold);
    opacity: 0.15;
    line-height: 1;
  }
  
  .quote-block blockquote {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-style: italic;
    color: var(--color-text-primary);
    line-height: 1.6;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }
  
  .quote-block cite {
    display: block;
    font-style: normal;
    font-size: 0.9375rem;
    color: var(--color-accent-gold);
    font-weight: 600;
  }
  
  .quote-block cite span {
    display: block;
    font-weight: 400;
    color: var(--color-text-muted);
    font-size: 0.8125rem;
    margin-top: 4px;
  }
  
  .credentials-bio {
    text-align: left;
  }
  
  .credentials-bio p {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 16px;
  }
  
  .credentials-bio p:last-child {
    margin-bottom: 0;
  }
  
  .track-record {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .record-card {
    padding: 24px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .record-card:hover {
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  .record-card.featured {
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
    border-color: var(--color-accent-gold-dark);
  }
  
  .record-card.featured:hover {
    border-color: var(--color-accent-gold);
    box-shadow: 0 8px 40px rgba(201, 169, 98, 0.2);
  }
  
  .record-label {
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 10px;
  }
  
  .record-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 10px;
  }
  
  .record-value.gold {
    color: var(--color-accent-gold);
  }
  
  .record-detail {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  @media (min-width: 640px) {
    .credentials {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .credentials-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 56px;
      align-items: start;
    }
    
    .credentials-text {
      text-align: left;
    }
    
    .track-record {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .record-card.featured {
      grid-column: span 2;
    }
  }
  
  @media (min-width: 1024px) {
    .credentials {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.75rem;
    }
    
    .credentials-content {
      gap: 80px;
    }
    
    .quote-block {
      padding: 32px;
    }
    
    .quote-block blockquote {
      font-size: 1.375rem;
    }
    
    .record-value {
      font-size: 1.5rem;
    }
  }
</style>
