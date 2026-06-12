import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, ChevronLeft, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { LocationInputModal } from '../components/opportunities/LocationInputModal';
import { SectorFilterBar } from '../components/opportunities/SectorFilterBar';
import { OpportunitiesMap } from '../components/opportunities/OpportunitiesMap';
import { CompanyPopupCard } from '../components/opportunities/CompanyPopupCard';
import { companies, filterCompaniesByProximity, getSectorForField } from '../data/companiesLoader';
import type { Company, CompanySector, StudentLocation } from '../types/opportunities';
import { PageHeader } from '../components/layout/PageHeader';
import { Toast } from '../components/Toast';

export const Opportunities: React.FC = () => {
  const { user, showToast } = useAppContext();
  const navigate = useNavigate();
  
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [location, setLocation] = useState<StudentLocation | null>(null);
  const [selectedSector, setSelectedSector] = useState<CompanySector | 'all'>('all');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Show location prompt automatically on load if no location is set
  useEffect(() => {
    if (!location) {
      setShowLocationPrompt(true);
    }
  }, [location]);

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
    <div className="relative w-full flex-1 min-h-[100dvh] overflow-hidden bg-app-bg">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <OpportunitiesMap 
          companies={filteredCompanies} 
          location={location} 
          onCompanySelect={setSelectedCompany} 
        />
      </div>

      {/* Floating Header */}
      <div className="absolute top-0 left-0 w-full z-10 p-4 sm:p-5 flex flex-col pointer-events-none">
        <div className="flex items-start justify-between w-full mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-[#1c1c1e]/85 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 mx-3 sm:mx-4 pointer-events-auto h-11">
            <button 
              onClick={() => setShowLocationPrompt(true)}
              className="w-full bg-[var(--color-surface)]/95 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-full px-4 flex items-center justify-center gap-2 border border-black/5 h-full text-text-primary text-[0.9rem] font-bold hover:bg-slate-50 transition-colors"
            >
               <Target size={18} className="text-[var(--color-accent)]" /> 
               {location ? location.value : 'Set Your Location'}
            </button>
          </div>
        </div>

        {/* Sector Filters overlay */}
        {location && (
          <div className="pointer-events-auto mb-2">
            <SectorFilterBar 
              selectedSector={selectedSector} 
              onSelect={(sector) => {
                setSelectedSector(sector);
                setSelectedCompany(null);
              }} 
            />
          </div>
        )}

        {/* Result Badge */}
        {location && filteredCompanies.length > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-card-bg/90 backdrop-blur rounded-full px-3 py-1.5 self-start shadow-[0_2px_10px_rgba(0,0,0,0.1)] pointer-events-none transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
            <span className="text-[0.7rem] sm:text-[0.75rem] font-bold text-[var(--color-accent)]">{filteredCompanies.length} result{filteredCompanies.length === 1 ? '' : 's'} found</span>
          </div>
        )}
      </div>

      {/* No Results Fallback Overlay */}
      {location && filteredCompanies.length === 0 && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none p-4">
          <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-6 text-center animate-in fade-in duration-500 pointer-events-auto max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={28} />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-2">No companies found</h4>
            <p className="text-[0.9rem] text-text-muted max-w-sm mb-6">
              We didn't find any companies for "{selectedSector !== 'all' ? selectedSector : 'this sector'}" in {location.resolvedCity || location.value}.
            </p>
            <button 
              onClick={() => setShowLocationPrompt(true)}
              className="px-6 py-2.5 bg-[#1c1c1e] text-white font-bold text-[0.85rem] rounded-full hover:bg-black transition-colors w-full"
            >
              Try a different location
            </button>
          </div>
        </div>
      )}

      {/* Selected Company Map Card Popup */}
      {selectedCompany && (
        <div className="absolute left-4 right-4 z-[1050] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex justify-center opacity-100 translate-y-[-20px] bottom-0 pointer-events-auto">
          <div className="relative w-full max-w-[400px]">
            <button 
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-full p-1 z-30 shadow-sm"
              onClick={() => setSelectedCompany(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <CompanyPopupCard 
              company={selectedCompany}
              onCall={handleCall}
              onWebsite={handleWebsite}
              onDirections={handleDirections}
              onBookmark={() => showToast(`${selectedCompany.name} added to bookmarks!`)}
            />
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationPrompt && (
        <LocationInputModal 
          onSave={(loc) => {
            setLocation(loc);
            setShowLocationPrompt(false);
          }}
          onDismiss={() => {
            if (location) {
              setShowLocationPrompt(false);
            }
          }}
        />
      )}
      <Toast />
    </div>
  );
};
