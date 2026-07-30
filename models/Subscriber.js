/* ============================================
   PLANORA — Mongoose Model: Subscriber
   ============================================ */

const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.'],
    },
  },
  {
    timestamps: true,   // adds createdAt / updatedAt
    versionKey: false,
  }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
