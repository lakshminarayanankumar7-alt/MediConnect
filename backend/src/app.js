import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// CORS configuration for controlled cross-origin access
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);

// Root greeting / fallback
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediConnect Healthcare API Service',
  });
});

// Centralized 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
