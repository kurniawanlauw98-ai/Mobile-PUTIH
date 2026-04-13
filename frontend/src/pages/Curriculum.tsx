import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

export default function Curriculum() {
  const semesters = [
    { num: 1, courses: [{ id: 1, name: "Pengantar Ilmu Hukum" }, { id: 2, name: "Pengantar Ilmu Sosial" }, { id: 3, name: "Pendidikan Kewarganegaraan" }] },
    { num: 2, courses: [{ id: 4, name: "Hukum Perdata" }, { id: 5, name: "Hukum Pidana" }, { id: 6, name: "Hukum Tata Negara" }] },
    { num: 3, courses: [{ id: 7, name: "Hukum Administrasi Negara" }, { id: 8, name: "Hukum Internasional" }] },
  ];

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
