import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, MoreHorizontal, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const statusBadge = (status) => {
  const map = {
    unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    replied: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return map[status] || map.replied;
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      setInquiries(res.data);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryStatus = async (e, id, status) => {
    e.stopPropagation(); // Prevents navigating to details page when clicking actions
    try {
      const { data } = await api.put(`/inquiries/${id}`, { status });
      setInquiries(inquiries.map((i) => (i._id === id ? data : i)));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const handleDeleteInquiry = async (e, id) => {
    e.stopPropagation(); // Prevents navigating to details page when clicking actions
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-5xl animate-fade-in w-full">
      <div className="mb-6">
        <Link to="/admin/contact" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors">
          <ArrowLeft size={16} /> Back to settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Form Inquiries</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Total Submissions: {inquiries.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                {['DATE', 'SENDER', 'SUBJECT', 'STATUS', 'ACTION'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {inquiries.map((inq) => (
                <tr 
                  key={inq._id} 
                  onClick={() => navigate(`/admin/inquiries/${inq._id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(inq.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{inq.senderName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{inq.senderEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm break-words">{inq.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(inq.status)}`}>
                      {inq.status === 'unread' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group/menu">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-gray-400" />
                      </button>
                      <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-10 hidden group-hover/menu:block animate-fade-in">
                        {['replied', 'archived', 'unread'].filter(s => s !== inq.status).map((s) => (
                          <button key={s} onClick={(e) => handleInquiryStatus(e, inq._id, s)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 capitalize first:rounded-t-xl">
                            Mark as {s}
                          </button>
                        ))}
                        <button onClick={(e) => handleDeleteInquiry(e, inq._id)} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl">
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
            <div className="text-center py-24 text-gray-400 dark:text-gray-600">
              <Mail size={44} className="mx-auto mb-2 opacity-40" />
              <p className="text-base font-medium">No inbox messages yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inquiries;