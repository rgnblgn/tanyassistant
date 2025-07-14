// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authMiddleware = require('./authMiddleware');

dotenv.config();

const aiRoute = require('./ai');
const jiraRoute = require('./routes/jira');
const savedUsersRoute = require('./routes/savedUsers');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

// MODELLER

// Meeting
const meetingSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  title: String,
  content: String,
  date: String,
});
const Meeting = mongoose.model('Meeting', meetingSchema);

// Daily
const dailySchema = new mongoose.Schema({
  owner: { type: String, required: true },
  assign: String,
  issues: [
    {
      title: String,
      comments: String,
      key: String,
    },
  ],
  date: String,
});
const Daily = mongoose.model('Daily', dailySchema);

// ROUTES

// Auth ve Modül Rotaları
app.use('/api/auth', auth);
app.use('/api/ai', aiRoute);
app.use('/api/jira', jiraRoute);
app.use('/api/saved-users', savedUsersRoute);

// Meeting Routes
app.get('/api/meetings', authMiddleware, async (req, res) => {
  const meetings = await Meeting.find({ owner: req.user.email }).sort({ date: -1 });
  res.json(meetings);
});

app.post('/api/meetings', authMiddleware, async (req, res) => {
  const { title, content, date } = req.body;
  const meeting = new Meeting({ owner: req.user.email, title, content, date });
  await meeting.save();
  res.status(201).json(meeting);
});

app.get('/api/meetings/:id', authMiddleware, async (req, res) => {
  const meeting = await Meeting.findOne({ _id: req.params.id, owner: req.user.email });
  if (!meeting) return res.status(404).json({ message: 'Not found' });
  res.json(meeting);
});

app.delete('/api/meetings/:id', authMiddleware, async (req, res) => {
  await Meeting.deleteOne({ _id: req.params.id, owner: req.user.email });
  res.json({ message: 'Deleted' });
});

// Daily Routes
app.get('/api/daily', authMiddleware, async (req, res) => {
  const dailyData = await Daily.find({ owner: req.user.email }).sort({ date: -1 });
  res.json(dailyData);
});

app.post('/api/daily', authMiddleware, async (req, res) => {
  const { assign, issues, date } = req.body;
  const newRecord = new Daily({ owner: req.user.email, assign, issues, date });
  await newRecord.save();
  res.status(201).json(newRecord);
});

app.delete('/api/daily/:id', authMiddleware, async (req, res) => {
  await Daily.deleteOne({ _id: req.params.id, owner: req.user.email });
  res.json({ message: 'Deleted' });
});

// AI Generate (Mock API)
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt,
        stream: true
      })
    });
    const data = await response.json();
    res.json({ result: data.response });
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: 'AI failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
});
