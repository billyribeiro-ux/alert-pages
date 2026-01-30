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

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  title: string;
  initials: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type Theme = 'dark' | 'light';
