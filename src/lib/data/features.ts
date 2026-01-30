export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: 'chart',
    title: 'Weekly Video Watchlist',
    description: '5-7 trades with full chart breakdown and execution guidance every Sunday night.'
  },
  {
    icon: 'bell',
    title: 'Real-Time Position Updates',
    description: 'Adjustments, partial exits, and new developments as market conditions evolve.'
  },
  {
    icon: 'globe',
    title: 'Market Commentary',
    description: 'Weekly macro analysis to understand the broader context of your trades.'
  },
  {
    icon: 'graduation',
    title: 'Education Library',
    description: 'Video lessons on strategy, risk management, and execution fundamentals.'
  }
];
