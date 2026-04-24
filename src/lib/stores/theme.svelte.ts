import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

function readStoredTheme(): Theme | null {
	if (!browser) return null;
	try {
		const value = localStorage.getItem('theme');
		return value === 'dark' || value === 'light' ? value : null;
	} catch {
		return null;
	}
}

function writeStoredTheme(value: Theme): void {
	if (!browser) return;
	try {
		localStorage.setItem('theme', value);
	} catch {
		// localStorage unavailable or quota exceeded
	}
}

function applyThemeClass(value: Theme): void {
	if (!browser) return;
	document.documentElement.classList.remove('dark', 'light');
	document.documentElement.classList.add(value);
}

export const theme = $state<{ current: Theme }>({
	current: readStoredTheme() ?? 'dark'
});

export function setTheme(next: Theme): void {
	theme.current = next;
	writeStoredTheme(next);
	applyThemeClass(next);
}

export function toggleTheme(): void {
	setTheme(theme.current === 'dark' ? 'light' : 'dark');
}
