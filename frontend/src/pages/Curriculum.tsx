import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Curriculum() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<{id: number, name: string, semester: number, file_url?: string}[]>([]);

  useEffect(() => {
    if (token) {
      axios.get('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCourses(res.data))
        .catch(err => console.error("Gagal memuat materi", err));
    }
  }, [token]);

  // Group by semester
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map(num => ({
    num,
    courses: courses.filter(c => c.semester === num)
  })).filter(sem => sem.courses.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Daftar Semester</h1>
        <p className="text-slate-500 mt-2">Pilih mata kuliah berdasarkan kurikulum semestermu.</p>
      </div>

      <div className="space-y-6">
        {semesters.map((sem) => (
          <div key={sem.num} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-lg text-brand-dark">Semester {sem.num}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {sem.courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 text-brand-dark rounded-lg flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-700">{course.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-dark transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
