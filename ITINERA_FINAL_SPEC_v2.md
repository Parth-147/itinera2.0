# Itinera — Personalized Dynamic Tour Planning & Tour Operations Platform
### Final project specification (v1)

## 1. What this project is

Itinera is a two-sided travel platform built for HackCelestial 3.0 (Tech
Alegria 2026, Pillai University) — Problem Statement 7, Hospitality &
Travel track. It lets travelers build a fully custom trip (destination,
dates, budget, stay, transport, interests) instead of picking a fixed
package, and gives tour operators a single dashboard to manage every
customer's bookings, vendors, and payments instead of spreadsheets and
WhatsApp threads.

Its key differentiator is **Trip DNA** — a per-traveler taste profile
built from post-trip reviews that personalizes future trip recommendations
and disruption alternatives — closing the full tour lifecycle (Discover
through Review) instead of stopping at booking, which is where most
competing hackathon submissions on this same PS are expected to stop.

This is a five-person team project. A working, clickable prototype is due
September 6, 2026 (Ideathon shortlisting round); a full 24-hour build
follows on September 26–27, 2026 if shortlisted to the final round.

## 2. Summary of key decisions made

| Decision point | Considered | Final choice | Why |
|---|---|---|---|
| Differentiator | Proactive risk prediction, group trip personalization, conversational-first UX, local/community vendor focus, live in-trip co-pilot, live budget rebalancing, vendor trust scoring | **Trip DNA** — evolving taste profile from post-trip reviews | Closes the full 11-step lifecycle (including the Review step almost every competing team will skip); reuses existing Adapt Engine and trip-builder work rather than requiring a separate subsystem |
| Database | MongoDB + Mongoose | **Firebase Firestore** | Free real-time listeners (live disruption updates with no extra code) and native pairing with Firebase Auth |
| Authentication | Seeded fake users (no real auth) | **Firebase Authentication + Google OAuth** | Firebase makes real login nearly free to add — no reason to skip it once Firestore was chosen |
| GenAI provider | Anthropic Claude API | **Google Gemini API (Flash)** | Claude API is pay-per-token after a one-time trial credit; Gemini's free tier is ongoing and ratelimited rather than trial-based, avoiding a mid-hackathon cost surprise |
| Custom-trained model | Training a bespoke LLM for adaptiveness | **Rejected for v1** — use Gemini for language tasks (text-in/text-out) only; Trip DNA's personalization logic is simple scoring, not a trained model | A from-scratch model needs GPU access, curated data, and months of work — infeasible in hackathon timelines; the actual "adaptive" need is served by rule-based scoring against stored taste data |
| Hosting | — | **Vercel (frontend) + Render/Railway (backend)** | Standard low-friction hackathon deployment pairing |

## 3. Core goals

- Let a traveler assemble a personalized, priced, day-wise itinerary from
  individual components rather than choosing a fixed package
- Give tour operators one dashboard for all active customized tours,
  vendors, bookings, and payments
- Detect the downstream impact of a disruption (cancellation, delay,
  weather) on a booked itinerary and propose ranked alternatives
  automatically (the Adapt Engine)
- Build a per-traveler taste profile from post-trip reviews and use it to
  personalize future recommendations and disruption alternatives (Trip DNA)
- Provide a natural-language entry point for describing trip preferences,
  and generate human-readable itinerary narration and disruption
  explanations
- Keep GenAI usage on a genuinely free, ongoing tier — no paid API
  dependency for a student hackathon project

## 4. Final architecture

```
React + Vite frontend (Vercel)
  - Traveler view: trip builder, itinerary display, cost comparison,
    disruption/adapt view, post-trip review screen
  - Operator view: active tours dashboard, vendor/booking/payment status,
    disruption notifications
  - Auth: Firebase Authentication (email/password + Google OAuth)
  - Real-time: Firestore listeners for live trip/disruption updates
        |
        |  REST (HTTPS)
        v
Node.js + Express backend (Render/Railway)
  - Adapt Engine: walks the dependsOn graph on a disruption, scores
    alternatives by cost delta, time delta, vendor rating, and Trip DNA fit
  - Gemini proxy: free-text trip intake, itinerary narration, disruption
    explanations — Gemini API key never exposed to the frontend
  - Firestore Admin SDK: server-side reads/writes requiring validation
        |
        v
Firebase (Firestore + Authentication)
  - Collections: users, trips, components, vendors, bookings,
    disruptions, taste_profiles
        |
        v
Google Gemini API (Flash) — free tier, called server-side only
```

The frontend talks to Firestore directly for most reads (via real-time
listeners) and to Express for anything requiring business logic (Adapt
Engine scoring, Gemini calls, validated writes).

## 5. Visual identity

- **Core palette**: deep navy/blue accent (`#1F4E79` range) on a clean
  white/light background — a professional, trustworthy travel-brand feel
  rather than a generic template look
- **Typography**: standard sans-serif UI font for readability across
  forms and dashboards
- **Motion**: Framer Motion used for itinerary component reordering,
  disruption alert transitions, and page/state changes — subtle, not
  flashy
- **Traveler side tone**: warm, exploratory — destination imagery,
  card-based component browsing
- **Operator side tone**: dense, functional — table/kanban layouts
  prioritizing at-a-glance status over visual flourish
