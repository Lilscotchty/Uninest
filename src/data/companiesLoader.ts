import type { Company, CompanySector, OpportunityType } from '../types/opportunities';

import itData from './it_sector.json';
import buildData from './construction.json';
import elecData from './electrical.json';
import lawData from './law_firm.json';
import medData from './medicine.json';
import travelData from './travel_and_tour.json';

// Utility to transform raw JSON data into Company array
function transformData(rawData: any[], sector: CompanySector): Company[] {
  return rawData.map((item: any, index: number) => ({
    id: `${sector}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    name: item.title || 'Unknown Company',
    sector,
    category: item.categoryName || sector,
    street: item.street || undefined,
    city: item.city || undefined,
    country: item.countryCode || 'GH',
    phone: item.phone || undefined,
    website: item.website || undefined,
    googleMapsUrl: item.url || undefined,
    rating: item.totalScore || undefined,
    reviewsCount: item.reviewsCount || undefined,
    lat: item.location?.lat,
    lng: item.location?.lng,
    opportunityTypes: ['attachment', 'internship', 'job'] as OpportunityType[],
  }));
}

export const companies: Company[] = [
  ...transformData(itData, 'technology'),
  ...transformData(buildData, 'construction'),
  ...transformData(elecData, 'electrical'),
  ...transformData(lawData, 'legal'),
  ...transformData(medData, 'healthcare'),
  ...transformData(travelData, 'tourism'),
];

const CITY_ALIASES: Record<string, string[]> = {
  'Accra': ['Accra', 'Tema', 'Madina', 'Spintex', 'Cantonments', 'Osu', 
            'Labone', 'Haatso', 'Achimota', 'Taifa', 'Adenta', 'Kwabenya', 'Lashibi'],
  'Kumasi': ['Kumasi', 'Adum', 'Nhyiaeso', 'Suame'],
  'Takoradi': ['Takoradi', 'Sekondi', 'Effia'],
};

export function filterCompaniesByProximity(
  companiesList: Company[],
  studentCity: string,
  studentSector?: CompanySector | 'all'
): Company[] {
  const nearbyAreas = Object.entries(CITY_ALIASES)
    .find(([key]) => key.toLowerCase() === studentCity.toLowerCase())?.[1] 
    ?? [studentCity];

  return companiesList
    .filter(c => nearbyAreas.some(area => 
      c.city?.toLowerCase().includes(area.toLowerCase()) ||
      c.street?.toLowerCase().includes(area.toLowerCase())
    ))
    .filter(c => !studentSector || studentSector === 'all' || c.sector === studentSector)
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
