const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken } = require('../utils/tokenHelper');
const sanitizeUser = require('../utils/sanitizeUser');

async function register(req, res) {
  try {
    const { email, password, fullName, phone, dateOfBirth } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            fullName,
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
          }
        }
      },
      include: {
        profile: true
      }
    });

    const token = generateToken(user);
    const safeUser = sanitizeUser(user, user.id, user.role);

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user, user.id, user.role);

    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

async function me(req, res) {
  try {
    // req.user is set by authMiddleware
    const safeUser = sanitizeUser(req.user, req.user.id, req.user.role);
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  me
};
