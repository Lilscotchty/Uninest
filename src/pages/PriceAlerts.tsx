import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { ChevronLeft, Bell, Plus, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';

export const PriceAlerts: React.FC = () => {
  const { setCurrentView, showToast, user } = useAppContext();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([
    { id: 1, loc: 'Legon Campus', maxPrice: 4000, active: true },
    { id: 2, loc: 'Madina Area', maxPrice: 3000, active: false }
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
    const isActivating = alerts.find(a => a.id === id)?.active === false;
    showToast(isActivating ? 'Alert activated' : 'Alert paused');
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-app-bg font-sans">
      <PageHeader 
        title="Price Alerts"
        showBackButton={true}
        onBack={() => navigate("/student/dashboard")}
      />

      <div className="w-full pb-20">
        <div className="max-w-screen-md mx-auto w-full px-5 py-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-light text-teal-600 rounded-[20px] flex items-center justify-center mx-auto mb-4">
              <Bell size={32} />
          </div>
          <h2 className="text-[1.5rem] font-bold text-text-primary mb-2">Never Miss a Drop</h2>
          <p className="text-[0.9rem] text-text-muted">Set up alerts to get notified instantly when the perfect room hits your dream price.</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-text-primary text-[1.1rem]">Your Alerts</h3>
          <button 
             className="text-teal-600 font-bold text-[0.8rem] flex items-center gap-1 active:opacity-70"
             onClick={() => setIsAdding(!isAdding)}
          >
            <Plus size={16} /> New Alert
          </button>
        </div>

        {isAdding && (
          <div className="bg-card-bg rounded-[18px] border border-teal-200 p-4 mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col gap-3">
              <input 
                 id="new-alert-area"
                 type="text" 
                 placeholder="Area/Property (e.g., East Legon)" 
                 className="w-full bg-app-bg border border-border-subtle rounded-xl px-3 py-2 text-[0.85rem] outline-none focus:border-teal" 
              />
              <div className="flex items-center gap-2">
                <span className="text-[0.85rem] font-semibold text-text-muted">Max: GH₵</span>
                <input 
                  id="new-alert-price"
                  type="number" 
                  placeholder="3500" 
                  className="w-full max-w-[100px] bg-app-bg border border-border-subtle rounded-xl px-3 py-2 text-[0.85rem] outline-none focus:border-teal" 
                />
              </div>
              <button 
                onClick={async () => {
                  setIsAdding(false); 
                  showToast('Alert created perfectly!');
                  
                  // Send Email Notification
                  const userEmail = user?.email || "pb7552212@gmail.com";
                  const areaInput = (document.getElementById('new-alert-area') as HTMLInputElement)?.value || 'Selected Area';
                  const maxPriceInput = (document.getElementById('new-alert-price') as HTMLInputElement)?.value || '0';
                  
                  try {
                    await fetch('/api/send-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: userEmail,
                        subject: `Price Alert Active: ${areaInput}`,
                        html: `<p>Hi there,</p>
                        <p>We've successfully set up your price alert.</p>
                        <p>You'll be the first to know when a property in <strong>${areaInput}</strong> drops below GH₵<strong>${maxPriceInput}</strong> / sem.</p>
                        <p>Keep an eye on this inbox!</p>`
                      })
                    });
                  } catch (e) {
                    console.error("Email error:", e);
                  }

                }}
                className="bg-teal text-white font-bold py-2.5 rounded-xl shadow-sm mt-2 text-[0.85rem] active:scale-[0.98]"
              >
                Save Alert
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-card-bg rounded-[18px] p-4 border-transparent border shadow-sm flex items-center justify-between">
              <div>
                <strong className="block text-[1rem] font-bold text-text-primary mb-0.5">{alert.loc}</strong>
                <span className="text-[0.8rem] text-text-muted font-medium">Under GH₵{alert.maxPrice.toLocaleString()} / sem</span>
              </div>
              
              <button 
                onClick={() => handleToggle(alert.id)}
                className={`w-[50px] h-[30px] rounded-full relative transition-colors duration-300 ${alert.active ? 'bg-teal' : 'bg-slate-200'}`}
              >
                <div className={`w-[22px] h-[22px] bg-[var(--color-surface)] rounded-full absolute top-[4px] shadow-sm transition-all duration-300 flex items-center justify-center ${alert.active ? 'left-[24px]' : 'left-[4px]'}`}>
                  {alert.active && <Check size={12} className="text-teal" />}
                </div>
              </button>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};
