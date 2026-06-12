import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { Company, CompanySector, StudentLocation } from '../../types/opportunities';

const SECTOR_COLORS: Record<CompanySector, string> = {
  technology:       '#3B82F6', // blue
  finance:          '#10B981', // emerald
  legal:            '#8B5CF6', // purple
  healthcare:       '#EF4444', // red
  construction:     '#F59E0B', // amber
  electrical:       '#FACC15', // yellow
  public_relations: '#EC4899', // pink
  tourism:          '#06B6D4', // cyan
};

const getSectorIcon = (sector: CompanySector) => {
  const color = SECTOR_COLORS[sector] || '#333';
  return new L.DivIcon({
    className: 'custom-company-marker',
    html: `
      <div style="position:relative;width:24px;height:24px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;border-radius:50%;background:white;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createClusterCustomIcon = function (cluster: any) {
  return new L.DivIcon({
    html: `<div style="background-color: #1c1c1e; color: white; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-weight: 700; font-size: 14px; font-family: var(--font-sans); transform: scale(1); transition: transform 0.2s;">
      ${cluster.getChildCount()}
    </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true, duration: 0.5 });
    }
  }, [center, map]);
  return null;
};

interface OpportunitiesMapProps {
  companies: Company[];
  location: StudentLocation | null;
  onCompanySelect: (company: Company) => void;
}

export const OpportunitiesMap: React.FC<OpportunitiesMapProps> = ({ 
  companies, location, onCompanySelect 
}) => {
  const centerLat = location?.resolvedLat || 5.6037;
  const centerLng = location?.resolvedLng || -0.1870;

  return (
    <div className="absolute inset-0 z-0 bg-[#e5e5e5]">
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={13} 
        className="w-full h-full !z-0" 
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2"
          attribution="Google Maps"
          maxZoom={20}
          maxNativeZoom={19}
        />
        <MapUpdater center={location ? [location.resolvedLat || centerLat, location.resolvedLng || centerLng] : null} />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
        >
          {companies.map(company => {
             if (!company.lat || !company.lng) return null;
             return (
               <Marker 
                 key={company.id}
                 position={[company.lat, company.lng]} 
                 icon={getSectorIcon(company.sector)} 
                 eventHandlers={{ click: () => { 
                   onCompanySelect(company);
                 } }}
               />
             );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
