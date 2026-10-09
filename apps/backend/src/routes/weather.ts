import { Router, Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';

const router = Router();

router.get('/current', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 35.0116;
    const lng = parseFloat(req.query.lng as string) || 135.7681;
    const name = (req.query.name as string) || 'Destination Region';

    const weather = await WeatherService.getWeatherForCoords({ lat, lng, name });
    res.json({ success: true, weather });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Weather lookup failed.' });
  }
});

router.post('/simulate', (req: Request, res: Response) => {
  try {
    const { simulation, components } = req.body;

    if (!simulation) {
      return res.status(400).json({ error: 'Simulation configuration required.' });
    }

    const result = WeatherService.simulateWhatIf(simulation, components || []);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Simulation execution failed.' });
  }
});

export default router;
