import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  Users,
  ShieldCheck,
  CloudSun,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Mountain,
  MessageSquare,
  Route,
  GitBranch,
} from 'lucide-react'

// Hero background slides
const HERO_SLIDES = [
  {
    photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    dest: 'Kyoto, Japan',
  },
  {
    photo: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop',
    dest: 'Santorini, Greece',
  },
  {
    photo: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1600&auto=format&fit=crop',
    dest: 'Swiss Alps',
  },
]

// Curated Top Destinations
interface Destination {
  id: string
  name: string
  region: string
  description: string
  rating: number
  reviewCount: number
  days: number
  plannedCount: string
  photo: string
  tags: string[]
}

const TOP_DESTINATIONS: Destination[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    region: 'Japan',
    description: 'Tranquil machiyas, bamboo groves & ancient UNESCO temples',
    rating: 4.97,
    reviewCount: 3420,
    days: 5,
    plannedCount: '24.2K',
    photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    tags: ['Culture', 'Temples', 'Culinary'],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    region: 'Greece',
    description: 'Caldera cliffside cave suites & sunset catamaran sails',
    rating: 4.95,
    reviewCount: 4120,
    days: 4,
    plannedCount: '31.8K',
    photo: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
    tags: ['Coastal', 'Romance', 'Sailing'],
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps & Jungfrau',
    region: 'Switzerland',
    description: 'Top of Europe cogwheel railway & high-alpine glacier walks',
    rating: 4.96,
    reviewCount: 2890,
    days: 5,
    plannedCount: '19.5K',
    photo: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    tags: ['Alpine', 'Railways', 'Nature'],
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    region: 'Italy',
    description: 'Pastel cliffside villages, lemon groves & Mediterranean azure',
    rating: 4.92,
    reviewCount: 2540,
    days: 6,
    plannedCount: '22.1K',
    photo: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    tags: ['Coastal', 'Gastronomy', 'Scenic'],
  },
  {
    id: 'patagonia',
    name: 'Patagonia & Torres',
    region: 'Chile & Argentina',
    description: 'Granite horns, blue calving glaciers & wild southern trails',
    rating: 4.98,
    reviewCount: 1890,
    days: 8,
    plannedCount: '14.7K',
    photo: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800&auto=format&fit=crop',
    tags: ['Trekking', 'Wildlife', 'Expedition'],
  },
  {
    id: 'iceland',
    name: 'South Coast & Aurora',
    region: 'Iceland',
    description: 'Geothermal Blue Lagoon, black sand beaches & glacier waterfalls',
    rating: 4.94,
    reviewCount: 3110,
    days: 5,
    plannedCount: '18.9K',
    photo: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800&auto=format&fit=crop',
    tags: ['Aurora', 'Geothermal', 'Glaciers'],
  },
]

// Iconic Treks
interface Trek {
  id: string
  title: string
  region: string
  category: 'himalayan' | 'alpine' | 'americas' | 'iconic'
  subtitle: string
  days: number
  altitude: string
  difficulty: 'Moderate' | 'Difficult' | 'Challenging'
  photo: string
  promptPreset: string
}

