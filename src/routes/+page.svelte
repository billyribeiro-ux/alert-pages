<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  // Sections
  import Nav from '$lib/components/sections/Nav.svelte';
  import Hero from '$lib/components/sections/Hero.svelte';
  import Ticker from '$lib/components/ui/Ticker.svelte';
  import Problem from '$lib/components/sections/Problem.svelte';
  import Solution from '$lib/components/sections/Solution.svelte';
  import HowItWorks from '$lib/components/sections/HowItWorks.svelte';
  import Credentials from '$lib/components/sections/Credentials.svelte';
  import Features from '$lib/components/sections/Features.svelte';
  import Audience from '$lib/components/sections/Audience.svelte';
  import SocialProof from '$lib/components/ui/SocialProof.svelte';
  import Testimonials from '$lib/components/sections/Testimonials.svelte';
  import FAQ from '$lib/components/sections/FAQ.svelte';
  import EmailCapture from '$lib/components/ui/EmailCapture.svelte';
  import PricingCTA from '$lib/components/sections/PricingCTA.svelte';
  import Footer from '$lib/components/sections/Footer.svelte';
  
  // Traders components - Version A (Floating Bubble)
  import TradersBubble from '$lib/components/traders/TradersBubble.svelte';
  
  // Traders components - Version B (Inline Section)
  // Uncomment to use Version B instead
  // import TradersSection from '$lib/components/traders/TradersSection.svelte';
  
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh ScrollTrigger after page load
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
</script>

<svelte:head>
  <title>Explosive Swings | Premium Stock & Options Alert Service</title>
  <meta name="description" content="Explosive Swings delivers 5-7 hand-picked weekly stock and options trade alerts with 100%+ profit potential. Founded by Billy Ribeiro, mentored by Wall Street legend Mark McGoldrick.">
  <meta name="keywords" content="stock alerts, options trading alerts, swing trading service, weekly stock picks, Billy Ribeiro trading">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Explosive Swings | Premium Stock & Options Alert Service">
  <meta property="og:description" content="5-7 hand-picked weekly trades with 100%+ profit potential. Wall Street precision, Monday ready.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://explosiveswings.com">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Explosive Swings | Premium Stock & Options Alert Service">
  <meta name="twitter:description" content="5-7 hand-picked weekly trades with 100%+ profit potential. Wall Street precision, Monday ready.">
</svelte:head>

<div class="page-wrapper">
  <Nav />
  
  <main>
    <Hero />
    
    <Ticker />
    
    <Problem />
    
    <Solution />
    
    <HowItWorks />
    
    <Credentials />
    
    <!-- 
      VERSION B: Inline Traders Section
      Uncomment below and comment out TradersBubble to use Version B
    -->
    <!-- <TradersSection /> -->
    
    <Features />
    
    <Audience />
    
    <SocialProof />
    
    <Testimonials />
    
    <FAQ />
    
    <section class="email-section">
      <div class="container">
        <EmailCapture />
      </div>
    </section>
    
    <PricingCTA />
  </main>
  
  <Footer />
  
  <!-- VERSION A: Floating Bubble (default) -->
  <TradersBubble />
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  main {
    position: relative;
  }
  
  .email-section {
    padding: 80px 0;
    background: var(--color-bg-primary);
  }
  
  .container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  @media (min-width: 640px) {
    .email-section {
      padding: 100px 0;
    }
  }
  
  @media (min-width: 1024px) {
    .email-section {
      padding: 120px 0;
    }
  }
</style>
