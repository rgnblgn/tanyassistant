const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    jiraUsername: String,
    jiraPassword: String,
    jiraBaseUrl: String,
    authToken: String,
});

module.exports = mongoose.model('User', userSchema);
