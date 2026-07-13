const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken } = require('../utils/tokenHelper');
const sanitizeUser = require('../utils/sanitizeUser');

async function register(req, res) {
  try {
    const { email, password, fullName, phone, dateOfBirth, role } = req.body;

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
        role: role === 'Teacher' ? 'TEACHER' : 'STUDENT',
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
  me,
  adminLogin
};

async function adminLogin(req, res) {
  try {
    const { schoolName, password } = req.body;

    const EXPECTED_NAME = 'St. Lawrence Next Gen Academy';
    const EXPECTED_PASS = process.env.ADMIN_PASSWORD;

    if (!EXPECTED_PASS) {
      return res.status(500).json({ error: 'Admin credentials not configured on server.' });
    }

    if (
      schoolName?.trim().toLowerCase() !== EXPECTED_NAME.toLowerCase() ||
      password !== EXPECTED_PASS
    ) {
      return res.status(401).json({ error: 'Invalid school name or password.' });
    }

    // Generate a special admin-only token (no user record needed)
    const jwt = require('jsonwebtoken');
    const adminToken = jwt.sign(
      { role: 'ADMIN', isStandaloneAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token: adminToken, role: 'ADMIN' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
