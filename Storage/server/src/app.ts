import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.config';
import { connectRedis } from './config/redis.config';
import authRoutes from './routes/auth.route';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8081' }));

// Routes
app.use('/auth', authRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Initialize services
const initializeServices = async () => {
  try {
    await Promise.all([connectDB(), connectRedis()]);
    console.log('Services connected successfully');
    
    // Start server
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server started at http://localhost:3000');
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

initializeServices();   