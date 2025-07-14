const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    mapping: Object,
    owner: { type: String, required: true },
});

module.exports = mongoose.model('StatusMapping', schema);
