// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Meeting Model
const meetingSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Daily Model
const dailySchema = new mongoose.Schema({
  assign: String,
  issues: [
    {
      title: String,
      comments: String
    }
  ],
  date: String
});

const Daily = mongoose.model('Daily', dailySchema);

// Routes - Meeting
app.get('/api/meetings', async (req, res) => {
  const meetings = await Meeting.find().sort({ date: -1 });
  res.json(meetings);
});

app.post('/api/meetings', async (req, res) => {
  const { title, content, date } = req.body;
  const meeting = new Meeting({ title, content, date });
  await meeting.save();
  res.status(201).json(meeting);
});

app.get('/api/meetings/:id', async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) return res.status(404).json({ message: 'Not found' });
  res.json(meeting);
});

app.delete('/api/meetings/:id', async (req, res) => {
  await Meeting.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Routes - Daily
app.post('/api/daily', async (req, res) => {
  const { assign, issues, date } = req.body;
  const record = new Daily({ assign, issues, date });
  await record.save();
  res.status(201).json(record);
});

app.get('/api/daily', async (req, res) => {
  const data = await Daily.find();
  res.json(data);
});

app.delete('/api/daily/:id', async (req, res) => {
  await Daily.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
