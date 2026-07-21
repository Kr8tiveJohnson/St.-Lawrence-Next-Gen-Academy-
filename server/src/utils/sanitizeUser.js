// sanitizeUser.js - Strips sensitive fields before sending user data to client
const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
};

module.exports = { sanitizeUser };
