import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, RefreshCw, Terminal, Settings, Layers, Layout, Database, Cloud, CheckSquare } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Perfectly mirrored to match DB schema definitions with precise icon layout references
const CATEGORY_MAP = [
  { name: 'Programming Languages', icon: Terminal },
  { name: 'DevOps & Tools', icon: Settings },
  { name: 'JavaScript Libraries & Frameworks', icon: Layers },
  { name: 'Web Frameworks', icon: Layout },
  { name: 'Backend as a Service', icon: Cloud },
  { name: 'Databases', icon: Database },
  { name: 'Testing', icon: CheckSquare }
];

const CATEGORIES = CATEGORY_MAP.map(c => c.name);

const SkillRow = ({ skill, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(skill);

  const save = () => { 
    onUpdate(skill._id, form); 
    setEditing(false); 
  };

  if (editing) {
    return (
      <div className="w-full flex flex-col gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-fade-in">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-zinc-400"
          placeholder="Skill name"
          autoFocus
        />
        
        <div className="flex items-center justify-between gap-2">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="flex-1 text-[11px] max-w-[140px] px-1.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={save} 
              className="p-1.5 text-emerald-600 cursor-pointer dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
              title="Save changes"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={() => setEditing(false)} 
              className="p-1.5 text-zinc-400 cursor-pointer dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/40 transition-all duration-150">
      <span className="truncate pr-2">{skill.name}</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button 
          onClick={() => {
            setForm(skill); 
            setEditing(true);
          }} 
          className="p-1 text-zinc-500 cursor-pointer dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <Edit2 size={11} />
        </button>
        <button onClick={() => onDelete(skill._id)} className="p-1 text-zinc-400 cursor-pointer dark:text-zinc-500 hover:text-red-500 transition-colors">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Programming Languages' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch { 
      toast.error('Failed to load skills'); 
    } finally { 
      setLoading(false); 
    }
  };

  const grouped = CATEGORY_MAP.reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat.name);
    acc[cat.name] = {
      icon: cat.icon,
      items: catSkills
    };
    return acc;
  }, {});

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    
    // Split input values by commas and clean spaces
    const skillNames = newSkill.name.split(',').map(name => name.trim()).filter(name => name.length > 0);
    
    if (skillNames.length === 0) return;

    try {
      // Execute all postings concurrently
      await Promise.all(
        skillNames.map(name => 
          api.post('/skills', { name, category: newSkill.category })
        )
      );
      
      fetchData();
      setNewSkill({ name: '', category: 'Programming Languages' });
      setAdding(false);
      toast.success(skillNames.length > 1 ? 'All skills added successfully!' : 'Skill added successfully!');
    } catch (error) { 
      const errMsg = error.response?.data?.error || 'Failed to add one or more skills';
      toast.error(errMsg.includes('duplicate key') ? 'One of these skill names already exists!' : errMsg); 
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      const { data } = await api.put(`/skills/${id}`, form);
      setSkills(skills.map((s) => (s._id === id ? data : s)));
      toast.success('Updated!');
    } catch { 
      toast.error('Update failed'); 
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success('Deleted');
    } catch { 
      toast.error('Delete failed'); 
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-zinc-400" /></div>;

  // Filter out any categories that have zero skills mapped to them
  const visibleCategories = Object.entries(grouped).filter(([_, data]) => data.items.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header Grid Placement */}
      <div className="flex items-center justify-between mb-10 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Skills Management Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Populate, adjust and coordinate items inside your portfolio deck blocks.</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          {adding ? <X size={16} /> : <Plus size={16} />}
          {adding ? 'Close Panel' : 'Add Skill'}
        </button>
      </div>

      {/* Add Skill Box */}
      {adding && (
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 mb-8 animate-fade-in shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">Append New Entries</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Skill Name(s)</label>
              <input
                type="text"
                placeholder="Separate multiple with commas, e.g. Go, GraphQL, AWS"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Placement Block Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={handleAdd} className="px-5 py-2.5 cursor-pointer bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
              Save Entry
            </button>
          </div>
        </div>
      )}

      {/* Grid Match Rendering */}
      {visibleCategories.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-sm text-zinc-400 italic">Your deck is empty. Open the panel above to append your skills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCategories.map(([categoryName, data]) => {
            const Icon = data.icon;
            return (
              <div 
                key={categoryName} 
                className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col justify-between shadow-sm dark:shadow-none"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} className="text-zinc-400 dark:text-zinc-500" />
                      <h3 className="text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">{categoryName}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full font-bold">
                      {data.items.length}
                    </span>
                  </div>

                  {/* Badges Layout Container */}
                  <div className="flex flex-wrap gap-2">
                    {data.items.map((skill) => (
                      <SkillRow 
                        key={skill._id} 
                        skill={skill} 
                        onUpdate={handleUpdate} 
                        onDelete={handleDelete} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Skills;