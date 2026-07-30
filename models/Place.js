/* ============================================
   PLANORA — Mongoose Model: Place
   ============================================ */

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['trekking', 'nature', 'accommodation', 'food', 'entertainment'],
    },
    height: {
      type: String,
      enum: ['short', 'medium', 'tall'],
      default: 'medium',
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,   // adds createdAt / updatedAt
    versionKey: false,
  }
);

// Index for fast category lookups
placeSchema.index({ category: 1 });

module.exports = mongoose.model('Place', placeSchema);
