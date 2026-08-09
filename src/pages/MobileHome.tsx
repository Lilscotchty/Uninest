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
  const formatPrice = (price: any) => {
    if (typeof price === 'number') return `$${price.toLocaleString()}`;
    return price || '$0';
  };

  const getLocation = (property: any) => {
    return property.location?.address || property.location || property.address || 'Unknown Location';
  };

  const getBgImage = (property: any, index: number) => {
    // Fresh, premium real estate and aesthetic apartment imagery
    const fallbacks = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop', // Modern luxury exterior
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop', // Clean apartment building facade
      'https://images.unsplash.com/photo-1493809842364-78817add7ff6?q=80&w=1000&auto=format&fit=crop', // Beautiful modern interior
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop'  // Sleek aesthetic bedroom
    ];
    return property.image || property.thumbnail || property.images?.[0] || fallbacks[index % fallbacks.length];
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
        {['Recommend', 'New', 'Nearby'].map(tab => (
          <div 
            key={tab}
            className={`tab ${activeFilter === tab ? 'active' : ''}`} 
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </div>
        ))}
      </nav>

      {/* Scrollable Cards Area */}
      <main className="cards-scroll-area">
        
        {/* Dynamic Properties from Context */}
        {properties.map((property: any, index: number) => {
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
                  <div className="price">{formatPrice(property.price)} <span>/ month</span></div>
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

        {/* Discoveries around Legon - Final Card */}
        {/* Updated with a vibrant, aesthetic neighborhood/cityscape image */}
        <div 
          className="card" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1000&auto=format&fit=crop')" }}
        >
          <div className="card-content">
            <div className="card-header">
              <h2>Discoveries<br/>around Legon</h2>
            </div>
            
            {/* Hidden block to maintain exact spatial alignment */}
            <div className="card-info" style={{ visibility: 'hidden' }}>
              <div className="price">$0 <span>/ month</span></div>
              <div className="location"><i className="fa-solid fa-location-dot mr-1"></i> None</div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-take-look" 
                onClick={() => navigate("/explore")}
              >
                Take a look
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};