import React, { useState } from 'react';
import './MobileHome.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, SlidersHorizontal, Bookmark, Circle } from 'lucide-react';

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
    const fallbacks = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop'
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
        <Circle size={10} fill="currentColor" className="mr-1" /> Skycobe
      </div>

      {/* Header */}
      <header>
        <div className="title-wrapper">
          <div className="accent-line"></div>
          <h1>Find<br/>Apartments</h1>
        </div>
        <button className="filter-btn" onClick={() => navigate("/explore")}>
          <SlidersHorizontal size={20} className="text-text-dark" />
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
                    <MapPin size={14} className="mr-1" /> {getLocation(property)}
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
                    <Bookmark 
                      size={20} 
                      fill={isSaved ? "currentColor" : "none"} 
                      color={isSaved ? "var(--text-dark)" : "white"} 
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Discoveries around Legon - Final Card */}
        <div 
          className="card" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop')" }}
        >
          <div className="card-content">
            <div className="card-header">
              <h2>Discoveries<br/>around Legon</h2>
            </div>
            
            {/* Hidden block to maintain exact spatial alignment */}
            <div className="card-info" style={{ visibility: 'hidden' }}>
              <div className="price">$0 <span>/ month</span></div>
              <div className="location"><MapPin size={14} className="mr-1" /> None</div>
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

      {/* Floating Navigation Bar */}
      <div className="fixed-nav-wrapper">
        <nav className="nav-bar">
          <div className="nav-inner">
            
            {/* Item 1: Home */}
            <button 
              className={`nav-item ${activeNav === 'Home' ? 'active' : ''}`} 
              onClick={() => setActiveNav('Home')}
            >
              <svg 
                width="18" height="18" viewBox="0 0 24 24" 
                fill={activeNav === 'Home' ? 'currentColor' : 'none'}
                stroke={activeNav === 'Home' ? 'none' : 'currentColor'}
                strokeWidth={activeNav === 'Home' ? '0' : '1.8'}
              >
                <path d="M12 2.5a2.5 2.5 0 00-1.6.58l-6.5 5.3A2.5 2.5 0 003 10.3V18a3 3 0 003 3h12a3 3 0 003-3v-7.7a2.5 2.5 0 00-.9-1.92l-6.5-5.3a2.5 2.5 0 00-1.6-.58z"></path>
                <rect 
                  x="9.5" y="14" width="5" height="2" rx="1" 
                  fill="var(--nav-active-bg)" 
                  style={{ display: activeNav === 'Home' ? 'block' : 'none' }}
                ></rect>
              </svg>
              <span className="nav-text">Home</span>
            </button>

            {/* Item 2: Map/Discover */}
            <button 
              className={`nav-item ${activeNav === 'Discover' ? 'active' : ''}`} 
              onClick={() => {
                setActiveNav('Discover');
                navigate("/virtual-tour");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span className="nav-text">Maps</span>
            </button>

            {/* Item 3: Saved */}
            <button 
              className={`nav-item ${activeNav === 'Saved' ? 'active' : ''}`} 
              onClick={() => setActiveNav('Saved')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="nav-text">Saved</span>
            </button>

            {/* Item 4: Profile */}
            <button 
              className={`nav-item ${activeNav === 'Profile' ? 'active' : ''}`} 
              onClick={() => setActiveNav('Profile')}
            >
              <img 
                src="https://i.pravatar.cc/100" 
                alt="Profile" 
                style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span className="nav-text">Profile</span>
            </button>
          </div>
        </nav>

        {/* Floating Action Button (FAB) */}
        <button className="fab" onClick={() => navigate("/price-alerts")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};