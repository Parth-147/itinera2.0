import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import {
  TripItinerary,
  OperatorTourSummary,
  OperatorTourDetail,
  DisruptionEvent,
  VendorInventoryItem,
  ComponentBooking,
  PaymentStatus,
} from '../types';

const DATA_DIR = path.resolve(__dirname, '../../data');
const TRIPS_FILE = path.join(DATA_DIR, 'itineraries.json');
const VENDORS_FILE = path.join(DATA_DIR, 'vendors.json');

const INITIAL_VENDORS: VendorInventoryItem[] = [
  {
    id: 'vnd-1',
    vendorName: 'Kiyomizu Stays',
    category: 'stay',
    serviceTitle: 'Gion Machiya Heritage Boutique Hotel Suites',
    location: 'Gion District, Kyoto',
    unitCost: 260,
    currency: 'USD',
    capacityPerDay: 8,
    bookedSlots: 5,
    rating: 4.95,
    contactEmail: 'reservations@kiyomizustays.jp',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-09-15',
  },
  {
    id: 'vnd-2',
    vendorName: 'Sagano Scenic Railway',
    category: 'transport',
    serviceTitle: 'Romantic Scenic Ravine Rail Service',
    location: 'Arashiyama, Kyoto',
    unitCost: 45,
    currency: 'USD',
    capacityPerDay: 120,
    bookedSlots: 84,
    rating: 4.8,
    contactEmail: 'operations@saganorail.jp',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-09-20',
  },
  {
    id: 'vnd-3',
    vendorName: 'Hozu Rapids Boatmen Union',
    category: 'activity',
    serviceTitle: 'Traditional Hozugawa River Boat Descent',
    location: 'Kameoka Pier, Kyoto',
    unitCost: 95,
    currency: 'USD',
    capacityPerDay: 40,
    bookedSlots: 28,
    rating: 4.75,
    contactEmail: 'safety@hozurapids.jp',
    slaStatus: 'warning',
    contractStatus: 'active',
    lastAuditDate: '2026-10-01',
  },
  {
    id: 'vnd-4',
    vendorName: 'Shoraian Bamboo Dining',
    category: 'dining',
    serviceTitle: 'Riverside Kaiseki Lunch Experience',
    location: 'Arashiyama Waterfront, Kyoto',
    unitCost: 80,
    currency: 'USD',
    capacityPerDay: 30,
    bookedSlots: 22,
    rating: 4.9,
    contactEmail: 'dining@shoraian.jp',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-09-28',
  },
  {
    id: 'vnd-5',
    vendorName: 'Zen Masters Cultural Council',
    category: 'activity',
    serviceTitle: 'Private Early-Morning Sogenchi Garden Meditation',
    location: 'Tenryu-ji Temple, Kyoto',
    unitCost: 110,
    currency: 'USD',
    capacityPerDay: 15,
    bookedSlots: 10,
    rating: 4.98,
    contactEmail: 'liaison@zencouncil.kyoto',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-10-04',
  },
  {
    id: 'vnd-6',
    vendorName: 'Alpine Chalet Residenz',
    category: 'stay',
    serviceTitle: 'Panoramic Mountain View Lodge',
    location: 'Grindelwald, Switzerland',
    unitCost: 320,
    currency: 'USD',
    capacityPerDay: 12,
    bookedSlots: 9,
    rating: 4.92,
    contactEmail: 'frontdesk@alpinechalet.ch',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-09-18',
  },
  {
    id: 'vnd-7',
    vendorName: 'Jungfrau Express Mobility',
    category: 'transport',
    serviceTitle: 'Cogwheel Alpine Rail Pass & Eiger Cableway',
    location: 'Interlaken / Jungfraujoch, Switzerland',
    unitCost: 125,
    currency: 'USD',
    capacityPerDay: 200,
    bookedSlots: 140,
    rating: 4.88,
    contactEmail: 'ticketing@jungfraumobility.ch',
    slaStatus: 'healthy',
    contractStatus: 'active',
    lastAuditDate: '2026-09-22',
  },
];

