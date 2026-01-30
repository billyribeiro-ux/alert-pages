<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { testimonials } from '$lib/data/testimonials';
  
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
        { opacity: 0, y: 50, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          delay: index * 0.12,
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

<section bind:this={sectionRef} class="testimonials">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">Results</span>
      <h2 class="section-title">Traders Who Execute the Plan</h2>
    </div>
    
    <div class="testimonial-grid">
      {#each testimonials as testimonial, index}
        <div bind:this={cardsRef[index]} class="testimonial-card">
          <div class="testimonial-stars">
            {#each Array(testimonial.rating) as _}
              <svg viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            {/each}
          </div>
          <p class="testimonial-text">"{testimonial.text}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">{testimonial.initials}</div>
            <div class="author-info">
              <h4>{testimonial.author}</h4>
              <p>{testimonial.title}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .testimonials {
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
  
  .testimonial-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .testimonial-card {
    padding: 32px 28px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    perspective: 1000px;
  }
  
  .testimonial-card::before {
    content: '"';
    position: absolute;
    top: 20px;
    right: 28px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 5rem;
    color: var(--color-accent-gold);
    opacity: 0.08;
    line-height: 1;
    pointer-events: none;
  }
  
  .testimonial-card:hover {
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  }
  
  .testimonial-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
  }
  
  .testimonial-stars svg {
    width: 18px;
    height: 18px;
    fill: var(--color-accent-gold);
    transition: transform 0.3s ease;
  }
  
  .testimonial-card:hover .testimonial-stars svg {
    animation: starPulse 0.5s ease forwards;
  }
  
  .testimonial-card:hover .testimonial-stars svg:nth-child(1) { animation-delay: 0s; }
  .testimonial-card:hover .testimonial-stars svg:nth-child(2) { animation-delay: 0.05s; }
  .testimonial-card:hover .testimonial-stars svg:nth-child(3) { animation-delay: 0.1s; }
  .testimonial-card:hover .testimonial-stars svg:nth-child(4) { animation-delay: 0.15s; }
  .testimonial-card:hover .testimonial-stars svg:nth-child(5) { animation-delay: 0.2s; }
  
  @keyframes starPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .testimonial-text {
    font-size: 1rem;
    color: var(--color-text-secondary);
    font-style: italic;
    margin-bottom: 24px;
    line-height: 1.8;
    position: relative;
    z-index: 1;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  
  .author-avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%);
    border: 2px solid var(--color-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    transition: all 0.3s ease;
  }
  
  .testimonial-card:hover .author-avatar {
    border-color: var(--color-accent-gold);
    background: rgba(201, 169, 98, 0.1);
    transform: scale(1.08);
  }
  
  .author-info h4 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 2px;
  }
  
  .author-info p {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  
  @media (min-width: 640px) {
    .testimonials {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .testimonial-card:last-child {
      grid-column: span 2;
      max-width: 50%;
      margin: 0 auto;
    }
  }
  
  @media (min-width: 1024px) {
    .testimonials {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 72px;
    }
    
    .testimonial-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .testimonial-card:last-child {
      grid-column: auto;
      max-width: none;
    }
    
    .testimonial-card {
      padding: 36px 32px;
    }
    
    .testimonial-text {
      font-size: 1.0625rem;
    }
  }
</style>
