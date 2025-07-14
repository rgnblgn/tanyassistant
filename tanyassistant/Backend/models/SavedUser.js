const mongoose = require('mongoose');

const SavedUserSchema = new mongoose.Schema({
  owner: { type: String, required: true }, // email
  username: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedUser', SavedUserSchema);
