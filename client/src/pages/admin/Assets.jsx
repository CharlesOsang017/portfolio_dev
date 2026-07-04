import { useState, useEffect, useRef } from 'react';
import { Upload, Image, Trash2, Copy, RefreshCw, File } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { fetchAssets(); }, []);

  const fetchAssets = async () => {
    try {
      const { data } = await api.get('/assets');
      setAssets(data);
    } catch { toast.error('Failed to load assets'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { data } = await api.post('/assets/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setAssets((prev) => [...prev, { filename: file.name, url: data.url, size: file.size }]);
      } catch { toast.error(`Failed to upload ${file.name}`); }
    }
    setUploading(false);
    toast.success('Upload complete!');
  };

  const handleDelete = async (filename) => {
    try {
      await api.delete(`/assets/${filename}`);
      setAssets(assets.filter((a) => a.filename !== filename));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your uploaded files and images.</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center mb-6 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload({ target: { files: e.dataTransfer.files } }); }}
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Images (JPG, PNG, GIF, WebP, SVG) and PDFs. Max 10MB each.</p>
      </div>

      {/* Grid */}
      {assets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.filename} className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {isImage(asset.filename) ? (
                  <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                ) : (
                  <File size={32} className="text-gray-400" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{asset.filename}</p>
                {asset.size && <p className="text-xs text-gray-400">{formatBytes(asset.size)}</p>}
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleCopy(asset.url)} className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100 transition-colors">
                  <Copy size={14} />
                </button>
                <button onClick={() => handleDelete(asset.filename)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Image size={40} className="mx-auto mb-3 opacity-40" />
          <p>No assets uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default Assets;
