<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  let formRef = $state<HTMLFormElement | null>(null);
  let inputRef = $state<HTMLInputElement | null>(null);
  let email = $state('');
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let errorMessage = $state('');
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';
    
    if (!email || !email.includes('@')) {
      errorMessage = 'Please enter a valid email address';
      shakeInput();
      return;
    }
    
    isSubmitting = true;
    
    // Simulate API call - replace with actual endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success animation
      isSuccess = true;
      if (formRef) {
        gsap.fromTo(formRef,
          { scale: 1 },
          { 
            scale: 1.02, 
            duration: 0.2, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.out'
          }
        );
      }
      
    } catch (error) {
      errorMessage = 'Something went wrong. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  function shakeInput() {
    if (inputRef) {
      gsap.fromTo(inputRef,
        { x: 0 },
        { 
          x: 10, 
          duration: 0.1, 
          repeat: 3, 
          yoyo: true,
          ease: 'power2.inOut'
        }
      );
    }
  }
  
  function resetForm() {
    isSuccess = false;
    email = '';
  }
</script>

<div class="email-capture">
  <div class="capture-content">
    <div class="capture-text">
      <h3>Get Free Market Insights</h3>
      <p>Join our weekly newsletter for market analysis and exclusive trade ideas.</p>
    </div>
    
    {#if isSuccess}
      <div class="success-message">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="success-text">
          <strong>You're in!</strong>
          <span>Check your inbox to confirm your subscription.</span>
        </div>
        <button class="reset-btn" onclick={resetForm} type="button">Subscribe another email</button>
      </div>
    {:else}
      <form bind:this={formRef} class="capture-form" onsubmit={handleSubmit}>
        <div class="input-wrapper">
          <input
            bind:this={inputRef}
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            disabled={isSubmitting}
            class:error={errorMessage}
          />
          <button type="submit" disabled={isSubmitting}>
            {#if isSubmitting}
              <span class="spinner"></span>
            {:else}
              <span>Subscribe</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            {/if}
          </button>
        </div>
        {#if errorMessage}
          <p class="error-text">{errorMessage}</p>
        {/if}
        <p class="privacy-note">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          No spam. Unsubscribe anytime.
        </p>
      </form>
    {/if}
  </div>
</div>

<style>
  .email-capture {
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    padding: 40px 28px;
    position: relative;
    overflow: hidden;
  }
  
  .email-capture::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-gradient-gold);
  }
  
  .email-capture::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 50%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(201, 169, 98, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .capture-content {
    position: relative;
    z-index: 1;
  }
  
  .capture-text {
    text-align: center;
    margin-bottom: 28px;
  }
  
  .capture-text h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 10px;
  }
  
  .capture-text p {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  .capture-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  input {
    width: 100%;
    padding: 16px 20px;
    font-size: 1rem;
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    outline: none;
    transition: all 0.3s ease;
  }
  
  input::placeholder {
    color: var(--color-text-muted);
  }
  
  input:focus {
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.15);
  }
  
  input.error {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
  
  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  button[type="submit"] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 24px;
    font-size: 0.9375rem;
    font-weight: 700;
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-bg-primary);
    background: var(--color-gradient-gold);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(201, 169, 98, 0.3);
  }
  
  button[type="submit"]:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201, 169, 98, 0.4);
  }
  
  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  button[type="submit"] svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
  
  button[type="submit"]:hover:not(:disabled) svg {
    transform: translateX(4px);
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(10, 10, 15, 0.3);
    border-top-color: var(--color-bg-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .error-text {
    font-size: 0.8125rem;
    color: var(--color-danger);
    text-align: center;
  }
  
  .privacy-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: 4px;
  }
  
  .privacy-note svg {
    width: 14px;
    height: 14px;
  }
  
  .success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  
  .success-icon {
    width: 56px;
    height: 56px;
    background: rgba(52, 211, 153, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-success);
    animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  @keyframes scaleIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .success-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .success-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .success-text strong {
    font-size: 1.125rem;
    color: var(--color-text-primary);
  }
  
  .success-text span {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .reset-btn {
    background: none;
    border: none;
    font-size: 0.8125rem;
    color: var(--color-accent-gold);
    cursor: pointer;
    text-decoration: underline;
    transition: opacity 0.3s ease;
  }
  
  .reset-btn:hover {
    opacity: 0.8;
  }
  
  @media (min-width: 640px) {
    .email-capture {
      padding: 48px 40px;
    }
    
    .capture-text h3 {
      font-size: 1.75rem;
    }
    
    .input-wrapper {
      flex-direction: row;
      gap: 12px;
    }
    
    input {
      flex: 1;
    }
    
    button[type="submit"] {
      width: auto;
      flex-shrink: 0;
    }
  }
  
  @media (min-width: 1024px) {
    .email-capture {
      padding: 56px 48px;
    }
  }
</style>