export class FirestoreService {
  private static db: admin.firestore.Firestore | null = null;
  private static inMemoryTrips: Map<string, TripItinerary> = new Map();
  private static inMemoryDisruptions: Map<string, DisruptionEvent> = new Map();
  private static inMemoryVendors: Map<string, VendorInventoryItem> = new Map();

  public static init() {
    this.ensureDataDirectory();
    this.loadLocalVendors();
    this.loadLocalTrips();

    if (this.db) return;

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        this.db = admin.firestore();
        console.log('Firebase Admin initialized with credentials.');
      } catch (err) {
        console.warn('Firebase Admin init failed; running with file-backed persistence:', err);
      }
    } else {
      console.log('No Firebase Admin credentials provided. Utilizing persistent file-backed local storage.');
    }
  }

  private static ensureDataDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('Failed creating data directory:', err);
    }
  }

  private static loadLocalTrips() {
    try {
      if (fs.existsSync(TRIPS_FILE)) {
        const raw = fs.readFileSync(TRIPS_FILE, 'utf-8');
        const trips: TripItinerary[] = JSON.parse(raw);
        for (const t of trips) {
          this.inMemoryTrips.set(t.id, t);
        }
        console.log(`Loaded ${trips.length} itineraries from ${TRIPS_FILE}`);
      }
    } catch (err) {
      console.warn('Failed loading local trips file:', err);
    }
  }

  private static saveLocalTrips() {
    try {
      const trips = Array.from(this.inMemoryTrips.values());
      fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving trips to local file:', err);
    }
  }

  private static loadLocalVendors() {
    try {
      if (fs.existsSync(VENDORS_FILE)) {
        const raw = fs.readFileSync(VENDORS_FILE, 'utf-8');
        const vendors: VendorInventoryItem[] = JSON.parse(raw);
        for (const v of vendors) {
          this.inMemoryVendors.set(v.id, v);
        }
      } else {
        for (const v of INITIAL_VENDORS) {
          this.inMemoryVendors.set(v.id, v);
        }
        this.saveLocalVendors();
      }
    } catch (err) {
      console.warn('Failed loading vendors file, using initial dataset:', err);
      for (const v of INITIAL_VENDORS) {
        this.inMemoryVendors.set(v.id, v);
      }
    }
  }

  private static saveLocalVendors() {
    try {
      const vendors = Array.from(this.inMemoryVendors.values());
      fs.writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving vendors to file:', err);
    }
  }

  // --- TRIPS ---

  public static async saveItinerary(itinerary: TripItinerary): Promise<TripItinerary> {
    itinerary.updatedAt = new Date().toISOString();
    
    // Ensure all components have bookingRef and paymentStatus
    for (const comp of itinerary.components) {
      if (!comp.bookingRef) {
        comp.bookingRef = `BKG-${comp.id.replace('comp-', 'RES-').toUpperCase()}`;
      }
      if (!comp.paymentStatus) {
        comp.paymentStatus = comp.status === 'disrupted' ? 'pending' : comp.status === 'swapped' ? 'escrow' : 'paid';
      }
    }

    this.inMemoryTrips.set(itinerary.id, itinerary);
    this.saveLocalTrips();

    if (this.db) {
      try {
        await this.db.collection('itineraries').doc(itinerary.id).set(itinerary);
      } catch (err) {
        console.error('Failed writing to Firestore:', err);
      }
    }

    return itinerary;
  }

  public static async getItinerary(id: string): Promise<TripItinerary | null> {
    if (this.inMemoryTrips.has(id)) {
      return this.inMemoryTrips.get(id)!;
    }

    if (this.db) {
      try {
        const doc = await this.db.collection('itineraries').doc(id).get();
        if (doc.exists) {
          const data = doc.data() as TripItinerary;
          this.inMemoryTrips.set(data.id, data);
          this.saveLocalTrips();
          return data;
        }
      } catch (err) {
        console.error('Failed reading from Firestore:', err);
      }
    }

    return null;
  }

  public static async listItineraries(): Promise<TripItinerary[]> {
    if (this.db) {
      try {
        const snap = await this.db.collection('itineraries').limit(50).get();
        const trips: TripItinerary[] = [];
        snap.forEach((d) => trips.push(d.data() as TripItinerary));
        if (trips.length > 0) {
          for (const t of trips) this.inMemoryTrips.set(t.id, t);
          return trips;
        }
      } catch (err) {
        console.error('Firestore list failed:', err);
      }
    }

    return Array.from(this.inMemoryTrips.values());
  }

  // --- OPERATOR TOURS ---

  public static async listOperatorTours(): Promise<OperatorTourSummary[]> {
    const trips = await this.listItineraries();

    return trips.map((trip) => {
      const activeDisruptions = trip.disruptions.filter((d) => !d.resolved);
      let status: OperatorTourSummary['status'] = 'confirmed';

      if (activeDisruptions.length > 0) {
        status = 'disrupted';
      } else if (trip.status === 'active') {
        status = 'in_progress';
      }

      let escrowTotal = 0;
      let paidTotal = 0;
      let pendingRefundTotal = 0;

      for (const comp of trip.components) {
        const payStatus = comp.paymentStatus || (comp.status === 'disrupted' ? 'pending' : comp.status === 'swapped' ? 'escrow' : 'paid');
        if (payStatus === 'escrow') escrowTotal += comp.cost;
        else if (payStatus === 'paid') paidTotal += comp.cost;
        else if (payStatus === 'refunded' || payStatus === 'pending') pendingRefundTotal += comp.cost;
      }

      return {
        id: `tour-${trip.id}`,
        tripId: trip.id,
        travelerName: trip.travelerName,
        travelerEmail: trip.travelerEmail || `${trip.travelerName.toLowerCase().replace(/\s+/g, '.')}@itinera.travel`,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        durationDays: trip.durationDays || 3,
        totalCost: trip.totalCost,
        currency: trip.currency,
        status,
        hasActiveDisruption: activeDisruptions.length > 0,
        disruptionCount: activeDisruptions.length,
        assignedOperator: 'Operations Team Alpha',
        lastUpdated: trip.updatedAt,
        componentCount: trip.components.length,
        escrowTotal,
        paidTotal,
        pendingRefundTotal,
      };
    });
  }

  public static async getTourDetail(tripId: string): Promise<OperatorTourDetail | null> {
    const trip = await this.getItinerary(tripId);
    if (!trip) return null;

    const activeDisruptions = trip.disruptions.filter((d) => !d.resolved);
    let status: OperatorTourSummary['status'] = 'confirmed';
    if (activeDisruptions.length > 0) status = 'disrupted';
    else if (trip.status === 'active') status = 'in_progress';

    let escrowTotal = 0;
    let paidTotal = 0;
    let pendingRefundTotal = 0;

    const bookings: ComponentBooking[] = trip.components.map((comp) => {
      const paymentStatus: PaymentStatus = comp.paymentStatus || (
        comp.status === 'disrupted' ? 'pending' : comp.status === 'swapped' ? 'escrow' : 'paid'
      );

      if (paymentStatus === 'escrow') escrowTotal += comp.cost;
      else if (paymentStatus === 'paid') paidTotal += comp.cost;
      else pendingRefundTotal += comp.cost;

      return {
        bookingId: `BKG-${comp.id}`,
        componentId: comp.id,
        componentName: comp.name,
        componentType: comp.type,
        day: comp.day,
        time: comp.time,
        duration: comp.duration,
        vendor: comp.vendor,
        vendorRating: comp.vendorRating,
        cost: comp.cost,
        currency: comp.currency,
        paymentStatus,
        bookingRef: comp.bookingRef || `BKG-${comp.id.replace('comp-', 'RES-').toUpperCase()}`,
        status: comp.status,
        dependsOn: comp.dependsOn || [],
      };
    });

    return {
      id: `tour-${trip.id}`,
      tripId: trip.id,
      title: trip.title,
      travelerName: trip.travelerName,
      travelerEmail: trip.travelerEmail || `${trip.travelerName.toLowerCase().replace(/\s+/g, '.')}@itinera.travel`,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      durationDays: trip.durationDays || 3,
      totalCost: trip.totalCost,
      currency: trip.currency,
      status,
      hasActiveDisruption: activeDisruptions.length > 0,
      disruptionCount: activeDisruptions.length,
      assignedOperator: 'Operations Team Alpha',
      lastUpdated: trip.updatedAt,
      componentCount: trip.components.length,
      escrowTotal,
      paidTotal,
      pendingRefundTotal,
      tasteProfile: trip.tasteProfile,
      components: trip.components,
      bookings,
      disruptions: trip.disruptions,
    };
  }

  public static async updateComponentBooking(
    tripId: string,
    componentId: string,
    updates: {
      paymentStatus?: PaymentStatus;
      vendor?: string;
      cost?: number;
    }
  ): Promise<TripItinerary | null> {
    const trip = await this.getItinerary(tripId);
    if (!trip) return null;

    const comp = trip.components.find((c) => c.id === componentId);
    if (!comp) return null;

    if (updates.paymentStatus) comp.paymentStatus = updates.paymentStatus;
    if (updates.vendor) comp.vendor = updates.vendor;
    if (typeof updates.cost === 'number') comp.cost = updates.cost;

    trip.totalCost = trip.components.reduce((sum, c) => sum + c.cost, 0);
    return await this.saveItinerary(trip);
  }

  public static async resolveDisruptionAsOperator(
    tripId: string,
    componentId: string,
    resolutionNote?: string
  ): Promise<TripItinerary | null> {
    const trip = await this.getItinerary(tripId);
    if (!trip) return null;

    const comp = trip.components.find((c) => c.id === componentId);
    if (comp) {
      comp.status = 'confirmed';
      comp.paymentStatus = 'paid';
    }

    const disruption = trip.disruptions.find((d) => d.componentId === componentId && !d.resolved);
    if (disruption) {
      disruption.resolved = true;
      if (resolutionNote) {
        disruption.description += ` [Resolved by Operator: ${resolutionNote}]`;
      }
    }

    const remaining = trip.disruptions.filter((d) => !d.resolved);
    if (remaining.length === 0) {
      trip.status = 'confirmed';
      for (const c of trip.components) {
        if (c.status === 'disrupted') c.status = 'confirmed';
      }
    }

    return await this.saveItinerary(trip);
  }

  public static async recordDisruption(disruption: DisruptionEvent, tripId: string): Promise<void> {
    this.inMemoryDisruptions.set(disruption.id, disruption);

    const trip = await this.getItinerary(tripId);
    if (trip) {
      trip.disruptions.push(disruption);
      trip.status = 'disrupted';
      const comp = trip.components.find((c) => c.id === disruption.componentId);
      if (comp) {
        comp.status = 'disrupted';
        comp.paymentStatus = 'pending';
      }
      for (const downId of disruption.affectedDownstream) {
        const downComp = trip.components.find((c) => c.id === downId);
        if (downComp) {
          downComp.status = 'disrupted';
          downComp.paymentStatus = 'escrow';
        }
      }
      await this.saveItinerary(trip);
    }
  }

  // --- VENDOR INVENTORY CRUD ---

  public static listVendors(): VendorInventoryItem[] {
    return Array.from(this.inMemoryVendors.values());
  }

  public static getVendor(id: string): VendorInventoryItem | null {
    return this.inMemoryVendors.get(id) || null;
  }

  public static updateVendor(
    id: string,
    updates: Partial<VendorInventoryItem>
  ): VendorInventoryItem | null {
    const current = this.inMemoryVendors.get(id);
    if (!current) return null;

    const updated: VendorInventoryItem = {
      ...current,
      ...updates,
      id: current.id,
    };

    this.inMemoryVendors.set(id, updated);
    this.saveLocalVendors();
    return updated;
  }

  public static createVendor(item: Omit<VendorInventoryItem, 'id'>): VendorInventoryItem {
    const id = `vnd-${Date.now()}`;
    const newVendor: VendorInventoryItem = {
      ...item,
      id,
      lastAuditDate: new Date().toISOString().split('T')[0],
    };

    this.inMemoryVendors.set(id, newVendor);
    this.saveLocalVendors();
    return newVendor;
  }
}
