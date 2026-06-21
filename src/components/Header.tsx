import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'নতুন অর্ডার (#DC-884927)',
      description: 'তানভীর আহমেদ ৩টি বক্স এর অর্ডার করেছেন।',
      time: '৫ মিনিট আগে',
      unread: true,
    },
    {
      id: 2,
      title: 'ডেলিভারি আপডেট',
      description: 'অর্ডার #DC-927318 সফলভাবে ডেলিভার করা হয়েছে।',
      time: '২ ঘণ্টা আগে',
      unread: false,
    },
  ]);

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/orders':
        return 'Order Management';
      case '/products':
        return 'Package Pricing Manager';
      case '/settings':
        return 'Settings & Configuration';
      default:
        return 'Admin Panel';
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/90 px-6 backdrop-blur-md lg:px-8">
      {/* Left side: Hamburger (mobile) & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h2 className="font-display text-lg font-bold text-slate-800 lg:text-xl">
            {getPageTitle()}
          </h2>
          <p className="hidden text-xs text-slate-400 sm:block font-sans">
            D-Cure Plus E-commerce Portal
          </p>
        </div>
      </div>

      {/* Right side: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        {/* Decorative Search bar */}
        <div className="relative hidden w-64 md:block">
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-sans text-slate-800 placeholder-slate-400 transition-all focus:border-brand-green/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/10"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white font-sans">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop to close panel */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 z-40 w-80 sm:w-96 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-100/50"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <h4 className="font-display font-bold text-slate-800 text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-semibold text-brand-green hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                            n.unread ? 'bg-brand-green-light/30 border border-brand-green-light' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-brand-green' : 'bg-slate-300'}`} />
                          <div className="space-y-0.5">
                            <p className="font-display text-xs font-bold text-slate-800 leading-tight">
                              {n.title}
                            </p>
                            <p className="font-sans text-[11px] text-slate-500 leading-snug">
                              {n.description}
                            </p>
                            <span className="font-sans text-[9px] font-medium text-slate-450 block">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-display font-semibold text-sm">
            A
          </div>
          <div className="hidden lg:block text-left">
            <p className="font-display text-xs font-bold text-slate-800 leading-tight">
              Admin User
            </p>
            <p className="font-sans text-[10px] text-slate-450">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
