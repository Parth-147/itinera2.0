import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ── Inline SVG Icons ─────────────────────────────────────────────── */

function CompassIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function SparklesIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

function CurrencyIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function CalendarCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
  )
}

function BuildingOfficeIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  )
}

function TicketIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
    </svg>
  )
}

function RouteIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  )
}

function MapPinIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function StarIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRightIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function CheckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

/* ── Static Structured Data ───────────────────────────────────────── */

interface ValueBenefit {
  title: string
  description: string
  icon: React.ReactNode
}

const VALUE_BENEFITS: ValueBenefit[] = [
  {
    title: 'Personalized recommendations',
    description: 'Intelligent curation tailored to your travel style, pace, and passions.',
    icon: <SparklesIcon className="size-5 text-indigo-600" />,
  },
  {
    title: 'Budget-aware planning',
    description: 'Transparent cost estimates and real-time expense allocation for any trip.',
    icon: <CurrencyIcon className="size-5 text-indigo-600" />,
  },
  {
    title: 'Verified travel options',
    description: 'Authentic stays, vetted activities, and verified local itineraries.',
    icon: <ShieldCheckIcon className="size-5 text-indigo-600" />,
  },
  {
    title: 'Complete trip planning',
    description: 'Day-by-day scheduling, route optimization, and notes in one unified space.',
    icon: <CalendarCheckIcon className="size-5 text-indigo-600" />,
  },
]

interface Step {
  stepNumber: string
  title: string
  description: string
  detail: string
}

const STEPS: Step[] = [
  {
    stepNumber: '01',
    title: 'Tell us what you want',
    description: 'Select your dream destination, travel dates, companion group, and preferred pace—relaxed, balanced, or fast-tracked.',
    detail: 'Set duration & travel vibe',
  },
  {
    stepNumber: '02',
    title: 'Get personalized recommendations',
    description: 'ITINERA automatically surfaces verified boutique accommodations, authentic culinary spots, and iconic cultural experiences.',
    detail: 'Budget-aware suggestions',
  },
  {
    stepNumber: '03',
    title: 'Build your trip',
    description: 'Fine-tune your intuitive daily timeline, eliminate redundant transit with smart route sequencing, and travel with total clarity.',
    detail: 'Ready-to-go daily itinerary',
  },
]

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  tag: string
}

const FEATURES: Feature[] = [
  {
    title: 'Personalized recommendations',
    description: 'Discover hidden gems and must-see landmarks hand-selected to fit your exact travel rhythm and preferences.',
    icon: <SparklesIcon className="size-6 text-indigo-600" />,
    tag: 'Intelligence',
  },
  {
    title: 'Budget-based suggestions',
    description: 'Stay on budget with transparent tiered pricing ($ to $$$), real-time cost previews, and smart allocation advice.',
    icon: <CurrencyIcon className="size-6 text-indigo-600" />,
    tag: 'Cost Control',
  },
  {
    title: 'Hotels and stays',
    description: 'Browse boutique hotels, traditional ryokans, and cliffside villas verified for quality and prime location.',
    icon: <BuildingOfficeIcon className="size-6 text-indigo-600" />,
    tag: 'Accommodations',
  },
  {
    title: 'Curated activities',
    description: 'Hand-picked local experiences, skip-the-line admissions, guided culinary trails, and outdoor adventures.',
    icon: <TicketIcon className="size-6 text-indigo-600" />,
    tag: 'Experiences',
  },
  {
    title: 'Seamless travel planning',
    description: 'Consolidate travel details, bookings, timing notes, and packing reminders into one elegant, organized dashboard.',
    icon: <RouteIcon className="size-6 text-indigo-600" />,
    tag: 'Organization',
  },
  {
    title: 'Smart itinerary creation',
    description: 'Automatically optimize daily routes to minimize backtracking, reduce fatigue, and maximize memorable hours.',
    icon: <CalendarCheckIcon className="size-6 text-indigo-600" />,
    tag: 'Routing',
  },
]

interface DestinationCardData {
  id: string
  name: string
  region: string
  continent: string
  rating: number
  reviewCount: number
  priceEst: string
  duration: string
  tags: string[]
  gradient: string
}

