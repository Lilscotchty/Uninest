import { supabase } from '../lib/supabase';
import type { Company, CompanySector } from '../types/opportunities';

export const CITY_ALIASES: Record<string, string[]> = {
  'Accra': ['Accra', 'Tema', 'Madina', 'Spintex', 'Cantonments', 'Osu', 
            'Labone', 'Haatso', 'Achimota', 'Taifa', 'Adenta', 'Kwabenya', 'Lashibi'],
  'Kumasi': ['Kumasi', 'Adum', 'Nhyiaeso', 'Suame'],
  'Takoradi': ['Takoradi', 'Sekondi', 'Effia'],
};

export async function fetchAndFilterCompaniesByProximity(
  studentCity: string,
  studentSector?: CompanySector | 'all'
): Promise<Company[]> {
  let query = supabase.from('companies').select('*');
  
  if (studentSector && studentSector !== 'all') {
    query = query.eq('sector', studentSector);
  }
  
  const { data, error } = await query;
  if (error || !data) {
    console.error('Error fetching companies:', error);
    return [];
  }

  // Transform db records to Company type
  const companiesList: Company[] = data.map((item: any) => ({
    id: item.id,
    name: item.name,
    sector: item.sector as CompanySector,
    category: item.category,
    street: item.street,
    city: item.city,
    country: item.country,
    phone: item.phone,
    website: item.website,
    googleMapsUrl: item.google_maps_url,
    rating: item.rating,
    reviewsCount: item.reviews_count,
    lat: item.lat,
    lng: item.lng,
    opportunityTypes: item.opportunity_types,
  }));

  const nearbyAreas = Object.entries(CITY_ALIASES)
    .find(([key]) => key.toLowerCase() === studentCity.toLowerCase())?.[1] 
    ?? [studentCity];

  return companiesList
    .filter(c => nearbyAreas.some(area => 
      c.city?.toLowerCase().includes(area.toLowerCase()) ||
      c.street?.toLowerCase().includes(area.toLowerCase())
    ))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export const FIELD_TO_SECTOR_MAP: Record<string, CompanySector> = {
  'computer science': 'technology',
  'information technology': 'technology',
  'software engineering': 'technology',
  'computer engineering': 'technology',
  'data science': 'technology',
  'accounting': 'finance',
  'finance': 'finance',
  'economics': 'finance',
  'banking': 'finance',
  'law': 'legal',
  'political science': 'legal',
  'paralegal studies': 'legal',
  'medicine': 'healthcare',
  'nursing': 'healthcare',
  'pharmacy': 'healthcare',
  'public health': 'healthcare',
  'biomedical science': 'healthcare',
  'civil engineering': 'construction',
  'architecture': 'construction',
  'quantity surveying': 'construction',
  'electrical engineering': 'electrical',
  'mechatronics': 'electrical',
  'telecommunications': 'electrical',
  'communication studies': 'public_relations',
  'marketing': 'public_relations',
  'journalism': 'public_relations',
  'public relations': 'public_relations',
  'tourism': 'tourism',
  'hospitality management': 'tourism',
  'hotel management': 'tourism',
};

export function getSectorForField(fieldOfStudy: string): CompanySector | null {
  const normalised = fieldOfStudy.toLowerCase().trim();
  return FIELD_TO_SECTOR_MAP[normalised] 
    ?? Object.entries(FIELD_TO_SECTOR_MAP)
         .find(([key]) => normalised.includes(key))?.[1] 
    ?? null;
}
