require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cbtRoutes = require('./routes/cbt.routes');

const app = express();
const PORT = process.env.PORT || 5001;

app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access denied for this origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount CBT routes both at root and /api/cbt for maximum compatibility
app.use('/api/cbt', cbtRoutes);
app.use('/cbt', cbtRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    service: 'St. Lawrence Next Gen Academy - Dedicated CBT Engine',
    status: 'online',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'St. Lawrence Next Gen Academy - Dedicated CBT Service',
    status: 'online',
    endpoints: {
      health: '/api/health',
      questions: '/api/cbt/questions',
      startExam: 'POST /api/cbt/exam/start',
      submitExam: 'POST /api/cbt/exam/submit',
      attempts: 'GET /api/cbt/attempts/me'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('CBT Service Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎯 St. Lawrence CBT Microservice is running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = app;
