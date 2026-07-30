/* ============================================
   PLANORA — Express.js Server (MongoDB edition)
   ============================================ */

require('dotenv').config();

const express    = require('express');
const path       = require('path');
const mongoose   = require('mongoose');

const placesRouter = require('./routes/places');
const Subscriber   = require('./models/Subscriber');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/planora';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`\n🍃 MongoDB connected: ${MONGO_URI}`))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve everything in /public as static files
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/places', placesRouter);

// POST /api/subscribe — newsletter subscription (persisted in MongoDB)
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  try {
    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();

    const total = await Subscriber.countDocuments();
    console.log(`📧 New subscriber: ${email}  (total: ${total})`);

    res.json({ success: true, message: 'Thanks for subscribing! 🎉' });

  } catch (err) {
    // MongoDB duplicate key error code
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You are already subscribed!' });
    }
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const subscriberCount = await Subscriber.countDocuments();
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      subscribers: subscriberCount,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Catch-all — serve index.html for any unmatched GET (SPA-friendly) ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✈️  Planora server running at http://localhost:${PORT}`);
  console.log(`   API → http://localhost:${PORT}/api/places`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
