import express from 'express';
import cors from 'cors';
import { checkDatabaseHealth } from './config/db';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import doctorsRouter from './routes/doctors';
import appointmentRouter from './routes/appointment';
import trackRouter from './routes/track';
import treatmentPlanRouter from './routes/treatmentPlan';
import { handleError } from './utils/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://mini-version-of-healthcare-app.vercel.app',  // Production
  'https://mini-version-of-healthcare-mj23r7xzl.vercel.app',  // New production domain
  /^https:\/\/mini-version-of-healthcare-app-.*\.vercel\.app$/,  // Preview deployments
  /^https:\/\/mini-version-of-healthcare-.*\.vercel\.app$/,  // Any healthcare app Vercel deployments
  'http://localhost:3000',  // Local development
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Validate critical env
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable');
}

// Health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const healthResult = await checkDatabaseHealth();
    
    if (healthResult.ok) {
      res.json({
        ok: true,
        message: 'Database connection successful',
        timestamp: healthResult.timestamp,
        database: {
          status: 'connected',
          response_time: Date.now() - new Date(healthResult.timestamp).getTime()
        }
      });
    } else {
      res.status(500).json({
        ok: false,
        error: healthResult.error,
        timestamp: healthResult.timestamp
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Basic server health endpoint
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.use('/api/auth', authRouter);

// Doctors routes
app.use('/api/doctors', doctorsRouter);

// Appointments routes
app.use('/api/appointments', appointmentRouter);

// Treatment plan routes
app.use('/api/treatment-plans', treatmentPlanRouter);

// Health tracking routes
app.use('/api/track', trackRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, req, res);
});

// Catch-all route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Healthcare App Backend Server running on port ${PORT}`);

});
