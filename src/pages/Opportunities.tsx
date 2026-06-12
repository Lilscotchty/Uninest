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
    <div className="flex flex-col h-screen bg-app-bg">
      <PageHeader 
        title="Opportunities Hub" 
        actions={[{
          label: "Back",
          icon: <ChevronLeft />,
          onClick: () => navigate(-1)
        }]}
      />

      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
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
          <div className="flex-1 relative flex flex-col h-full bg-app-bg px-4 pb-20 pt-4">
            <div className="absolute top-6 right-6 z-10">
              <button 
                onClick={() => setShowLocationPrompt(true)}
                className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-text-primary text-[0.75rem] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <Target size={12} /> {location.value}
              </button>
            </div>

            {filteredCompanies.length > 0 ? (
              <>
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-slate-800 text-[0.75rem] font-bold px-3 py-1.5 rounded-full">
                    {filteredCompanies.length} result{filteredCompanies.length === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="flex-1 w-full h-full pb-[10px]">
                  <OpportunitiesMap 
                    companies={filteredCompanies} 
                    location={location} 
                    onCompanySelect={setSelectedCompany} 
                  />
                </div>
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
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Search size={28} />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">No companies found</h4>
                <p className="text-[0.9rem] text-text-muted max-w-sm mb-6">
                  We didn't find any companies for "{selectedSector !== 'all' ? selectedSector : 'this sector'}" in {location.resolvedCity || location.value}.
                </p>
                <button 
                  onClick={() => setShowLocationPrompt(true)}
                  className="px-6 py-2.5 bg-card-bg border border-border-subtle text-text-primary font-bold text-[0.85rem] rounded-[16px] hover:bg-slate-100 transition-colors"
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
              // Only allow dismiss if a location has already been set
              if (location) {
                setShowLocationPrompt(false);
              }
            }}
          />
        )}
      </div>

      <Toast />
    </div>
  );
};
