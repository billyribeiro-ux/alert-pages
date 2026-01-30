export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'What exactly do I get with each alert?',
    answer: 'Every setup includes: exact entry price, strike and expiration for options, first/second/third profit targets, stop loss level, and video analysis explaining the trade thesis.'
  },
  {
    question: 'How much capital do I need?',
    answer: 'You can start with any account size. Each alert includes both stock and options plays. You decide how much to allocate based on your risk tolerance.'
  },
  {
    question: 'When do I receive the alerts?',
    answer: "The main video watchlist drops every Sunday night after market close. You prepare your orders for Monday's 9:30 AM open. Position updates throughout the week."
  },
  {
    question: 'Do I need to watch the market all day?',
    answer: 'No. Review Sunday night, set your orders Monday morning, then live your life. Check the dashboard for updates when convenient.'
  },
  {
    question: "What if I'm a complete beginner?",
    answer: "Perfect. The education library covers fundamentals, but real learning happens by following the trades. You'll develop skills through actual execution."
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No contracts, no commitments. Cancel through your account dashboard whenever you want. No questions asked.'
  }
];