const WORLD_TREKS: Trek[] = [
  {
    id: 'everest-base-camp',
    title: 'Everest Base Camp',
    region: 'Khumbu, Nepal',
    category: 'himalayan',
    subtitle: 'Walk in the shadow of the world’s highest peak through Sherpa villages',
    days: 14,
    altitude: '5,364m',
    difficulty: 'Challenging',
    photo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    promptPreset: 'Everest Base Camp 14-day trekking route with acclimatization days, tea house lodges, and Kala Patthar sunrise.',
  },
  {
    id: 'annapurna-circuit',
    title: 'Annapurna Circuit',
    region: 'Gandaki, Nepal',
    category: 'himalayan',
    subtitle: 'The legendary full circuit crossing Thorong La Pass at sunrise',
    days: 15,
    altitude: '5,416m',
    difficulty: 'Challenging',
    photo: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33?q=80&w=800&auto=format&fit=crop',
    promptPreset: 'Annapurna Circuit 15-day trek with Thorong La pass crossing, mountain tea houses, and Tatopani hot springs.',
  },
  {
    id: 'jungfrau-alpine-trail',
    title: 'Jungfrau Alpine Traverse',
    region: 'Bernese Oberland, Switzerland',
    category: 'alpine',
    subtitle: 'First-class cogwheel rail, North Face views & pristine glacier walks',
    days: 5,
    altitude: '3,454m',
    difficulty: 'Moderate',
    photo: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    promptPreset: 'Jungfrau 5-day alpine itinerary with Top of Europe rail, Eiger trail hike, and traditional Swiss fondue chalet.',
  },
  {
    id: 'torres-w-trek',
    title: 'Torres del Paine W-Trek',
    region: 'Patagonia, Chile',
    category: 'americas',
    subtitle: 'Grey Glacier icebergs, French Valley amphitheatre & granite towers',
    days: 5,
    altitude: '1,200m',
    difficulty: 'Moderate',
    photo: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800&auto=format&fit=crop',
    promptPreset: 'Torres del Paine 5-day W-Trek with refuge stays, Grey Glacier catamaran, and sunrise at the Base of the Towers.',
  },
  {
    id: 'tour-du-mont-blanc',
    title: 'Tour du Mont Blanc',
    region: 'France, Italy & Switzerland',
    category: 'alpine',
    subtitle: 'Trek through three European nations around western Europe’s roof',
    days: 10,
    altitude: '2,665m',
    difficulty: 'Difficult',
    photo: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=800&auto=format&fit=crop',
    promptPreset: 'Tour du Mont Blanc 10-day circuit crossing France, Italy, and Switzerland with alpine refuges and luggage transfers.',
  },
  {
    id: 'inca-trail',
    title: 'Classic Inca Trail to Machu Picchu',
    region: 'Cusco, Peru',
    category: 'americas',
    subtitle: 'Ancient stone staircases, cloud forests & the legendary Sun Gate',
    days: 4,
    altitude: '4,215m',
    difficulty: 'Moderate',
    photo: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    promptPreset: '4-day classic Inca Trail with licensed Quechua guides, Dead Woman’s Pass, and sunrise entrance at Intipunku.',
  },
]

