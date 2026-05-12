export interface Hostel {
  id: number;
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
}

export interface AppState {
  credits: number; // Defaults to 500
  savedHostels: number[]; // Array of saved hostel IDs
  activeFilter: string; // Defaults to 'all'
}

export interface ViewState {
  currentView: 'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup';
  selectedHostelId: number | null;
}
