import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocationVerification, LocationData } from '../hooks/useLocationVerification';

const customMarkerIcon = new L.DivIcon({
  html: `<div style="width: 20px; height: 20px; background-color: #2596be; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface LocationInputProps {
  address: string;
  setAddress: (address: string) => void;
  onVerifySuccess: (data: LocationData | null) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ address, setAddress, onVerifySuccess }) => {
  const { verifyAddress, status, errorMsg, locationData, reset } = useLocationVerification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Auto insert dash after typing 2 letters
    if (rawValue.length === 2 && !rawValue.includes('-')) {
        rawValue += '-';
    }
    // Prevent more than 2 dashes
    const parts = rawValue.split('-');
    if (parts.length > 3) {
      rawValue = parts.slice(0, 3).join('-');
    }
    
    setAddress(rawValue);
    if (status !== 'IDLE') {
       reset();
       onVerifySuccess(null);
    }
  };

  const handleVerify = async () => {
     if (!address) return;
     const result = await verifyAddress(address);
     if (result) {
        onVerifySuccess(result);
     }
  };

  let borderClass = "border-border-subtle focus:border-[var(--color-accent)]";
  if (status === 'SUCCESS') borderClass = "border-green-500";
  if (status === 'ERROR') borderClass = "border-coral";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
         <input 
           type="text" 
           value={address}
           onChange={handleInputChange}
           className={`bg-app-bg border ${borderClass} rounded-xl px-4 py-3 text-[0.95rem] outline-none focus:ring-2 focus:ring-indigo-light transition-all w-full font-medium`}
           placeholder="GM-765-7484"
           maxLength={15}
         />
         <button
            type="button"
            onClick={handleVerify}
            disabled={status === 'VERIFYING' || !address}
            className="bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-bold whitespace-nowrap px-4 rounded-xl hover:bg-[#c7d2fe] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1.5"
         >
           {status === 'VERIFYING' ? (
              <span className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></span>
           ) : (
              <MapPin size={16} />
           )}
           {status === 'VERIFYING' ? 'Verifying' : 'Verify'}
         </button>
      </div>

      {status === 'SUCCESS' && locationData && (
        <div className="animate-in fade-in flex flex-col gap-3 mt-1">
          <div className="text-green-600 text-xs font-bold flex items-center gap-1.5 px-1 tracking-wide">
            <CheckCircle2 size={14} className="shrink-0" />
            Location Verified in {locationData.district || locationData.region}
          </div>
          
          <div className="h-[150px] w-full rounded-2xl overflow-hidden border border-border-subtle shadow-sm relative z-0">
            <MapContainer 
              center={[locationData.lat, locationData.lng]} 
              zoom={16} 
              className="w-full h-full z-0" 
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Marker position={[locationData.lat, locationData.lng]} icon={customMarkerIcon} />
            </MapContainer>
          </div>
          <a
            href={`https://www.google.com/maps?q=${locationData.lat},${locationData.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[var(--color-accent)] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] mt-1 hover:bg-[var(--color-accent)]-dark"
          >
            <MapPin size={16} />
            Open in Google Maps
          </a>
        </div>
      )}

      {status === 'ERROR' && (
        <div className="text-coral text-xs font-bold flex items-center gap-1.5 px-1 mt-1 animate-in fade-in tracking-wide">
           <AlertCircle size={14} className="shrink-0" />
           {errorMsg} - Try Again
        </div>
      )}
    </div>
  )
}