const FEATURED_DESTINATIONS: DestinationCardData[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    region: 'Japan',
    continent: 'Asia',
    rating: 4.97,
    reviewCount: 342,
    priceEst: 'From $1,450',
    duration: '5–7 days',
    tags: ['#Temples', '#ZenGardens'],
    gradient: 'from-rose-100 via-orange-50 to-amber-100',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    region: 'Greece',
    continent: 'Europe',
    rating: 4.93,
    reviewCount: 288,
    priceEst: 'From $2,100',
    duration: '4–6 days',
    tags: ['#CalderaViews', '#Sunsets'],
    gradient: 'from-sky-100 via-blue-50 to-indigo-100',
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    region: 'Morocco',
    continent: 'Africa',
    rating: 4.88,
    reviewCount: 215,
    priceEst: 'From $850',
    duration: '4–6 days',
    tags: ['#Medina', '#Riads'],
    gradient: 'from-amber-100 via-orange-50 to-yellow-100',
  },
  {
    id: 'reykjavik',
    name: 'Reykjavík',
    region: 'Iceland',
    continent: 'Europe',
    rating: 4.95,
    reviewCount: 394,
    priceEst: 'From $2,450',
    duration: '6–9 days',
    tags: ['#Auroras', '#Glaciers'],
    gradient: 'from-teal-100 via-cyan-50 to-blue-100',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    region: 'Italy',
    continent: 'Europe',
    rating: 4.92,
    reviewCount: 318,
    priceEst: 'From $2,600',
    duration: '5–8 days',
    tags: ['#CliffsideVillas', '#Capri'],
    gradient: 'from-violet-100 via-purple-50 to-indigo-100',
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    region: 'New Zealand',
    continent: 'Oceania',
    rating: 4.96,
    reviewCount: 250,
    priceEst: 'From $1,850',
    duration: '7–10 days',
    tags: ['#AlpineLakes', '#MilfordSound'],
    gradient: 'from-emerald-100 via-teal-50 to-green-100',
  },
]

