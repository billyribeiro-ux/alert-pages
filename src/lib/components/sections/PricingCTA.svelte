<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { calculateTimeLeft, type TimeLeft } from '$lib/utils/countdown';
  
  let sectionRef: HTMLElement;
  let contentRef: HTMLElement;
  let priceRef: HTMLElement;
  let ctaRef: HTMLElement;
  let countdownRef: HTMLElement;
  
  // Countdown - set to 7 days from now (adjust as needed)
  const launchEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  let timeLeft = $state<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Update countdown every second
    const updateCountdown = () => {
      timeLeft = calculateTimeLeft(launchEndDate);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    // Content animation
    gsap.fromTo(contentRef,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top 75%',
          once: true
        }
      }
    );
    
    // Price animation
    gsap.fromTo(priceRef,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top 75%',
          once: true
        }
      }
    );
    
    // Countdown animation
    gsap.fromTo(countdownRef,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top 75%',
          once: true
        }
      }
    );
    
    // CTA animation
    gsap.fromTo(ctaRef,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top 75%',
          once: true
        }
      }
    );
    
    return () => clearInterval(interval);
  });
  
  function padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
</script>

<section bind:this={sectionRef} class="pricing-cta" id="pricing">
  <div class="glow-top"></div>
  <div class="glow-bottom"></div>
  
  <div class="pricing-cta-content" bind:this={contentRef}>
    <span class="section-eyebrow">Limited Time</span>
    <h2 class="section-title">Launch Special</h2>
    <p class="section-text">Get full access to Explosive Swings at our introductory price. Lock in this rate before it goes up.</p>
    
    <div bind:this={priceRef} class="price-box">
      <div class="price-wrapper">
        <span class="price-currency">$</span>
        <span class="price-amount">49</span>
      </div>
      <div class="price-period">per month</div>
      <span class="price-badge">Launch Price</span>
    </div>
    
    <div bind:this={countdownRef} class="countdown">
      <div class="countdown-label">Offer ends in:</div>
      <div class="countdown-timer">
        <div class="countdown-unit">
          <span class="countdown-value">{padZero(timeLeft.days)}</span>
          <span class="countdown-text">Days</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-value">{padZero(timeLeft.hours)}</span>
          <span class="countdown-text">Hours</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-value">{padZero(timeLeft.minutes)}</span>
          <span class="countdown-text">Min</span>
        </div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit">
          <span class="countdown-value">{padZero(timeLeft.seconds)}</span>
          <span class="countdown-text">Sec</span>
        </div>
      </div>
    </div>
    
    <div bind:this={ctaRef} class="cta-wrapper">
      <button type="button" class="cta-primary">
        <span>Join Explosive Swings</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
      
      <div class="cta-note">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Cancel anytime. No contracts.
      </div>
    </div>
    
    <div class="trust-badges">
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span>Secure Payment</span>
      </div>
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
        <span>All Major Cards</span>
      </div>
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span>SSL Encrypted</span>
      </div>
    </div>
  </div>
</section>

<style>
  .pricing-cta {
    padding: 100px 20px;
    background: var(--color-bg-secondary);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .glow-top {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 50%;
    background: radial-gradient(ellipse at 50% 100%, rgba(201, 169, 98, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .glow-bottom {
    position: absolute;
    bottom: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 50%;
    background: radial-gradient(ellipse at 50% 0%, rgba(201, 169, 98, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .pricing-cta-content {
    position: relative;
    z-index: 2;
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
    font-size: 2.25rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
    color: var(--color-text-primary);
  }
  
  .section-text {
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
    line-height: 1.7;
    margin-bottom: 40px;
  }
  
  .price-box {
    margin-bottom: 32px;
  }
  
  .price-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
  }
  
  .price-currency {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    margin-top: 8px;
  }
  
  .price-amount {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 5rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    line-height: 1;
    background: var(--color-gradient-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .price-period {
    font-size: 1.0625rem;
    color: var(--color-text-muted);
    margin-top: 8px;
  }
  
  .price-badge {
    display: inline-block;
    margin-top: 16px;
    padding: 8px 20px;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-bg-primary);
    background: var(--color-gradient-gold);
    border-radius: 100px;
    box-shadow: 0 4px 20px rgba(201, 169, 98, 0.3);
  }
  
  .countdown {
    margin-bottom: 40px;
  }
  
  .countdown-label {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }
  
  .countdown-timer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  
  .countdown-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }
  
  .countdown-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 60px;
    display: block;
  }
  
  .countdown-text {
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 8px;
  }
  
  .countdown-separator {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    margin-bottom: 24px;
  }
  
  .cta-wrapper {
    margin-bottom: 40px;
  }
  
  .cta-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    max-width: 360px;
    background: var(--color-gradient-gold);
    color: var(--color-bg-primary);
    padding: 20px 40px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 30px rgba(201, 169, 98, 0.35);
    position: relative;
    overflow: hidden;
  }
  
  .cta-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .cta-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 50px rgba(201, 169, 98, 0.5);
  }
  
  .cta-primary:hover::before {
    opacity: 1;
  }
  
  .cta-primary svg {
    width: 22px;
    height: 22px;
    transition: transform 0.3s ease;
  }
  
  .cta-primary:hover svg {
    transform: translateX(6px);
  }
  
  .cta-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  
  .cta-note svg {
    width: 18px;
    height: 18px;
    color: var(--color-success);
  }
  
  .trust-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
  }
  
  .badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
  
  .badge svg {
    width: 18px;
    height: 18px;
    color: var(--color-accent-gold);
  }
  
  @media (min-width: 640px) {
    .pricing-cta {
      padding: 120px 32px;
    }
    
    .section-title {
      font-size: 2.75rem;
    }
    
    .price-amount {
      font-size: 6rem;
    }
    
    .countdown-value {
      font-size: 2.5rem;
      min-width: 80px;
      padding: 16px 20px;
    }
    
    .countdown-separator {
      font-size: 2.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    .pricing-cta {
      padding: 140px 32px;
    }
    
    .section-title {
      font-size: 3rem;
    }
    
    .price-amount {
      font-size: 7rem;
    }
  }
</style>
