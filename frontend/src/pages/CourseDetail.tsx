import { useParams, useNavigate } from 'react-router-dom';
import { FileText, PlayCircle, BookOpen, PenTool } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data based on id
  const course = {
    id,
    name: "Pengantar Ilmu Hukum",
    description: "Mata kuliah ini membahas konsep-konsep dasar, asas-asas, dan sistem hukum yang berlaku, khususnya di Indonesia.",
    progress: 45,
    modules: [
      { title: "Modul 1: Konsep Dasar Hukum", type: "pdf", duration: "10 Halaman" },
      { title: " Modul 2: Sumber-sumber Hukum", type: "video", duration: "15 Menit" },
      { title: "Kuis Modul 1 & 2", type: "quiz", duration: "20 Soal" },
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
              <BookOpen className="w-8 h-8 mx-auto text-brand-accent" />
              <h3 className="font-bold">Butuh Bantuan?</h3>
              <p className="text-sm text-white/80">Tanya AI Tutor jika kamu kesulitan memahami materi ini.</p>
              <button onClick={() => navigate('/ai-tutor')} className="w-full py-2 bg-brand-accent text-brand-dark font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                Tanya AI Tutor
              </button>
            </div>
            <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
