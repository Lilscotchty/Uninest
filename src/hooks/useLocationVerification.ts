// Note on CORS & Proxy Architecture for Production:
// In a true web production environment, browsers enforce CORS (Cross-Origin Resource Sharing).
// Directly calling external APIs (like 'https://ghanapostgps.sperixlabs.org/get-location') 
// from the frontend often results in CORS errors because the API may not whitelist your origin.
// To bypass this, you should route this fetch request through your own backend proxy 
// (e.g., a Node.js Express server, Next.js API route, or a serverless function like AWS Lambda/Cloudflare Workers).
// Your frontend would call your proxy (e.g., POST /api/verify-location), and your proxy 
// (not restricted by CORS) would make the actual request to the Ghana Post GPS server 
// and forward the response back to your client.

import { useState } from 'react';

export type VerificationState = 'IDLE' | 'VERIFYING' | 'SUCCESS' | 'ERROR';

export interface LocationData {
  lat: number;
  lng: number;
  region: string;
  district: string;
  streetName: string;
}

export const useLocationVerification = () => {
  const [status, setStatus] = useState<VerificationState>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const verifyAddress = async (address: string) => {
    // Regex check
    const formatRegex = /^[A-Z]{2}-\d{3,4}-\d{4}$/;
    if (!formatRegex.test(address)) {
      setStatus('ERROR');
      setErrorMsg('Invalid Format. Expected e.g. GM-765-7484');
      setLocationData(null);
      return null;
    }

    try {
      setStatus('VERIFYING');
      setErrorMsg('');
      
      const res = await fetch('https://ghanapostgps.sperixlabs.org/get-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ address }),
      });

      if (!res.ok) {
        throw new Error('Network Error');
      }

      const data = await res.json();
      
      if (!data) throw new Error('Network Error');
      
      const target = data?.Table?.[0] || data;
      const lat = target?.CenterLatitude || target?.centerLatitude;
      const lng = target?.CenterLongitude || target?.centerLongitude;
      const region = target?.Region || target?.region || 'Unknown Region';
      const district = target?.District || target?.district || 'Unknown District';
      const streetName = target?.StreetName || target?.streetName || '';

      if (lat && lng) {
        setStatus('SUCCESS');
        const newLocationInfo = { lat: parseFloat(lat), lng: parseFloat(lng), region, district, streetName };
        setLocationData(newLocationInfo);
        return newLocationInfo;
      } else {
        setStatus('ERROR');
        setErrorMsg('Address Not Found');
        setLocationData(null);
        return null;
      }

    } catch (err: any) {
      setStatus('ERROR');
      if (err.message === 'Network Error') {
        setErrorMsg('Network Error. Please try again later.');
      } else {
        setErrorMsg('Verification failed. Please check the address.');
      }
      setLocationData(null);
      return null;
    }
  };

  const reset = () => {
    setStatus('IDLE');
    setErrorMsg('');
    setLocationData(null);
  };

  return { verifyAddress, status, errorMsg, locationData, reset };
};
