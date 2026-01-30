import { error } from '@sveltejs/kit';
import { traders } from '$lib/data/traders';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const trader = traders.find(t => t.id === params.slug);
  
  if (!trader) {
    throw error(404, 'Trader not found');
  }
  
  return {
    trader
  };
};
