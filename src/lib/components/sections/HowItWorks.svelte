<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let stepsRef: HTMLElement[] = [];
  let lineRef: HTMLElement;
  
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
    
    // Connecting line animation
    if (lineRef) {
      gsap.fromTo(lineRef,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: lineRef,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
    
    // Steps stagger animation
    stepsRef.forEach((step, index) => {
      gsap.fromTo(step,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            once: true
          }
        }
      );
      
      // Number pulse animation
      const number = step.querySelector('.step-number');
      if (number) {
        gsap.fromTo(number,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.2 + 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });
  });
</script>

<section bind:this={sectionRef} class="how-it-works">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">The Process</span>
      <h2 class="section-title">How It Works</h2>
      <p class="section-text">Four simple steps to transform your trading week.</p>
    </div>
    
    <div class="steps-wrapper">
      <div bind:this={lineRef} class="connecting-line"></div>
      
      <div class="steps">
        <div bind:this={stepsRef[0]} class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Receive Watchlist</h3>
            <p>Sunday night, your weekly video watchlist drops with 5-7 hand-picked setups ready for Monday's open.</p>
          </div>
        </div>
        
        <div bind:this={stepsRef[1]} class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Review & Prepare</h3>
            <p>Watch the video breakdowns. Understand the thesis. Set your alerts and orders before bed.</p>
          </div>
        </div>
        
        <div bind:this={stepsRef[2]} class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Execute at Open</h3>
            <p>9:30 AM Monday, your orders are ready. Execute the plan with precision and confidence.</p>
          </div>
        </div>
        
        <div bind:this={stepsRef[3]} class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>Manage & Profit</h3>
            <p>Follow position updates throughout the week. Take profits at targets. Let runners ride.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .how-it-works {
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
  
  .steps-wrapper {
    position: relative;
  }
  
  .connecting-line {
    display: none;
  }
  
  .steps {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .step {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
  
  .step-number {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: var(--color-bg-primary);
    border: 2px solid var(--color-accent-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    position: relative;
    transition: all 0.4s ease;
  }
  
  .step-number::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px solid rgba(201, 169, 98, 0.2);
    opacity: 0;
    transition: all 0.4s ease;
  }
  
  .step:hover .step-number {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(201, 169, 98, 0.4);
  }
  
  .step:hover .step-number::after {
    opacity: 1;
    inset: -10px;
  }
  
  .step-content h3 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }
  
  .step:hover .step-content h3 {
    color: var(--color-accent-gold);
  }
  
  .step-content p {
    color: var(--color-text-muted);
    font-size: 0.9375rem;
    line-height: 1.7;
  }
  
  @media (min-width: 640px) {
    .how-it-works {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .steps {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
  }
  
  @media (min-width: 1024px) {
    .how-it-works {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 80px;
    }
    
    .steps-wrapper {
      position: relative;
      padding-top: 40px;
    }
    
    .connecting-line {
      display: block;
      position: absolute;
      top: 68px;
      left: 10%;
      right: 10%;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        var(--color-accent-gold) 10%, 
        var(--color-accent-gold) 90%, 
        transparent 100%
      );
      transform-origin: left center;
      opacity: 0.3;
    }
    
    .steps {
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
    }
    
    .step {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
    
    .step-number {
      margin-bottom: 24px;
      width: 64px;
      height: 64px;
      font-size: 1.5rem;
    }
    
    .step-content h3 {
      font-size: 1.1875rem;
      margin-bottom: 12px;
    }
  }
</style>
