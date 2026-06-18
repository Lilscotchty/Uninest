import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Search, HelpCircle, FileText, MessageCircle, Phone, ChevronRight, CreditCard, Shield } from 'lucide-react';

export const Support = () => {
  return (
    <div className="flex-1 w-full flex flex-col bg-app-bg min-h-screen">
      <PageHeader title="Help & Support" />
      
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-20 flex-1">
        
        {/* Search Header */}
        <div className="bg-[var(--color-button)] rounded-[24px] p-8 md:p-12 mb-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold text-white mb-4 tracking-tight leading-tight">
              How can we help you?
            </h1>
            <div className="relative w-full max-w-lg mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for articles, questions..." 
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[1rem] focus:outline-none shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-slate-900 border-none placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl mx-auto">
          {[
            { icon: FileText, title: 'Booking Guide', desc: 'Learn how to find and book your perfect room.' },
            { icon: CreditCard, title: 'Payments & Billing', desc: 'Secure payment methods, refunds, and receipts.' },
            { icon: Shield, title: 'Trust & Safety', desc: 'Verification processes and our safe community guidelines.' }
          ].map((cat, i) => (
            <div key={i} className="bg-card-bg rounded-[20px] p-6 border border-border-subtle shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-app-bg text-[var(--color-accent)] rounded-xl flex items-center justify-center border border-border-subtle shrink-0">
                <cat.icon size={24} />
              </div>
              <div>
                <h3 className="text-[1.05rem] font-bold text-text-primary mb-1.5">{cat.title}</h3>
                <p className="text-[0.9rem] text-text-secondary leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-card-bg rounded-[24px] border border-border-subtle shadow-sm p-6 md:p-8 max-w-3xl mx-auto mb-10">
          <h2 className="text-[1.2rem] font-bold text-text-primary mb-6 flex items-center gap-2">
            <HelpCircle size={20} className="text-[var(--color-accent)]" /> 
            Frequently Asked Questions
          </h2>
          
          <div className="divide-y divide-border-subtle flex flex-col">
            {[
              'How do I cancel a booking?',
              'What happens if my payment fails?',
              'Can I schedule an in-person viewing?',
              'Are the listed prices inclusive of utility bills?'
            ].map((q, i) => (
               <button key={i} className="py-4 flex justify-between items-center text-left hover:bg-app-bg/50 px-2 rounded-lg transition-colors group">
                 <span className="text-[0.95rem] font-semibold text-text-primary group-hover:text-[var(--color-accent)] transition-colors">{q}</span>
                 <ChevronRight size={18} className="text-text-muted transition-transform group-hover:translate-x-1" />
               </button>
            ))}
          </div>
          <div className="mt-4 pt-4 text-center">
            <span className="text-[0.9rem] font-bold text-[var(--color-accent)] cursor-pointer hover:underline">View all FAQs</span>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="max-w-4xl mx-auto w-full bg-[var(--color-button)]/5 border border-[var(--color-button)]/20 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
           <div>
             <h3 className="text-[1.2rem] font-bold text-text-primary mb-2">Still need help?</h3>
             <p className="text-[0.95rem] text-text-secondary max-w-sm">Our support team is available 24/7 to assist you with any inquiries.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-3 shrink-0">
             <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-button)] text-white rounded-xl font-bold text-[0.95rem] transition-transform hover:scale-105 shadow-sm">
               <MessageCircle size={18} /> Chat with us
             </button>
             <button className="flex items-center justify-center gap-2 px-6 py-3 bg-app-bg border border-border-subtle text-text-primary rounded-xl font-bold text-[0.95rem] transition-colors hover:bg-border-subtle shadow-sm">
               <Phone size={18} /> Call Support
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};
