import { useNavigate } from "react-router-dom";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme, type ThemeMode } from '../context/ThemeContext';
import { PageHeader } from '../components/layout/PageHeader';
import { OpportunitiesSection } from '../components/opportunities/OpportunitiesSection';
import { User, CreditCard, Bell, Shield, HelpCircle, FileText, PenLine, LogOut, ChevronRight, Moon, Sun, Monitor, Maximize, Minimize, ScanLine, Settings } from 'lucide-react';

function ThemeRow() {
  const { mode, resolved, setMode } = useTheme();

  const next: Record<ThemeMode, ThemeMode> = {
    light: 'dark', dark: 'system', system: 'light',
  };

  const icons: Record<ThemeMode, React.ReactNode> = { light: <Sun size={16} />, dark: <Moon size={16} />, system: <Monitor size={16} /> };
  const labels: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' };

  return (
    <button
      type="button"
      onClick={() => setMode(next[mode])}
      className="flex items-center justify-between w-full p-4 border-b border-transparent text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--color-accent-muted)]/20 text-text-muted flex items-center justify-center shrink-0">
          <span style={{ color: 'var(--color-accent)' }}>{icons[mode]}</span>
        </div>
        <span className="text-[0.9rem] font-semibold text-[var(--color-text-primary)]">
          Appearance
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          {labels[mode]}
        </span>
        <ChevronRight size={16} className="text-[var(--color-text-disabled)]" />
      </div>
    </button>
  );
}

