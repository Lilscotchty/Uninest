import React, { useState } from 'react';
import './MobileHome.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const MobileHome: React.FC = () => {
  const { activeFilter, setActiveFilter, savedProperties, toggleSave, setSelectedPropertyId, properties } = useAppContext();
  const navigate = useNavigate();
  
  // Navigation State
  const [activeNav, setActiveNav] = useState('Home');

  // Helper to format property data safely
  const formatPrice = (property: any) => {
    if (typeof property.priceNum === 'number') return `GH₵${property.priceNum.toLocaleString()}`;
    return property.price || 'GH₵0';
  };

  const getPricingTag = (property: any) => {
    if (property.pricing_tag) return property.pricing_tag;
    return '/sem';
  };

  const getLocation = (property: any) => {
    return property.loc || property.location?.address || property.location || property.address || 'Unknown Location';
  };

  const getBgImage = (property: any, index: number) => {
    const fallbacks = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop'
    ];
    return property.img || property.image || property.thumbnail || property.images?.[0] || fallbacks[index % fallbacks.length];
  };

  // Replace spaces with line breaks for the stylistic headers
  const formatTitle = (title: string) => {
    const words = (title || 'Beautiful Apartment').split(' ');
    if (words.length > 1) {
      return <>{words[0]}<br/>{words.slice(1).join(' ')}</>;
    }
    return title;
  };

  return (
    <div className="app-container">
      {/* Brand top center */}
      <div className="top-brand">
        <i className="fa-solid fa-circle"></i> Skycobe
      </div>

      {/* Header */}
      <header>
        <div className="title-wrapper">
          <div className="accent-line"></div>
          <h1>Find<br/>Apartments</h1>
        </div>
        <button className="filter-btn" onClick={() => navigate("/explore")}>
          <i className="fa-solid fa-sliders text-text-dark text-xl"></i>
        </button>
      </header>

      {/* Tabs - Wired to your Context */}
      <nav className="nav-tabs">
        {['Recommend', 'New', 'Nearby'].map(tab => {
          const isActive = activeFilter === tab || (activeFilter === 'all' && tab === 'Recommend');
          return (
          <div 
            key={tab}
            className={`tab ${isActive ? 'active' : ''}`} 
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </div>
          );
        })}
      </nav>

      {/* Scrollable Cards Area */}
      <main className="cards-scroll-area">
        
        {/* Dynamic Properties from Context */}
        {properties
          .filter(property => {
            const effectiveFilter = activeFilter === 'all' ? 'Recommend' : activeFilter;
            if (effectiveFilter === 'Recommend') return property.rating >= 4.5 || property.category?.toLowerCase().includes('premium');
            if (effectiveFilter === 'Nearby') return property.loc?.includes('min') || property.loc?.toLowerCase().includes('legon') || property.loc?.toLowerCase().includes('near');
            if (effectiveFilter === 'New') return Number(property.id) > 3;
            return true; // Fallback for unmatched filters
          })
          .map((property: any, index: number) => {
          const isSaved = savedProperties.includes(property.id);
          
          return (
            <div 
              key={property.id} 
              className="card" 
              style={{ backgroundImage: `url(${getBgImage(property, index)})` }}
            >
              <div className="card-content">
                <div className="card-header">
                  <h2>{formatTitle(property.title || property.name)}</h2>
                </div>
                
                <div className="card-info">
                  <div className="price">{formatPrice(property)} <span>{getPricingTag(property)}</span></div>
                  <div className="location">
                    <i className="fa-solid fa-location-dot mr-1"></i> {getLocation(property)}
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="btn-take-look" 
                    onClick={() => {
                      setSelectedPropertyId(property.id);
                      navigate("/details");
                    }}
                  >
                    Take a look
                  </button>
                  <button 
                    className={`btn-bookmark card-bookmark ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(property.id);
                    }}
                  >
                    <i className={isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      </main>
    </div>
  );
};