const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
    try {
        return { valid: true, decoded: jwt.verify(token, JWT_SECRET) };
    } catch (error) {
        return { valid: false, error: error.message };
    }
};

module.exports = { generateToken, verifyToken };
