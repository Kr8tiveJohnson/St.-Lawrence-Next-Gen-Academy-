const express = require('express');
const cors = require('cors');

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

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
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

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'St. Lawrence Next Gen API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
