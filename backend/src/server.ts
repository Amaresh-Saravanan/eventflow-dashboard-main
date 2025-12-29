import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import ticketRoutes from './routes/ticketRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'EventFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      events: '/api/events',
      tickets: '/api/tickets',
      users: '/api/users'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log('🚀 EventFlow Backend Started!');
  console.log('================================');
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Server: http://localhost:${config.port}`);
  console.log(`💚 Health: http://localhost:${config.port}/health`);
  console.log(`📚 API Base: http://localhost:${config.port}/api`);
  console.log('================================');
});

export default app;
