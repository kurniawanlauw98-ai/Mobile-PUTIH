require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_ut_hukum';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// Mock Database
const users = [
  { id: 1, name: 'Admin Pusat', email: 'admin@ut.ac.id', password: bcrypt.hashSync('admin123', 10), semester: 0, role: 'admin' }
];
const courses = [
  { id: 1, name: "Pengantar Ilmu Hukum", semester: 1 },
  { id: 2, name: "Pengantar Ilmu Sosial", semester: 1 },
  { id: 4, name: "Hukum Perdata", semester: 2 },
  { id: 5, name: "Hukum Pidana", semester: 2 }
];

const quizzes = {
  "1": {
    courseId: 1,
    title: "Kuis Pengantar Ilmu Hukum Modul 1",
    questions: [
      { id: 1, question: "Hukum menurut Van Apeldoorn adalah...", options: ["Peraturan yang memaksa", "Gejala sosial, tidak ada definisi pasti", "Aturan kebiasaan", "Hukum adat semata"], correctAnswer: 1, explanation: "Van Apeldoorn menyatakan sangat sulit memberikan definisi hukum karena meliputi begitu banyak aspek sosial." },
      { id: 2, question: "Sumber hukum formal di Indonesia tertinggi adalah...", options: ["Undang-Undang", "Peraturan Pemerintah", "UUD 1945", "Ketetapan MPR"], correctAnswer: 2, explanation: "Hierarki tertinggi peraturan di Indonesia adalah UUD 1945." }
    ]
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Akses ditolak.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token kadaluarsa.' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, semester } = req.body;
  if (!name || !email || !password || !semester) return res.status(400).json({ error: 'Wajib diisi' });
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ error: 'Email terdaftar' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, semester, password: hashedPassword, role: 'student' };
  users.push(newUser);
  res.status(201).json({ message: 'Registrasi berhasil' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Salah kredensial' });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Salah kredensial' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, semester: user.semester, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, semester: user.semester, role: user.role } });
});

app.get('/api/courses', authenticateToken, (req, res) => {
  res.json(courses);
});

app.post('/api/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Hanya Admin yang bisa upload materi' });
  const { name, semester } = req.body;
  if (!name || !semester) return res.status(400).json({ error: 'Nama dan semester materi wajib diisi' });
  const newCourse = { id: Date.now(), name, semester };
  courses.push(newCourse);
  res.status(201).json({ message: 'Materi berhasil diunggah', course: newCourse });
});

app.get('/api/quiz/:courseId', authenticateToken, (req, res) => {
  const quiz = quizzes[req.params.courseId];
  if (!quiz) return res.status(404).json({ error: 'Tidak ditemukan.' });
  const safeQuiz = { ...quiz, questions: quiz.questions.map(q => ({ id: q.id, question: q.question, options: q.options })) };
  res.json(safeQuiz);
});

app.post('/api/quiz/:courseId/submit', authenticateToken, (req, res) => {
  const { answers } = req.body;
  const quiz = quizzes[req.params.courseId];
  if (!quiz) return res.status(404).json({ error: 'Tidak ditemukan.' });
  let score = 0;
  const results = quiz.questions.map(q => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) score += 1;
    return { questionId: q.id, isCorrect, correctAnswer: q.options[q.correctAnswer], explanation: q.explanation };
  });
  res.json({ score: Math.round((score / quiz.questions.length) * 100), results });
});

app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message req' });
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    return res.json({ reply: `[MOCK AI] Ini adalah balasan simulasi untuk: "${message}"` });
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Kamu adalah AI Tutor untuk mahasiswa UT Ilmu Hukum..." },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Kesalahan AI.' });
  }
});

// IMPORTANT: Jangan tambah app.listen jika dijalankan di Vercel Serverless
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running locally on port ${PORT}`));
}

module.exports = app;
