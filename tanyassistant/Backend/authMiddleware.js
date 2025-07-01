const sessionStore = require('./sessionStore');
const User = require('./models/User');

const authMiddleware = async (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token missing' });

    const { email } = sessionStore.get(token);
    if (!email) return res.status(401).json({ error: 'Invalid session token' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // bundan sonra route'larda `req.user` üzerinden erişebilirsin
    next();
};

module.exports = authMiddleware;
