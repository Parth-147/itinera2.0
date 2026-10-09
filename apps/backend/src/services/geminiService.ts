import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripItinerary, ItineraryComponent } from '../types';

export interface IntakeParams {
  prompt?: string;
  destination: string;
  days: number;
  startDate?: string;
  budget?: string;
  travelerStyle?: string;
  travelerName?: string;
}

export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI | null {
    if (!this.genAI && process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return this.genAI;
  }

  /**
   * Generates a structured multi-day itinerary from natural language or structured intake
   */
  public static async generateItinerary(params: IntakeParams): Promise<TripItinerary> {
    const client = this.getClient();
    const destination = params.destination || 'Kyoto, Japan';
    const days = Math.min(10, Math.max(1, params.days || 3));
    const travelerName = params.travelerName || 'Alex Mercer';
    const startDate = params.startDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

    if (client) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemPrompt = `You are ITINERA's high-precision travel architect.
Create a structured JSON itinerary for ${destination} for ${days} days.
Traveler: ${travelerName}. Budget: ${params.budget || 'moderate'}. Style: ${params.travelerStyle || 'balanced adventure and culture'}.
User notes: "${params.prompt || ''}"

Return strictly valid JSON matching this schema:
{
  "title": string,
  "destination": string,
  "tasteProfile": { "adventure": number (0-100), "culture": number (0-100), "relaxation": number (0-100), "budgetConscious": number (0-100) },
  "components": [
    {
      "id": "comp-1",
      "name": string,
      "type": "stay" | "transport" | "activity" | "dining",
      "day": number (1 to ${days}),
      "time": "09:00 AM",
      "duration": "2 hours",
      "location": { "name": string, "lat": number, "lng": number },
      "cost": number,
      "currency": "USD",
      "vendor": string,
      "vendorRating": number (4.0 to 5.0),
      "dependsOn": string[] (IDs of prerequisite components, e.g. ["comp-1"]),
      "description": string,
      "tags": string[]
    }
  ]
}
Do not wrap in markdown quotes if possible, output pure JSON.`;

        const response = await model.generateContent(systemPrompt);
        let rawText = response.response.text().trim();
        if (rawText.startsWith('```json')) {
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (rawText.startsWith('```')) {
          rawText = rawText.replace(/```/g, '').trim();
        }

        const parsed = JSON.parse(rawText);
        const totalCost = (parsed.components || []).reduce((sum: number, c: any) => sum + (c.cost || 0), 0);

        return {
          id: `trip-${Date.now()}`,
          title: parsed.title || `${days}-Day Discovery of ${destination}`,
          destination: parsed.destination || destination,
          destinationCoords: parsed.components?.[0]?.location || { name: destination, lat: 35.0116, lng: 135.7681 },
          startDate,
          endDate: new Date(new Date(startDate).getTime() + days * 86400000).toISOString().split('T')[0],
          durationDays: days,
          totalCost: totalCost || 1450,
          currency: 'USD',
          travelerId: 'traveler-user-1',
          travelerName,
          tasteProfile: parsed.tasteProfile || { adventure: 75, culture: 85, relaxation: 60, budgetConscious: 70 },
          components: (parsed.components || []).map((c: any, idx: number) => ({
            ...c,
            id: c.id || `comp-${idx + 1}`,
            status: 'confirmed',
            dependsOn: c.dependsOn || (idx > 0 && c.type !== 'stay' ? [`comp-${idx}`] : []),
          })),
          disruptions: [],
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('Gemini API call failed or timed out, using fallback structured engine:', err);
      }
    }

    // High quality deterministic fallback generator
    return this.buildFallbackItinerary(destination, days, startDate, travelerName);
  }

  /**
   * Generates fallback itinerary with DAG dependencies and realistic prices
   */
  private static buildFallbackItinerary(
    destination: string,
    days: number,
    startDate: string,
    travelerName: string
  ): TripItinerary {
    const isJapan = /japan|kyoto|tokyo|osaka/i.test(destination);
    const isIceland = /iceland|reykjavik/i.test(destination);
    const isSwiss = /swiss|switzerland|alps|zermatt/i.test(destination);

    const baseCoords = isJapan
      ? { name: 'Kyoto Central', lat: 35.0116, lng: 135.7681 }
      : isIceland
      ? { name: 'Reykjavik Harbour', lat: 64.1466, lng: -21.9426 }
      : isSwiss
      ? { name: 'Interlaken Valley', lat: 46.6863, lng: 7.8632 }
      : { name: `${destination} City Center`, lat: 48.8566, lng: 2.3522 };

    const components: ItineraryComponent[] = [];
    let compCounter = 1;

    for (let day = 1; day <= days; day++) {
      // 1. Hotel / Stay
      const stayId = `comp-${compCounter++}`;
      components.push({
        id: stayId,
        name: isJapan
          ? `Gion Heritage Machiya Suite (Night ${day})`
          : isIceland
          ? `Northern Light Eco-Lodge (Night ${day})`
          : `Alpine Panorama Grand Hotel (Night ${day})`,
        type: 'stay',
        day,
        time: '02:00 PM',
        duration: 'Overnight',
        location: {
          name: `${destination} Historic District`,
          lat: baseCoords.lat + (day * 0.002),
          lng: baseCoords.lng + (day * 0.002),
        },
        cost: 220,
        currency: 'USD',
        vendor: 'Aura Luxury Stays',
        vendorRating: 4.9,
        dependsOn: [],
        status: 'confirmed',
        description: 'Selected for tranquil acoustic insulation, locally crafted furnishings, and walking distance to transit.',
        tags: ['stay', 'boutique', 'relaxation'],
      });

      // 2. Morning Transport
      const transportId = `comp-${compCounter++}`;
      components.push({
        id: transportId,
        name: `Day ${day} Morning Express Transfer`,
        type: 'transport',
        day,
        time: '08:45 AM',
        duration: '45 mins',
        location: baseCoords,
        cost: 35,
        currency: 'USD',
        vendor: 'Apex Regional Transit',
        vendorRating: 4.8,
        dependsOn: [stayId],
        status: 'confirmed',
        description: 'Reserved executive transfer connecting the accommodation directly to morning excursion grounds.',
        tags: ['transit', 'rail', 'punctual'],
      });

      // 3. Morning Activity (Key Excursion with dependencies)
      const activityId = `comp-${compCounter++}`;
      components.push({
        id: activityId,
        name: isJapan
          ? `Private Bamboo Grove Meditation & Tea Ceremony`
          : isIceland
          ? `Vatnajökull Glacier Cave Exploration`
          : `Jungfrau High Alpine Ascent & Glacier Walk`,
        type: 'activity',
        day,
        time: '10:00 AM',
        duration: '3.5 hours',
        location: {
          name: `${destination} Sanctuary Area`,
          lat: baseCoords.lat + 0.015,
          lng: baseCoords.lng + 0.012,
        },
        cost: 140,
        currency: 'USD',
        vendor: 'Elysian Expeditions',
        vendorRating: 4.95,
        dependsOn: [transportId], // Depends on morning transport!
        status: 'confirmed',
        description: 'Small group private docent access before general public admission hours.',
        tags: ['culture', 'nature', 'highlight'],
      });

      // 4. Afternoon Dining
      const diningId = `comp-${compCounter++}`;
      components.push({
        id: diningId,
        name: `Artisanal Chef's Tasting Table`,
        type: 'dining',
        day,
        time: '01:30 PM',
        duration: '1.5 hours',
        location: {
          name: `${destination} Gastronomy Quarter`,
          lat: baseCoords.lat + 0.008,
          lng: baseCoords.lng + 0.009,
        },
        cost: 75,
        currency: 'USD',
        vendor: 'Terra & Hearth Dining',
        vendorRating: 4.85,
        dependsOn: [activityId], // Depends on finishing the morning activity
        status: 'confirmed',
        description: 'Multi-course farm-to-table lunch highlighting seasonal harvests and paired infusions.',
        tags: ['dining', 'culinary', 'artisan'],
      });

      // 5. Sunset Activity
      const eveningId = `comp-${compCounter++}`;
      components.push({
        id: eveningId,
        name: isJapan
          ? `Golden Pavilion Twilight Walk & Lantern Illumination`
          : isIceland
          ? `Thermal Lagoon Mineral Soak & Stargazing`
          : `Valley Sunset Funicular & Alpine Horn Recital`,
        type: 'activity',
        day,
        time: '05:00 PM',
        duration: '2 hours',
        location: {
          name: `${destination} Scenic Overlook`,
          lat: baseCoords.lat - 0.01,
          lng: baseCoords.lng + 0.015,
        },
        cost: 85,
        currency: 'USD',
        vendor: 'Twilight Horizons Co.',
        vendorRating: 4.9,
        dependsOn: [diningId],
        status: 'confirmed',
        description: 'Uncrowded golden hour access tailored for breathtaking viewpoints and photography.',
        tags: ['sunset', 'sightseeing', 'relaxation'],
      });
    }

    const totalCost = components.reduce((acc, c) => acc + c.cost, 0);

    return {
      id: `trip-${Date.now()}`,
      title: `${days}-Day Curated Journey: ${destination}`,
      destination,
      destinationCoords: baseCoords,
      startDate,
      endDate: new Date(new Date(startDate).getTime() + days * 86400000).toISOString().split('T')[0],
      durationDays: days,
      totalCost,
      currency: 'USD',
      travelerId: 'traveler-user-1',
      travelerName,
      travelerEmail: 'alex.mercer@itinera.travel',
      tasteProfile: {
        adventure: 78,
        culture: 88,
        relaxation: 65,
        budgetConscious: 70,
        favoriteStyles: ['Scenic Rail', 'Artisan Cuisine', 'Historic Sanctuaries'],
      },
      components,
      disruptions: [],
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
