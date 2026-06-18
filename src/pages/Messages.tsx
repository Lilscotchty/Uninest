import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Search, MessageSquare, Send, Paperclip, MoreVertical } from 'lucide-react';

export const Messages = () => {
  return (
    <div className="flex-1 w-full flex flex-col bg-app-bg min-h-screen">
      <PageHeader title="Messages" />
      
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-20 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Conversations List */}
        <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 bg-card-bg rounded-[20px] shadow-sm border border-border-subtle flex flex-col overflow-hidden h-[600px] md:h-[calc(100vh-140px)]">
          <div className="p-4 border-b border-border-subtle shrink-0">
            <h2 className="text-[1.1rem] font-bold text-text-primary mb-4 tracking-tight">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2.5 bg-app-bg border border-border-subtle rounded-xl text-[0.9rem] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-text-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col divide-y divide-border-subtle">
            {/* Active Conversation Item */}
            <div className="p-4 flex gap-3 items-center bg-app-bg/60 cursor-pointer border-l-4 border-l-[var(--color-accent)]">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border-subtle">
                <img src="https://loremflickr.com/100/100/face?lock=41" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-[0.95rem] text-text-primary truncate">Sarah Jenkins</h3>
                  <span className="text-[0.7rem] text-[var(--color-accent)] font-bold">10:42 AM</span>
                </div>
                <p className="text-[0.85rem] text-text-primary font-medium truncate">Yes, the room is still available.</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] shrink-0"></div>
            </div>

            {/* Inactive Conversation Items */}
            {[
              { name: 'Michael Osei', msg: 'Thanks for the virtual tour!', time: 'Yesterday' },
              { name: 'Pentagon Properties', msg: 'Your lease agreement is attached.', time: 'Monday' },
              { name: 'Evandy Support', msg: 'How can we help you today?', time: 'Oct 12' }
            ].map((chat, i) => (
              <div key={i} className="p-4 flex gap-3 items-center hover:bg-app-bg/40 cursor-pointer transition-colors border-l-4 border-l-transparent">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200">
                   <img src={`https://loremflickr.com/100/100/face?lock=${i+50}`} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-[0.95rem] text-text-primary truncate">{chat.name}</h3>
                    <span className="text-[0.7rem] text-text-muted">{chat.time}</span>
                  </div>
                  <p className="text-[0.85rem] text-text-secondary truncate">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Chat Area */}
        <div className="hidden md:flex flex-1 bg-card-bg rounded-[20px] shadow-sm border border-border-subtle flex-col overflow-hidden h-[calc(100vh-140px)] relative">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-app-bg/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border-subtle">
                <img src="https://loremflickr.com/100/100/face?lock=41" alt="Sarah" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-[1rem] text-text-primary">Sarah Jenkins</h3>
                <span className="text-[0.75rem] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full hover:bg-border-subtle flex items-center justify-center text-text-muted transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar bg-card-bg/50">
            <div className="w-full flex justify-center">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider bg-app-bg px-3 py-1 rounded-full border border-border-subtle">Today</span>
            </div>

             {/* Sent Message */}
             <div className="flex flex-col items-end w-full gap-1">
                <div className="bg-[var(--color-button)] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] lg:max-w-[70%] shadow-sm leading-relaxed text-[0.95rem]">
                  Hi Sarah! I'm interested in the Private Room at Pentagon Annex. Is it still available for the upcoming semester?
                </div>
                <span className="text-[0.7rem] text-text-muted mr-1">10:38 AM</span>
             </div>

             {/* Received Message */}
             <div className="flex items-end gap-2 w-full">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mb-5">
                  <img src="https://loremflickr.com/100/100/face?lock=41" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="bg-app-bg text-text-primary px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] lg:max-w-[70%] shadow-sm border border-border-subtle leading-relaxed text-[0.95rem]">
                    Yes, the room is still available.
                  </div>
                  <div className="bg-app-bg text-text-primary px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] lg:max-w-[70%] shadow-sm border border-border-subtle leading-relaxed text-[0.95rem] mt-1">
                    Would you like to schedule a virtual tour or book it right away?
                  </div>
                  <span className="text-[0.7rem] text-text-muted ml-1">10:42 AM</span>
                </div>
             </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-app-bg/50 border-t border-border-subtle shrink-0">
            <div className="bg-card-bg border border-border-subtle rounded-full p-2 flex items-center shadow-sm">
              <button className="w-10 h-10 rounded-full hover:bg-app-bg flex items-center justify-center text-text-muted transition-colors shrink-0">
                <Paperclip size={20} />
              </button>
              <input 
                 type="text" 
                 placeholder="Type your message..." 
                 className="flex-1 bg-transparent px-3 py-2 text-[0.95rem] text-text-primary focus:outline-none placeholder:text-text-muted"
              />
              <button className="w-10 h-10 rounded-full bg-[var(--color-button)] flex items-center justify-center text-white transition-transform hover:scale-105 shrink-0 shadow-sm ml-1">
                <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
