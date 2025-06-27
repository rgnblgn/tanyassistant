const mongoose = require('mongoose');

const SavedUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('SavedUser', SavedUserSchema);
