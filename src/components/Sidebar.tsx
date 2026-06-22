import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Tag, 
  Settings as SettingsIcon, 
  X, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/cedra.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, menus, logout } = useAuth();

  const allMenuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, slug: 'dashboard' },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, slug: 'orders' },
    { name: 'Products / Pricing', path: '/products', icon: Tag, slug: 'products' },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, slug: 'settings' },
  ];

  // Filter menu items if API menus exist and are active
  const menuItems = menus && menus.length > 0
    ? allMenuItems.filter(item => 
        menus.some(m => m.slug?.toLowerCase() === item.slug && m.is_active)
      )
    : allMenuItems;


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
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto flex items-center shrink-0">
              <img src={logoImg} alt="Cedra Logo" className="h-7 w-auto object-contain" />
            </div>
            <div className="border-l border-slate-200 pl-3 py-0.5">
              <h1 className="font-display text-sm font-bold leading-none tracking-tight text-brand-green">
                D-CURE Plus
              </h1>
              <span className="text-[8.5px] font-sans font-semibold tracking-wider text-slate-400 uppercase block mt-1">
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
        <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold font-display text-sm shrink-0">
              {user?.name 
                ? user.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                : 'AD'}
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-xs text-slate-800 leading-tight truncate max-w-[120px]" title={user?.name || 'Administrator'}>
                {user?.name || 'Administrator'}
              </p>
              <p className="font-sans text-[10px] text-slate-400 truncate max-w-[120px]" title={user?.email || 'admin@dcureplus.com'}>
                {user?.email || 'admin@dcureplus.com'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand-red transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>
    </>
  );
}
