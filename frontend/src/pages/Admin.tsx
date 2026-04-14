import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const [semester, setSemester] = useState(1);
  const [fileUrl, setFileUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak: Khusus Admin Pusat</div>;
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/courses', { name, semester, file_url: fileUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Materi "${name}" berhasil diunggah ke Semester ${semester}!`);
      setName('');
      setFileUrl('');
      setSemester(1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengunggah materi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-brand-dark/10 text-brand-dark rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-500 text-sm">Upload Materi & Modul Baru</p>
          </div>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">
            {error}
        </div>}
        {success && <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{success}</span>
        </div>}

        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Mata Kuliah / Materi</label>
            <input 
              type="text" required
              placeholder="Contoh: Hukum Tata Negara Modul 1"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tautan Materi (Google Drive / PDF)</label>
            <input 
              type="url" required
              placeholder="Contoh: https://drive.google.com/..."
              value={fileUrl} onChange={e => setFileUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Untuk Semester</label>
            <select 
              value={semester} onChange={e => setSemester(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading || !name}
            className="w-full mt-4 flex items-center justify-center space-x-2 bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{loading ? 'Mengunggah...' : 'Upload Materi Baru'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
