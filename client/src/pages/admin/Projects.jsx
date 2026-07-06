import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Upload, RefreshCw, Eye, EyeOff, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Web Development', 'Mobile', 'Frontend', 'Backend',
  'Infrastructure / DevOps', 'Data Science', 'Design', 'Other',
];

const TAG_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
];

const ProjectEditor = ({ project, onUpdate, onDiscard }) => {
  const [form, setForm] = useState(project);
  const [tagInput, setTagInput] = useState('');
  const fileRef = useRef(null);

  const handleChange = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const addTag = () => {
    if (!tagInput.trim()) return;
    handleChange('techStack', [...(form.techStack || []), tagInput.trim()]);
    setTagInput('');
  };

  const removeTag = (idx) => {
    handleChange('techStack', form.techStack.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/assets/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      handleChange('heroImage', data.url);
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">≡∙</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Content Editor: <span className="text-gray-900 dark:text-white font-bold">{form.title}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></div>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">{form.isPublished ? 'Published' : 'Draft'}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Project Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
              />
            </div>

            {/* Category + Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Tech Stack Tags</label>
                <div className="flex flex-wrap gap-1.5 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[42px]">
                  {(form.techStack || []).map((tag, idx) => (
                    <span key={idx} className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${TAG_COLORS[idx % TAG_COLORS.length]}`}>
                      {tag}
                      <button onClick={() => removeTag(idx)} className="hover:opacity-70"><X size={10} /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                    className="text-xs bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 min-w-[50px] flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors resize-none"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Live URL</label>
                <input
                  type="url"
                  value={form.liveUrl || ''}
                  onChange={(e) => handleChange('liveUrl', e.target.value)}
                  placeholder="https://"
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">GitHub URL</label>
                <input
                  type="url"
                  value={form.githubUrl || ''}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/"
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right: image + toggles */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Hero Image</label>
              <div
                className="aspect-video rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => fileRef.current?.click()}
              >
                {form.heroImage ? (
                  <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
                    <Upload size={20} />
                    <span className="text-sm">Upload image</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Recommended size: 1920×1080px (Max 5MB)</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature on Homepage</span>
                <button
                  onClick={() => handleChange('isFeatured', !form.isFeatured)}
                  className={`toggle-track ${form.isFeatured ? 'checked bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                ><div className="toggle-thumb" /></button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Project</span>
                <button
                  onClick={() => handleChange('isInternal', !form.isInternal)}
                  className={`toggle-track ${form.isInternal ? 'checked bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                ><div className="toggle-thumb" /></button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</span>
                <button
                  onClick={() => handleChange('isPublished', !form.isPublished)}
                  className={`toggle-track ${form.isPublished ? 'checked bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                ><div className="toggle-thumb" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => onDiscard(project)}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Discard
          </button>
          <button
            onClick={() => onUpdate(form._id, form)}
            className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Update Project Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, views: 0, featured: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [projRes, homeRes] = await Promise.all([api.get('/projects'), api.get('/home')]);
      setProjects(projRes.data);
      const featured = projRes.data.filter((p) => p.isFeatured).length;
      setStats({ total: projRes.data.length, views: homeRes.data.portfolioViews || 0, featured: `${featured}/${projRes.data.length}` });
      if (projRes.data.length > 0) setSelectedId(projRes.data[0]._id);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    try {
      const { data } = await api.post('/projects', { title: 'New Project', category: 'Web Development', techStack: [], description: '', isPublished: false });
      setProjects([data, ...projects]);
      setSelectedId(data._id);
      toast.success('Project created!');
    } catch { toast.error('Failed to create project'); }
  };

  const handleUpdate = async (id, form) => {
    try {
      const { data } = await api.put(`/projects/${id}`, form);
      setProjects(projects.map((p) => (p._id === id ? data : p)));
      toast.success('Project updated!');
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      const remaining = projects.filter((p) => p._id !== id);
      setProjects(remaining);
      setSelectedId(remaining[0]?._id || null);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const selectedProject = projects.find((p) => p._id === selectedId);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Management Console</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Projects Portfolio</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Manage your engineering case studies and technical projects.</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'TOTAL PROJECTS', value: stats.total },
          { label: 'PORTFOLIO VIEWS', value: stats.views >= 1000 ? `${(stats.views/1000).toFixed(1)}k` : stats.views },
          { label: 'FEATURED', value: stats.featured },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Add new project card */}
      {/* <button
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl py-8 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all mb-5"
      >
        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
          <Plus size={20} />
        </div>
        <span className="text-sm font-medium">Add New Project to Portfolio</span>
      </button> */}

      {/* Selected Project Editor */}
      {selectedProject && (
        <ProjectEditor
          project={selectedProject}
          onUpdate={handleUpdate}
          onDiscard={(orig) => setProjects(projects.map((p) => (p._id === orig._id ? orig : p)))}
        />
      )}

      {/* Other Projects list */}
      {projects.filter((p) => p._id !== selectedId).length > 0 && (
        <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Other Projects</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {projects.filter((p) => p._id !== selectedId).map((p) => (
              <div key={p._id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedId(p._id)}
                >
                  {p.heroImage && <img src={p.heroImage} alt={p.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <button onClick={() => setSelectedId(p._id)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
