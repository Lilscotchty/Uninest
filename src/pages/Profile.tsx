import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, CreditCard, Bell, Shield, HelpCircle, FileText, PenLine, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';

export const Profile: React.FC = () => {
  const { showToast, setCurrentView, theme, toggleTheme } = useAppContext();

  const handleAction = (action: string) => {
    if (action === 'Log Out') {
      setCurrentView('signup');
    } else {
      showToast(`${action} action triggered`);
    }
  };

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-hidden">
      {/* Top Header */}
     <div className="bg-card-bg h-[60px] flex items-center justify-center border-b border-border-subtle relative z-10 w-full shrink-0">
  <h1 className="text-[17px] font-semibold text-text-primary tracking-tight">
    Profile
  </h1>
</div>
      <div className="flex-1 overflow-y-auto px-5 pb-[100px] flex flex-col gap-5 hide-scrollbar w-full mt-4">
        
        {/* User Identity Card */}
        <div className="bg-card-bg rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle flex items-center gap-4 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-fraunces font-bold text-2xl shrink-0 overflow-hidden border-2 border-border-subtle">
            {/* Avatar or Initials */}
            KO
          </div>
          <div className="flex flex-col flex-1 min-w-0 pr-6">
            <h2 className="font-fraunces text-lg font-bold text-text-primary truncate">Kwame Owusu</h2>
            <p className="text-[0.8rem] text-text-muted font-medium truncate mt-0.5">Level 300, University of Ghana</p>
          </div>
          <button 
            onClick={() => handleAction('Edit Profile')}
            className="absolute top-4 right-4 text-text-muted hover:text-indigo transition-colors p-2"
          >
            <PenLine size={16} />
          </button>
        </div>

        {/* Settings & Preferences */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[100ms]">
          
          {/* Account Group */}
          <div className="bg-card-bg rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle bg-app-bg/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Account</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Personal Information')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light text-indigo flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Personal Information</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-indigo transition-colors" />
              </button>
              <button onClick={() => handleAction('Payment Methods')} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-teal-light text-teal flex items-center justify-center shrink-0">
                  <CreditCard size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Payment Methods</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-teal transition-colors" />
              </button>
            </div>
          </div>

          {/* Preferences Group */}
          <div className="bg-card-bg rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle bg-app-bg/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Preferences</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Notifications')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-amber-light text-amber-glow flex items-center justify-center shrink-0">
                  <Bell size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Notifications</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-amber-glow transition-colors" />
              </button>
              <button onClick={() => handleAction('Privacy & Security')} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light text-indigo flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Privacy & Security</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-indigo transition-colors" />
              </button>
              <button onClick={() => toggleTheme()} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light/20 text-text-muted flex items-center justify-center shrink-0">
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>
          </div>

          {/* Support Group */}
          <div className="bg-card-bg rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle bg-app-bg/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Support</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Help Center')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <HelpCircle size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Help Center</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-[#d97706] transition-colors" />
              </button>
              <button onClick={() => handleAction('Terms & Policies')} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light/20 text-text-muted flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Terms & Policies</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-text-muted transition-colors" />
              </button>
            </div>
          </div>

        </div>

        {/* Logout Action */}
        <div className="mt-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[150ms]">
          <button 
            onClick={() => handleAction('Log Out')}
            className="inline-flex items-center gap-2 text-coral font-bold text-[0.95rem] py-3 px-6 rounded-full bg-coral-light/30 border border-coral-light/50 active:scale-[0.97] transition-all hover:bg-coral-light"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
};
