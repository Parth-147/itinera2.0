import { Router, Request, Response } from 'express';
import { AdaptEngine } from '../services/adaptEngine';
import { FirestoreService } from '../services/firestoreService';
import { DisruptionEvent, DisruptionCause } from '../types';

const router = Router();

/**
 * POST /api/adapt/trigger
 * Simulates or triggers a real disruption on a specific itinerary component
 */
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const { tripId, componentId, cause, description } = req.body;

    if (!tripId || !componentId) {
      return res.status(400).json({ error: 'tripId and componentId are required.' });
    }

    const trip = await FirestoreService.getItinerary(tripId);
    if (!trip) {
      return res.status(404).json({ error: `Itinerary ${tripId} not found.` });
    }

    const disruptionCause: DisruptionCause = cause || 'weather';
    const disruptionDesc: string = description || 'Adverse weather conditions triggered safety suspension.';

    const adaptation = AdaptEngine.triggerAdaptation(
      trip,
      componentId,
      disruptionCause,
      disruptionDesc
    );

    // Record the disruption in state
    const disruptionEvent: DisruptionEvent = {
      id: `disrupt-${Date.now()}`,
      componentId,
      cause: disruptionCause,
      description: disruptionDesc,
      severity: 'medium',
      affectedDownstream: adaptation.impactedComponents,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    await FirestoreService.recordDisruption(disruptionEvent, tripId);

    res.json({
      success: true,
      adaptation,
      disruptionEvent,
    });
  } catch (err: any) {
    console.error('Adapt trigger error:', err);
    res.status(500).json({ error: err.message || 'Adapt engine calculation failed.' });
  }
});

/**
 * POST /api/adapt/apply
 * Applies a chosen alternative, resolving the disruption and updating graph state
 */
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { tripId, originalComponentId, replacementComponent } = req.body;

    if (!tripId || !originalComponentId || !replacementComponent) {
      return res.status(400).json({ error: 'Missing tripId, originalComponentId, or replacementComponent.' });
    }

    const trip = await FirestoreService.getItinerary(tripId);
    if (!trip) {
      return res.status(404).json({ error: `Itinerary ${tripId} not found.` });
    }

    const index = trip.components.findIndex((c) => c.id === originalComponentId);
    if (index === -1) {
      return res.status(404).json({ error: `Component ${originalComponentId} not found in trip.` });
    }

    // Preserve original ID & dependencies, update with replacement details
    const original = trip.components[index];
    trip.components[index] = {
      ...replacementComponent,
      id: original.id,
      dependsOn: original.dependsOn,
      status: 'swapped',
    };

    // Mark disruption as resolved
    const activeDisruption = trip.disruptions.find((d) => d.componentId === originalComponentId && !d.resolved);
    if (activeDisruption) {
      activeDisruption.resolved = true;
    }

    // If all disruptions resolved, restore status
    const remainingUnresolved = trip.disruptions.filter((d) => !d.resolved);
    if (remainingUnresolved.length === 0) {
      trip.status = 'confirmed';
      // Reset downstream components status if they were flagged
      trip.components.forEach((c) => {
        if (c.status === 'disrupted') c.status = 'confirmed';
      });
    }

    // Recalculate total cost
    trip.totalCost = trip.components.reduce((sum, c) => sum + c.cost, 0);

    await FirestoreService.saveItinerary(trip);

    res.json({
      success: true,
      updatedTrip: trip,
      message: `Successfully replaced component with "${replacementComponent.name}". Graph dependencies restored.`,
    });
  } catch (err: any) {
    console.error('Adapt apply error:', err);
    res.status(500).json({ error: err.message || 'Failed to apply alternative.' });
  }
});

export default router;
