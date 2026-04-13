import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bot, LogOut, GraduationCap, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menu = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Daftar Semester', icon: BookOpen, path: '/curriculum' },
    { name: 'AI Tutor', icon: Bot, path: '/ai-tutor' },
  ];

  const { user } = useAuth();
  if (user?.role === 'admin') {
    menu.push({ name: 'Upload Materi', icon: Settings, path: '/admin' });
  }

  return (
    <div className="w-64 h-screen bg-brand-dark text-white fixed top-0 left-0 flex flex-col shadow-xl">
      <div className="p-6 flex items-center space-x-3 mb-6">
        <GraduationCap className="w-8 h-8 text-brand-accent" />
        <h1 className="text-xl font-bold tracking-wide">UT Hukum<span className="text-brand-accent">.</span></h1>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-brand-accent font-medium' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white transition-colors w-full rounded-lg hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
