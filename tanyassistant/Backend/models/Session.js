// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // 7 gün sonra silinir
});

module.exports = mongoose.model('Session', sessionSchema);
