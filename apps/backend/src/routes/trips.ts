import { Router, Request, Response } from 'express';
import { FirestoreService } from '../services/firestoreService';
import { TripItinerary } from '../types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const trips = await FirestoreService.listItineraries();
    res.json({ success: true, trips });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed listing trips.' });
  }
});

router.get('/operator/overview', async (_req: Request, res: Response) => {
  try {
    const tours = await FirestoreService.listOperatorTours();
    res.json({ success: true, tours });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed retrieving operator tour overview.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const trip = await FirestoreService.getItinerary(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }
    res.json({ success: true, trip });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed retrieving trip.' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const tripData: TripItinerary = req.body;
    if (!tripData.id) {
      tripData.id = `trip-${Date.now()}`;
    }
    const saved = await FirestoreService.saveItinerary(tripData);
    res.json({ success: true, trip: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed saving trip.' });
  }
});

router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const trip = await FirestoreService.getItinerary(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }
    trip.status = 'confirmed';
    await FirestoreService.saveItinerary(trip);

    res.json({
      success: true,
      bookingReference: `ITN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      totalPaid: trip.totalCost,
      currency: trip.currency,
      timestamp: new Date().toISOString(),
      message: 'Booking successfully confirmed and logged into operator manifest.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Booking confirmation failed.' });
  }
});

export default router;
