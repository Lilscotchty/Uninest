import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Bell, Check, Circle, Calendar, MessageSquare, ShieldCheck, Tag, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'system' | 'promo';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your request for a Private Room at Pentagon Annex has been approved.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message from Host',
    message: 'Hi, are you still interested in scheduling a tour this Friday?',
    time: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Account Verified',
    message: 'Your student ID has been successfully verified. You now have full access.',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Special Discount',
    message: 'Get 5% off your next booking when you refer a friend this week!',
    time: '2 days ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'booking',
    title: 'Tour Scheduled',
    message: 'You have an upcoming virtual tour at Evandy Property on Thursday at 2:00 PM.',
    time: '3 days ago',
    isRead: true,
  }
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'unread' ? !n.isRead : true
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar size={18} className="text-emerald-600" />;
      case 'message': return <MessageSquare size={18} className="text-[var(--color-accent)]" />;
      case 'system': return <ShieldCheck size={18} className="text-indigo-600" />;
      case 'promo': return <Tag size={18} className="text-amber-500" />;
      default: return <Info size={18} className="text-slate-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-emerald-100';
      case 'message': return 'bg-[var(--color-accent-muted)]';
      case 'system': return 'bg-indigo-100';
      case 'promo': return 'bg-amber-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-app-bg min-h-screen">
      <PageHeader 
        title="Notifications" 
        actions={unreadCount > 0 ? [
          { 
            icon: <Check size={20} />, 
            label: 'Mark all read', 
            onClick: markAllAsRead 
          }
        ] : undefined}
      />
      
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 pt-4 flex-1">
        
        {/* Header and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[1.3rem] font-bold text-text-primary tracking-tight">Your Updates</h1>
            <p className="text-[0.9rem] text-text-muted mt-1">Stay informed about your bookings, messages, and account.</p>
          </div>
          
          <div className="flex bg-card-bg p-1 rounded-xl shadow-sm border border-border-subtle inline-flex w-max shrink-0">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-lg text-[0.85rem] font-semibold transition-all ${
                activeTab === 'all' 
                  ? 'bg-app-bg text-text-primary shadow-sm' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`px-5 py-2 rounded-lg text-[0.85rem] font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'unread' 
                  ? 'bg-app-bg text-text-primary shadow-sm' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-[var(--color-accent)] text-white text-[0.65rem] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Bell size={32} />
              </div>
              <h3 className="text-[1.1rem] font-semibold text-text-primary mb-2">You're all caught up!</h3>
              <p className="text-[0.9rem] text-text-muted max-w-sm mx-auto">
                No {activeTab === 'unread' ? 'unread ' : ''}notifications at the moment. Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle flex flex-col">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-app-bg/50 cursor-pointer ${!notification.isRead ? 'bg-[var(--color-accent-muted)]/20' : ''}`}
                  onClick={() => toggleReadStatus(notification.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className={`text-[0.95rem] truncate ${!notification.isRead ? 'font-bold text-text-primary' : 'font-semibold text-text-primary/90'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[0.75rem] text-text-muted whitespace-nowrap shrink-0 mt-0.5">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-[0.85rem] leading-snug ${!notification.isRead ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                      {notification.message}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center pl-2">
                    {!notification.isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] shadow-sm"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
