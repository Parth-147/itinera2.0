import {
  ItineraryComponent,
  TripItinerary,
  ComponentAlternative,
  AdaptationResult,
  DisruptionCause,
  TasteProfile,
} from '../types';

/**
 * Adapt Engine: Graph-aware itinerary disruption resolution
 * 
 * Features:
 * 1. DAG Traversal via `dependsOn`: Finds all cascading impacted components
 * 2. Multi-criteria alternative ranking:
 *    - Cost Delta (40%)
 *    - Time/Schedule Delta (30%)
 *    - Vendor Rating (20%)
 *    - Taste Profile / Trip DNA Match (10%)
 * 3. AI / Rule-based synthesis for instant recovery recommendations
 */
export class AdaptEngine {
  /**
   * Identifies all components downstream that depend on the disrupted component
   */
  public static findDownstreamImpact(
    disruptedId: string,
    components: ItineraryComponent[]
  ): string[] {
    const visited = new Set<string>();
    const queue = [disruptedId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      // Find all components that declare dependency on currentId
      for (const comp of components) {
        if (comp.dependsOn && comp.dependsOn.includes(currentId)) {
          if (!visited.has(comp.id)) {
            visited.add(comp.id);
            queue.push(comp.id);
          }
        }
      }
    }

    return Array.from(visited);
  }

  /**
   * Scores an alternative component relative to the original
   */
  public static scoreAlternative(
    original: ItineraryComponent,
    candidate: ItineraryComponent,
    tasteProfile: TasteProfile
  ): ComponentAlternative {
    // 1. Cost Delta Score (40%): lower cost increase is better
    const costDelta = candidate.cost - original.cost;
    let costScore = 100;
    if (costDelta > 0) {
      // Penalty for price increase: e.g. 50% increase reduces score by 50
      const percentIncrease = (costDelta / Math.max(original.cost, 1)) * 100;
      costScore = Math.max(10, 100 - percentIncrease);
    } else if (costDelta < 0) {
      // Bonus if it's cheaper without being suspicious
      costScore = 100;
    }

    // 2. Time Score (30%): compare hour/time slot similarity
    // If same time slot, 100. If different hour, minor penalty
    let timeScore = 95;
    if (candidate.time !== original.time) {
      timeScore = 80;
    }
    if (candidate.duration !== original.duration) {
      timeScore -= 10;
    }
    timeScore = Math.max(20, timeScore);

    // 3. Vendor Rating Score (20%): scale 0-5 to 0-100
    const vendorScore = Math.min(100, Math.max(0, (candidate.vendorRating / 5) * 100));

    // 4. Taste Profile Match (10%): based on tags matching traveler DNA
    let tasteScore = 70; // baseline
    const tags = candidate.tags.map((t) => t.toLowerCase());
    if (tags.some((t) => ['adventure', 'trek', 'kayak', 'explore'].includes(t))) {
      tasteScore = (tasteScore + tasteProfile.adventure) / 2;
    }
    if (tags.some((t) => ['museum', 'temple', 'heritage', 'history', 'art'].includes(t))) {
      tasteScore = (tasteScore + tasteProfile.culture) / 2;
    }
    if (tags.some((t) => ['spa', 'beach', 'sunset', 'resort', 'café'].includes(t))) {
      tasteScore = (tasteScore + tasteProfile.relaxation) / 2;
    }
    tasteScore = Math.min(100, Math.max(20, tasteScore));

    // Weighted composite
    const compositeScore = Math.round(
      costScore * 0.4 +
      timeScore * 0.3 +
      vendorScore * 0.2 +
      tasteScore * 0.1
    );

    // Human-readable explanation
    const costText =
      costDelta === 0
        ? 'Same price'
        : costDelta < 0
        ? `$${Math.abs(costDelta)} cheaper`
        : `+$${costDelta} premium`;

    const explanation = `Rated ${candidate.vendorRating}★ by ${candidate.vendor}. ${costText}. Fits schedule with ${timeScore}% slot alignment and matches your ${candidate.tags[0] || 'activity'} preference.`;

    return {
      component: candidate,
      score: compositeScore,
      costDelta,
      breakdown: {
        costScore: Math.round(costScore),
        timeScore: Math.round(timeScore),
        vendorScore: Math.round(vendorScore),
        tasteScore: Math.round(tasteScore),
      },
      explanation,
    };
  }

