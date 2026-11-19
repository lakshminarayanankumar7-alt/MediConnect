import dotenv from 'dotenv';

// 1. Load environment variables first
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap function to establish MongoDB connection before starting the HTTP server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Start Express HTTP Server only after successful DB connection
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `[MediConnect Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
      console.log(`[MediConnect Backend] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[MediConnect Backend] Database check: http://localhost:${PORT}/api/health/db`);
    });

    // Handle unhandled promise rejections gracefully
    process.on('unhandledRejection', (err) => {
      console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle termination signals
    process.on('SIGTERM', () => {
      console.log('[Server] SIGTERM received. Shutting down gracefully...');
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error(
      `[MediConnect Backend] Server startup aborted due to database connection failure: ${error.message}`
    );
    process.exit(1);
  }
};

startServer();
