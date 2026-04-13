import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [semester, setSemester] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', { name, email, password, semester });
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registrasi gagal.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-brand-accent" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Daftar Akun Baru</h2>
        <p className="text-center text-slate-500 mb-8">Bergabung dengan platform belajar digital UT</p>

        {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
        {success && <div className="p-3 mb-6 bg-green-50 text-green-600 rounded-lg text-sm text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-dark/20" 
              value={name} onChange={e => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-dark/20" 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" required minLength={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-dark/20" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-dark/20"
              value={semester} onChange={e => setSemester(Number(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl shadow-md mt-6 hover:bg-brand-dark/90 transition-all">
            Daftar Akun
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Sudah punya akun? <Link to="/login" className="text-brand-dark font-semibold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
