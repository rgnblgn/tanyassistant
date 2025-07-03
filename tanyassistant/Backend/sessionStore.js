// sessionStore.js
const Session = require('./models/Session');

const sessionStore = {
    async set(token, { email }) {
        await Session.updateOne(
            { token },
            { $set: { token, email, createdAt: new Date() } },
            { upsert: true }
        );
    },

    async get(token) {
        const session = await Session.findOne({ token });
        return session ? { email: session.email } : null;
    },

    async delete(token) {
        await Session.deleteOne({ token });
    }
};

module.exports = sessionStore;
