import { Router, Request, Response } from 'express';
import { GeminiService } from '../services/geminiService';
import { FirestoreService } from '../services/firestoreService';

const router = Router();

/**
 * POST /api/gemini/intake
 * Converts natural language prompt + parameters into a structured day-wise itinerary
 */
router.post('/intake', async (req: Request, res: Response) => {
  try {
    const { prompt, destination, days, startDate, budget, travelerStyle, travelerName } = req.body;
    
    if (!destination && !prompt) {
      return res.status(400).json({ error: 'Destination or prompt is required.' });
    }

    const itinerary = await GeminiService.generateItinerary({
      prompt,
      destination: destination || 'Kyoto, Japan',
      days: Number(days) || 3,
      startDate,
      budget,
      travelerStyle,
      travelerName,
    });

    // Save to persistence store
    await FirestoreService.saveItinerary(itinerary);

    res.json({
      success: true,
      itinerary,
    });
  } catch (err: any) {
    console.error('Gemini intake route error:', err);
    res.status(500).json({ error: err.message || 'Failed to process itinerary intake.' });
  }
});

export default router;
