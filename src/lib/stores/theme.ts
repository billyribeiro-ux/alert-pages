import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function createThemeStore() {
  const defaultTheme: Theme = 'dark';
  
  const initial = browser 
    ? (localStorage.getItem('theme') as Theme) || defaultTheme 
    : defaultTheme;
  
  const { subscribe, set, update } = writable<Theme>(initial);
  
  return {
    subscribe,
    toggle: () => {
      update(current => {
        const next = current === 'dark' ? 'light' : 'dark';
        if (browser) {
          localStorage.setItem('theme', next);
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(next);
        }
        return next;
      });
    },
    set: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
