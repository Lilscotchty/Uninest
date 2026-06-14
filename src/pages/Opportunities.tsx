import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, ChevronLeft, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { LocationInputModal } from '../components/opportunities/LocationInputModal';
import { SectorFilterBar } from '../components/opportunities/SectorFilterBar';
import { OpportunitiesMap } from '../components/opportunities/OpportunitiesMap';
import { CompanyPopupCard } from '../components/opportunities/CompanyPopupCard';
import { fetchAndFilterCompaniesByProximity, getSectorForField } from '../data/companiesLoader';
import type { Company, CompanySector, StudentLocation } from '../types/opportunities';
import { PageHeader } from '../components/layout/PageHeader';
import { Toast } from '../components/Toast';

export const Opportunities: React.FC = () => {
  const { user, showToast, hasPaidOpportunityHub, setHasPaidOpportunityHub } = useAppContext();
  const navigate = useNavigate();
  
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      if (location && location.resolvedCity) {
        setIsLoading(true);
        try {
          const results = await fetchAndFilterCompaniesByProximity(location.resolvedCity, selectedSector);
          setFilteredCompanies(results);
          if (results.length > 0 && !hasPaidOpportunityHub) {
            setShowPaymentPrompt(true);
          }
        } catch (err) {
          console.error("Failed to load companies", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadCompanies();
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
    <div className="relative w-full flex-1 min-h-[100dvh] overflow-hidden bg-app-bg flex flex-col">
      <PageHeader
        title="Opportunities"
        showBackButton={true}
        onBack={() => navigate(-1)}
        rightAction={
          location && (
            <button 
              onClick={() => setShowLocationPrompt(true)}
              className="bg-[var(--color-surface)] shadow-sm rounded-full px-4 py-2 flex items-center justify-center gap-2 border border-border-subtle text-text-primary text-[0.8rem] font-bold hover:bg-slate-50 transition-colors pointer-events-auto"
            >
               <Target size={16} className="text-[var(--color-accent)]" /> 
               {location.value}
            </button>
          )
        }
      />
      
      {/* Map Background */}
      <div className="flex-1 relative z-0">
        <OpportunitiesMap 
          companies={filteredCompanies} 
          location={location} 
          onCompanySelect={(c) => {
            if (!hasPaidOpportunityHub) {
              setShowPaymentPrompt(true);
            } else {
              setSelectedCompany(c);
            }
          }} 
        />

        {/* Sector Filters & Results Overlay */}
        <div className="absolute top-0 left-0 w-full z-10 p-4 sm:p-5 flex flex-col pointer-events-none">
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

          {location && filteredCompanies.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-card-bg/90 backdrop-blur rounded-full px-3 py-1.5 self-start shadow-[0_2px_10px_rgba(0,0,0,0.1)] pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
              <span className="text-[0.7rem] sm:text-[0.75rem] font-bold text-[var(--color-accent)]">{filteredCompanies.length} result{filteredCompanies.length === 1 ? '' : 's'} found</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="absolute inset-0 z-[20] bg-app-bg flex flex-col md:flex-row pointer-events-none">
          {/* List View Skeleton (Desktop) */}
          <div className="hidden md:flex flex-col w-[40%] lg:w-[35%] h-full p-4 border-r border-border-subtle bg-card-bg shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full animate-pulse bg-slate-200"></div>
              <div className="flex-1 h-11 rounded-xl animate-pulse bg-slate-200"></div>
            </div>
            <div className="flex gap-2 mb-6 overflow-hidden">
               {[1, 2, 3].map(i => <div key={i} className="w-20 h-8 rounded-full animate-pulse bg-slate-200"></div>)}
            </div>
            <div className="space-y-4 flex-1 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-[140px] animate-pulse bg-slate-200 rounded-[20px]"></div>
              ))}
            </div>
          </div>
          
          {/* Map View Skeleton */}
          <div className="flex-1 h-full relative bg-[#e5e5e5] overflow-hidden">
            {/* Map UI Elements Skeletons */}
            <div className="absolute top-4 left-4 right-4 md:hidden flex justify-between">
               <div className="w-11 h-11 rounded-full animate-pulse bg-slate-300"></div>
               <div className="w-32 h-11 rounded-full animate-pulse bg-slate-300"></div>
            </div>
            
            {/* Map marker skeletons */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-10 h-10 bg-slate-400/40 rounded-full animate-ping"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${15 + Math.random() * 70}%`,
                  animationDuration: `${1.5 + Math.random()}s`
                }}
              ></div>
            ))}
            
            {/* List View Skeleton (Mobile bottom drawer) */}
            <div className="md:hidden absolute bottom-0 left-0 w-full h-[50vh] bg-app-bg rounded-t-[32px] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 w-40 animate-pulse bg-slate-200 rounded-md mb-6"></div>
              <div className="space-y-4 overflow-hidden">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="w-full h-[120px] animate-pulse bg-slate-200 rounded-[20px]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results Fallback Overlay */}
      {!isLoading && location && filteredCompanies.length === 0 && (
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
              className="px-6 py-2.5 bg-[#1c1c1e] text-white font-bold text-[0.85rem] rounded-full hover:bg-[var(--color-button-hover)] transition-colors w-full"
            >
              Try a different location
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentPrompt && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => navigate(-1)} />
          <div className="relative bg-[var(--color-card-bg)] shadow-2xl rounded-3xl p-6 md:p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-accent-muted)] text-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Unlock Opportunity Hub</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              We found <b>{filteredCompanies.length}</b> opportunities near you! Pay a one-time fee of <b>GH₵ 5.00</b> to unlock company names, exact locations, and direct contact details.
            </p>
            
            <button 
              onClick={() => {
                setIsProcessingPayment(true);
                setTimeout(() => {
                  setHasPaidOpportunityHub(true);
                  setIsProcessingPayment(false);
                  setShowPaymentPrompt(false);
                  showToast("Payment Successful! Opportunity Hub unlocked.");

                  // Simulate rewarding referrer if this user was referred
                  if (user && user.user_metadata?.referred_by) {
                     const referrerCode = user.user_metadata.referred_by;
                     console.log(`Referrer with code ${referrerCode} earned 1 GHC!`);
                     
                     // In our mock, the referralCode is `user.id.substring(0, 8).toUpperCase()`. 
                     // We can't trivially find user.id from the code if we don't have a DB query.
                     // But if the user is using the app locally in one browser, we can just save it 
                     // using the referralCode as a key as a hacky way to mock it across tabs.
                     // A real app would query: UPDATE profiles SET cash = cash + 1 WHERE referral_code = referrerCode
                     const currentCash = Number(localStorage.getItem(`cash_by_code_${referrerCode}`) || '0');
                     localStorage.setItem(`cash_by_code_${referrerCode}`, (currentCash + 1).toString());
                     
                     const refs = JSON.parse(localStorage.getItem(`referees_by_code_${referrerCode}`) || '[]');
                     refs.push({ name: user.user_metadata.full_name || 'Referred Friend', status: 'Completed', date: new Date().toLocaleDateString(), amount: 1 });
                     localStorage.setItem(`referees_by_code_${referrerCode}`, JSON.stringify(refs));
                  }
                }, 1500);
              }}
              disabled={isProcessingPayment}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-[var(--color-accent-hover)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-wait mb-3"
            >
              {isProcessingPayment ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Pay GH₵ 5.00 Now"}
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-2"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Selected Company Map Card Popup */}
      {selectedCompany && hasPaidOpportunityHub && (
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
