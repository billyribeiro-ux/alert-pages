import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the hero headline', async () => {
		render(Page);
		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent(/Wall Street Precision/i);
	});

	it('exposes the primary pricing CTA', async () => {
		render(Page);
		const cta = page.getByRole('link', { name: /Join Explosive Swings/i });
		await expect.element(cta).toBeInTheDocument();
		await expect.element(cta).toHaveAttribute('href', '#pricing');
	});
});
