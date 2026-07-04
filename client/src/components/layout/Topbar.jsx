import { Search, Bell, Globe, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ placeholder = 'Search...', onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-4">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Search */}
      <div className="flex-1 flex items-center gap-2 max-w-md">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full text-sm bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Preview Site */}
        <button
          onClick={() => navigate('/')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Globe size={14} />
          Preview Site
        </button>

        {/* Save Changes button (slot) */}
        <button
          id="topbar-save-btn"
          className="px-4 py-1.5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity hidden"
          onClick={() => document.dispatchEvent(new CustomEvent('save-changes'))}
        >
          Save Changes
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <Sun size={18} className="text-gray-400 hover:text-yellow-400 transition-colors" />
            : <Moon size={18} className="text-gray-600 hover:text-indigo-600 transition-colors" />
          }
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell size={18} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};

export default Topbar;
