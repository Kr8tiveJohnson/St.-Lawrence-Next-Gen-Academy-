const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter for all API endpoints
 * Allows 300 requests per 15 minutes per IP
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP address, please try again after 15 minutes.'
  }
});

/**
 * Strict rate limiter for Authentication endpoints (login, register, admin-login)
 * Mitigates brute-force credential stuffing: max 10 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Rate limiter for newsletter subscriptions to prevent email spam / inbox floods
 * Max 5 subscription attempts per hour per IP
 */
const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many newsletter subscription requests from this IP. Please try again later.'
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  newsletterLimiter
};
