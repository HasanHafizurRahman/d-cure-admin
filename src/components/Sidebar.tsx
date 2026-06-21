import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Tag, 
  Settings as SettingsIcon, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Products / Pricing', path: '/products', icon: Tag },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Wrapper */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white px-6 py-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Brand Logo */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green text-accent-gold shadow-md">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight tracking-tight text-brand-green">
                D-CURE Plus
              </h1>
              <span className="text-[10px] font-sans font-semibold tracking-wider text-slate-400 uppercase">
                Admin Panel
              </span>
            </div>
          </div>
          
          {/* Close button for Mobile drawer */}
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-display font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-brand-green-light text-brand-green font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon 
                      className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-brand-green' : 'text-slate-400'
                      }`} 
                    />
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Details */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold font-display text-sm">
              AD
            </div>
            <div>
              <p className="font-display font-semibold text-xs text-slate-800">
                Administrator
              </p>
              <p className="font-sans text-[10px] text-slate-400">
                admin@dcureplus.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
