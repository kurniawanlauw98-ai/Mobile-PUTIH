import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ChevronRight, XCircle, ArrowLeft } from 'lucide-react';

export default function Quiz() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Gagal mengambil data kuis.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchQuiz();
  }, [id, token]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/quiz/${id}/submit`, { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err: any) {
      alert('Gagal mengirim jawaban.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat Kuis...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  if (!quiz) return <div className="p-8 text-center">Kuis tidak ditemukan.</div>;

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Hasil Kuis</h2>
          <div className="text-5xl font-black text-brand-dark my-6">{result.score}<span className="text-2xl text-slate-400">/100</span></div>
          <p className="text-slate-600 mb-6">Kamu telah menyelesaikan {quiz.title}.</p>
          <button onClick={() => navigate(`/course/${id}`)} className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold hover:bg-brand-dark/90 transition-all flex items-center mx-auto space-x-2">
            <ArrowLeft className="w-5 h-5"/>
            <span>Kembali ke Materi</span>
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 px-4">Review Jawaban:</h3>
          {result.results.map((res: any, idx: number) => {
            const q = quiz.questions.find((q: any) => q.id === res.questionId);
            return (
              <div key={idx} className={`p-6 rounded-2xl border ${res.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start space-x-4">
                  {res.isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"/> : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1"/>}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">{idx + 1}. {q?.question}</h4>
                    <div className="text-sm bg-white p-4 rounded-xl shadow-sm mb-3">
                      <span className="block font-medium text-slate-500 mb-1">Jawaban Benar:</span>
                      <span className="font-bold text-brand-dark">{res.correctAnswer}</span>
                    </div>
                    <p className="text-sm text-slate-600"><span className="font-semibold">Pembahasan:</span> {res.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h1>
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Soal {currentQuestion + 1} dari {quiz.questions.length}</span>
          <span>Progress: {Math.round(((currentQuestion) / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-brand-dark h-2 rounded-full transition-all" style={{width: `${((currentQuestion) / quiz.questions.length) * 100}%`}}></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(q.id, idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answers[q.id] === idx 
                  ? 'bg-blue-50 border-brand-dark text-brand-dark font-semibold' 
                  : 'bg-white border-slate-200 hover:border-brand-dark/40 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === idx ? 'border-brand-dark' : 'border-slate-300'}`}>
                  {answers[q.id] === idx && <div className="w-2.5 h-2.5 bg-brand-dark rounded-full"></div>}
                </div>
                <span>{opt}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          {currentQuestion < quiz.questions.length - 1 ? (
            <button 
              disabled={answers[q.id] === undefined}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-5 h-5"/>
            </button>
          ) : (
            <button 
              disabled={answers[q.id] === undefined}
              onClick={handleSubmit}
              className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-dark/90 shadow-md disabled:opacity-50"
            >
              Kirim & Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
