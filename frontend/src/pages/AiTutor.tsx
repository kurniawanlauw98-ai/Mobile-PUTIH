import { useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AiTutor() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Saya adalah AI Tutor Ilmu Hukum khusus untuk mahasiswa UT. Ada materi hukum atau pasal yang ingin kamu diskusikan hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', 
        { message: userMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, terjadi kesalahan saat menghubungi server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[90vh] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-brand-dark px-6 py-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-accent" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">AI Tutor Hukum</h2>
          <p className="text-white/70 text-xs text-brand-accent">Asisten Pembelajaran UT AI-Powered</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex max-w-[80%] ${msg.role === 'user' ? 'ml-auto space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 ml-4' : 'bg-brand-dark text-brand-accent'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-dark text-white rounded-tr-none' : 'bg-white shadow-sm border border-slate-100 text-slate-800 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex space-x-4 max-w-[80%]">
             <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-dark text-brand-accent flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={sendMessage} className="flex relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan tentang hukum perdata, pidana, dsb..."
            className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-dark text-white rounded-full flex items-center justify-center hover:bg-brand-dark/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
