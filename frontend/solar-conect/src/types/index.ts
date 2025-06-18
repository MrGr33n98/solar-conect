// Redefined User to match backend JWT/API response
export interface User {
  id: string; // Changed from uid
  name: string; // Changed from displayName
  email: string;
  role: string;
  // photoURL and isAnonymous are removed as they are not part of the new backend user structure
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
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean; // Renamed from loading to avoid conflict
  login: (email: string, password: string) => Promise<boolean>; // Returns true on success
  logOut: () => void;
  // signInWithGoogle and signInWithLinkedIn are removed for now to focus on JWT auth
  // userId can be derived from user.id if needed
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  averageBill: string;
  message: string;
}