export interface Property {
  id: number | string;
  name: string;
  loc: string; // e.g., 'Legon · 3 min to main gate'
  lat: number;
  lng: number;
  price: string; // e.g., 'GH₵5,000'
  priceNum: number;
  rating: number;
  reviews: number;
  tags: string[]; // ['wifi', 'sec', 'gen']
  category: string; // 'private campus wifi'
  avail: string;
  img: string;
  images?: string[];
  panoramas?: string[];
  desc?: string;
  amenities?: string[];
  policies?: string;
  rooms?: any[];
  videoTour?: string;
  dbId?: string;
  manager_id?: string;
  pricing_tag?: string;
}

export interface AppState {
  savedProperties: (number | string)[]; // Array of saved property IDs
  activeFilter: string; // Defaults to 'all'
}

export interface ViewState {
  currentView: 'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup' | 'virtual-tour' | 'price-alerts' | 'manager-dashboard';
  selectedPropertyId: number | string | null;
}
