export type ComponentType = 'stay' | 'transport' | 'activity' | 'dining';
export type ComponentStatus = 'confirmed' | 'disrupted' | 'swapped' | 'alternative';
export type DisruptionCause = 'weather' | 'transport_delay' | 'vendor_cancellation' | 'social_unrest' | 'strike';

export interface LocationCoords {
  name: string;
  lat: number;
  lng: number;
}

export interface ItineraryComponent {
  id: string;
  name: string;
  type: ComponentType;
  day: number;
  time: string;
  duration: string;
  location: LocationCoords;
  cost: number;
  currency: string;
  vendor: string;
  vendorRating: number;
  dependsOn: string[]; // Graph DAG dependencies
  status: ComponentStatus;
  description: string;
  tags: string[];
  bookingRef?: string;
  paymentStatus?: 'paid' | 'escrow' | 'pending' | 'refunded';
}

export interface TasteProfile {
  adventure: number;   // 0-100
  culture: number;     // 0-100
  relaxation: number;  // 0-100
  budgetConscious: number; // 0-100
  favoriteStyles?: string[];
}

export interface DisruptionEvent {
  id: string;
  componentId: string;
  cause: DisruptionCause;
  description: string;
  severity: 'low' | 'medium' | 'critical';
  affectedDownstream: string[];
  timestamp: string;
  resolved: boolean;
}

export interface ComponentAlternative {
  component: ItineraryComponent;
  score: number; // 0 to 100
  breakdown: {
    costScore: number;     // 40% weight
    timeScore: number;     // 30% weight
    vendorScore: number;   // 20% weight
    tasteScore: number;    // 10% weight
  };
  costDelta: number;
  explanation: string;
}

export interface AdaptationResult {
  disruptedComponentId: string;
  disruptionCause: DisruptionCause;
  disruptionDescription: string;
  impactedComponents: string[];
  rankedAlternatives: ComponentAlternative[];
  systemRecommendation: string;
  recalculatedTotalCost: number;
}

export interface TripItinerary {
  id: string;
  title: string;
  destination: string;
  destinationCoords: LocationCoords;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalCost: number;
  currency: string;
  travelerId: string;
  travelerName: string;
  travelerEmail?: string;
  tasteProfile: TasteProfile;
  components: ItineraryComponent[];
  disruptions: DisruptionEvent[];
  status: 'draft' | 'confirmed' | 'active' | 'completed' | 'disrupted';
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  coords: LocationCoords;
  typicalCostPerDay: number;
  currency: string;
  highlights: string[];
  bestSeasons: string[];
}

export type PaymentStatus = 'paid' | 'escrow' | 'pending' | 'refunded';

export interface ComponentBooking {
  bookingId: string;
  componentId: string;
  componentName: string;
  componentType: ComponentType;
  day: number;
  time: string;
  duration: string;
  vendor: string;
  vendorRating: number;
  cost: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingRef: string;
  status: ComponentStatus;
  dependsOn: string[];
}

export interface OperatorTourSummary {
  id: string;
  tripId: string;
  travelerName: string;
  travelerEmail?: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalCost: number;
  currency: string;
  status: 'confirmed' | 'in_progress' | 'disrupted' | 'attention_needed';
  hasActiveDisruption: boolean;
  disruptionCount: number;
  assignedOperator: string;
  lastUpdated: string;
  componentCount: number;
  escrowTotal: number;
  paidTotal: number;
  pendingRefundTotal: number;
}

export interface OperatorTourDetail extends OperatorTourSummary {
  title: string;
  tasteProfile: TasteProfile;
  components: ItineraryComponent[];
  bookings: ComponentBooking[];
  disruptions: DisruptionEvent[];
}

export interface VendorInventoryItem {
  id: string;
  vendorName: string;
  category: ComponentType;
  serviceTitle: string;
  location: string;
  unitCost: number;
  currency: string;
  capacityPerDay: number;
  bookedSlots: number;
  rating: number;
  contactEmail: string;
  slaStatus: 'healthy' | 'warning' | 'suspended';
  contractStatus: 'active' | 'review' | 'suspended';
  lastAuditDate: string;
}
