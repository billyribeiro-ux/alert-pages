<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { faqs } from '$lib/data/faqs';
  
  let sectionRef: HTMLElement;
  let headerRef: HTMLElement;
  let itemsRef: HTMLElement[] = [];
  let openIndex = $state<number | null>(null);
  
  function toggleFaq(index: number) {
    if (openIndex === index) {
      openIndex = null;
    } else {
      openIndex = index;
    }
  }
  
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
    
    // Items stagger animation
    itemsRef.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="faq">
  <div class="container">
    <div bind:this={headerRef} class="section-header">
      <span class="section-eyebrow">Questions</span>
      <h2 class="section-title">Common Questions</h2>
    </div>
    
    <div class="faq-grid">
      {#each faqs as faq, index}
        <button
          bind:this={itemsRef[index]}
          class="faq-item"
          class:open={openIndex === index}
          onclick={() => toggleFaq(index)}
          aria-expanded={openIndex === index}
        >
          <div class="faq-header">
            <h3>{faq.question}</h3>
            <div class="faq-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </div>
          </div>
          <div class="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq {
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
  
  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    width: 100%;
    padding: 24px 28px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .faq-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--color-gradient-gold);
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s ease;
  }
  
  .faq-item:hover {
    border-color: rgba(201, 169, 98, 0.3);
    transform: translateX(4px);
  }
  
  .faq-item:hover::before,
  .faq-item.open::before {
    transform: scaleY(1);
  }
  
  .faq-item.open {
    border-color: var(--color-accent-gold);
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, rgba(201, 169, 98, 0.03) 100%);
  }
  
  .faq-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  
  .faq-header h3 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
    line-height: 1.4;
  }
  
  .faq-item:hover .faq-header h3,
  .faq-item.open .faq-header h3 {
    color: var(--color-accent-gold);
  }
  
  .faq-icon {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-gold);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .faq-item:hover .faq-icon {
    background: rgba(201, 169, 98, 0.15);
  }
  
  .faq-item.open .faq-icon {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: rotate(45deg);
  }
  
  .faq-icon svg {
    width: 16px;
    height: 16px;
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }
  
  .faq-item.open .faq-answer {
    max-height: 300px;
    opacity: 1;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);
  }
  
  .faq-answer p {
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.8;
  }
  
  @media (min-width: 640px) {
    .faq {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.25rem;
    }
    
    .faq-grid {
      gap: 16px;
    }
    
    .faq-item {
      padding: 28px 32px;
    }
    
    .faq-header h3 {
      font-size: 1.125rem;
    }
  }
  
  @media (min-width: 1024px) {
    .faq {
      padding: 120px 0;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .section-header {
      margin-bottom: 72px;
    }
  }
</style>
