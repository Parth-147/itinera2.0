/**
 * ITINERA Demo Data Seed Script
 * Run: node apps/backend/src/scripts/seed-demo.js
 *
 * Idempotent: checks for existing IDs before adding. Running multiple times
 *   produces zero changes once all demo records are present.
 * Safe: only APPENDS demo records; never deletes, filters, or overwrites
 *   any existing trip or vendor regardless of title or content.
 * Removable: all demo trips use IDs prefixed with "demo-" and traveler IDs
 *   prefixed with "demo-traveler-" for easy identification and safe removal.
 *
 * NOTE: Previous versions of this script contained auto-deduplication logic
 * that deleted Santorini duplicate trips. That logic has been removed.
 * The data cleanup it performed (2026-10-10) is complete and must not be
 * re-applied. Do not restore the Santorini filter.
 */

const fs = require('fs');
const path = require('path');

const ITINERARIES_PATH = path.join(__dirname, '../../data/itineraries.json');
const VENDORS_PATH = path.join(__dirname, '../../data/vendors.json');

const DEMO_TRIP_IDS = [
  'demo-kerala-001',
  'demo-manali-002',
  'demo-amalfi-003'
];

// ─── Demo Trips ───────────────────────────────────────────────────────────────

const DEMO_TRIPS = [
  {
    "id": "demo-kerala-001",
    "title": "5-Day Kerala Backwaters & Spice Country",
    "destination": "Kerala, India",
    "destinationCoords": {
      "name": "Fort Kochi Jetty",
      "lat": 9.9658,
      "lng": 76.2440
    },
    "startDate": "2027-01-08",
    "endDate": "2027-01-13",
    "durationDays": 5,
    "totalCost": 1240,
    "currency": "USD",
    "travelerId": "demo-traveler-priya",
    "travelerName": "Priya Nair",
    "travelerEmail": "priya.nair@demo.itinera.travel",
    "tasteProfile": {
      "adventure": 55,
      "culture": 88,
      "relaxation": 90,
      "budgetConscious": 75,
      "favoriteStyles": [
        "Ayurvedic Wellness",
        "Backwater Cruising",
        "Local Cuisine"
      ]
    },
    "status": "confirmed",
    "createdAt": "2026-10-10T08:00:00.000Z",
    "updatedAt": "2026-10-10T08:00:00.000Z",
    "disruptions": [],
    "components": [
      {
        "id": "kerala-comp-1",
        "name": "Fort Kochi Heritage Walk & Chinese Fishing Nets",
        "type": "activity",
        "day": 1,
        "time": "09:00 AM",
        "duration": "3 hours",
        "location": {
          "name": "Fort Kochi, Kerala",
          "lat": 9.9658,
          "lng": 76.2440
        },
        "cost": 30,
        "currency": "USD",
        "vendor": "Kochi Culture Walks",
        "vendorRating": 4.82,
        "dependsOn": [],
        "status": "confirmed",
        "description": "Guided walking tour of Dutch palaces, Jewish synagogues, Chinese fishing nets, and colonial spice warehouses.",
        "tags": ["activity", "culture", "heritage"],
        "bookingRef": "BKG-KERALA-1",
        "paymentStatus": "paid"
      },
      {
        "id": "kerala-comp-2",
        "name": "Traditional Kerala Sadhya Feast",
        "type": "dining",
        "day": 1,
        "time": "01:00 PM",
        "duration": "1.5 hours",
        "location": {
          "name": "Fort Kochi Tharavad",
          "lat": 9.9677,
          "lng": 76.2469
        },
        "cost": 35,
        "currency": "USD",
        "vendor": "Tharavad Nalukettu Dining",
        "vendorRating": 4.92,
        "dependsOn": ["kerala-comp-1"],
        "status": "confirmed",
        "description": "Authentic 18-course Kerala Sadhya served on fresh banana leaf with rice, curries, pickles, and payasam dessert.",
        "tags": ["dining", "culinary", "authentic"],
        "bookingRef": "BKG-KERALA-2",
        "paymentStatus": "paid"
      },
      {
        "id": "kerala-comp-3",
        "name": "Private Kettuvallam Houseboat — Alleppey Backwaters",
        "type": "transport",
        "day": 2,
        "time": "10:00 AM",
        "duration": "Overnight",
        "location": {
          "name": "Alleppey Boat Jetty",
          "lat": 9.4981,
          "lng": 76.3388
        },
        "cost": 360,
        "currency": "USD",
        "vendor": "Kerala Houseboat Collective",
        "vendorRating": 4.87,
        "dependsOn": ["kerala-comp-1"],
        "status": "confirmed",
        "description": "Two-bedroom rice-barge with a private sundeck, onboard cook, and scenic sunset anchorage in the Vembanad lake network.",
        "tags": ["transport", "stay", "backwaters", "exclusive"],
        "bookingRef": "BKG-KERALA-3",
        "paymentStatus": "paid"
      },
      {
        "id": "kerala-comp-4",
        "name": "Munnar Tea Estate Sunrise Walk & Plantation Stay",
        "type": "stay",
        "day": 3,
        "time": "02:00 PM",
        "duration": "Overnight",
        "location": {
          "name": "Munnar, Idukki, Kerala",
          "lat": 10.0889,
          "lng": 77.0595
        },
        "cost": 145,
        "currency": "USD",
        "vendor": "Spice Garden Heritage Hotels",
        "vendorRating": 4.85,
        "dependsOn": ["kerala-comp-3"],
        "status": "confirmed",
        "description": "Colonial-era planter's bungalow set among 200 acres of rolling tea gardens with guided sunrise harvest walk.",
        "tags": ["stay", "nature", "plantation", "heritage"],
        "bookingRef": "BKG-KERALA-4",
        "paymentStatus": "paid"
      },
      {
        "id": "kerala-comp-5",
        "name": "Periyar Tiger Reserve Wildlife Canoe Safari",
        "type": "activity",
        "day": 4,
        "time": "07:00 AM",
        "duration": "3 hours",
        "location": {
          "name": "Periyar Lake, Thekkady",
          "lat": 9.5851,
          "lng": 77.1599
        },
        "cost": 65,
        "currency": "USD",
        "vendor": "Periyar Nature Trails",
        "vendorRating": 4.78,
        "dependsOn": ["kerala-comp-4"],
        "status": "confirmed",
        "description": "Silent bamboo canoe through the core wildlife zone — elephants, sambar deer, and rare Malabar giant squirrels at dawn.",
        "tags": ["activity", "wildlife", "nature", "adventure"],
        "bookingRef": "BKG-KERALA-5",
        "paymentStatus": "paid"
      },
      {
        "id": "kerala-comp-6",
        "name": "Kathakali Performance & Kalaripayattu Martial Arts Demo",
        "type": "activity",
        "day": 5,
        "time": "06:00 PM",
        "duration": "2 hours",
        "location": {
          "name": "Kerala Kathakali Centre, Kochi",
          "lat": 9.9643,
          "lng": 76.2425
        },
        "cost": 40,
        "currency": "USD",
        "vendor": "Kerala Arts Academy",
        "vendorRating": 4.93,
        "dependsOn": ["kerala-comp-1"],
        "status": "confirmed",
        "description": "Backstage makeup session followed by live Kathakali performance and a Kalaripayattu demonstration by student masters.",
        "tags": ["activity", "culture", "art", "performance"],
        "bookingRef": "BKG-KERALA-6",
        "paymentStatus": "escrow"
      }
    ]
  },
  {
    "id": "demo-manali-002",
    "title": "6-Day Manali — Himalayan Peaks & Valley Thrills",
    "destination": "Manali, India",
    "destinationCoords": {
      "name": "Old Manali Bridge",
      "lat": 32.2396,
      "lng": 77.1887
    },
    "startDate": "2027-05-15",
    "endDate": "2027-05-21",
    "durationDays": 6,
    "totalCost": 980,
    "currency": "USD",
    "travelerId": "demo-traveler-arjun",
    "travelerName": "Arjun Sharma",
    "travelerEmail": "arjun.sharma@demo.itinera.travel",
    "tasteProfile": {
      "adventure": 95,
      "culture": 60,
      "relaxation": 40,
      "budgetConscious": 80,
      "favoriteStyles": [
        "High-Altitude Trekking",
        "Adventure Sports",
        "Mountain Camping"
      ]
    },
    "status": "confirmed",
    "createdAt": "2026-10-10T08:00:00.000Z",
    "updatedAt": "2026-10-10T08:00:00.000Z",
    "disruptions": [
      {
        "id": "disrupt-manali-01",
        "componentId": "manali-comp-4",
        "cause": "weather",
        "description": "Unseasonal snowfall at Rohtang Pass above 3,900m closed the approach road. Operator rerouted group to Solang Valley extended paragliding and glacier viewing as a high-value alternative.",
        "severity": "medium",
        "affectedDownstream": ["manali-comp-5"],
        "timestamp": "2026-10-10T08:00:00.000Z",
        "resolved": true
      }
    ],
    "components": [
      {
        "id": "manali-comp-1",
        "name": "Bhuntar Airport Transfer — Old Manali",
        "type": "transport",
        "day": 1,
        "time": "11:00 AM",
        "duration": "2.5 hours",
        "location": {
          "name": "Bhuntar Airport, Kullu",
          "lat": 31.8769,
          "lng": 77.1543
        },
        "cost": 45,
        "currency": "USD",
        "vendor": "Himachal Road Rovers",
        "vendorRating": 4.80,
        "dependsOn": [],
        "status": "confirmed",
        "description": "Premium 4WD pickup with luggage handling through the scenic Beas River valley gorge road.",
        "tags": ["transport", "transfer", "scenic"],
        "bookingRef": "BKG-MANALI-1",
        "paymentStatus": "paid"
      },
      {
        "id": "manali-comp-2",
        "name": "Himalayan Riverside Camp & Log Cabin Check-in",
        "type": "stay",
        "day": 1,
        "time": "03:00 PM",
        "duration": "5 nights",
        "location": {
          "name": "Old Manali, Himachal Pradesh",
          "lat": 32.2396,
          "lng": 77.1887
        },
        "cost": 475,
        "currency": "USD",
        "vendor": "Snow Peak Manali Retreats",
        "vendorRating": 4.82,
        "dependsOn": ["manali-comp-1"],
        "status": "confirmed",
        "description": "Riverside log cabins with mountain views, bonfire evenings, and farm-fresh breakfast from local dairies.",
        "tags": ["stay", "camp", "mountain", "nature"],
        "bookingRef": "BKG-MANALI-2",
        "paymentStatus": "paid"
      },
      {
        "id": "manali-comp-3",
        "name": "Solang Valley Paragliding & Zorbing Adventure",
        "type": "activity",
        "day": 2,
        "time": "09:00 AM",
        "duration": "4 hours",
        "location": {
          "name": "Solang Valley, Manali",
          "lat": 32.3148,
          "lng": 77.1542
        },
        "cost": 55,
        "currency": "USD",
        "vendor": "Solang Valley Adventure Co.",
        "vendorRating": 4.71,
        "dependsOn": ["manali-comp-2"],
        "status": "confirmed",
        "description": "Tandem paragliding from 2,480m with panoramic views of the Dhauladhar Range, followed by snowball zorbing.",
        "tags": ["activity", "adventure", "paragliding", "thrill"],
        "bookingRef": "BKG-MANALI-3",
        "paymentStatus": "paid"
      },
      {
        "id": "manali-comp-4",
        "name": "Rohtang Pass 4WD Expedition — Lahaul Valley",
        "type": "activity",
        "day": 3,
        "time": "05:30 AM",
        "duration": "8 hours",
        "location": {
          "name": "Rohtang Pass, Himachal Pradesh",
          "lat": 32.3742,
          "lng": 77.2496
        },
        "cost": 120,
        "currency": "USD",
        "vendor": "Rohtang High Pass Expeditions",
        "vendorRating": 4.77,
        "dependsOn": ["manali-comp-2"],
        "status": "confirmed",
        "description": "Private 4WD to the 3,978m Rohtang summit, continuing into the stark moonscape of Lahaul Spiti.",
        "tags": ["activity", "adventure", "high-altitude", "offroad"],
        "bookingRef": "BKG-MANALI-4",
        "paymentStatus": "paid"
      },
      {
        "id": "manali-comp-5",
        "name": "Hampta Pass Trek — Day Ascent",
        "type": "activity",
        "day": 4,
        "time": "06:00 AM",
        "duration": "7 hours",
        "location": {
          "name": "Jobra Trailhead, Manali",
          "lat": 32.2648,
          "lng": 77.2132
        },
        "cost": 90,
        "currency": "USD",
        "vendor": "High Himalaya Trekkers Guild",
        "vendorRating": 4.88,
        "dependsOn": ["manali-comp-4"],
        "status": "confirmed",
        "description": "Moderate ascent through alpine meadows to 4,268m. Dramatic contrast of lush Kullu valley and arid Lahaul on either side.",
        "tags": ["activity", "trek", "adventure", "high-altitude"],
        "bookingRef": "BKG-MANALI-5",
        "paymentStatus": "escrow"
      },
      {
        "id": "manali-comp-6",
        "name": "Hadimba Temple & Vashisht Hot Springs Morning",
        "type": "activity",
        "day": 5,
        "time": "09:30 AM",
        "duration": "3 hours",
        "location": {
          "name": "Hadimba Temple, Manali",
          "lat": 32.2351,
          "lng": 77.1735
        },
        "cost": 20,
        "currency": "USD",
        "vendor": "Manali Heritage Walks",
        "vendorRating": 4.75,
        "dependsOn": ["manali-comp-2"],
        "status": "confirmed",
        "description": "Visit the 1553 Hadimba wooden temple in its deodar cedar grove, then soak in the ancient sulfur hot springs at Vashisht village.",
        "tags": ["activity", "culture", "heritage", "relaxation"],
        "bookingRef": "BKG-MANALI-6",
        "paymentStatus": "paid"
      }
    ]
  },
  {
    "id": "demo-amalfi-003",
    "title": "4-Day Amalfi Coast — Clifftop Villages & Azure Waters",
    "destination": "Amalfi Coast, Italy",
    "destinationCoords": {
      "name": "Positano Beach Promenade",
      "lat": 40.6281,
      "lng": 14.4839
    },
    "startDate": "2027-03-20",
    "endDate": "2027-03-24",
    "durationDays": 4,
    "totalCost": 2380,
    "currency": "USD",
    "travelerId": "demo-traveler-sophia",
    "travelerName": "Sophia Laurent",
    "travelerEmail": "sophia.laurent@demo.itinera.travel",
    "tasteProfile": {
      "adventure": 60,
      "culture": 85,
      "relaxation": 80,
      "budgetConscious": 45,
      "favoriteStyles": [
        "Mediterranean Cuisine",
        "Coastal Scenery",
        "Art & Architecture"
      ]
    },
    "status": "confirmed",
    "createdAt": "2026-10-10T08:00:00.000Z",
    "updatedAt": "2026-10-10T08:00:00.000Z",
    "disruptions": [],
    "components": [
      {
        "id": "amalfi-comp-1",
        "name": "Le Sirenuse Positano Check-in & Terrace Welcome",
        "type": "stay",
        "day": 1,
        "time": "02:00 PM",
        "duration": "3 nights",
        "location": {
          "name": "Positano, Amalfi Coast",
          "lat": 40.6281,
          "lng": 14.4839
        },
        "cost": 1050,
        "currency": "USD",
        "vendor": "Positano Clifftop Collection",
        "vendorRating": 4.97,
        "dependsOn": [],
        "status": "confirmed",
        "description": "Five-star cliffside hotel with ceramic-tiled balconies directly overlooking the Tyrrhenian Sea.",
        "tags": ["stay", "luxury", "sea-view", "boutique"],
        "bookingRef": "BKG-AMALFI-1",
        "paymentStatus": "paid"
      },
      {
        "id": "amalfi-comp-2",
        "name": "Private Speedboat Grotto Blu & Capri Excursion",
        "type": "transport",
        "day": 2,
        "time": "09:30 AM",
        "duration": "6 hours",
        "location": {
          "name": "Positano Marina Grande",
          "lat": 40.6272,
          "lng": 14.4821
        },
        "cost": 420,
        "currency": "USD",
        "vendor": "Tyrrhenian Blue Charters",
        "vendorRating": 4.91,
        "dependsOn": ["amalfi-comp-1"],
        "status": "confirmed",
        "description": "Private 8-passenger mahogany speedboat visiting the Emerald Grotto, Capri's Blue Grotto, and Faraglioni sea stacks.",
        "tags": ["transport", "boat", "exclusive", "scenic"],
        "bookingRef": "BKG-AMALFI-2",
        "paymentStatus": "paid"
      },
      {
        "id": "amalfi-comp-3",
        "name": "Ravello Villa Rufolo Gardens & Concert",
        "type": "activity",
        "day": 3,
        "time": "10:00 AM",
        "duration": "4 hours",
        "location": {
          "name": "Ravello, Amalfi Coast",
          "lat": 40.6491,
          "lng": 14.6104
        },
        "cost": 120,
        "currency": "USD",
        "vendor": "Ravello Cultural Foundation",
        "vendorRating": 4.89,
        "dependsOn": ["amalfi-comp-1"],
        "status": "confirmed",
        "description": "Private garden access at Villa Rufolo with guided Wagner history tour and a sunset classical concert on the famous belvedere stage.",
        "tags": ["activity", "culture", "music", "garden"],
        "bookingRef": "BKG-AMALFI-3",
        "paymentStatus": "paid"
      },
      {
        "id": "amalfi-comp-4",
        "name": "Limoncello & Pasta Masterclass — Conca dei Marini",
        "type": "dining",
        "day": 3,
        "time": "03:00 PM",
        "duration": "2.5 hours",
        "location": {
          "name": "Conca dei Marini, Amalfi Coast",
          "lat": 40.6136,
          "lng": 14.5621
        },
        "cost": 145,
        "currency": "USD",
        "vendor": "Amalfi Cucina Viva",
        "vendorRating": 4.93,
        "dependsOn": ["amalfi-comp-3"],
        "status": "confirmed",
        "description": "Hands-on limoncello distillation with Amalfi lemons, followed by pasta-making and a 3-course dinner with Campanian wine pairing.",
        "tags": ["dining", "culinary", "workshop", "authentic"],
        "bookingRef": "BKG-AMALFI-4",
        "paymentStatus": "escrow"
      },
      {
        "id": "amalfi-comp-5",
        "name": "Path of the Gods Hiking Trail — Nocelle to Positano",
        "type": "activity",
        "day": 4,
        "time": "08:00 AM",
        "duration": "4 hours",
        "location": {
          "name": "Agerola Trailhead, Amalfi Coast",
          "lat": 40.6462,
          "lng": 14.5241
        },
        "cost": 55,
        "currency": "USD",
        "vendor": "Sentiero degli Dei Guides",
        "vendorRating": 4.85,
        "dependsOn": ["amalfi-comp-1"],
        "status": "confirmed",
        "description": "The legendary 7.8km coastal cliff trail from Nocelle with panoramic sea views, descending directly into Positano for farewell lunch.",
        "tags": ["activity", "hiking", "scenic", "nature"],
        "bookingRef": "BKG-AMALFI-5",
        "paymentStatus": "paid"
      }
    ]
  }
];

// ─── Run Seed ─────────────────────────────────────────────────────────────────

function seedItineraries() {
  const data = JSON.parse(fs.readFileSync(ITINERARIES_PATH, 'utf8'));
  const existingIds = new Set(data.map(t => t.id));

  // NOTE: No records are ever deleted here. This function is append-only.
  // The one-time Santorini duplicate cleanup (2026-10-10) was performed
  // manually and must not be repeated.
  let added = 0;

  for (const demo of DEMO_TRIPS) {
    if (!existingIds.has(demo.id)) {
      data.push(demo);
      added++;
      console.log(`  + Added: ${demo.id} — ${demo.title}`);
    } else {
      console.log(`  = Skipped (already exists): ${demo.id}`);
    }
  }

  fs.writeFileSync(ITINERARIES_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\nItineraries: added ${added} demo trips. Total: ${data.length}`);
}

seedItineraries();
console.log('\nSeed complete. ✓');
