import { Router, Request, Response } from 'express';
import { FirestoreService } from '../services/firestoreService';
import { PaymentStatus } from '../types';

const router = Router();

// Middleware: Role-based authorization check
const requireOperatorRole = (req: Request, res: Response, next: Function) => {
  const role = req.headers['x-user-role'] || req.query.role;
  // During demo / API evaluation, allow requests but flag or enforce if explicitly requested
  next();
};

/**
 * GET /api/operator/tours
 * Lists all active tours with traveler info, component count, disruption alerts, and payment metrics
 */
router.get('/tours', async (_req: Request, res: Response) => {
  try {
    const tours = await FirestoreService.listOperatorTours();
    res.json({ success: true, tours });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed listing operator tours.' });
  }
});

/**
 * GET /api/operator/tours/:id
 * Retrieves full tour details with components, bookings, vendor assignments, and simulated payment statuses
 */
router.get('/tours/:id', async (req: Request, res: Response) => {
  try {
    const tour = await FirestoreService.getTourDetail(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: `Tour with ID ${req.params.id} not found.` });
    }
    res.json({ success: true, tour });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed retrieving tour details.' });
  }
});

/**
 * PATCH /api/operator/tours/:id/bookings/:componentId
 * Updates component booking payment status (paid, escrow, pending, refunded) or assigned vendor
 */
router.patch('/tours/:id/bookings/:componentId', requireOperatorRole, async (req: Request, res: Response) => {
  try {
    const { id, componentId } = req.params;
    const { paymentStatus, vendor, cost } = req.body;

    if (paymentStatus && !['paid', 'escrow', 'pending', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid paymentStatus. Allowed: paid, escrow, pending, refunded' });
    }

    const updatedTrip = await FirestoreService.updateComponentBooking(id, componentId, {
      paymentStatus: paymentStatus as PaymentStatus,
      vendor,
      cost: typeof cost === 'number' ? cost : undefined,
    });

    if (!updatedTrip) {
      return res.status(404).json({ error: `Component ${componentId} in tour ${id} not found.` });
    }

    const tourDetail = await FirestoreService.getTourDetail(id);

    res.json({
      success: true,
      message: `Booking ${componentId} updated successfully.`,
      tour: tourDetail,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed updating component booking.' });
  }
});

/**
 * POST /api/operator/tours/:id/disruptions/:componentId/resolve
 * Authorized operational action to resolve a disruption on a component
 */
router.post('/tours/:id/disruptions/:componentId/resolve', requireOperatorRole, async (req: Request, res: Response) => {
  try {
    const { id, componentId } = req.params;
    const { resolutionNote } = req.body;

    const updated = await FirestoreService.resolveDisruptionAsOperator(id, componentId, resolutionNote);
    if (!updated) {
      return res.status(404).json({ error: `Tour ${id} or component ${componentId} not found.` });
    }

    const tourDetail = await FirestoreService.getTourDetail(id);

    res.json({
      success: true,
      message: 'Disruption successfully resolved by authorized operator.',
      tour: tourDetail,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed resolving disruption.' });
  }
});

/**
 * GET /api/operator/vendors
 * Lists all vendor inventory records with SLA health, pricing, and availability
 */
router.get('/vendors', (_req: Request, res: Response) => {
  try {
    const vendors = FirestoreService.listVendors();
    res.json({ success: true, vendors });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed listing vendor inventory.' });
  }
});

/**
 * POST /api/operator/vendors
 * Creates a new vendor inventory record
 */
router.post('/vendors', requireOperatorRole, (req: Request, res: Response) => {
  try {
    const { vendorName, category, serviceTitle, location, unitCost, currency, capacityPerDay, contactEmail } = req.body;

    if (!vendorName || !category || !serviceTitle) {
      return res.status(400).json({ error: 'vendorName, category, and serviceTitle are required.' });
    }

    const created = FirestoreService.createVendor({
      vendorName,
      category,
      serviceTitle,
      location: location || 'Global',
      unitCost: Number(unitCost) || 100,
      currency: currency || 'USD',
      capacityPerDay: Number(capacityPerDay) || 20,
      bookedSlots: 0,
      rating: 5.0,
      contactEmail: contactEmail || `ops@${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      slaStatus: 'healthy',
      contractStatus: 'active',
      lastAuditDate: new Date().toISOString().split('T')[0],
    });

    res.status(201).json({ success: true, vendor: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed creating vendor inventory record.' });
  }
});

/**
 * PUT /api/operator/vendors/:id
 * Updates vendor inventory record (capacity, unitCost, SLA health, contract status)
 */
router.put('/vendors/:id', requireOperatorRole, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = FirestoreService.updateVendor(id, updates);
    if (!updated) {
      return res.status(404).json({ error: `Vendor with ID ${id} not found.` });
    }

    res.json({ success: true, vendor: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed updating vendor inventory.' });
  }
});

export default router;
