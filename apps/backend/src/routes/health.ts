import { Router, Request, Response } from 'express';
import { NugenService } from '../services/nugenService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ITINERA Backend Platform',
    timestamp: new Date().toISOString(),
    geminiConnected: Boolean(process.env.GEMINI_API_KEY),
    weatherConnected: Boolean(process.env.OPENWEATHER_API_KEY),
    firebaseConnected: Boolean(process.env.FIREBASE_PROJECT_ID),
    nugenStatus: NugenService.getStatus(),
  });
});

export default router;
