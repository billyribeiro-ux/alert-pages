export interface Trader {
  id: string;
  name: string;
  title: string;
  initials: string;
  image?: string;
  bio: string;
  shortBio: string;
  achievements: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export const traders: Trader[] = [
  {
    id: 'billy',
    name: 'Billy Ribeiro',
    title: 'Founder & Lead Analyst',
    initials: 'BR',
    bio: `Wall Street trained, market battle-tested. Billy spent years learning institutional trading strategies directly from Mark McGoldrick, former Partner and Head of Global Securities at Goldman Sachs. That mentorship shaped a methodology that combines institutional precision with retail accessibility.

His track record speaks for itself: Called the COVID top and bottom in 2020. Predicted the 2022 market top and subsequent bottom. Identified the 2024-2025 new highs before they happened. A 600% overnight return on OXY puts. A 573x return on a single 0DTE SPX trade.

But numbers only tell part of the story. Billy built Explosive Swings to give everyday traders the same edge that Wall Street keeps for itself.`,
    shortBio: 'Wall Street trained under Goldman Sachs\' Mark McGoldrick. Called COVID top/bottom, 2022 reversal, and 2024-25 highs.',
    achievements: [
      'Mentored by Mark McGoldrick (Goldman Sachs)',
      'Called COVID market top & bottom',
      '573x return on 0DTE SPX trade',
      '600% overnight on OXY puts'
    ]
  },
  {
    id: 'freddie',
    name: 'Freddie Ferber',
    title: 'Co-Analyst & Options Strategist',
    initials: 'FM',
    bio: `Freddie brings a unique blend of technical precision and options expertise to Explosive Swings. With over a decade of active trading experience, he specializes in identifying high-probability options setups that maximize risk-to-reward.

His analytical approach focuses on market structure, volume profiles, and institutional flow analysis. Freddie's ability to break down complex options strategies into actionable, easy-to-follow trade plans has helped thousands of traders level up their game.

Together with Billy, he ensures every alert comes with crystal-clear execution guidance that traders of all levels can follow with confidence.`,
    shortBio: 'Options specialist with 10+ years experience. Expert in market structure and institutional flow analysis.',
    achievements: [
      '10+ years active trading',
      'Options strategy specialist',
      'Market structure expert',
      'Institutional flow analysis'
    ]
  }
];
