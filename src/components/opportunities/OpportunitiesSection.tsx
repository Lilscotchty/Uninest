import React, { useState, useEffect } from 'react';
import { Target, Search, ArrowRight, Briefcase } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { LocationInputModal } from './LocationInputModal';
import { SectorFilterBar } from './SectorFilterBar';
import { OpportunitiesMap } from './OpportunitiesMap';
import { CompanyPopupCard } from './CompanyPopupCard';
import { companies, filterCompaniesByProximity, getSectorForField } from '../../data/companiesLoader';
import type { Company, CompanySector, StudentLocation } from '../../types/opportunities';

export const OpportunitiesSection: React.FC = () => {
  const { user, showToast } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [location, setLocation] = useState<StudentLocation | null>(null);
  const [selectedSector, setSelectedSector] = useState<CompanySector | 'all'>('all');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Initialize from field of study if location is available
  useEffect(() => {
    if (isExpanded && !location) {
      setShowLocationPrompt(true);
    }
  }, [isExpanded, location]);

  useEffect(() => {
    if (location) {
      const fieldOfStudy = user?.user_metadata?.programme || 'computer science'; // fallback for demo
      const autoSector = getSectorForField(fieldOfStudy);
      if (autoSector && selectedSector === 'all') {
        setSelectedSector(autoSector);
      }
    }
  }, [location, selectedSector, user?.user_metadata?.programme]);

  useEffect(() => {
    if (location && location.resolvedCity) {
      const results = filterCompaniesByProximity(companies, location.resolvedCity, selectedSector);
      setFilteredCompanies(results);
    }
  }, [location, selectedSector]);

  const handleOpenFind = () => {
    setIsExpanded(true);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirections = (mapsUrl: string) => {
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-card-bg rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-transparent border overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="px-5 py-4 border-b border-border-subtle bg-app-bg/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase size={16} />
          </div>
          <div>
            <h3 className="text-[1rem] font-bold text-text-primary leading-tight">Opportunities Near You</h3>
            <p className="text-[0.75rem] text-text-muted mt-0.5">Discover attachment & job opportunities in your area.</p>
          </div>
        </div>
        {!isExpanded && (
          <button 
            onClick={handleOpenFind}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] text-white text-[0.8rem] font-bold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Find <ArrowRight size={14} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col relative w-full h-[550px] bg-app-bg/30">
          {location && (
            <SectorFilterBar 
              selectedSector={selectedSector} 
              onSelect={(sector) => {
                setSelectedSector(sector);
                setSelectedCompany(null);
              }} 
            />
          )}

          {location ? (
            <div className="flex-1 relative px-4 pb-4">
              <div className="absolute top-2 right-6 z-10">
                <button 
                  onClick={() => setShowLocationPrompt(true)}
                  className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-text-primary text-[0.75rem] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Target size={12} /> {location.value}
                </button>
              </div>

              {filteredCompanies.length > 0 ? (
                <>
                  <div className="absolute top-2 left-6 z-10">
                    <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-slate-800 text-[0.75rem] font-bold px-3 py-1.5 rounded-full">
                      {filteredCompanies.length} result{filteredCompanies.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <OpportunitiesMap 
                    companies={filteredCompanies} 
                    location={location} 
                    onCompanySelect={setSelectedCompany} 
                  />
                  {selectedCompany && (
                    <CompanyPopupCard 
                      company={selectedCompany}
                      onCall={handleCall}
                      onWebsite={handleWebsite}
                      onDirections={handleDirections}
                      onBookmark={() => showToast(`${selectedCompany.name} added to bookmarks!`)}
                      onDismiss={() => setSelectedCompany(null)}
                    />
                  )}
                </>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Search size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary mb-2">No companies found</h4>
                  <p className="text-[0.9rem] text-text-muted max-w-sm mb-6">
                    We didn't find any companies for "{selectedSector !== 'all' ? selectedSector : 'this sector'}" in {location.resolvedCity || location.value}.
                  </p>
                  <button 
                    onClick={() => setShowLocationPrompt(true)}
                    className="px-6 py-2.5 bg-card-bg border border-border-subtle text-text-primary font-bold text-[0.85rem] rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Try a different location
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {showLocationPrompt && (
            <LocationInputModal 
              onSave={(loc) => {
                setLocation(loc);
                setShowLocationPrompt(false);
              }}
              onDismiss={() => {
                setShowLocationPrompt(false);
                if (!location) setIsExpanded(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
