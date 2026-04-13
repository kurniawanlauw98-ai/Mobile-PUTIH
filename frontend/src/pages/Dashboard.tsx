import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const ongoingCourses = [
    { id: 1, name: "Pengantar Ilmu Hukum", semester: 1, progress: 65 },
    { id: 2, name: "Hukum Perdata", semester: 2, progress: 30 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Selamat datang, {user?.name || 'Mahasiswa'}! 👋</h1>
        <p className="text-slate-500 mt-2">Terus tingkatkan pemahaman hukummu hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Mata Kuliah Aktif</p>
            <p className="text-2xl font-bold text-slate-800">2</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tugas Selesai</p>
            <p className="text-2xl font-bold text-slate-800">14</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Jam Belajar</p>
            <p className="text-2xl font-bold text-slate-800">32 Jam</p>
          </div>
        </div>
      </div>

      {/* Ongoing Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Lanjutkan Belajar</h2>
          <button className="text-brand-dark text-sm font-medium hover:underline">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ongoingCourses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-brand-dark bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">Semester {course.semester}</span>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-brand-dark transition-colors">{course.name}</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brand-dark h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
