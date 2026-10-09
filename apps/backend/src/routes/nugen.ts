import { Router, Request, Response } from 'express';
import { NugenService } from '../services/nugenService';

const router = Router();

router.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    nugen: NugenService.getStatus(),
  });
});

router.post('/narrative', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    const result = await NugenService.generateDomainNarrative(prompt || 'Synthesize operational tour resilience', context);
    res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Nugen narrative generation failed.' });
  }
});

export default router;
