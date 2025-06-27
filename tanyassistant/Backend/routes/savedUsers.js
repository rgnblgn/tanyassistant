const express = require('express');
const router = express.Router();
const SavedUser = require('../models/SavedUser');

// GET /api/saved-users
router.get('/', async (req, res) => {
  try {
    const users = await SavedUser.find({});
    const usernames = users.map(u => u.username);
    res.json(usernames);
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcılar alınamadı', details: err });
  }
});

// POST /api/saved-users
router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username gerekli' });

  try {
    // Aynı kullanıcı zaten varsa tekrar ekleme
    const existing = await SavedUser.findOne({ username });
    if (existing) return res.status(200).json({ message: 'Zaten kayıtlı' });

    const newUser = new SavedUser({ username });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu', details: err });
  }
});

module.exports = router;
