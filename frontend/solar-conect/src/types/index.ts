export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAnonymous?: boolean;
}

export interface Company {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  segment: string;
  products: string[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  benefits?: Benefit[];
  projects?: Project[];
  testimonials?: Testimonial[];
  differentials?: Differential[];
  socialMedia?: SocialMedia;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  capacity: string;
  savings: string;
  image: string;
  type: 'residential' | 'commercial' | 'industrial';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  rating: number;
  image: string;
}

export interface Differential {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface AnalyticData {
  id: string;
  interest: string;
  timestamp: Date;
  userId: string;
  pageVisited: string;
}

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  averageBill: string;
  message: string;
}