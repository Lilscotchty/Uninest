import React from 'react';
import { Star, MapPin, Phone, Globe, Navigation, X, GraduationCap, Briefcase } from 'lucide-react';
import type { Company } from '../../types/opportunities';

interface CompanyPopupProps {
  company: Company;
  onCall: (phone: string) => void;
  onWebsite: (url: string) => void;
  onDirections: (mapsUrl: string) => void;
  onBookmark: () => void;
  onDismiss: () => void;
}

export const CompanyPopupCard: React.FC<CompanyPopupProps> = ({ 
  company, onCall, onWebsite, onDirections, onBookmark, onDismiss 
}) => {
  return (
    <div className="absolute bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] z-50 bg-card-bg rounded-[24px] shadow-float border border-border-subtle p-5 animate-in slide-in-from-bottom-6 duration-300">
      <button 
        onClick={onDismiss}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-app-bg text-text-muted hover:text-text-primary transition-colors"
      >
        <X size={18} />
      </button>

      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="pr-10">
          <h3 className="text-[1.1rem] font-bold text-text-primary leading-tight tracking-tight mb-1">
            {company.name}
          </h3>
          <div className="flex items-center gap-2 text-[0.8rem] font-medium text-text-muted mb-2">
            {company.rating && (
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded pl-1">
                <Star size={12} fill="currentColor" />
                {company.rating.toFixed(1)} 
                <span className="text-text-muted ml-0.5 font-medium">({company.reviewsCount})</span>
              </span>
            )}
            {company.rating && <span className="w-1 h-1 rounded-full bg-border-subtle" />}
            <span className="capitalize">{company.category || company.sector}</span>
          </div>
          
          <div className="flex items-start gap-1.5 text-[0.85rem] text-text-muted">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span className="leading-snug">{company.street || company.city}, {company.city}</span>
          </div>
        </div>

        {/* Opportunities Row */}
        <div className="bg-app-bg rounded-[12px] p-3 mt-1 border border-border-subtle border-dashed">
          <p className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-2">Opportunities</p>
          <div className="flex flex-wrap gap-2">
            {company.opportunityTypes.includes('attachment') && (
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-[6px] text-[0.75rem] font-bold">
                <GraduationCap size={12} /> Attachment
              </span>
            )}
            {company.opportunityTypes.includes('internship') && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-[6px] text-[0.75rem] font-bold">
                <Briefcase size={12} /> Internship
              </span>
            )}
            {company.opportunityTypes.includes('job') && (
              <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-[6px] text-[0.75rem] font-bold">
                <Briefcase size={12} /> Job
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          {company.phone && (
            <button
              onClick={() => onCall(company.phone!)}
              className="flex-1 bg-slate-900 text-white font-bold text-[0.85rem] py-2.5 rounded-[12px] flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <Phone size={14} /> Call
            </button>
          )}
          {company.website && (
            <button
              onClick={() => onWebsite(company.website!)}
              className="px-4 py-2.5 bg-app-bg border border-border-subtle text-text-primary font-bold text-[0.85rem] rounded-[12px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
            >
              <Globe size={14} /> Web
            </button>
          )}
          {company.googleMapsUrl && (
            <button
              onClick={() => onDirections(company.googleMapsUrl!)}
              className="px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[0.85rem] rounded-[12px] flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
            >
              <Navigation size={14} /> Dir
            </button>
          )}
          <button
            onClick={() => onBookmark()}
            className="w-10 h-[40px] bg-amber-50 text-amber-500 font-bold text-[0.85rem] rounded-[12px] flex items-center justify-center hover:bg-amber-100 transition-colors ml-auto"
            aria-label="Bookmark Company"
          >
            <Star size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
