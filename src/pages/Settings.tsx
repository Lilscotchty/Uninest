import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { User, Bell, Shield, CreditCard, ChevronRight, Smartphone } from 'lucide-react';

export const Settings = () => {
  const [activeSegment, setActiveSegment] = useState('account');

  return (
    <div className="flex-1 w-full flex flex-col bg-app-bg min-h-screen">
      <PageHeader title="Settings" />
      
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-20 flex-1 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-[280px] shrink-0 bg-card-bg rounded-[20px] shadow-sm border border-border-subtle p-3 flex flex-col gap-1 hide-scrollbar overflow-x-auto md:overflow-visible">
          {[
            { id: 'account', icon: User, label: 'Account Information' },
            { id: 'security', icon: Shield, label: 'Login & Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'billing', icon: CreditCard, label: 'Payment Methods' },
            { id: 'devices', icon: Smartphone, label: 'Connected Devices' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSegment(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left w-full transition-all ${
                activeSegment === item.id 
                  ? 'bg-app-bg text-text-primary shadow-sm font-semibold border border-border-subtle' 
                  : 'text-text-secondary hover:bg-app-bg hover:text-text-primary border border-transparent'
              }`}
            >
              <item.icon size={18} className={activeSegment === item.id ? 'text-[var(--color-accent)]' : 'text-text-muted'} />
              <span className="flex-1 text-[0.95rem] whitespace-nowrap md:whitespace-normal">{item.label}</span>
              <ChevronRight size={16} className={`md:hidden ${activeSegment === item.id ? 'text-[var(--color-accent)]' : 'text-transparent'}`} />
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full bg-card-bg rounded-[20px] shadow-sm border border-border-subtle p-6 md:p-8">
          
          <div className="border-b border-border-subtle pb-6 mb-6">
            <h2 className="text-[1.3rem] font-bold text-text-primary tracking-tight">Account Information</h2>
            <p className="text-[0.9rem] text-text-muted mt-1">Update your personal details and public profile.</p>
          </div>

          <form className="flex flex-col gap-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-20 h-20 bg-[var(--color-accent-muted)] rounded-full flex items-center justify-center text-[var(--color-accent)] font-bold text-2xl border-2 border-app-bg shadow-sm">
                JD
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Profile Photo</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-app-bg border border-border-subtle rounded-lg text-[0.85rem] font-semibold text-text-primary hover:bg-border-subtle transition-colors">
                    Upload new
                  </button>
                  <button className="px-4 py-2 text-coral bg-coral-light/20 rounded-lg text-[0.85rem] font-semibold hover:bg-coral-light/40 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-bold text-text-secondary uppercase tracking-wider">First Name</label>
                <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-xl text-[0.95rem] text-text-primary focus:outline-none focus:border-[var(--color-accent)] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-bold text-text-secondary uppercase tracking-wider">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-xl text-[0.95rem] text-text-primary focus:outline-none focus:border-[var(--color-accent)] transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.85rem] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue="student@university.edu" className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-xl text-[0.95rem] text-text-primary focus:outline-none focus:border-[var(--color-accent)] transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.85rem] font-bold text-text-secondary uppercase tracking-wider">Phone Number</label>
              <input type="tel" defaultValue="+233 50 123 4567" className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-xl text-[0.95rem] text-text-primary focus:outline-none focus:border-[var(--color-accent)] transition-colors" />
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="px-8 py-3 bg-[var(--color-button)] text-white rounded-xl font-bold text-[0.95rem] shadow-sm hover:scale-[1.02] transition-transform">
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
