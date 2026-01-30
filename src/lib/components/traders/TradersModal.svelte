<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { traders } from '$lib/data/traders';
  
  interface Props {
    onClose: () => void;
  }
  
  let { onClose }: Props = $props();
  
  let overlayRef: HTMLElement;
  let modalRef: HTMLElement;
  let cardsRef: HTMLElement[] = [];
  let activeTrader = $state(0);
  
  onMount(() => {
    // Entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(overlayRef,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
    .fromTo(modalRef,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
      '-=0.2'
    )
    .fromTo(cardsRef,
      { opacity: 0, y: 40, rotateY: -15 },
      { 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        duration: 0.6, 
        stagger: 0.15,
        ease: 'power3.out'
      },
      '-=0.3'
    );
    
    // Particle effect
    createParticles();
  });
  
  function handleClose() {
    const tl = gsap.timeline({
      onComplete: onClose
    });
    
    tl.to(cardsRef, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    })
    .to(modalRef, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2')
    .to(overlayRef, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2');
  }
  
  function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${5 + Math.random() * 10}s`;
      container.appendChild(particle);
    }
  }
  
  function selectTrader(index: number) {
    activeTrader = index;
    
    // Animate card emphasis
    cardsRef.forEach((card, i) => {
      if (i === index) {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }
  
  function handleOverlayClick() {
    handleClose();
  }
  
  function handleOverlayKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
  
  function handleModalClick(e: MouseEvent) {
    e.stopPropagation();
  }
  
  function handleModalKeydown(e: KeyboardEvent) {
    e.stopPropagation();
  }
</script>

<svelte:window onkeydown={handleOverlayKeydown} />

<div 
  bind:this={overlayRef} 
  class="modal-overlay"
  role="dialog"
  aria-modal="true"
  aria-label="Meet the traders"
>
  <button 
    type="button" 
    class="overlay-button"
    onclick={handleOverlayClick}
    aria-label="Close modal"
  ></button>
  <div class="particles-container"></div>
  
  <div 
    bind:this={modalRef} 
    class="modal-content"
    role="document"
  >
    <button class="close-btn" onclick={handleClose} type="button" aria-label="Close modal">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <div class="modal-header">
      <span class="modal-eyebrow">The Team Behind Your Edge</span>
      <h2 class="modal-title">Meet The Traders</h2>
      <p class="modal-subtitle">Wall Street experience. Retail accessibility. Real results.</p>
    </div>
    
    <div class="traders-grid">
      {#each traders as trader, index}
        <div 
          bind:this={cardsRef[index]}
          class="trader-card"
          class:active={activeTrader === index}
          onmouseenter={() => selectTrader(index)}
          role="article"
        >
          <div class="card-glow"></div>
          
          <div class="trader-avatar">
            <div class="avatar-ring"></div>
            <div class="avatar-inner">
              <span>{trader.initials}</span>
            </div>
          </div>
          
          <div class="trader-info">
            <h3>{trader.name}</h3>
            <p class="trader-title">{trader.title}</p>
          </div>
          
          <p class="trader-bio">{trader.shortBio}</p>
          
          <div class="trader-achievements">
            <h4>Key Achievements</h4>
            <ul>
              {#each trader.achievements as achievement}
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{achievement}</span>
                </li>
              {/each}
            </ul>
          </div>
          
          <a href="/traders/{trader.id}" class="card-footer">
            <div class="footer-line"></div>
            <span class="read-more">Full Bio</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      {/each}
    </div>
    
    <div class="modal-footer">
      <a href="/pricing" class="cta-btn" onclick={handleClose}>
        <span>Join Our Community</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
  }
  
  .overlay-button {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 0;
  }
  
  .particles-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  
  :global(.particle) {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--color-accent-gold);
    border-radius: 50%;
    opacity: 0.3;
    animation: float linear infinite;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    50% {
      transform: translateY(-100px) translateX(50px);
    }
  }
  
  .modal-content {
    position: relative;
    width: 100%;
    max-width: 1000px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    padding: 40px 24px;
    box-shadow: 
      0 25px 80px rgba(0, 0, 0, 0.5),
      0 0 100px rgba(201, 169, 98, 0.1);
    z-index: 1;
  }
  
  .close-btn {
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
  
  .close-btn:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-accent-gold);
    transform: rotate(90deg);
  }
  
  .close-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .modal-eyebrow {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 12px;
  }
  
  .modal-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.25rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 12px;
  }
  
  .modal-subtitle {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }
  
  .traders-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .trader-card {
    position: relative;
    padding: 32px 24px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    perspective: 1000px;
    text-align: left;
    font-family: inherit;
  }
  
  .trader-card::before {
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
  
  .trader-card:hover,
  .trader-card.active {
    border-color: var(--color-accent-gold);
    box-shadow: 0 12px 40px rgba(201, 169, 98, 0.15);
  }
  
  .trader-card:hover::before,
  .trader-card.active::before {
    transform: scaleX(1);
  }
  
  .card-glow {
    position: absolute;
    top: -50%;
    right: -30%;
    width: 60%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  .trader-card:hover .card-glow,
  .trader-card.active .card-glow {
    opacity: 1;
  }
  
  .trader-avatar {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
  }
  
  .avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--color-accent-gold);
    opacity: 0.3;
    transition: all 0.4s ease;
  }
  
  .trader-card:hover .avatar-ring,
  .trader-card.active .avatar-ring {
    opacity: 1;
    inset: -8px;
    animation: ringRotate 8s linear infinite;
  }
  
  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .avatar-inner {
    width: 100%;
    height: 100%;
    background: var(--color-gradient-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 30px rgba(201, 169, 98, 0.4);
    transition: transform 0.4s ease;
  }
  
  .trader-card:hover .avatar-inner,
  .trader-card.active .avatar-inner {
    transform: scale(1.05);
  }
  
  .avatar-inner span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .trader-info {
    text-align: center;
    margin-bottom: 16px;
  }
  
  .trader-info h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 6px;
    transition: color 0.3s ease;
  }
  
  .trader-card:hover .trader-info h3,
  .trader-card.active .trader-info h3 {
    color: var(--color-accent-gold);
  }
  
  .trader-title {
    font-size: 0.875rem;
    color: var(--color-accent-gold);
    font-weight: 500;
  }
  
  .trader-bio {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .trader-achievements {
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
  }
  
  .trader-achievements h4 {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 14px;
    text-align: center;
  }
  
  .trader-achievements ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .trader-achievements li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .trader-achievements li svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: var(--color-success);
  }
  
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    padding-top: 20px;
    opacity: 0.7;
    transform: translateY(4px);
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  
  .trader-card:hover .card-footer,
  .trader-card.active .card-footer {
    opacity: 1;
    transform: translateY(0);
  }
  
  .footer-line {
    flex: 1;
    height: 1px;
    background: var(--color-border);
    max-width: 40px;
  }
  
  .read-more {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .card-footer svg {
    width: 16px;
    height: 16px;
    color: var(--color-accent-gold);
    transition: transform 0.3s ease;
  }
  
  .trader-card:hover .card-footer svg {
    transform: translateX(4px);
  }
  
  .modal-footer {
    text-align: center;
  }
  
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 40px;
    background: var(--color-gradient-gold);
    color: var(--color-bg-primary);
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.4s ease;
    box-shadow: 0 8px 30px rgba(201, 169, 98, 0.35);
  }
  
  .cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 50px rgba(201, 169, 98, 0.5);
  }
  
  .cta-btn svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  .cta-btn:hover svg {
    transform: translateX(5px);
  }
  
  @media (min-width: 640px) {
    .modal-content {
      padding: 48px 40px;
    }
    
    .modal-title {
      font-size: 2.5rem;
    }
    
    .traders-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
    
    .trader-card {
      padding: 36px 28px;
    }
  }
  
  @media (min-width: 1024px) {
    .modal-content {
      padding: 64px 56px;
    }
    
    .modal-title {
      font-size: 3rem;
    }
    
    .traders-grid {
      gap: 32px;
    }
    
    .trader-card {
      padding: 40px 32px;
    }
  }
</style>
