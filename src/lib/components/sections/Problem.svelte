<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let painPointsRef: HTMLElement[] = [];
  
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
    
    // Pain points stagger animation
    painPointsRef.forEach((point, index) => {
      gsap.fromTo(point,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: point,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="problem">
  <div class="container">
    <div class="problem-grid">
      <div bind:this={headerRef} class="problem-intro">
        <span class="section-eyebrow">The Reality</span>
        <h2 class="section-title">Trading Shouldn't Consume Your Life</h2>
        <p class="section-text">
          You want to grow your wealth through the markets. But you have a career, a family, responsibilities. You can't stare at charts for 8 hours a day. Most alerts come too late or lack the context to execute confidently.
        </p>
      </div>
      
      <div class="pain-points">
        <div bind:this={painPointsRef[0]} class="pain-point">
          <div class="pain-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="pain-content">
            <h4>Time-Starved</h4>
            <p>Your schedule doesn't allow for constant market monitoring. Opportunities pass while you're in meetings.</p>
          </div>
        </div>
        
        <div bind:this={painPointsRef[1]} class="pain-point">
          <div class="pain-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="pain-content">
            <h4>Information Overload</h4>
            <p>Countless "gurus" with conflicting advice. No clear methodology. Analysis paralysis is real.</p>
          </div>
        </div>
        
        <div bind:this={painPointsRef[2]} class="pain-point">
          <div class="pain-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="pain-content">
            <h4>Vague Alerts</h4>
            <p>"Buy XYZ" with no entry, no targets, no stop loss. You're left guessing and often losing.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .problem {
    padding: 80px 0;
    background: var(--color-bg-secondary);
    position: relative;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .problem-grid {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }
  
  .problem-intro {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
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
  
  .pain-points {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
  }
  
  .pain-point {
    display: flex;
    gap: 20px;
    padding: 24px;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .pain-point:hover {
    transform: translateX(8px);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.1);
  }
  
  .pain-icon {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-danger);
    transition: all 0.3s ease;
  }
  
  .pain-point:hover .pain-icon {
    background: rgba(239, 68, 68, 0.15);
    transform: scale(1.05);
  }
  
  .pain-icon svg {
    width: 26px;
    height: 26px;
  }
  
  .pain-content h4 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }
  
  .pain-content p {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    line-height: 1.6;
  }
  
  @media (min-width: 640px) {
    .problem {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .pain-point {
      padding: 28px;
    }
  }
  
  @media (min-width: 1024px) {
    .problem {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .problem-grid {
      gap: 64px;
    }
  }
</style>
