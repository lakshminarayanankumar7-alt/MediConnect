import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    General API health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediConnect API is running',
  });
});

/**
 * @route   GET /api/health/db
 * @desc    Database connectivity health check endpoint
 * @access  Public
 */
router.get('/db', (req, res) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isConnected = mongoose.connection.readyState === 1;

  if (isConnected) {
    return res.status(200).json({
      success: true,
      database: 'connected',
    });
  }

  return res.status(503).json({
    success: false,
    database: 'disconnected',
  });
});

export default router;
