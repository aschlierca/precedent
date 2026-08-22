require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { requireAuth } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const contactsRoutes = require('./routes/contacts');
const careerHistoryRoutes = require('./routes/careerHistory');
const groupsRoutes = require('./routes/groups');

if (process.env.AUTH_BYPASS === 'true' && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_BYPASS must not be enabled in production');
}

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/contacts', requireAuth, contactsRoutes);
app.use('/api/career-history', requireAuth, careerHistoryRoutes);
app.use('/api/groups', requireAuth, groupsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
