import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other'];

const SkillBar = ({ proficiency }) => (
  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full skill-bar-fill"
      style={{ width: `${proficiency}%` }}
    />
  </div>
);

const SkillRow = ({ skill, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(skill);

  const save = () => { onUpdate(skill._id, form); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 text-sm px-2 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="text-sm px-2 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0} max={100}
            value={form.proficiency}
            onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
            className="w-24 accent-indigo-600"
          />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 w-8">{form.proficiency}%</span>
        </div>
        <button onClick={save} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"><Check size={14} /></button>
        <button onClick={() => setEditing(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><X size={14} /></button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{skill.name[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{skill.name}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{skill.proficiency}%</span>
        </div>
        <SkillBar proficiency={skill.proficiency} />
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
          <Edit2 size={13} />
        </button>
        <button onClick={() => onDelete(skill._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 80 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    return acc;
  }, {});

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    try {
      const { data } = await api.post('/skills', newSkill);
      setSkills([...skills, data]);
      setNewSkill({ name: '', category: 'Frontend', proficiency: 80 });
      setAdding(false);
      toast.success('Skill added!');
    } catch { toast.error('Failed to add skill'); }
  };

  const handleUpdate = async (id, form) => {
    try {
      const { data } = await api.put(`/skills/${id}`, form);
      setSkills(skills.map((s) => (s._id === id ? data : s)));
      toast.success('Updated!');
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your technical skills and proficiency levels.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5 mb-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">New Skill</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24">Proficiency</label>
            <input
              type="range" min={0} max={100}
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-10">{newSkill.proficiency}%</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Add Skill</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{category}</h3>
              <span className="text-xs text-gray-400">{catSkills.length} skill{catSkills.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="p-2">
              {catSkills.map((skill) => (
                <SkillRow key={skill._id} skill={skill} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <p>No skills yet. Add your first skill!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
