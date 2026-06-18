import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Share2, Check, HelpCircle, Gift } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useAppContext } from '../context/AppContext';

export const Referrals: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, referralCode, earnedCredits, earnedCash, referees } = useAppContext();
  const [copied, setCopied] = useState(false);
  
  // Real code generated from user ID
  const displayReferralCode = referralCode || "SIGN-IN-REQUIRED";

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(displayReferralCode);
    setCopied(true);
    showToast("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!referralCode) return;
    const shareUrl = `${window.location.origin}/signup?ref=${displayReferralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join me on this housing app!',
        text: `Use my code ${displayReferralCode} to sign up and we both get credits!`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Referral link copied!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-app-bg flex flex-col font-sans relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      <PageHeader 
        title="Refer a Friend"
        showBackButton={true}
        onBack={() => navigate(-1)}
        actions={[
          { icon: <HelpCircle size={22} />, label: "Help", onClick: () => showToast("Learn how referrals work") }
        ]}
      />
      
      <div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row gap-8 flex-1 pb-20 px-4 sm:px-6 lg:px-8 items-start">
        
        {/* Left Column */}
        <div className="w-full md:w-1/2 lg:w-5/12 shrink-0 flex flex-col md:sticky md:top-24">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8 mt-6 md:mt-2">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
              <Gift size={40} className="ml-1" />
            </div>
            <h2 className="text-[1.2rem] font-semibold text-text-primary">Invite friends, earn credits</h2>
            <p className="text-text-secondary w-full sm:w-4/5 mx-auto text-[0.95rem] leading-relaxed">
              When a friend signs up with your code and completes their first booking, you both receive <b>10 booking credits</b>. Plus, earn <b>₵1.00</b> every time a referee pays for Opportunity Hub features!
            </p>
          </div>

          <div className="bg-card-bg border border-border-subtle rounded-[20px] p-6 shadow-sm mb-6 flex flex-col items-center w-full">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Your Unique Code</span>
            <div className="flex items-center justify-center gap-3 w-full bg-[var(--color-surface-2)] tracking-widest text-2xl font-black text-text-primary rounded-xl py-4 px-4 border border-[var(--color-border)] border-dashed">
              <span>{displayReferralCode}</span>
            </div>
            
            <div className="flex gap-4 w-full mt-6">
              <button 
                onClick={handleCopy}
                disabled={!referralCode}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-surface)] border border-border-subtle rounded-xl py-3 text-text-primary font-semibold hover:bg-[var(--color-surface-2)] disabled:opacity-50 transition-colors"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
              <button 
                onClick={handleShare}
                disabled={!referralCode}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-3 font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 lg:flex-1 shrink-0 flex flex-col md:mt-2">
          <div className="bg-card-bg border border-border-subtle rounded-[20px] p-6 shadow-sm mb-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[1.05rem] font-semibold text-text-primary">Your Rewards</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-border-subtle">
                <span className="text-3xl font-black text-emerald-600 mb-1">{earnedCredits}</span>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Credits Earned</span>
              </div>
              <div className="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-border-subtle">
                <span className="text-3xl font-black text-[var(--color-accent)] mb-1">₵{earnedCash.toFixed(2)}</span>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Cash Earned</span>
              </div>
            </div>
          </div>

          <div className="mb-4 px-2 w-full">
            <h3 className="text-[1.05rem] font-semibold text-text-primary mb-4">Referral History</h3>
            
            {referees.length === 0 ? (
              <div className="text-center py-8 bg-card-bg/50 rounded-xl border border-border-subtle w-full">
                <p className="text-sm text-text-muted">No referrals yet. Share your code to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {referees.map((ref, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-card-bg/50 rounded-xl border border-border-subtle w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-text-secondary font-bold">
                        {ref.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary text-sm">{ref.name}</p>
                        <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${ref.status === 'Completed' ? 'text-emerald-600 bg-emerald-100' : 'text-amber-600 bg-amber-100'}`}>
                          {ref.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {ref.amount ? (
                        <p className="font-bold text-text-primary">+ GH₵ {ref.amount.toFixed(2)}</p>
                      ) : (
                        <p className="font-bold text-text-primary">+10 Credits</p>
                      )}
                      <p className="text-xs text-text-muted mt-0.5">{ref.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
