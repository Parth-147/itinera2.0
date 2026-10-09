import {
  TripItinerary,
  OperatorTourSummary,
  OperatorTourDetail,
  VendorInventoryItem,
  PaymentStatus,
  AdaptationResult,
  DisruptionEvent,
  WeatherCondition,
  ItineraryComponent,
} from '../types/itinerary';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let parsedMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      parsedMessage = parsed.error || parsed.message || errorText;
    } catch {
      // not JSON
    }
    throw new Error(parsedMessage || `API Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<any>(res);
  },

  async getTrips(): Promise<TripItinerary[]> {
    const res = await fetch(`${API_BASE}/trips`);
    const data = await handleResponse<{ success: boolean; trips: TripItinerary[] }>(res);
    return data.trips || [];
  },

  async getTrip(id: string): Promise<TripItinerary> {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    const data = await handleResponse<{ success: boolean; trip: TripItinerary }>(res);
    return data.trip;
  },

  async saveTrip(trip: TripItinerary): Promise<TripItinerary> {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });
    const data = await handleResponse<{ success: boolean; trip: TripItinerary }>(res);
    return data.trip;
  },

  async generateItineraryWithGemini(params: {
    prompt?: string;
    destination: string;
    days: number;
    startDate?: string;
    budget?: string;
    travelerStyle?: string;
    travelerName?: string;
  }): Promise<TripItinerary> {
    const res = await fetch(`${API_BASE}/gemini/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await handleResponse<{ success: boolean; itinerary: TripItinerary }>(res);
    return data.itinerary;
  },

  async triggerDisruption(params: {
    tripId: string;
    componentId: string;
    cause: string;
    description: string;
  }): Promise<{ adaptation: AdaptationResult; disruptionEvent: DisruptionEvent }> {
    const res = await fetch(`${API_BASE}/adapt/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<{ adaptation: AdaptationResult; disruptionEvent: DisruptionEvent }>(res);
  },

  async applyAlternative(params: {
    tripId: string;
    originalComponentId: string;
    replacementComponent: ItineraryComponent;
  }): Promise<{ updatedTrip: TripItinerary; message: string }> {
    const res = await fetch(`${API_BASE}/adapt/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse<{ updatedTrip: TripItinerary; message: string }>(res);
  },

  async getOperatorOverview(): Promise<OperatorTourSummary[]> {
    const res = await fetch(`${API_BASE}/operator/tours`);
    const data = await handleResponse<{ success: boolean; tours: OperatorTourSummary[] }>(res);
    return data.tours || [];
  },

  async getOperatorTourDetail(id: string): Promise<OperatorTourDetail> {
    const res = await fetch(`${API_BASE}/operator/tours/${id}`);
    const data = await handleResponse<{ success: boolean; tour: OperatorTourDetail }>(res);
    return data.tour;
  },

  async updateComponentBooking(
    tripId: string,
    componentId: string,
    payload: { paymentStatus?: PaymentStatus; vendor?: string; cost?: number }
  ): Promise<{ success: boolean; tour: OperatorTourDetail; message: string }> {
    const res = await fetch(`${API_BASE}/operator/tours/${tripId}/bookings/${componentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'operator' },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async resolveDisruptionAsOperator(
    tripId: string,
    componentId: string,
    resolutionNote?: string
  ): Promise<{ success: boolean; tour: OperatorTourDetail; message: string }> {
    const res = await fetch(`${API_BASE}/operator/tours/${tripId}/disruptions/${componentId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'operator' },
      body: JSON.stringify({ resolutionNote }),
    });
    return handleResponse<any>(res);
  },

  async getVendorInventory(): Promise<VendorInventoryItem[]> {
    const res = await fetch(`${API_BASE}/operator/vendors`);
    const data = await handleResponse<{ success: boolean; vendors: VendorInventoryItem[] }>(res);
    return data.vendors || [];
  },

  async createVendorInventory(payload: Partial<VendorInventoryItem>): Promise<VendorInventoryItem> {
    const res = await fetch(`${API_BASE}/operator/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'operator' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<{ success: boolean; vendor: VendorInventoryItem }>(res);
    return data.vendor;
  },

  async updateVendorInventory(id: string, payload: Partial<VendorInventoryItem>): Promise<VendorInventoryItem> {
    const res = await fetch(`${API_BASE}/operator/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'operator' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<{ success: boolean; vendor: VendorInventoryItem }>(res);
    return data.vendor;
  },

  async getWeather(coords: { lat: number; lng: number; name: string }): Promise<WeatherCondition> {
    const url = `${API_BASE}/weather/current?lat=${coords.lat}&lng=${coords.lng}&name=${encodeURIComponent(coords.name)}`;
    const res = await fetch(url);
    const data = await handleResponse<{ success: boolean; weather: WeatherCondition }>(res);
    return data.weather;
  },

  async simulateWeatherWhatIf(simulation: {
    condition: string;
    intensity: number;
  }, components: any[]) {
    const res = await fetch(`${API_BASE}/weather/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulation, components }),
    });
    return handleResponse<any>(res);
  },

  async bookTrip(id: string) {
    const res = await fetch(`${API_BASE}/trips/${id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },
};
