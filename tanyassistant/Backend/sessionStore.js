const store = {};

module.exports = {
    set: (token, data) => { store[token] = data },
    get: (token) => store[token],
    delete: (token) => { delete store[token]; }
};
