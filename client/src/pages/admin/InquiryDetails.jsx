import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, CheckCircle2, Archive, MessageSquare, Clock, User, Mail } from 'lucide-react';

const statusBadge = (status) => {
  const map = {
    unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const InquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiryDetails();
  }, [id]);

  const fetchInquiryDetails = async () => {
    try {
      const res = await api.get(`/inquiries/${id}`);
      setInquiry(res.data);
      
      // Auto-update unread status to 'replied' or read state if your backend logic demands it upon viewing
    } catch {
      toast.error('Could not find inquiry details');
      navigate('/admin/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { data } = await api.put(`/inquiries/${id}`, { status: newStatus });
      setInquiry(data);
      toast.success(`Inquiry marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message permanently?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry removed successfully');
      navigate('/admin/inquiries');
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in w-full px-4 sm:px-0">
      {/* Top Controls Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/admin/inquiries" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors">
            <ArrowLeft size={16} /> Back to inquiries
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-md">
            {inquiry.subject || 'No Subject Line'}
          </h1>
        </div>

        {/* Dynamic Action Buttons Container */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {inquiry.status !== 'replied' && (
            <button
              onClick={() => updateStatus('replied')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 size={14} /> Mark Replied
            </button>
          )}
          {inquiry.status !== 'archived' && (
            <button
              onClick={() => updateStatus('archived')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity"
            >
              <Archive size={14} /> Archive
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:opacity-90 transition-opacity"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Main Mail Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Header Metadata */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
                {inquiry.senderName?.charAt(0) || <User size={14} />}
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">{inquiry.senderName}</h2>
                <a href={`mailto:${inquiry.senderEmail}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5">
                  <Mail size={12} /> {inquiry.senderEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right w-full sm:w-auto justify-between sm:justify-start">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(inquiry.status)}`}>
              {inquiry.status}
            </span>
            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
              <Clock size={12} />
              {new Date(inquiry.createdAt).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            <MessageSquare size={12} />
            <span>Message Content</span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 whitespace-pre-wrap break-words">
            {inquiry.message || <span className="italic text-gray-400">This submission didn't contain a message body.</span>}
          </div>
        </div>

        {/* Quick External Actions Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 flex justify-end">
          <a
            href={`mailto:${inquiry.senderEmail}?subject=Re: ${encodeURIComponent(inquiry.subject || '')}`}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetails;