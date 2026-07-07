import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Clock, Zap, Mail, Image,
  Settings, LogOut, ChevronLeft, ChevronRight, Monitor,
  FileSearchCorner
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Projects', icon: Briefcase, path: '/admin/projects' },
  { label: 'Experience', icon: Clock, path: '/admin/experience' },
  { label: 'Skills', icon: Zap, path: '/admin/skills' },
  { label: 'Contact Info', icon: Mail, path: '/admin/contact' },
  { label: 'Inquiries', icon: FileSearchCorner, path: '/admin/inquiries' },
  { label: 'Assets', icon: Image, path: '/admin/assets' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Overlay: darkens the screen background when sidebar is open on mobile */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen z-30 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 transform
          
          /* Mobile behaviour: Slide completely off-screen by default */
          ${collapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-60'}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800 ${collapsed ? 'md:justify-center' : ''}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
            <Monitor size={16} className="text-white dark:text-gray-900" />
          </div>
          {/* Hide text completely if collapsed on desktop, show always on mobile if sidebar is visible */}
          <div className={`${collapsed ? 'md:hidden' : 'block'} animate-fade-in overflow-hidden`}>
            <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight">ZENITH CMS</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Admin Console</div>
          </div>
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-16 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors z-40
            /* Dynamic placement: pops out of the screen layout when closed on mobile */
            ${collapsed ? '-right-9 md:-right-3' : '-right-3'}`}
        >
          {collapsed ? <ChevronRight size={12} className='dark:text-zinc-100 dark:border-gray-700 dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent' /> : <ChevronLeft size={12} className='dark:text-zinc-100 dark:border-gray-700 dark:bg-gray-900 cursor-pointer' />}
        </button>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
                ${collapsed ? 'md:justify-center' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={`${collapsed ? 'md:hidden' : 'block'} animate-fade-in`}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
          <NavLink
            to="/admin/settings"
            title={collapsed ? 'Settings' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
              ${collapsed ? 'md:justify-center' : ''}`
            }
          >
            <Settings size={18} className="flex-shrink-0" />
            <span className={`${collapsed ? 'md:hidden' : 'block'}`}>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150
              ${collapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`${collapsed ? 'md:hidden' : 'block'}`}>Logout</span>
          </button>

          {(!collapsed || user) && (
            <div className={`${collapsed ? 'md:hidden' : 'block'} mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 px-1 animate-fade-in`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name}</div>
                  <NavLink to="/" className="text-xs text-indigo-500 hover:underline">Preview Site</NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;