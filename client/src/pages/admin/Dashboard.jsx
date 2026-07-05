import { useState, useEffect, useRef } from 'react';
import { PenLine, Briefcase, AlertCircle, Upload, Rocket, Calendar, Code, Smile, Save, RefreshCw, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const metricConfig = [
  { key: 'projectsCompleted', label: 'PROJECTS COMPLETED', icon: Rocket },
  { key: 'yearsExperience', label: 'YEARS EXPERIENCE', icon: Calendar },
  { key: 'openSourceContribs', label: 'OPEN SOURCE CONTRIBS', icon: Code },
  { key: 'happyClients', label: 'HAPPY CLIENTS', icon: Smile },
];

const Dashboard = () => {
  const [form, setForm] = useState({
    mainHeadline: '',
    subHeadline: '',
    isAvailable: true,
    profileImage: '',
    resumeUrl: '', // Added resume url tracking
    metrics: { projectsCompleted: 0, yearsExperience: 0, openSourceContribs: 0, happyClients: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedData, setSavedData] = useState(null);
  
  // Separate refs for image and resume files
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/home');
      setForm(data);
      setSavedData(data);
      setHasChanges(false);
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleMetricChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      metrics: { ...prev.metrics, [key]: Number(value) },
    }));
    setHasChanges(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleChange('profileImage', data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    }
  };

  // New handler for resume PDF files
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleChange('resumeUrl', data.url);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Resume upload failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/home', form);
      setSavedData(form);
      setHasChanges(false);
      toast.success('Changes saved successfully!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home Page Content</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your primary landing page information, hero section, and key metrics.</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={18} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Section</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Main Headline</label>
                <input
                  type="text"
                  value={form.mainHeadline}
                  onChange={(e) => handleChange('mainHeadline', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                  placeholder="Hello, I'm John Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Intro / Sub-headline</label>
                <textarea
                  value={form.subHeadline}
                  onChange={(e) => handleChange('subHeadline', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors resize-none"
                  placeholder="A Senior Software Engineer specializing in..."
                />
              </div>
            </div>
          </div>

          {/* Work Status */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-gray-600 dark:text-gray-400" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Work Status</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Control the "Available for Work" badge on your site.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChange('isAvailable', !form.isAvailable)}
                  className={`toggle-track ${form.isAvailable ? 'checked bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className="toggle-thumb" />
                </button>
                <span className={`text-sm font-medium ${form.isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  {form.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-600 dark:text-gray-400">📊</span>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {metricConfig.map(({ key, label, icon: Icon }) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                    <input
                      type="number"
                      value={form.metrics?.[key] ?? 0}
                      onChange={(e) => handleMetricChange(key, e.target.value)}
                      className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent outline-none w-full"
                      min={0}
                    />
                  </div>
                  <Icon size={22} className="text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile Image */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Profile Image</h2>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
              {form.profileImage ? (
                <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Upload size={32} />
                  <span className="text-xs text-center px-4">No image yet</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center mb-3">Recommended: Square aspect ratio, min 800×800px. JPG or PNG.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Replace Image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* NEW Resume Upload Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Resume Document</h2>
            <div className="bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 flex flex-col items-center justify-center min-h-[120px]">
              {form.resumeUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={32} className="text-indigo-500" />
                  <span className="text-xs text-gray-900 dark:text-white font-medium text-center break-all px-2 line-clamp-1">
                    {form.resumeUrl.split('/').pop()}
                  </span>
                  <a 
                    href={form.resumeUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[11px] text-indigo-500 hover:underline"
                  >
                    View Current Document
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <span className="text-xs text-center">No resume uploaded yet</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center mb-3">Accepted format: PDF only.</p>
            <button
              onClick={() => resumeInputRef.current?.click()}
              className="w-full py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {form.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
            </button>
            <input 
              ref={resumeInputRef} 
              type="file" 
              accept=".pdf,application/pdf" 
              className="hidden" 
              onChange={handleResumeUpload} 
            />
          </div>

          {/* Site Preview */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Site Preview</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              {form.isAvailable && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></div>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Available for Freelance</span>
                </div>
              )}
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{form.mainHeadline || 'Your headline'}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{form.subHeadline || 'Your subheadline...'}</p>
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 bg-gray-900 dark:bg-white rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2 italic">Draft view. Changes are not live.</p>
          </div>
        </div>
      </div>

      {/* Unsaved Changes toast */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl p-4 flex items-start gap-3 max-w-xs animate-fade-in">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Unsaved Changes</div>
            <div className="text-xs opacity-70 mt-0.5">You have modified content. Don't forget to save!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;