/* ── Main Component ───────────────────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate()
  const [destinationQuery, setDestinationQuery] = useState('')
  const [activePreviewDay, setActivePreviewDay] = useState<number>(2)

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = destinationQuery.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white px-6 pt-8 pb-16 sm:px-8 sm:pt-14 sm:pb-24 lg:pt-16">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-1/2 translate-x-1/2 h-[520px] w-[780px] rounded-full bg-gradient-to-b from-indigo-100/50 via-slate-50/40 to-transparent blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Hero Header Content */}
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              <SparklesIcon className="size-3.5 text-indigo-600" />
              Intelligent Travel Platform
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl md:leading-[1.12]">
              Intelligent travel planning, crafted for how you wander.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              From personalized destination discovery and budget-aware recommendations to seamless day-by-day itineraries—ITINERA builds trips that reflect your personal travel style.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
              <Link
                to="/create"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
              >
                <span>Plan Your Trip</span>
                <ArrowRightIcon className="size-4" />
              </Link>

              <Link
                to="/search"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
              >
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>

          {/* Quick Destination Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 sm:p-2.5 animate-fade-in"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <MapPinIcon className="size-5" />
                </div>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Where do you want to travel? (e.g. Kyoto, Amalfi, Iceland)..."
                  className="w-full rounded-xl bg-slate-50/70 py-2.5 pr-4 pl-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                <CompassIcon className="size-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* ── Travel Visual Area: Interactive Itinerary Snapshot ── */}
          <div className="mx-auto mt-12 max-w-4xl animate-fade-in-up">
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60">
              {/* Card Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="ml-2 text-xs font-semibold text-slate-600">
                    ITINERA Smart Itinerary Preview
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-full px-3 py-0.5">
                  <CheckIcon className="size-3 text-indigo-600" />
                  <span>Route Optimized</span>
                </div>
              </div>

              {/* Itinerary Header */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      <span>Curated Journey</span>
                      <span>·</span>
                      <span>Japan</span>
                    </div>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      Autumn in Kyoto & Arashiyama
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>6 Days / 5 Nights</span>
                      <span>·</span>
                      <span>2 Travelers</span>
                      <span>·</span>
                      <span>Moderate Pace</span>
                    </p>
                  </div>

                  {/* Live Budget Counter Preview */}
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 sm:p-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs">
                      <CurrencyIcon className="size-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Estimated Budget</p>
                      <p className="text-base font-bold text-slate-950">$1,450 <span className="text-xs font-normal text-slate-400">/ target $1,600</span></p>
                    </div>
                  </div>
                </div>

                {/* Day selector tabs */}
                <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
                  {[1, 2, 3].map((dayNum) => (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => setActivePreviewDay(dayNum)}
                      className={[
                        'rounded-xl px-4 py-2 font-semibold transition',
                        activePreviewDay === dayNum
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      Day 0{dayNum}: {dayNum === 1 ? 'Arrival & Gion' : dayNum === 2 ? 'Fushimi & Zen Temples' : 'Arashiyama Bamboo'}
                    </button>
                  ))}
                </div>

                {/* Day Timeline Activities */}
                <div className="mt-6 space-y-3">
                  {activePreviewDay === 2 ? (
                    <>
                      <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50 sm:items-center">
                        <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200/60">
                          07:00 AM
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Fushimi Inari Taisha Dawn Ascent
                          </p>
                          <p className="text-xs text-slate-500">
                            Beat the mid-day crowds through the iconic thousand vermilion torii gates.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200/60">
                          #Highlight
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50 sm:items-center">
                        <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200/60">
                          12:30 PM
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Nishiki Market Artisan Culinary Tasting
                          </p>
                          <p className="text-xs text-slate-500">
                            Curated 5-course street-food walk featuring fresh matcha, skewers, and yuba.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
                          #Gastronomy
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50 sm:items-center">
                        <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200/60">
                          03:30 PM
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Ryoan-ji Zen Meditation & Rock Garden Walk
                          </p>
                          <p className="text-xs text-slate-500">
                            Quiet contemplative garden visit scheduled before temple closing.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                          #Culture
                        </span>
                      </div>
                    </>
                  ) : activePreviewDay === 1 ? (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">Day 01 Highlights</p>
                      <p className="mt-1">Airport express transfer to central Kyoto · Check-in at boutique machiya stay · Evening twilight stroll through historic Gion.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">Day 03 Highlights</p>
                      <p className="mt-1">Sagano scenic railway · Arashiyama bamboo grove morning walk · Traditional Hozu river wooden boat drift.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST / VALUE STRIP ──────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/60 px-6 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition hover:shadow-sm"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/60">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              How ITINERA plans your journey
            </h2>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Turn scattered ideas, bookmarks, and wishlists into an effortless, personalized itinerary in minutes.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.stepNumber}
                className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold tracking-tight text-indigo-600">
                    {s.stepNumber}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    {s.detail}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-950 group-hover:text-indigo-600 transition-colors">
                  {s.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURE SECTION ──────────────────────────────────────── */}
      <section className="bg-slate-50/60 px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Core Capabilities
            </span>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything required for extraordinary trips
            </h2>
            <p className="mx-auto mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Powerful tools designed to simplify every dimension of your journey—from inspiration to booking and on-the-ground exploration.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/70 transition-colors group-hover:bg-indigo-100/70">
                    {f.icon}
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {f.tag}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESTINATION / DISCOVERY SECTION ──────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                Trending Destinations
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Where travelers are heading next
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Explore hand-curated itineraries, seasonal highlights, and verified local experiences.
              </p>
            </div>

            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              <span>Explore all destinations</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_DESTINATIONS.map((d) => (
              <Link
                key={d.id}
                to={`/search?q=${encodeURIComponent(d.name)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                {/* Visual Swatch */}
                <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${d.gradient} p-4`}>
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-sm">
                      {d.continent}
                    </span>
                  </div>

                  <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-900 shadow-xs backdrop-blur-sm">
                    <StarIcon className="size-3.5 text-amber-500" />
                    <span>{d.rating.toFixed(2)}</span>
                    <span className="text-[11px] font-normal text-slate-500">({d.reviewCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-slate-950 group-hover:text-indigo-600 transition-colors">
                        {d.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPinIcon className="size-3.5 text-slate-400" />
                        <span>{d.region}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200/80 rounded-md px-2 py-0.5">
                      {d.priceEst}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>Pace: {d.duration}</span>
                    <div className="flex gap-1.5">
                      {d.tags.map((t) => (
                        <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white sm:px-8 sm:py-28">
        {/* Subtle background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-1/4 h-[380px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
            Start Your Journey
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to plan your next unforgettable trip?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Join modern travelers who plan smarter, explore deeper, and enjoy frictionless itineraries with ITINERA.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Link
              to="/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98] sm:w-auto"
            >
              <span>Plan Your Trip</span>
              <ArrowRightIcon className="size-4" />
            </Link>

            <Link
              to="/search"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98] sm:w-auto"
            >
              <span>Explore Destinations</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Free to plan · No credit card required · Instant personalized results
          </p>
        </div>
      </section>
    </main>
  )
}

