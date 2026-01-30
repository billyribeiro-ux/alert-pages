import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGSAP() {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Set defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8
    });
    
    // ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none none'
    });
  }
}

export { gsap, ScrollTrigger };