  /**
   * Main adapt entry point
   */
  public static triggerAdaptation(
    itinerary: TripItinerary,
    disruptedComponentId: string,
    cause: DisruptionCause,
    description: string,
    availableCatalogAlternatives?: ItineraryComponent[]
  ): AdaptationResult {
    const original = itinerary.components.find((c) => c.id === disruptedComponentId);
    if (!original) {
      throw new Error(`Component with ID ${disruptedComponentId} not found in itinerary.`);
    }

    // 1. Identify downstream cascading components
    const impactedIds = this.findDownstreamImpact(disruptedComponentId, itinerary.components);

    // 2. Locate or generate alternatives for this slot
    const candidates = availableCatalogAlternatives && availableCatalogAlternatives.length > 0
      ? availableCatalogAlternatives
      : this.generateFallbackAlternatives(original, cause);

    // 3. Score and rank alternatives
    const rankedAlternatives = candidates
      .map((cand) => this.scoreAlternative(original, cand, itinerary.tasteProfile))
      .sort((a, b) => b.score - a.score);

    // 4. Recommendation
    const topPick = rankedAlternatives[0];
    const systemRecommendation = topPick
      ? `Adapt Engine recommends swapping to "${topPick.component.name}" with a recovery score of ${topPick.score}/100. ${topPick.explanation}`
      : 'No automated replacement found. Manual operator reroute required.';

    const recalculatedTotalCost = topPick
      ? itinerary.totalCost + topPick.costDelta
      : itinerary.totalCost;

    return {
      disruptedComponentId,
      disruptionCause: cause,
      disruptionDescription: description,
      impactedComponents: impactedIds,
      rankedAlternatives,
      systemRecommendation,
      recalculatedTotalCost,
    };
  }

  /**
   * Generates smart realistic fallback alternatives based on component type and cause
   */
  private static generateFallbackAlternatives(
    original: ItineraryComponent,
    cause: DisruptionCause
  ): ItineraryComponent[] {
    const isWeather = cause === 'weather';

    if (original.type === 'activity') {
      return [
        {
          id: `alt-${original.id}-1`,
          name: isWeather ? `Indoor Heritage & Artisan Gallery (${original.location.name})` : `Express Guided City Highlights`,
          type: 'activity',
          day: original.day,
          time: original.time,
          duration: original.duration,
          location: {
            name: `${original.location.name} Cultural Pavilion`,
            lat: original.location.lat + 0.005,
            lng: original.location.lng - 0.003,
          },
          cost: Math.max(25, Math.round(original.cost * 0.9)),
          currency: original.currency,
          vendor: 'Artisan Heritage Guild',
          vendorRating: 4.8,
          dependsOn: original.dependsOn,
          status: 'alternative',
          description: isWeather
            ? 'Weather-proof indoor immersion into local art, textile craft, and private culinary tasting.'
            : 'Premium expedited tour avoiding congested routes with private docent.',
          tags: ['culture', 'indoor', 'craft', 'culinary'],
        },
        {
          id: `alt-${original.id}-2`,
          name: `VIP Botanical Conservatory & Tea Lounge`,
          type: 'activity',
          day: original.day,
          time: original.time,
          duration: original.duration,
          location: {
            name: `${original.location.name} Glasshouse Reserve`,
            lat: original.location.lat - 0.008,
            lng: original.location.lng + 0.006,
          },
          cost: Math.round(original.cost * 1.15),
          currency: original.currency,
          vendor: 'Terra Lux Experiences',
          vendorRating: 4.95,
          dependsOn: original.dependsOn,
          status: 'alternative',
          description: 'Climate-controlled architectural glass conservatory with private high tea tasting.',
          tags: ['relaxation', 'luxury', 'indoor', 'tea'],
        },
      ];
    }

    if (original.type === 'transport') {
      return [
        {
          id: `alt-${original.id}-1`,
          name: 'Scenic Express Rail Executive Coach',
          type: 'transport',
          day: original.day,
          time: original.time,
          duration: original.duration,
          location: original.location,
          cost: Math.round(original.cost * 1.05),
          currency: original.currency,
          vendor: 'National Highspeed Rail',
          vendorRating: 4.85,
          dependsOn: original.dependsOn,
          status: 'alternative',
          description: 'Weather-resilient electric rail service with panoramic observation windows.',
          tags: ['train', 'scenic', 'reliable'],
        },
        {
          id: `alt-${original.id}-2`,
          name: 'Private Chauffeur Mercedes Sprinter Transfer',
          type: 'transport',
          day: original.day,
          time: original.time,
          duration: original.duration,
          location: original.location,
          cost: Math.round(original.cost * 1.3),
          currency: original.currency,
          vendor: 'Apex Private Mobility',
          vendorRating: 4.9,
          dependsOn: original.dependsOn,
          status: 'alternative',
          description: 'Door-to-door private luxury vehicle with live GPS traffic rerouting.',
          tags: ['private', 'luxury', 'direct'],
        },
      ];
    }

    // Default stay / dining alternative
    return [
      {
        id: `alt-${original.id}-1`,
        name: `Boutique Sister Property (${original.location.name})`,
        type: original.type,
        day: original.day,
        time: original.time,
        duration: original.duration,
        location: original.location,
        cost: original.cost,
        currency: original.currency,
        vendor: 'Grand Horizon Hospitality',
        vendorRating: 4.8,
        dependsOn: original.dependsOn,
        status: 'alternative',
        description: 'Equal tier partner establishment with guaranteed instant confirmation.',
        tags: ['hospitality', 'convenience'],
      },
    ];
  }
}
