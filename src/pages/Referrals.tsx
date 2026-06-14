import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Share2, Check, HelpCircle, Gift } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useAppContext } from '../context/AppContext';

export const Referrals: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [copied, setCopied] = useState(false);
  
  const referralCode = "ROOMIE2024"; // Mock code for prototype
  const earnedCredits = 15; // Mock earned credits

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    showToast("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on this housing app!',
        text: `Use my code ${referralCode} to sign up and we both get credits!`,
        url: window.location.origin,
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-xl mx-auto w-full flex flex-col flex-1 pb-20">
        <PageHeader 
          title="Refer a Friend"
          showBackButton={true}
          onBack={() => navigate(-1)}
          actions={[
            { icon: <HelpCircle size={22} />, label: "Help", onClick: () => showToast("Learn how referrals work") }
          ]}
        />

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8 mt-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
              <Gift size={40} className="ml-1" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Invite friends, earn credits</h2>
            <p className="text-text-secondary w-4/5 mx-auto text-[0.95rem] leading-relaxed">
              When a friend signs up with your code and completes their first booking, you both receive <b>10 booking credits</b>. Plus, earn <b>₵1.00</b> every time a referee pays for Opportunity Hub features!
            </p>
          </div>

          <div className="bg-card-bg border border-border-subtle rounded-[20px] p-6 shadow-sm mb-6 flex flex-col items-center">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Your Unique Code</span>
            <div className="flex items-center justify-center gap-3 w-full bg-[var(--color-surface-2)] tracking-widest text-2xl font-black text-text-primary rounded-xl py-4 px-4 border border-[var(--color-border)] border-dashed">
              <span>{referralCode}</span>
            </div>
            
            <div className="flex gap-4 w-full mt-6">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-border-subtle rounded-xl py-3 text-text-primary font-semibold hover:bg-[var(--color-surface-2)] transition-colors"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-3 font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          <div className="bg-card-bg border border-border-subtle rounded-[20px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text-primary text-lg">Your Rewards</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-border-subtle">
                <span className="text-3xl font-black text-emerald-600 mb-1">{earnedCredits}</span>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Credits Earned</span>
              </div>
              <div className="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-border-subtle">
                <span className="text-3xl font-black text-[var(--color-accent)] mb-1">₵4.00</span>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Cash Earned</span>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-4 px-2">
            <h3 className="font-bold text-text-primary text-lg mb-4">Referral History</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card-bg/50 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                     <img src="https://loremflickr.com/100/100/face,woman?lock=4" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">Sarah J.</p>
                    <p className="text-xs text-emerald-600 font-medium bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-primary">+10 Credits</p>
                  <p className="text-xs text-text-muted mt-0.5">Oct 24, 2024</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-card-bg/50 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-text-secondary font-bold">
                    MK
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">Michael K.</p>
                    <p className="text-xs text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Pending Booking</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-muted">--</p>
                  <p className="text-xs text-text-muted mt-0.5">Nov 2, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