- **Reactive behavior**: disrupted components visually flag (color/badge
  change) in real time via Firestore listeners without a page refresh

## 6. Functional requirements

### 6.1 Trip building (traveler)
- Input destination(s), dates, duration, budget, accommodation/transport
  preferences, interests, and travel style
- Generate a day-wise itinerary from individual components (stay,
  transport, activity)
- Swap, add, or remove any component; cost recalculates live
- Compare at least two alternatives for a given component
- Confirm/"book" the finalized itinerary

### 6.2 Operator dashboard
- List all active tours with traveler, destination, dates, and status
- View full component/booking breakdown per tour
- View vendor assignment and payment status per booking
- Add/edit vendor inventory records
- Receive real-time notification when a disruption affects a managed tour

### 6.3 Adapt Engine
- Raise a disruption event against a specific component
- Identify all components depending on the disrupted one via `dependsOn`
- Flag dependents as "at risk" in real time on both traveler and operator
  views
- Generate at least two ranked alternatives, scored by cost delta, time
  delta, and vendor rating
- Update itinerary and cost immediately on alternative selection

### 6.4 Trip DNA
- Prompt post-trip ratings/reviews of individual components (the Review
  lifecycle step)
- Derive and store taste attributes (accommodation tier preference,
  activity affinities, budget sensitivity) into a per-traveler profile
- Use the profile to pre-weight recommendations on the traveler's next
  trip
- Use the profile as an input signal in Adapt Engine ranking
- Allow a traveler to view a summary of their own taste profile

### 6.5 GenAI features (Gemini)
- Convert free-text trip descriptions into structured trip parameters
- Generate human-readable, day-by-day itinerary narration
- Generate a short natural-language explanation of why an Adapt Engine
  alternative was ranked highest
- All Gemini calls made server-side only; API key never in client code

### 6.6 Booking and payment (simulated)
- Create a booking record per confirmed component
- Represent payment status as pending / paid / refunded (simulated)
- Update booking status to cancelled when a component is removed due to
  disruption

### 6.7 Authentication
- Sign up / sign in via Firebase Authentication (email/password)
- Sign in via Google OAuth through Firebase Authentication
- Assign each user a role (traveler or operator) in a Firestore profile
- Restrict Operator Dashboard access to the operator role

## 7. Non-functional requirements

- **Performance**: initial itinerary generated within ~5 seconds; Adapt
  Engine returns ranked alternatives within ~3 seconds under demo
  conditions
- **Real-time**: Firestore-driven UI updates reflected within ~2 seconds
- **Security**: all traffic over HTTPS; Gemini API key stored server-side
  only; Firestore security rules restrict users to their own data
  (operators may read tours assigned to them)
- **Resilience**: if the Gemini API is temporarily unreachable, the system
  should degrade gracefully (cached/seeded fallback) rather than break the
  demo
- **Portability**: frontend and backend deployable independently
  (Vercel / Render or Railway) via environment-variable configuration

## 8. Final tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js + Express |
| Auth & Database | Firebase Authentication (incl. Google OAuth) + Cloud Firestore |
| GenAI | Google Gemini API (Flash) — free tier, server-side only |
| Hosting | Vercel (frontend) + Render/Railway (backend) |

## 9. Build phases

### Phase 1 — Setup (pre-build)
Firebase project, Firestore + Auth enabled, Gemini API key issued, repo
and branch structure created, local environments running for all five
members.

### Phase 2 — Core skeletons
Static trip builder UI, static operator dashboard shell, Firestore
collections defined with seed data, Adapt Engine logic planned on paper,
Express skeleton with a working Gemini proxy test route.

### Phase 3 — Wire it together
Trip builder writes real trips to Firestore; operator dashboard reads
real trips; Adapt Engine implemented with real cost/time scoring against
seeded `dependsOn` data; free-text intake wired to Gemini.

### Phase 4 — Demo polish
Framer Motion transitions, "Trigger Disruption" demo control, Trip DNA
mock/summary screen, full team bug-bash on the end-to-end flow.

### Phase 5 — Ship the prototype (Sep 6 deadline)
Deploy frontend and backend, record a short demo walkthrough, verify no
API keys are exposed in committed code, submit with buffer time.

### Phase 6 — Full hackathon build (if shortlisted, Sep 26–27)
Real-time Firestore listeners fully wired across both dashboards, Trip
DNA scoring logic fully implemented (not mocked), itinerary narration and
disruption explanations added via Gemini, UI polish pass, live 24-hour
build culminating in the on-stage demo.

## 10. Explicitly out of scope for v1

- Real payment processing (status is simulated only)
- Real hotel/transport/activity vendor API integrations (inventory is
  hand-seeded)
- Training or fine-tuning any custom machine learning model
- Multi-currency and internationalization support
- Full WCAG accessibility compliance

## 11. Success criteria for v1

- A traveler can build a custom multi-day trip end-to-end and see it
  appear on the operator dashboard
- Triggering a disruption visibly flags affected components and offers
  at least two ranked alternatives, with the itinerary updating live on
  selection
- At least one Gemini-powered feature (free-text trip intake) works
  end-to-end without exposing the API key client-side
- The prototype is deployed and reachable via a live link, not just
  runnable locally, by the September 6 submission deadline
