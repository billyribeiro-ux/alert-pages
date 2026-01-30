<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let cardsRef: HTMLElement[] = [];
  
  const features = [
    {
      icon: 'chart',
      title: 'Weekly Video Watchlist',
      description: '5-7 trades with full chart breakdown and execution guidance every Sunday night.'
    },
    {
      icon: 'bell',
      title: 'Real-Time Position Updates',
      description: 'Adjustments, partial exits, and new developments as market conditions evolve.'
    },
    {
      icon: 'globe',
      title: 'Market Commentary',
      description: 'Weekly macro analysis to understand the broader context of your trades.'
    },
    {
      icon: 'graduation',
      title: 'Education Library',
      description: 'Video lessons on strategy, risk management, and execution fundamentals.'
    }
  ];
  
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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="features">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">Member Dashboard</span>
      <h2 class="section-title">Everything You Need</h2>
    </div>
    
    <div class="features-grid">
      {#each features as feature, index}
        <div bind:this={cardsRef[index]} class="feature-card">
          <div class="feature-icon">
            {#if feature.icon === 'chart'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            {:else if feature.icon === 'bell'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            {:else if feature.icon === 'globe'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            {:else if feature.icon === 'graduation'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            {/if}
          </div>
          <div class="feature-content">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
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
    color: var(--color-text-primary);
  }
  
  .features-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .feature-card {
    display: flex;
    gap: 20px;
    padding: 28px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .feature-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(201, 169, 98, 0.03) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  .feature-card:hover {
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
  
  .feature-card:hover::after {
    opacity: 1;
  }
  
  .feature-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-gold);
    transition: all 0.4s ease;
  }
  
  .feature-card:hover .feature-icon {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: scale(1.05) rotate(-3deg);
    box-shadow: 0 8px 25px rgba(201, 169, 98, 0.35);
  }
  
  .feature-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .feature-content {
    position: relative;
    z-index: 1;
  }
  
  .feature-content h3 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }
  
  .feature-card:hover .feature-content h3 {
    color: var(--color-accent-gold);
  }
  
  .feature-content p {
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.7;
  }
  
  @media (min-width: 640px) {
    .features {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }
  
  @media (min-width: 1024px) {
    .features {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 72px;
    }
    
    .feature-card {
      padding: 32px;
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
    }
    
    .feature-icon svg {
      width: 30px;
      height: 30px;
    }
  }
</style>
