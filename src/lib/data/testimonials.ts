export interface Testimonial {
  id: string;
  text: string;
  author: string;
  title: string;
  initials: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    text: "Finally, an alert service that gives me everything I need. The video breakdowns alone are worth it. I actually understand why I'm taking each trade now.",
    author: 'Michael K.',
    title: 'Healthcare Executive',
    initials: 'MK',
    rating: 5
  },
  {
    id: '2',
    text: "The risk management approach changed everything. I used to hold losers hoping they'd come back. Now I cut losses fast and let winners run.",
    author: 'Sarah R.',
    title: 'Software Engineer',
    initials: 'SR',
    rating: 5
  },
  {
    id: '3',
    text: "As a beginner, I was overwhelmed. Explosive Swings gave me a framework. Now I understand entries, stops, targets. The education happens by following along.",
    author: 'James T.',
    title: 'New Trader',
    initials: 'JT',
    rating: 5
  }
];
