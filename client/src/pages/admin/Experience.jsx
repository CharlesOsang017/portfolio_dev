import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X, RefreshCw, Save, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ExperienceCard = ({ exp, onUpdate, onDelete, isNew, onCancelNew }) => {
  const [expanded, setExpanded] = useState(true);
  const [form, setForm] = useState(exp);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(exp);
  }, [exp]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleAddBullet = () => {
    handleChange('responsibilities', [...(form.responsibilities || []), '']);
  };

  const handleBulletChange = (idx, value) => {
    const bullets = [...(form.responsibilities || [])];
    bullets[idx] = value;
    handleChange('responsibilities', bullets);
  };

  const handleRemoveBullet = (idx) => {
    const bullets = (form.responsibilities || []).filter((_, i) => i !== idx);
    handleChange('responsibilities', bullets);
  };

  const handleSave = () => {
    onUpdate(form._id, form, isNew);
    setDirty(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
        <GripVertical size={18} className="text-gray-300 dark:text-gray-600 flex-shrink-0 cursor-grab" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {form.jobTitle || (isNew ? 'New Milestone' : 'Untitled Position')}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{form.company || 'Specify Company'}</span>
            {form.location && <><span>•</span><span>{form.location}</span></>}
            {isNew && <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">Unsaved</span>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => isNew ? onCancelNew() : onDelete(form._id)} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            {isNew ? <X size={16} /> : <Trash2 size={16} />}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-5 animate-fade-in">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Start Date</label>
              <input
                type="month"
                value={form.startDate ? form.startDate.slice(0, 7) : ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPresent || false}
                    onChange={(e) => {
                      handleChange('isPresent', e.target.checked);
                      if (e.target.checked) handleChange('endDate', '');
                    }}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
                </label>
              </div>
              <input
                type="month"
                value={form.isPresent ? '' : (form.endDate ? form.endDate.slice(0, 7) : '')}
                disabled={form.isPresent}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Responsibilities & Achievements</label>
            <div className="space-y-2">
              {(form.responsibilities || []).map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2.5 text-gray-400 text-sm">•</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                  />
                  <button onClick={() => handleRemoveBullet(idx)} className="mt-1 p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleAddBullet} className="mt-2 flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              <Plus size={14} />
              Add bullet point
            </button>
          </div>

          {/* Core Info Input Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Job Title</label>
              <input
                type="text"
                value={form.jobTitle || ''}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Company</label>
              <input
                type="text"
                value={form.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            {/* NEW: Dropdown Location Selector replacing text field */}
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Location Type</label>
              <select
                value={form.location || 'Remote'}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors cursor-pointer appearance-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {(dirty || isNew) && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save size={14} />
                {isNew ? 'Save New Milestone' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialNewExperience = {
    jobTitle: '',
    company: '',
    location: 'Remote', // Standard baseline default
    startDate: new Date().toISOString().slice(0, 7),
    isPresent: true,
    endDate: '',
    responsibilities: []
  };

  const [newExpForm, setNewExpForm] = useState(initialNewExperience);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/experience');
      setExperiences(data);
    } catch {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (isAdding) {
      toast.error("Please save your current pending milestone first.");
      return;
    }
    setNewExpForm(initialNewExperience);
    setIsAdding(true);
  };

  const handleUpsert = async (id, updatedForm, isNew) => {
    if (!updatedForm.jobTitle || !updatedForm.company) {
      toast.error("Job Title and Company are required fields!");
      return;
    }

    try {
      if (isNew) {
        const { data } = await api.post('/experience', updatedForm);
        setExperiences([data, ...experiences]);
        setIsAdding(false);
        toast.success('Milestone created!');
      } else {
        const { data } = await api.put(`/experience/${id}`, updatedForm);
        setExperiences(experiences.map((e) => (e._id === id ? data : e)));
        toast.success('Updated successfully!');
      }
    } catch (err) {
      toast.error(isNew ? err.response.data.message : 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      await api.delete(`/experience/${id}`);
      setExperiences(experiences.filter((e) => e._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Timeline</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your professional milestones and career journey.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <ExperienceCard 
            exp={newExpForm} 
            isNew={true} 
            onUpdate={handleUpsert} 
            onCancelNew={() => setIsAdding(false)} 
          />
        )}

        {experiences.map((exp) => (
          <ExperienceCard key={exp._id} exp={exp} isNew={false} onUpdate={handleUpsert} onDelete={handleDelete} />
        ))}

        {experiences.length === 0 && !isAdding && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <Clock size={40} className="mx-auto mb-3 opacity-40" />
            <p>No experience entries yet. Add your first milestone!</p>
          </div>
        )}
      </div>

      {experiences.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <GripVertical size={16} />
          Drag the indicator icons on the left of each card to reorder your timeline. Changes are saved globally.
        </div>
      )}
    </div>
  );
};

export default Experience;