<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { traders } from '$lib/data/traders';
  import TradersModal from './TradersModal.svelte';
  
  let bubbleRef: HTMLElement;
  let isModalOpen = $state(false);
  
  // Derive display traders with safe access
  const displayTraders = traders.slice(0, 2);
  
  onMount(() => {
    if (!bubbleRef) return;
    
    // Initial entrance animation
    const entranceTween = gsap.fromTo(bubbleRef,
      { 
        opacity: 0, 
        scale: 0.5,
        y: 50
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 0.8, 
        delay: 2,
        ease: 'back.out(1.7)'
      }
    );
    
    // Floating animation
    const floatTween = gsap.to(bubbleRef, {
      y: -8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    // Magnetic effect constants
    const MAGNETIC_THRESHOLD = 200;
    const MAGNETIC_STRENGTH = 0.3;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!bubbleRef || isModalOpen) return;
      
      const rect = bubbleRef.getBoundingClientRect();
      const bubbleCenterX = rect.left + rect.width / 2;
      const bubbleCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - bubbleCenterX, 2) + 
        Math.pow(e.clientY - bubbleCenterY, 2)
      );
      
      if (distance < MAGNETIC_THRESHOLD) {
        const strength = (MAGNETIC_THRESHOLD - distance) / MAGNETIC_THRESHOLD * MAGNETIC_STRENGTH;
        const deltaX = (e.clientX - bubbleCenterX) * strength;
        
        gsap.to(bubbleRef, {
          x: deltaX,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        // Reset position when outside threshold
        gsap.to(bubbleRef, {
          x: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Comprehensive cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      entranceTween.kill();
      floatTween.kill();
      gsap.killTweensOf(bubbleRef);
      
      // Restore body overflow if modal was open during unmount
      if (isModalOpen) {
        document.body.style.overflow = '';
      }
    };
  });
  
  function openModal() {
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = '';
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<button
  bind:this={bubbleRef}
  class="traders-bubble"
  onclick={openModal}
  aria-label="Meet the traders"
>
  <div class="bubble-glow"></div>
  <div class="bubble-ring"></div>
  
  <div class="avatars">
    {#each displayTraders as trader, index}
      <div class="avatar" style="z-index: {displayTraders.length - index};">
        <span>{trader.initials}</span>
      </div>
    {/each}
  </div>
  
  <div class="bubble-text">
    <span class="text-main">Meet The Traders</span>
    <span class="text-sub">Click to learn more</span>
  </div>
  
  <div class="bubble-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </div>
</button>

{#if isModalOpen}
  <TradersModal onClose={closeModal} />
{/if}

<style>
  .traders-bubble {
    position: fixed;
    bottom: 32px;
    left: 32px;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 20px 12px 14px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  .traders-bubble:hover {
    border-color: var(--color-accent-gold);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.25),
      0 0 40px rgba(201, 169, 98, 0.2);
    transform: scale(1.02);
  }
  
  .bubble-glow {
    position: absolute;
    inset: -3px;
    border-radius: 100px;
    background: var(--color-gradient-gold);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
    filter: blur(8px);
  }
  
  .traders-bubble:hover .bubble-glow {
    opacity: 0.4;
  }
  
  .bubble-ring {
    position: absolute;
    inset: -6px;
    border-radius: 100px;
    border: 1px solid var(--color-accent-gold);
    opacity: 0;
    transition: all 0.4s ease;
    animation: ringPulse 2s ease-in-out infinite;
    animation-play-state: paused;
  }
  
  .traders-bubble:hover .bubble-ring {
    opacity: 0.3;
    animation-play-state: running;
  }
  
  @keyframes ringPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.1;
    }
  }
  
  .avatars {
    display: flex;
    position: relative;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-gradient-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-bg-secondary);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .avatar:nth-child(2) {
    margin-left: -14px;
  }
  
  .traders-bubble:hover .avatar:nth-child(1) {
    transform: translateX(-4px);
  }
  
  .traders-bubble:hover .avatar:nth-child(2) {
    transform: translateX(4px);
  }
  
  .avatar span {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-bg-primary);
  }
  
  .bubble-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .text-main {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }
  
  .traders-bubble:hover .text-main {
    color: var(--color-accent-gold);
  }
  
  .text-sub {
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    transition: opacity 0.3s ease;
  }
  
  .bubble-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(201, 169, 98, 0.1);
    border-radius: 50%;
    color: var(--color-accent-gold);
    transition: all 0.3s ease;
  }
  
  .traders-bubble:hover .bubble-arrow {
    background: var(--color-accent-gold);
    color: var(--color-bg-primary);
    transform: translateX(3px);
  }
  
  .bubble-arrow svg {
    width: 14px;
    height: 14px;
  }
  
  @media (max-width: 640px) {
    .traders-bubble {
      bottom: 20px;
      left: 20px;
      padding: 10px 16px 10px 12px;
      gap: 10px;
    }
    
    .avatar {
      width: 34px;
      height: 34px;
    }
    
    .avatar:nth-child(2) {
      margin-left: -12px;
    }
    
    .avatar span {
      font-size: 0.6875rem;
    }
    
    .text-main {
      font-size: 0.8125rem;
    }
    
    .text-sub {
      display: none;
    }
    
    .bubble-arrow {
      width: 20px;
      height: 20px;
    }
    
    .bubble-arrow svg {
      width: 12px;
      height: 12px;
    }
  }
</style>