export const Profile: React.FC = () => {
  const { showToast, setCurrentView, isFullscreen, toggleFullscreen, user } = useAppContext();
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    if (action === 'Personal Information' || action === 'Edit Profile') {
      navigate('/edit-profile');
    } else if (action === 'Log Out') {
      import('../lib/supabase').then(({ supabase }) => {
        supabase.auth.signOut().then(() => {
          navigate("/login");
          showToast('Logged out successfully');
        });
      });
    } else {
      showToast(`${action} action triggered`);
    }
  };

  const fullName = user?.user_metadata?.full_name || 
                   `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 
                   'User';
  const role = user?.user_metadata?.account_type === 'manager' ? 'Property Manager' : 'Student';
  const levelText = user?.user_metadata?.level ? `Level ${user?.user_metadata?.level} ` : '';
  const university = user?.user_metadata?.university || 'University of Ghana, Legon';
  const email = user?.email || '';

  return (
    <div className="w-full flex-1 flex flex-col bg-app-bg font-sans relative">
      <PageHeader 
        showBackButton={true}
        onBack={() => navigate(-1)}
        actions={[
          {
            icon: <ScanLine size={22} strokeWidth={1.8} />,
            label: "Scan",
            onClick: () => showToast('Scan action triggered'),
          },
          {
            icon: <Settings size={22} strokeWidth={1.8} />,
            label: "Settings",
            onClick: () => showToast('Settings action triggered'),
          },
        ]}
      />

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-[100px] md:pb-12 flex flex-col md:flex-row gap-8 mt-4 max-w-screen-xl mx-auto relative pt-0 items-start">
        
        {/* Left Column: User Identity Card */}
        <div className="w-full md:w-[340px] shrink-0 md:sticky md:top-24">
          <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cover Banner */}
            <div className="h-28 w-full relative shrink-0 bg-slate-200">
              <img 
                src="https://loremflickr.com/600/200/campus,university?lock=200" 
                alt="University Campus" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
              <button 
                onClick={() => handleAction('Edit Cover Photo')}
                className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[var(--color-button-hover)]/50 transition-colors"
              >
                <PenLine size={14} className="stroke-[2.5]" />
              </button>
            </div>

            <div className="px-5 pb-5 relative z-10">
              {/* Header section with Avatar and Edit action */}
              <div className="flex justify-between items-start mb-2">
                <div className="relative -mt-[48px]">
                  {/* Avatar */}
                  <div className="w-[96px] h-[96px] rounded-full border-[4px] border-card-bg overflow-hidden relative shadow-sm z-10 bg-[var(--color-button)]/10">
                    <img 
                      src={user?.user_metadata?.avatar_url || "https://loremflickr.com/200/200/face,smiling?lock=300"} 
                      alt={fullName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Distinctive Status Badge to avoid copyright while keeping the vibe */}
                  <div className="absolute -bottom-1 -left-2 rotate-[-8deg] z-20 drop-shadow-sm">
                    <div className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-[8px] rounded-tl-[2px] rounded-br-[2px] uppercase tracking-wider border-[2px] border-card-bg">
                      {role === 'Student' ? '#RoommateSeach' : '#VerifiedManager'}
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button 
                  onClick={() => handleAction('Edit Profile')}
                  className="mt-3 w-8 h-8 rounded-full text-text-muted hover:text-[var(--color-accent)] hover:bg-[var(--color-button)]/5 flex items-center justify-center transition-colors shadow-sm bg-app-bg"
                >
                  <PenLine size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex flex-col mt-1">
                <h2 className="text-[1.3rem] font-bold text-text-primary leading-tight tracking-tight mb-1">{fullName}</h2>
                <p className="text-[0.95rem] text-text-primary font-medium leading-snug">{role === 'Student' ? `${levelText}${role}` : role}</p>
                <p className="text-[0.85rem] text-text-primary/80 mt-0.5">{university}</p>
                <div className="flex flex-col mt-3 gap-1.5 text-[0.85rem] text-text-muted leading-relaxed">
                  <span>{email}</span>
                  <span className="text-[var(--color-accent)] font-medium hover:underline cursor-pointer transition-colors w-max">54 connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Preferences */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 w-full">
          
          {/* Opportunities Feature */}
          {role === 'Student' && <OpportunitiesSection />}

          {/* Settings Grid (If many, we can grid them, but a vertical list per section is typical for profile menus) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[100ms]">
            
            {/* Account Group */}
            <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-border-subtle bg-app-bg/30">
                <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Account</span>
              </div>
              <div className="flex flex-col">
                <button onClick={() => navigate('/referrals')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Refer a Friend</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold mr-1">Earn ₵</span>
                </button>
                <button onClick={() => handleAction('Personal Information')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Personal Information</span>
                </button>
                <button onClick={() => handleAction('Payment Methods')} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-teal-light text-teal flex items-center justify-center shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Payment Methods</span>
                </button>
              </div>
            </div>

            {/* Preferences Group */}
            <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-border-subtle bg-app-bg/30">
                <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Preferences</span>
              </div>
              <div className="flex flex-col">
                <button onClick={() => handleAction('Notifications')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-amber-light text-amber-glow flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Notifications</span>
                </button>
                <button onClick={() => handleAction('Privacy & Security')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Shield size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Privacy & Security</span>
                </button>
                <ThemeRow />
                <button onClick={() => toggleFullscreen()} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group border-t border-border-subtle">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">{isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'}</span>
                </button>
              </div>
            </div>

            {/* Management Group */}
            {role !== 'Student' && (
            <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-border-subtle bg-app-bg/30">
                <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Management</span>
              </div>
              <div className="flex flex-col">
                <button onClick={() => navigate("/manager/dashboard")} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Property Manager Dashboard</span>
                </button>
              </div>
            </div>
            )}

            {/* Support Group */}
            <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-hidden h-fit">
              <div className="px-5 py-3.5 border-b border-border-subtle bg-app-bg/30">
                <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Support</span>
              </div>
              <div className="flex flex-col">
                <button onClick={() => handleAction('Help Center')} className="flex items-center gap-3 w-full p-4 border-b border-border-subtle text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                    <HelpCircle size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Help Center</span>
                </button>
                <button onClick={() => handleAction('Terms & Policies')} className="flex items-center gap-3 w-full p-4 text-left bg-card-bg transition-colors hover:bg-app-bg cursor-pointer active:bg-[var(--color-surface-2)] group">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <span className="flex-1 text-[0.95rem] font-semibold text-text-primary">Terms & Policies</span>
                </button>
              </div>
            </div>

          </div>

          {/* Logout Action */}
          <div className="mt-4 mb-4 flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[150ms]">
            <button 
              onClick={() => handleAction('Log Out')}
              className="inline-flex items-center gap-2 text-coral font-bold text-[0.95rem] py-3.5 px-8 rounded-full bg-coral-light/20 border border-coral-light/50 active:scale-[0.97] transition-all hover:bg-coral-light/40"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
