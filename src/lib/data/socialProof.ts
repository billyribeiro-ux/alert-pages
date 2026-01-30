export interface SocialProofItem {
  name: string;
  logo?: string;
  type: 'broker' | 'media' | 'partner';
}

export const socialProofs: SocialProofItem[] = [
  { name: 'TD Ameritrade', type: 'broker' },
  { name: 'Interactive Brokers', type: 'broker' },
  { name: 'E*TRADE', type: 'broker' },
  { name: 'Schwab', type: 'broker' },
  { name: 'Webull', type: 'broker' },
  { name: 'Tastytrade', type: 'broker' }
];
