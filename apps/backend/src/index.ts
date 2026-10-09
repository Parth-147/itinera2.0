import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import geminiRouter from './routes/gemini';
import adaptRouter from './routes/adapt';
import weatherRouter from './routes/weather';
import nugenRouter from './routes/nugen';
import tripsRouter from './routes/trips';
import operatorRouter from './routes/operator';
import { FirestoreService } from './services/firestoreService';
import { seedDatabase } from './scripts/seedFirestore';

import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());

// API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Please try again later.' },
});
app.use('/api/', apiLimiter);

// Initialize persistence
FirestoreService.init();

// Seed initial trips if store is ready
seedDatabase().catch((err) => console.error('Auto seed warning:', err));

// Route mounts
app.use('/api/health', healthRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/adapt', adaptRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/nugen', nugenRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/operator', operatorRouter);

// Root fallback
app.get('/', (_req, res) => {
  res.json({
    name: 'ITINERA Backend Platform',
    version: '2.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server exception:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`ITINERA Backend API listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
