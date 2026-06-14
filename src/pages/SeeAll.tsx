import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageHeader } from '../components/layout/PageHeader';
import { ChevronLeft } from 'lucide-react';

export const SeeAll: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { properties, savedProperties, toggleSave, setSelectedPropertyId } = useAppContext();

  let title = "Properties";
  let displayProperties = properties;

  if (type === 'nearby') {
    title = "Nearby Properties";
    // Mock nearby filter: rating > 4 is nearby since dummy distance isn't there
    displayProperties = properties;
  } else if (type === 'featured') {
    title = "Featured Picks";
    displayProperties = properties.filter(p => ['1', '2', '3'].includes(p.id.toString()));
  } else if (type === 'new') {
    title = "New Listings";
    displayProperties = [...properties].reverse(); // Mock new properties
  }

  return (
    <div className="flex flex-col flex-1 bg-app-bg w-full">
      <PageHeader 
        title={title}
        showBackButton={true}
        onBack={() => navigate(-1)}
      />
      <div className="w-full p-4 sm:p-6 pb-20">
        <div className="max-w-screen-xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isSaved={savedProperties.includes(property.id)}
              onToggleSave={toggleSave}
              onClick={() => {
                setSelectedPropertyId(property.id);
                navigate("/details");
              }} 
              layout="full-width-clean"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
