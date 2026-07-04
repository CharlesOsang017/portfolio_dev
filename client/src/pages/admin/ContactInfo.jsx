import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import { IoSave } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import { CiLinkedin, CiMail, CiLocationOn, CiCircleInfo, CiClock1, CiLink } from "react-icons/ci";
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Clock, Info, Mail, MapPin, MoreHorizontal, RefreshCw, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusBadge = (status) => {
  const map = {
    unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    replied: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return map[status] || map.replied;
};

const ContactInfo = () => {
  const [contact, setContact] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [cRes, iRes] = await Promise.all([api.get('/contact'), api.get('/inquiries')]);
      setContact(cRes.data);
      setInquiries(iRes.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/contact', contact);
      setHasChanges(false);
      toast.success('Contact info saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/inquiries/${id}`, { status });
      setInquiries(inquiries.map((i) => (i._id === id ? data : i)));
    } catch { toast.error('Update failed'); }
  };

  const handleDeleteInquiry = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact & Availability</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage how the world reaches you and set your current workload capacity.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
        >
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Availability */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Availability</h2>
            <span className="text-gray-400">📅</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Set your current work status for potential clients and recruiters.</p>

          <div className="space-y-3">
            {[
              { value: 'selective', label: 'Open for select projects' },
              { value: 'unavailable', label: 'Currently Unavailable' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-2.5">
                  {value === 'selective' && <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot"></div>}
                  {value === 'unavailable' && <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${contact?.availability === value ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {contact?.availability === value && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900"></div>}
                </div>
                <input
                  type="radio"
                  name="availability"
                  value={value}
                  checked={contact?.availability === value}
                  onChange={() => handleChange('availability', value)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Custom Status Message</label>
            <textarea
              value={contact?.customStatusMessage || ''}
              onChange={(e) => handleChange('customStatusMessage', e.target.value)}
              rows={3}
              placeholder="e.g., Accepting new frontend contracts for Q4..."
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Primary Channels */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Primary Channels</h2>
            <Link size={16} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { field: 'email', label: 'Email Address', icon: Mail, placeholder: 'your@email.com' },
              { field: 'location', label: 'Location', icon: MapPin, placeholder: 'City, Country' },
              { field: 'linkedinUrl', label: 'LinkedIn URL', icon: FaLinkedin, placeholder: 'linkedin.com/in/...' },
              { field: 'githubUrl', label: 'GitHub URL', icon: FaGithub, placeholder: 'github.com/...' },
            ].map(({ field, label, icon: Icon, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-indigo-400 transition-colors">
                  <Icon size={14} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={contact?.[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Info notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <Info size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              These details are used across your portfolio's footer and contact section. Ensure they are correct before saving.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Inquiries</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage form submissions from your contact page</p>
          </div>
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['DATE', 'SENDER', 'SUBJECT', 'STATUS', 'ACTION'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {inquiries.slice(0, 5).map((inq) => (
                <tr key={inq._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(inq.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{inq.senderName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{inq.senderEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[220px] truncate">{inq.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(inq.status)}`}>
                      {inq.status === 'unread' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                      {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group/menu">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal size={16} className="text-gray-400" />
                      </button>
                      <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-10 hidden group-hover/menu:block animate-fade-in">
                        {['replied', 'archived', 'unread'].filter(s => s !== inq.status).map((s) => (
                          <button key={s} onClick={() => handleInquiryStatus(inq._id, s)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 capitalize first:rounded-t-xl">
                            Mark as {s}
                          </button>
                        ))}
                        <button onClick={() => handleDeleteInquiry(inq._id)} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl">
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inquiries.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-600">
              <Mail size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Display Location */}
      <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative flex items-end">
          {/* Map mockup */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(99,102,241,0.05) 30px, rgba(99,102,241,0.05) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(99,102,241,0.05) 30px, rgba(99,102,241,0.05) 31px)',
            }} />
            <MapPin size={32} className="absolute text-indigo-500 opacity-60" />
          </div>
          <div className="relative z-10 m-4 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 max-w-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Display Location</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Your current base is set to {contact?.location || 'Not set'}. This affects the timezone shown on your profile.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              Current Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
