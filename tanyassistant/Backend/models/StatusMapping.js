const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    mapping: Object,
});

module.exports = mongoose.model('StatusMapping', schema);
