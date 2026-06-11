export type CompanySector = 
  | 'technology' 
  | 'finance' 
  | 'legal' 
  | 'healthcare' 
  | 'construction' 
  | 'electrical' 
  | 'public_relations' 
  | 'tourism';

export type OpportunityType = 'attachment' | 'internship' | 'job';

export interface Company {
  id: string;
  name: string;
  sector: CompanySector;
  category: string;
  street?: string;
  city?: string;
  country: string;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  lat?: number;
  lng?: number;
  opportunityTypes: OpportunityType[];
}

export interface StudentLocation {
  type: 'gps' | 'community';
  value: string;
  resolvedCity?: string;
  resolvedLat?: number;
  resolvedLng?: number;
  savedAt: string;
}

export interface BookmarkedCompany {
  companyId: string;
  savedAt: string;
  notes?: string;
}
