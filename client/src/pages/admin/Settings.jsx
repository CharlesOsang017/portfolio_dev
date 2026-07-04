import { useState } from 'react';
import { User, Lock, Moon, Sun, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!newPass || newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/profile', { password: newPass });
      setCurrentPass('');
      setNewPass('');
      toast.success('Password changed!');
    } catch { toast.error('Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences.</p>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={14} />
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">New Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 transition-colors">
                <Lock size={14} className="text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min 8 characters"
                  className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                />
                <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            {theme === 'dark' ? <Moon size={18} className="text-gray-500" /> : <Sun size={18} className="text-gray-500" />}
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Toggle between light and dark interface</div>
            </div>
            <button
              onClick={toggleTheme}
              className={`toggle-track ${theme === 'dark' ? 'checked bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
