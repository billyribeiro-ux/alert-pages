<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  let heroRef: HTMLElement;
  let eyebrowRef: HTMLElement;
  let titleRef: HTMLElement;
  let subtitleRef: HTMLElement;
  let statsRef: HTMLElement;
  let ctaRef: HTMLElement;
  let noteRef: HTMLElement;
  let canvasRef: HTMLCanvasElement;
  
  // Stats values - start with actual values, animate separately
  let setupsCount = $state(0);
  let profitCount = $state(0);
  let priceCount = $state(0);
  
  function animateCounters() {
    // Setups counter (to 7)
    const setupsObj = { value: 0 };
    gsap.to(setupsObj, {
      value: 7,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        setupsCount = Math.round(setupsObj.value);
      }
    });
    
    // Profit counter (to 100)
    const profitObj = { value: 0 };
    gsap.to(profitObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        profitCount = Math.round(profitObj.value);
      }
    });
    
    // Price counter (to 49)
    const priceObj = { value: 0 };
    gsap.to(priceObj, {
      value: 49,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        priceCount = Math.round(priceObj.value);
      }
    });
  }
  
  onMount(() => {
    // Animate chart background
    if (canvasRef) {
      const ctx = canvasRef.getContext('2d');
      if (ctx) {
        animateChart(ctx);
      }
    }
    
    // GSAP timeline for text animations
    const tl = gsap.timeline({ delay: 0.3 });
    
    tl.fromTo(eyebrowRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(titleRef,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(subtitleRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(statsRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', onComplete: animateCounters },
      '-=0.3'
    )
    .fromTo(ctaRef,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(noteRef,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );
  });
  
  function animateChart(ctx: CanvasRenderingContext2D) {
    const canvas = canvasRef;
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    // Generate smooth chart data
    const points = 50;
    let data: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const progress = i / points;
      const trend = progress * 0.4;
      const wave = Math.sin(progress * Math.PI * 3) * 0.15;
      const noise = (Math.random() - 0.5) * 0.1;
      data.push(0.3 + trend + wave + noise);
    }
    
    let animationProgress = 0;
    
    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(201, 169, 98, 0.15)');
      gradient.addColorStop(1, 'rgba(201, 169, 98, 0)');
      
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      const visiblePoints = Math.floor(animationProgress * points);
      
      for (let i = 0; i <= visiblePoints && i < points; i++) {
        const x = (i / (points - 1)) * width;
        const y = height - (data[i] * height * 0.7);
        
        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          const prevX = ((i - 1) / (points - 1)) * width;
          const prevY = height - (data[i - 1] * height * 0.7);
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        }
      }
      
      if (visiblePoints > 0 && visiblePoints < points) {
        const lastX = (visiblePoints / (points - 1)) * width;
        ctx.lineTo(lastX, height);
      } else if (visiblePoints >= points) {
        ctx.lineTo(width, height);
      }
      
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw line
      ctx.beginPath();
      for (let i = 0; i <= visiblePoints && i < points; i++) {
        const x = (i / (points - 1)) * width;
        const y = height - (data[i] * height * 0.7);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = ((i - 1) / (points - 1)) * width;
          const prevY = height - (data[i - 1] * height * 0.7);
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        }
      }
      
      ctx.strokeStyle = 'rgba(201, 169, 98, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw glow point at end
      if (visiblePoints > 0 && visiblePoints <= points) {
        const endIndex = Math.min(visiblePoints, points - 1);
        const endX = (endIndex / (points - 1)) * width;
        const endY = height - (data[endIndex] * height * 0.7);
        
        ctx.beginPath();
        ctx.arc(endX, endY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 169, 98, 0.8)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(endX, endY, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 169, 98, 0.2)';
        ctx.fill();
      }
      
      // Animate
      if (animationProgress < 1) {
        animationProgress += 0.015;
        requestAnimationFrame(draw);
      } else {
        // Loop the animation
        setTimeout(() => {
          animationProgress = 0;
          // Generate new data
          for (let i = 0; i < points; i++) {
            const progress = i / points;
            const trend = progress * 0.4;
            const wave = Math.sin(progress * Math.PI * 3 + Date.now() * 0.001) * 0.15;
            const noise = (Math.random() - 0.5) * 0.1;
            data[i] = 0.3 + trend + wave + noise;
          }
          requestAnimationFrame(draw);
        }, 3000);
      }
    }
    
    draw();
  }
</script>

<section bind:this={heroRef} class="hero">
  <canvas bind:this={canvasRef} class="hero-chart"></canvas>
  <div class="hero-glow"></div>
  
  <div class="hero-content">
    <div bind:this={eyebrowRef} class="eyebrow">
      <span class="line"></span>
      <span>Premium Stock & Options Alerts</span>
      <span class="line"></span>
    </div>
    
    <h1 bind:this={titleRef} class="title">
      Wall Street Precision.<br>
      <span class="highlight">Monday Ready.</span>
    </h1>
    
    <p bind:this={subtitleRef} class="subtitle">
      Every Sunday night, receive 5-7 meticulously researched trade setups with exact entries, targets, and stops. Review the video watchlist, prepare your orders, and execute with confidence when the market opens Monday at 9:30 AM.
    </p>
    
    <div bind:this={statsRef} class="stats">
      <div class="stat">
        <span class="stat-value">{setupsCount}</span>
        <span class="stat-label">Weekly Setups</span>
      </div>
      <div class="stat">
        <span class="stat-value">{profitCount}%+</span>
        <span class="stat-label">Profit Potential</span>
      </div>
      <div class="stat">
        <span class="stat-value">${priceCount}</span>
        <span class="stat-label">Launch Price</span>
      </div>
    </div>
    
    <div bind:this={ctaRef} class="cta-container">
      <a href="#pricing" class="cta-primary">
        <span>Join Explosive Swings</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
    
    <p bind:this={noteRef} class="note">Cancel anytime. No contracts.</p>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 80px;
    position: relative;
    overflow: hidden;
    background: var(--color-bg-primary);
  }
  
  .hero-chart {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    opacity: 0.6;
    pointer-events: none;
  }
  
  .hero-glow {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 60%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
  }
  
  .eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    opacity: 0;
  }
  
  .eyebrow span:not(.line) {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent-gold);
  }
  
  .eyebrow .line {
    width: 40px;
    height: 1px;
    background: var(--color-accent-gold);
    opacity: 0.5;
  }
  
  .title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
    color: var(--color-text-primary);
    opacity: 0;
  }
  
  .title .highlight {
    background: var(--color-gradient-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: 1.0625rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 40px;
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
  }
  
  .stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 48px;
    opacity: 0;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-value {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
  
  .cta-container {
    margin-bottom: 20px;
    opacity: 0;
  }
  
  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--color-gradient-gold);
    color: var(--color-bg-primary);
    padding: 18px 36px;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 30px rgba(201, 169, 98, 0.3);
  }
  
  .cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(201, 169, 98, 0.4);
  }
  
  .cta-primary svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  .cta-primary:hover svg {
    transform: translateX(5px);
  }
  
  .note {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    opacity: 0;
  }
  
  @media (min-width: 640px) {
    .title {
      font-size: 3.25rem;
    }
    
    .stats {
      gap: 60px;
    }
    
    .stat-value {
      font-size: 3rem;
    }
  }
  
  @media (min-width: 1024px) {
    .hero {
      padding: 140px 20px 100px;
    }
    
    .title {
      font-size: 3.75rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
    }
    
    .stats {
      gap: 80px;
    }
    
    .stat-value {
      font-size: 3.5rem;
    }
  }
</style>
