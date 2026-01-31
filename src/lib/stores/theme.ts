import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function safeLocalStorageGet(key: string): string | null {
  if (!browser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  if (!browser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable or quota exceeded
  }
}

function createThemeStore() {
  const defaultTheme: Theme = 'dark';
  
  const initial = (safeLocalStorageGet('theme') as Theme) || defaultTheme;
  
  const { subscribe, set, update } = writable<Theme>(initial);
  
  return {
    subscribe,
    toggle: () => {
      update(current => {
        const next = current === 'dark' ? 'light' : 'dark';
        if (browser) {
          safeLocalStorageSet('theme', next);
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(next);
        }
        return next;
      });
    },
    set: (theme: Theme) => {
      if (browser) {
        safeLocalStorageSet('theme', theme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
