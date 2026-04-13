import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal.');
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
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Login Mahasiswa</h2>
        <p className="text-center text-slate-500 mb-8">Masuk ke platform belajar digital UT</p>

        {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all outline-none" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all outline-none" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-dark/90 transition-all shadow-md mt-4">
            Masuk
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-600">
          Belum punya akun? <Link to="/register" className="text-brand-dark font-semibold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
