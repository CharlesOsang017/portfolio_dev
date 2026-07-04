import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { user, register, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (!result.success) toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center px-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
            <Monitor size={20} className="text-white dark:text-gray-900" />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-outfit text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Set up your portfolio management suite</p>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 transition-colors">
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="John Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 transition-colors">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 transition-colors">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                required minLength={8}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/admin/login" className="font-semibold text-gray-900 dark:text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