export default function Home() {
  const navigate = useNavigate()

  const [heroDestination, setHeroDestination] = useState('Kyoto, Japan')
  const [heroDays, setHeroDays] = useState(4)
  const [heroBudget, setHeroBudget] = useState('moderate')
  const [heroSlide, setHeroSlide] = useState(0)
  const [activeDemoTab, setActiveDemoTab] = useState<'prompt' | 'graph' | 'itinerary'>('itinerary')
  const [activeTrekCategory, setActiveTrekCategory] = useState<string>('all')

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(
      `/create?destination=${encodeURIComponent(heroDestination)}&days=${heroDays}&budget=${heroBudget}`
    )
  }

  const filteredTreks =
    activeTrekCategory === 'all'
      ? WORLD_TREKS
      : WORLD_TREKS.filter((t) => t.category === activeTrekCategory)

  return (
    <main className="min-h-screen bg-white">
      {/* ═════════════════════════════════════════════════════════════════
          1. IMMERSIVE HERO — FULL-BLEED PHOTOGRAPHY + SEARCH FORM
          ═════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 overflow-hidden bg-[#0D1A15]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(31,77,69,0.5),transparent)] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Hero Header Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200 text-xs font-semibold shadow-xs">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI-Powered Travel Architect & Resilient Graph Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#FAF7F2] leading-[1.15] sm:leading-[1.12] tracking-tight">
              Plan Your{' '}
              <span className="font-display italic font-normal bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#FF8A65] bg-clip-text text-transparent pr-2">
                Dream Trip
              </span>{' '}
              with AI
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-stone-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Tell ITINERA where you want to go. Get a full day-by-day itinerary with boutique partner stays, DAG graph routes, and real-time weather adaptability — in under 60 seconds.
            </p>

            {/* Fast Entry Point Planner Pill */}
            <form
              onSubmit={handleHeroSubmit}
              className="max-w-4xl mx-auto bg-white p-2.5 sm:p-3 rounded-3xl sm:rounded-full border border-white/20 shadow-2xl shadow-black/30 flex flex-col sm:flex-row items-center gap-2 transition hover:border-white/40"
            >
              {/* Destination Input */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin className="size-4 text-[#1F4D45] shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Destination
                  </span>
                  <input
                    type="text"
                    value={heroDestination}
                    onChange={(e) => setHeroDestination(e.target.value)}
                    placeholder="Where to? (e.g. Kyoto, Swiss Alps)"
                    className="w-full text-xs sm:text-sm font-semibold text-gray-900 outline-none bg-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Days Selector */}
              <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Calendar className="size-4 text-[#1F4D45] shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Duration
                  </span>
                  <select
                    value={heroDays}
                    onChange={(e) => setHeroDays(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
                  >
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>7 Days</option>
                    <option value={10}>10 Days</option>
                  </select>
                </div>
              </div>

              {/* Budget Selector */}
              <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 w-full sm:w-40">
                <DollarSign className="size-4 text-[#1F4D45] shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Budget
                  </span>
                  <select
                    value={heroBudget}
                    onChange={(e) => setHeroBudget(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
                  >
                    <option value="economy">Economy ($)</option>
                    <option value="moderate">Moderate ($$)</option>
                    <option value="luxury">Luxury ($$$)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl sm:rounded-full bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
              >
                <Sparkles className="size-4 text-amber-300" />
                <span>Start Planning Free</span>
              </button>
            </form>

            {/* Social Proof & Traveler Trust Counter */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
                  alt="Explorer"
                  className="size-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
                  alt="Explorer"
                  className="size-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
                  alt="Explorer"
                  className="size-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
                  alt="Explorer"
                  className="size-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
              </div>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                <strong className="text-white font-bold">120+</strong> curated journeys synthesized this week •{' '}
                <span className="text-amber-300 font-semibold">4.9★</span> community satisfaction
              </p>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              INTERACTIVE PRODUCT DEMONSTRATION WINDOW (MAC CHROME MOCKUP)
              ═════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 mt-16 sm:mt-20 max-w-5xl mx-auto">
            <div className="rounded-3xl overflow-hidden border border-gray-200/90 shadow-[0_30px_90px_rgba(15,23,42,0.12)] bg-white transition hover:shadow-[0_40px_100px_rgba(15,23,42,0.18)]">
              {/* Browser Chrome Header */}
              <div className="bg-gray-100/90 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#FF5F57]" />
                  <div className="size-3 rounded-full bg-[#FFBD2E]" />
                  <div className="size-3 rounded-full bg-[#28C840]" />
                </div>

                <div className="bg-white/90 rounded-full px-4 py-1 text-[11px] font-medium text-gray-500 border border-gray-200/80 flex items-center gap-1.5 shadow-2xs">
                  <Compass className="size-3 text-[#1F4D45]" />
                  <span>itinera.ai/planner/kyoto-machiya-journey</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="size-3" />
                  Live Sync
                </div>
              </div>

              {/* Demo Mode Tabs */}
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Workflow Preview:
                </span>
                <button
                  onClick={() => setActiveDemoTab('prompt')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeDemoTab === 'prompt'
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  1. AI Synthesis & DNA
                </button>
                <button
                  onClick={() => setActiveDemoTab('graph')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeDemoTab === 'graph'
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  2. Weather Twin & DAG Graph
                </button>
                <button
                  onClick={() => setActiveDemoTab('itinerary')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeDemoTab === 'itinerary'
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  3. Day-by-Day Timeline & Vouchers
                </button>
              </div>

              {/* Demo Window Content Body */}
              <div className="p-6 sm:p-8 bg-white min-h-[380px]">
                {activeDemoTab === 'itinerary' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            DAG Dependencies Verified
                          </span>
                          <span className="text-xs text-gray-400 font-medium">4 Days • 12 Components</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                          Kyoto Imperial Machiya & Zen Shrines
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                            Total Investment
                          </span>
                          <span className="text-xl font-black text-gray-900">$2,450 USD</span>
                        </div>
                        <Link
                          to="/trip/kyoto-trip-01"
                          className="px-4 py-2 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition shadow-xs"
                        >
                          Open Full Trip
                        </Link>
                      </div>
                    </div>

                    {/* Timeline Component Demo Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Component 1 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/70 transition">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#1F4D45] px-2 py-0.5 rounded bg-white border border-gray-200">
                            Day 1 • 08:30 AM
                          </span>
                          <span className="text-emerald-600 font-bold">$335</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Gion Machiya Heritage Boutique Hotel</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Selected for tranquil acoustic isolation and walking distance to historic temples.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                          <span>Kiyomizu Stays (4.95★)</span>
                          <span className="text-emerald-700 font-bold">Voucher Locked</span>
                        </div>
                      </div>

                      {/* Component 2 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/70 transition">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#1F4D45] px-2 py-0.5 rounded bg-white border border-gray-200">
                            Day 1 • 11:00 AM
                          </span>
                          <span className="text-emerald-600 font-bold">$75</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Private Zen Garden Meditation</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Exclusive docent access before general admission gates open to public.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                          <span>Kyoto Heritage Masters</span>
                          <span className="text-emerald-700 font-bold">Voucher Locked</span>
                        </div>
                      </div>

                      {/* Component 3 - Adaptive Weather Replacement Demonstration */}
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-amber-800 px-2 py-0.5 rounded bg-white border border-amber-200">
                            Day 1 • 02:30 PM (Adaptive)
                          </span>
                          <span className="text-amber-800 font-bold">$60</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Uji Matcha Tea Ceremony Workshop</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Automatic weather reroute: replaced outdoor river punting during localized rain.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                          <span>Adapt Engine Active</span>
                          <span>Score: 92/100</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'graph' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-[#0D1A15] text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Digital Twin Weather & Graph Pipeline
                        </span>
                        <span className="text-xs text-gray-400">OpenMeteo Live API Synced</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        ITINERA models each trip as a Directed Acyclic Graph (DAG). If upstream delays or severe rain occurs, downstream dependent components adapt automatically.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <strong className="block text-gray-900 font-bold mb-1">Weather Forecast</strong>
                        <span className="text-gray-500">Kyoto: 18°C, Rain expected 02:00 PM (85% probability)</span>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <strong className="block text-gray-900 font-bold mb-1">Cascade Traversal</strong>
                        <span className="text-gray-500">Component [kyoto-comp-3] suspended; [kyoto-comp-4] alerted</span>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <strong className="block text-gray-900 font-bold mb-1">Top Alternative Ranked</strong>
                        <span className="text-emerald-700 font-semibold">Indoor Uji Matcha Masterclass (+$0 cost delta)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeDemoTab === 'prompt' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4"
                  >
                    <h4 className="text-sm font-bold text-gray-900">Natural-Language Synthesis Matrix</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      "I want an immersive 4-day trip to Kyoto emphasizing uncrowded temple docents, authentic tea masters, boutique accommodations, and high culinary craftsmanship."
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-[#1F4D45]/10 text-[#1F4D45] font-semibold">Culture 92%</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Mindful Relaxation 68%</span>
                      <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold">Adventure 75%</span>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">Budget Optimization 60%</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STAT BAR */}
      <section className="bg-[#1F4D45] text-white py-5">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-white/15">
            {[
              { label: 'Trips Synthesized', value: '14,800+' },
              { label: 'Avg. Plan Time', value: '< 60 sec' },
              { label: 'Verified Partners', value: '340+' },
              { label: 'Community Rating', value: '4.9 / 5.0 ★' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center sm:px-6">
                <div className="text-xl sm:text-2xl font-black text-amber-300">{value}</div>
                <div className="text-[11px] text-white/70 font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          2. FEATURE PILLARS IN RICH DARK SECTION
          ═════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white pt-20 pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF7A59] mb-3">
              Intelligent Travel Infrastructure
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Everything You Need for Resilient, Smarter Travel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 hover:border-emerald-900/50 transition">
              <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">AI Graph Architect</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Day-by-day itineraries compiled with DAG dependency intelligence, verified stays, and zero transit backtracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 hover:border-amber-900/50 transition">
              <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Mountain className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">World Trek Discovery</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                500+ curated treks and expeditions across the Himalayas, European Alps, Andes, and dramatic coastal ridges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 hover:border-sky-900/50 transition">
              <div className="size-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Compass className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">Interactive Maps &amp; Routing</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Detailed waypoint routes with elevation metrics, transit vectors, and geo-referenced coordinates for every activity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 hover:border-orange-900/50 transition">
              <div className="size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF7A59]">
                <CloudSun className="size-6" />
              </div>
              <h3 className="text-base font-bold text-white">Weather Digital Twin</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Real hyper-local forecasts with continuous cascade monitoring and ranked alternative replacement during storms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          3. TOP DESTINATIONS DIRECTORY SECTION
          ═════════════════════════════════════════════════════════════════ */}

      <section id="destinations" className="py-20 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F4D45] mb-2">
                Handpicked Escapes
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Top Destinations Worldwide
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Click any destination to architect your personalized AI itinerary in seconds
              </p>
            </div>

            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F4D45] hover:text-[#2A6559] transition self-start sm:self-end"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_DESTINATIONS.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                    <img
                      src={dest.photo}
                      alt={dest.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold shadow-xs">
                        {dest.days} Days Recommended
                      </span>

                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold">
                        <Users className="size-3 text-emerald-400" />
                        <span>{dest.plannedCount}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="text-[11px] font-semibold text-amber-300 block">
                        {dest.region}
                      </span>
                      <h3 className="text-xl font-bold text-white drop-shadow-xs">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-gray-800 ml-1">{dest.rating}</span>
                      <span className="text-gray-400 text-[11px]">({dest.reviewCount.toLocaleString()})</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dest.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <span className="text-xs text-gray-500 font-medium">Ready to customize</span>
                  <Link
                    to={`/create?destination=${encodeURIComponent(`${dest.name}, ${dest.region}`)}&days=${dest.days}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition shadow-xs hover:scale-105"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          4. WORLD'S GREATEST TREKS SHOWCASE (RICH DARK FOREST SECTION)
          ═════════════════════════════════════════════════════════════════ */}
      <section id="treks" className="py-24 bg-[#0D1A15] text-white">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF7A59] mb-2">
                TRAVELLER'S CHOICE
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                World’s Greatest Treks
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl leading-relaxed">
                From Himalayan giants to Alpine classics — iconic multi-day trails every explorer dreams of completing. Modeled with elevation, camps, and safety checkpoints.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 self-start md:self-end">
              {[
                { id: 'all', label: 'All Treks' },
                { id: 'himalayan', label: 'Himalayan' },
                { id: 'alpine', label: 'Alpine & Europe' },
                { id: 'americas', label: 'Americas & Andes' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTrekCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border ${
                    activeTrekCategory === cat.id
                      ? 'bg-white text-[#0D1A15] border-white shadow-xs'
                      : 'bg-transparent text-gray-400 border-white/15 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-Bleed Trek Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreks.map((trek) => (
              <motion.div
                key={trek.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-3xl overflow-hidden border border-white/10 shadow-lg flex flex-col justify-end min-h-[420px]"
              >
                {/* Background Photo */}
                <img
                  src={trek.photo}
                  alt={trek.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

                {/* Floating Top Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-md ${
                      trek.difficulty === 'Challenging'
                        ? 'bg-rose-500 text-white'
                        : trek.difficulty === 'Difficult'
                        ? 'bg-amber-400 text-gray-950'
                        : 'bg-sky-400 text-gray-950'
                    }`}
                  >
                    {trek.difficulty}
                  </span>
                </div>

                {/* Overlay Content */}
                <div className="relative z-10 p-6 space-y-3">
                  <p className="text-xs text-gray-300 font-medium line-clamp-1">
                    {trek.subtitle}
                  </p>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {trek.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <MapPin className="size-3.5 text-[#FF7A59]" />
                    <span>{trek.region}</span>
                  </div>

                  {/* Metrics Bar */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/15 text-xs text-gray-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="size-3.5 text-gray-400" />
                      <span>{trek.days} Days</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <TrendingUp className="size-3.5 text-emerald-400" />
                      <span>Max {trek.altitude}</span>
                    </div>
                  </div>

                  <Link
                    to={`/create?destination=${encodeURIComponent(trek.region)}&days=${trek.days}&prompt=${encodeURIComponent(trek.promptPreset)}`}
                    className="w-full mt-3 py-3 rounded-2xl bg-white/15 hover:bg-white text-white hover:text-gray-950 text-xs font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Architect Trek Itinerary</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          5. FOUR-STEP HOW IT WORKS
          ═════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#f7fdf9]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1F4D45] block mb-2">
              Intuitive Planning Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How ITINERA Works
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              From your initial travel vision to a resilient, weather-adaptive itinerary ready for departure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-2xl bg-[#1F4D45] text-white flex items-center justify-center shadow-md">
                  <MapPin className="size-6" />
                </div>
                <span className="text-[11px] font-black tracking-widest text-gray-300">STEP 01</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">Tell Us Your Vision</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Share your destination, dates, pacing, and budget. Speak naturally — ITINERA reads your intent.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-2xl bg-[#1F4D45] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="size-6" />
                </div>
                <span className="text-[11px] font-black tracking-widest text-gray-300">STEP 02</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">AI Compiles the Graph</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Gemini intelligence pairs verified stays, activities, and transit into a Directed Acyclic Graph.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <CloudSun className="size-6" />
                </div>
                <span className="text-[11px] font-black tracking-widest text-gray-300">STEP 03</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">Weather & Alternatives</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Simulate disruptions in the Digital Twin. The Adapt Engine ranks and scores alternatives in real time.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="size-6" />
                </div>
                <span className="text-[11px] font-black tracking-widest text-gray-300">STEP 04</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">Travel with Confidence</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Locked partner vouchers, smart escrow, and continuous operator support throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          6. REFINED FINAL CTA SECTION
          ═════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D45] via-[#163832] to-[#0D1A15] p-10 sm:p-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
                <Sparkles className="size-3.5" />
                Begin Your Next Chapter
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to Experience Truly Adaptive Travel?
              </h2>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                No rigid spreadsheets. No disrupted plans with zero backup. Architect your first journey with Gemini and ITINERA in under 60 seconds.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/create"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="size-4" />
                  <span>Start Planning Free with AI</span>
                </Link>
                <Link
                  to="/search"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition border border-white/20 inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Destination Catalog</span>
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
