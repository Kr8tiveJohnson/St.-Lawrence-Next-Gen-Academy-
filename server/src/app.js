const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalLimiter } = require('./middleware/rateLimiter');

// Import all route handlers
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const classroomRoutes = require('./routes/classroom.routes');
const chatRoutes = require('./routes/chat.routes');
const newsRoutes = require('./routes/news.routes');
const pastQuestionRoutes = require('./routes/pastQuestion.routes');
const friendRoutes = require('./routes/friend.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const siteContentRoutes = require('./routes/siteContent.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const cbtRoutes = require('./routes/cbt.routes');
const tipsRoutes = require('./routes/tips.routes');
const resourceRoutes = require('./routes/resources.routes');
const assignmentRoutes = require('./routes/assignments.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();

// Disable X-Powered-By header to obscure Express framework fingerprinting
app.disable('x-powered-by');

// Apply HTTP Security Headers via Helmet
app.use(helmet());

// CORS Whitelist Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (such as mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access denied for this origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-paystack-signature']
}));

// Apply global rate limiting across all API endpoints
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/questions', pastQuestionRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/cbt', cbtRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/progress', progressRoutes);

// Safe Root route (No route map exposure)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'St. Lawrence Next Gen Academy API',
    status: 'online',
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'St. Lawrence Next Gen API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
