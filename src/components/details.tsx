import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  isSuperhost: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string; // Used to map to the correct SVG
}

export interface PropertyDetails {
  id: string;
  title: string;
  type: string; // e.g., "Student Hostel", "Apartment"
  images: string[]; // Array of image URLs for the slider
  basePrice: number; // Base price per occupant
  currency: string; // e.g., "GH₵"
  maxOccupants: number; 
  rating: number;
  reviewCount: number;
  mapEmbedUrl: string; // URL for the iframe
  amenities: Amenity[];
  host: Host;
}

export interface DetailsProps {
  propertyData: PropertyDetails;
}

export default function Details({ propertyData }: DetailsProps) {
  // Application States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [occupantsCount, setOccupantsCount] = useState(1);
  const [gender, setGender] = useState('Male');
  const [isLiked, setIsLiked] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(1);
  const [isReserving, setIsReserving] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Animation keys (React technique to force CSS animation restart)
  const [priceKey, setPriceKey] = useState(0);
  const [badgeKey, setBadgeKey] = useState(0);

  // Swipe Gesture Ref
  const touchStartY = useRef(0);

  // --- Auto-play Slider Effect ---
  useEffect(() => {
    if (!propertyData.images || propertyData.images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % propertyData.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [propertyData.images]);

  // --- Handlers ---
  const handleOccupantsSelect = (count: number) => {
    setOccupantsCount(count);
    setPriceKey((prev) => prev + 1); // Trigger price animation bump
  };

  const handleBooking = () => {
    setBookingsCount((prev) => prev + 1);
    setBadgeKey((prev) => prev + 1); // Trigger badge animation bump
    setIsReserving(true);
    
    // Reset button state after delay
    setTimeout(() => {
      setIsReserving(false);
    }, 1500);
  };

  // --- Swipe Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEndUp = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = e.changedTouches[0].screenY;
    if (touchStartY.current - touchEndY > 20) setIsPanelOpen(true);
  };

  const handleTouchEndDown = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = e.changedTouches[0].screenY;
    if (touchEndY - touchStartY.current > 20) setIsPanelOpen(false);
  };

  // Constants mapping
  const totalPrice = propertyData.basePrice * occupantsCount;

  // --- Helper to Render Amenity SVG ---
  const renderAmenityIcon = (iconName: string) => {
    switch(iconName) {
      case 'wifi':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        );
      case 'desk':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
            <path d="M22 12H2"></path>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
        );
      case 'security':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'ac':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
            <path d="M2 20h20"></path>
            <path d="M5 20V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  return (
    <div className="app-wrapper">
      
      {/* Full Screen Image Slider */}
      <div className="slider-container">
        <div className="slider-overlay"></div>
        {propertyData.images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${propertyData.title} Image ${idx + 1}`} 
            className={`slider-img ${currentImageIndex === idx ? 'active' : ''}`} 
          />
        ))}
      </div>

      {/* Background Text */}
      <div className="bg-typography">
        <div>SKY</div>
        <div>COBE</div>
      </div>

      {/* Header */}
      <header className="header">
        <button className="icon-btn" aria-label="Go Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="header-title-container">
          <h1 className="header-title">{propertyData.title}</h1>
          <span className="header-subtitle">{propertyData.type}</span>
        </div>
        <button className="icon-btn" aria-label="Saved Bookings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <div key={badgeKey} className="cart-badge price-bump">{bookingsCount}</div>
        </button>
      </header>

      {/* Floating Actions */}
      <div className="floating-actions">
        <button className="icon-btn" aria-label="Like Room" onClick={() => setIsLiked(!isLiked)}>
          <svg className={`heart-icon ${isLiked ? 'liked' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#1e1e1e' : 'none'} stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button className="icon-btn" aria-label="Share Room">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>

      {/* Primary Bottom Sheet */}
      <div className="bottom-sheet">
        <div className="row-info">
          <div>
            <div className="label">Total Price</div>
            <div key={priceKey} className="price-value price-bump">
              {propertyData.currency} {totalPrice.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="label">Select Gender</div>
            <div className="gender-options">
              <button 
                className={`gender-btn ${gender === 'Male' ? 'active' : ''}`} 
                onClick={() => setGender('Male')}
              >
                Male
              </button>
              <button 
                className={`gender-btn ${gender === 'Female' ? 'active' : ''}`} 
                onClick={() => setGender('Female')}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        <div className="occupants-selector">
          <div className="label">Number of occupants</div>
          <div className="occ-buttons">
            {Array.from({ length: propertyData.maxOccupants }, (_, i) => i + 1).map(num => (
              <button 
                key={num}
                className={`occ-btn ${occupantsCount === num ? 'active' : ''}`} 
                onClick={() => handleOccupantsSelect(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <button className="book-btn" onClick={handleBooking}>
          {isReserving ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Reserved!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Book Room
            </>
          )}
        </button>

        {/* Swipe Indicator */}
        <div 
          className="swipe-indicator" 
          onClick={() => setIsPanelOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndUp}
        >
          <span>Swipe up for amenities</span>
          <svg className="bounce-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      </div>

      {/* Secondary Details Panel */}
      <div 
        className={`panel-overlay ${isPanelOpen ? 'active' : ''}`} 
        onClick={() => setIsPanelOpen(false)}
      ></div>
      
      <div className={`details-panel ${isPanelOpen ? 'active' : ''}`}>
        
        <div 
          className="panel-header" 
          onClick={() => setIsPanelOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndDown}
        >
          <div className="drag-handle"></div>
          <h2 className="panel-title">Details & Amenities</h2>
        </div>

        <div className="panel-content">
          
          {/* Location Map */}
          <h3 className="section-title">Location</h3>
          <div className="map-container">
            <iframe 
              src={propertyData.mapEmbedUrl}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>

          {/* Amenities */}
          <h3 className="section-title">Amenities</h3>
          <div className="amenities-grid">
            {propertyData.amenities.map(amenity => (
              <div className="amenity-item" key={amenity.id}>
                {renderAmenityIcon(amenity.iconName)}
                {amenity.name}
              </div>
            ))}
          </div>

          {/* Reviews and Ratings */}
          <h3 className="section-title">Reviews</h3>
          <div className="review-card">
            <div className="rating-summary">
              <div className="rating-score">{propertyData.rating.toFixed(1)}</div>
              <div className="rating-details">
                <div className="stars">{renderStars(propertyData.rating)}</div>
                <div className="review-count">{propertyData.reviewCount} Reviews</div>
              </div>
            </div>
            <button className="write-review-btn">Write a Review</button>
          </div>

          {/* Host Profile */}
          <h3 className="section-title">Property Host</h3>
          <div className="host-card">
            <div className="host-info-wrap">
              <img src={propertyData.host.avatarUrl} alt="Host Profile" className="host-avatar" />
              <div className="host-details">
                <h4>{propertyData.host.name}</h4>
                <p>{propertyData.host.isSuperhost ? 'Superhost • ' : ''}{propertyData.host.rating.toFixed(1)} ★</p>
              </div>
            </div>
            <button className="contact-btn">Contact</button>
          </div>
          
          <div style={{ height: '30px' }}></div>

        </div>
      </div>

    </div>
  );
}