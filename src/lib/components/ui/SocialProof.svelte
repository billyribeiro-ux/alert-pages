<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let sectionRef: HTMLElement;
  let logosRef: HTMLElement;
  
  const brokers = [
    { name: 'TD Ameritrade', abbr: 'TDA' },
    { name: 'Interactive Brokers', abbr: 'IBKR' },
    { name: 'E*TRADE', abbr: 'E*T' },
    { name: 'Charles Schwab', abbr: 'SCHW' },
    { name: 'Webull', abbr: 'WB' },
    { name: 'Tastytrade', abbr: 'TT' },
    { name: 'Fidelity', abbr: 'FID' },
    { name: 'Robinhood', abbr: 'RH' },
  ];
  
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(sectionRef,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top 90%',
          once: true
        }
      }
    );
    
    // Stagger logos
    const logos = logosRef.querySelectorAll('.broker-logo');
    gsap.fromTo(logos,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: logosRef,
          start: 'top 90%',
          once: true
        }
      }
    );
  });
</script>

<section bind:this={sectionRef} class="social-proof">
  <div class="container">
    <p class="proof-label">Works with all major brokers</p>
    
    <div bind:this={logosRef} class="logos-grid">
      {#each brokers as broker}
        <div class="broker-logo">
          <span class="broker-abbr">{broker.abbr}</span>
          <span class="broker-name">{broker.name}</span>
        </div>
      {/each}
    </div>
    
    <p class="proof-note">Execute alerts on your preferred platform</p>
  </div>
</section>

<style>
  .social-proof {
    padding: 48px 20px;
    background: var(--color-bg-primary);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  .proof-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 32px;
  }
  
  .logos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 900px;
    margin: 0 auto 24px;
  }
  
  .broker-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 10px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: default;
  }
  
  .broker-logo:hover {
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .broker-abbr {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }
  
  .broker-logo:hover .broker-abbr {
    color: var(--color-accent-gold);
  }
  
  .broker-name {
    font-size: 0.625rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .proof-note {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  @media (min-width: 640px) {
    .social-proof {
      padding: 56px 32px;
    }
    
    .logos-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    
    .broker-logo {
      padding: 24px 16px;
    }
    
    .broker-abbr {
      font-size: 1.375rem;
    }
  }
  
  @media (min-width: 1024px) {
    .logos-grid {
      grid-template-columns: repeat(8, 1fr);
    }
    
    .broker-logo {
      padding: 20px 8px;
    }
    
    .broker-abbr {
      font-size: 1.125rem;
    }
  }
</style>
