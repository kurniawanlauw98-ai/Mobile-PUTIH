import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, PlayCircle, BookOpen, PenTool } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    if (token) {
      axios.get('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const c = res.data.find((x: any) => x.id.toString() === id);
          setCourseData(c);
        })
        .catch(err => console.error(err));
    }
  }, [id, token]);

  if (!courseData) return <div className="p-8 text-center text-slate-500">Memuat Materi...</div>;

  const course = {
    id: courseData.id,
    name: courseData.name,
    file_url: courseData.file_url,
    description: "Mata kuliah ini membahas konsep-konsep dasar, asas-asas, dan sistem hukum yang berlaku.",
    progress: 0,
    modules: [
      { title: "Kuis Modul 1", type: "quiz", duration: "10 Soal" }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-brand-dark text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm inline-block mb-4">Semester 1</span>
          <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
          <p className="text-white/80 max-w-2xl leading-relaxed">{course.description}</p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Materi Pembelajaran</h2>
          <div className="space-y-4">
            {course.modules.map((mod, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-brand-dark/30 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    mod.type === 'pdf' ? 'bg-red-50 text-red-500' :
                    mod.type === 'video' ? 'bg-blue-50 text-blue-500' :
                    'bg-green-50 text-green-500'
                  }`}>
                    {mod.type === 'pdf' ? <FileText className="w-6 h-6" /> :
                     mod.type === 'video' ? <PlayCircle className="w-6 h-6" /> :
                     <PenTool className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-brand-dark transition-colors">{mod.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{mod.duration}</p>
                  </div>
                </div>
                <button 
                  onClick={() => mod.type === 'quiz' ? navigate(`/quiz/${id}`) : alert('Buka materi...')}
                  className="px-4 py-2 bg-slate-50 text-brand-dark text-sm font-medium rounded-lg group-hover:bg-brand-dark group-hover:text-white transition-all"
                >
                  {mod.type === 'quiz' ? 'Mulai' : 'Buka'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Progress Belajar</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Diselesaikan</span>
                <span className="font-medium text-brand-dark">{course.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-brand-dark h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-dark text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="relative z-10 text-center space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-8 h-8 text-brand-accent/50" />
                <h1 className="text-xl font-bold text-white">Akses Materi</h1>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => course.file_url ? window.open(course.file_url, '_blank') : alert('Admin belum mengunggah file materi untuk mata kuliah ini.')}
                  className="bg-brand-accent text-brand-dark px-6 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Baca Modul Materi</span>
                </button>
                <button 
                  onClick={() => navigate(`/quiz/${course.id}`)}
                  className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Mulai Kuis Pelatihan</span>
                </button>
              </div>
            </div>
            <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
