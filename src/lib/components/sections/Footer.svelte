<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  let footerRef: HTMLElement;
  let contentRef: HTMLElement;
  
  const currentYear = new Date().getFullYear();
  
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(contentRef,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef,
          start: 'top 95%',
          once: true
        }
      }
    );
  });
</script>

<footer bind:this={footerRef} class="footer">
  <div class="container" bind:this={contentRef}>
    <div class="footer-main">
      <div class="footer-brand">
        <a href="/" class="logo">
          <div class="logo-icon">⚡</div>
          <span>Explosive Swings</span>
        </a>
        <p class="tagline">Wall Street precision. Monday ready.</p>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4>Legal</h4>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/risk-disclosure">Risk Disclosure</a>
        </div>
        <div class="link-group">
          <h4>Support</h4>
          <a href="/contact">Contact Us</a>
          <a href="/faq">FAQ</a>
          <a href="mailto:support@explosiveswings.com">Email Support</a>
        </div>
        <div class="link-group">
          <h4>Connect</h4>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="copyright">© {currentYear} Explosive Swings. All rights reserved.</p>
      
      <div class="social-links">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
          </svg>
        </a>
      </div>
    </div>
    
    <div class="disclaimer">
      <p>
        <strong>Risk Disclosure:</strong> Trading stocks and options involves substantial risk of loss and is not suitable for all investors. Past performance does not guarantee future results. The information provided is for educational purposes only and should not be construed as investment advice. Options trading carries significant risk including the potential loss of the entire investment. Never invest more than you can afford to lose.
      </p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-bg-primary);
    padding: 60px 20px 40px;
    border-top: 1px solid var(--color-border);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-main {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
  }
  
  .footer-brand {
    text-align: center;
  }
  
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
    margin-bottom: 12px;
    transition: transform 0.3s ease;
  }
  
  .logo:hover {
    transform: scale(1.02);
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    background: var(--color-gradient-gold);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
  }
  
  .tagline {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    text-align: center;
  }
  
  .link-group h4 {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }
  
  .link-group a {
    display: block;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-decoration: none;
    padding: 6px 0;
    transition: color 0.3s ease;
  }
  
  .link-group a:hover {
    color: var(--color-accent-gold);
  }
  
  .footer-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .copyright {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  
  .social-links {
    display: flex;
    gap: 16px;
  }
  
  .social-links a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    color: var(--color-text-muted);
    transition: all 0.3s ease;
  }
  
  .social-links a:hover {
    color: var(--color-accent-gold);
    border-color: var(--color-accent-gold);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(201, 169, 98, 0.2);
  }
  
  .social-links svg {
    width: 18px;
    height: 18px;
  }
  
  .disclaimer {
    max-width: 900px;
    margin: 0 auto;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
  }
  
  .disclaimer p {
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    text-align: center;
  }
  
  .disclaimer strong {
    color: var(--color-text-secondary);
  }
  
  @media (min-width: 640px) {
    .footer {
      padding: 80px 32px 48px;
    }
    
    .footer-main {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .footer-brand {
      text-align: left;
    }
    
    .footer-links {
      gap: 48px;
      text-align: left;
    }
    
    .footer-bottom {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  
  @media (min-width: 1024px) {
    .footer-links {
      gap: 64px;
    }
    
    .logo {
      font-size: 1.375rem;
    }
  }
</style>
