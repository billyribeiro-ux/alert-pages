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
    
    // Cards animation
    cardsRef.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.15,
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

<section bind:this={sectionRef} class="audience">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">Who This Is For</span>
      <h2 class="section-title">Built for Two Types of Traders</h2>
    </div>
    
    <div class="audience-grid">
      <div bind:this={cardsRef[0]} class="persona-card">
        <div class="persona-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3>Busy Professionals</h3>
        <p>You have a career. You want your money working while you work.</p>
        <ul class="persona-list">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Sunday night prep fits any schedule</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Execute Monday morning, live your week</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Institutional analysis without the 60-hour weeks</span>
          </li>
        </ul>
      </div>
      
      <div bind:this={cardsRef[1]} class="persona-card">
        <div class="persona-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <h3>Aspiring Traders</h3>
        <p>You're ready to take trading seriously but drowning in conflicting information.</p>
        <ul class="persona-list">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Learn by doing with real setups</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Develop pattern recognition through practice</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Make money while you learn the craft</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  .audience {
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
    color: var(--color-text-primary);
  }
  
  .audience-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .persona-card {
    padding: 36px 28px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .persona-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-gradient-gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  .persona-card:hover {
    border-color: var(--color-accent-gold);
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(201, 169, 98, 0.15);
  }
  
  .persona-card:hover::before {
    transform: scaleX(1);
  }
  
  .persona-icon {
    width: 64px;
    height: 64px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: var(--color-accent-gold);
    transition: all 0.4s ease;
  }
  
  .persona-card:hover .persona-icon {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: scale(1.08) rotate(-5deg);
    box-shadow: 0 10px 30px rgba(201, 169, 98, 0.4);
  }
  
  .persona-icon svg {
    width: 32px;
    height: 32px;
  }
  
  .persona-card h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }
  
  .persona-card:hover h3 {
    color: var(--color-accent-gold);
  }
  
  .persona-card > p {
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  .persona-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  
  .persona-list li {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
  
  .persona-list svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--color-success);
    margin-top: 2px;
    transition: transform 0.3s ease;
  }
  
  .persona-card:hover .persona-list svg {
    transform: scale(1.15);
  }
  
  @media (min-width: 640px) {
    .audience {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .audience-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
  }
  
  @media (min-width: 1024px) {
    .audience {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 72px;
    }
    
    .persona-card {
      padding: 44px 36px;
    }
    
    .persona-card h3 {
      font-size: 1.625rem;
    }
    
    .audience-grid {
      gap: 32px;
    }
  }
</style>
