// routes/savedUsers.js
const express = require('express');
const router = express.Router();
const SavedUser = require('../models/SavedUser');
const authMiddleware = require('../authMiddleware');

// GET /api/saved-users - Kendi kayıtlı kullanıcılarını getir
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await SavedUser.find({ owner: req.user._id });
    const usernames = users.map(u => u.username);
    res.json(usernames);
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcılar alınamadı', details: err });
  }
});

// DELETE /api/saved-users/:username - Kendi kayıtlarından kullanıcı sil
router.delete('/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const deleted = await SavedUser.findOneAndDelete({
      username,
      owner: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ message: 'Kullanıcı silindi', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Silme sırasında hata oluştu', details: err });
  }
});

// POST /api/saved-users - Yeni kullanıcı ekle
router.post('/', authMiddleware, async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username gerekli' });

  try {
    // Aynı kullanıcı daha önce bu kullanıcıya ait olarak eklenmiş mi?
    const existing = await SavedUser.findOne({
      username,
      owner: req.user._id
    });

    if (existing) return res.status(200).json({ message: 'Zaten kayıtlı' });

    const newUser = new SavedUser({
      username,
      owner: req.user._id
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu', details: err });
  }
});

module.exports = router;
