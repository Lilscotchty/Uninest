import React from 'react';
import { Property } from '../types';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatPrice } from '../lib/formatPrice';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const { recordView } = useRecentlyViewed();

  const handleCardClick = () => {
    recordView({
      id: property.id.toString(),
      name: property.name,
      image_url: property.img,
      location: property.loc,
      price: property.priceNum,
      viewedAt: Date.now(),
    });
    onClick();
  };

  return (
    <div 
      onClick={handleCardClick}
      // shrink-0 prevents squishing, snap-start creates the carousel feel
      className="w-72 h-72 shrink-0 snap-start flex flex-col bg-card-bg rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="w-full h-2/3 overflow-hidden bg-slate-100">
        <img 
          src={property.img} 
          alt={property.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="w-full h-1/3 p-5 flex flex-col justify-center">
        <h3 className="font-bold text-text-primary text-lg whitespace-nowrap overflow-hidden text-ellipsis">
          {property.name}
        </h3>
        <div className="text-base font-semibold text-text-muted mt-1">
          {formatPrice(property.priceNum, property.pricing_tag || '/sem')}
        </div>
      </div>
    </div>
  );
};