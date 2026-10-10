import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sliders,
  Plane,
  HeartHandshake,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { TripItinerary } from '../types/itinerary';

// Quick inspiration presets for rapid testing and delightful exploration
const INSPIRATION_PRESETS = [
  {
    label: '🌸 Kyoto Heritage',
    destination: 'Kyoto, Japan',
    days: 4,
    budget: 'moderate',
    style: 'Culture & Mindful Relaxation',
    prompt: 'Private morning temple visits before crowds, authentic matcha ceremony, tranquil machiya suite, and farm-to-table kaiseki dining.',
    photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: '🏔️ Swiss Jungfrau',
    destination: 'Interlaken & Jungfrau, Switzerland',
    days: 5,
    budget: 'luxury',
    style: 'Alpine Adventure & High Serenity',
    prompt: 'First-class scenic cogwheel rail to Top of Europe, pristine glacier walk, fondue tasting, and panoramic balcony alpine lodge.',
    photo: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: '🌅 Santorini Sunsets',
    destination: 'Santorini, Greece',
    days: 4,
    budget: 'moderate',
    style: 'Coastal Romance & Gastronomy',
    prompt: 'Private catamaran cruise around volcanic caldera at golden hour, cliffside cave villa in Oia, and artisanal Aegean wine tastings.',
    photo: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: '❄️ Iceland Aurora',
    destination: 'Reykjavik & South Coast, Iceland',
    days: 4,
    budget: 'moderate',
    style: 'Dramatic Nature & Geothermal',
    prompt: 'Blue Lagoon geothermal retreat, northern lights private super-jeep safari, black sand beach walk, and glacier waterfall exploration.',
    photo: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800&auto=format&fit=crop',
  },
];

const STYLE_OPTIONS = [
  'Culture & Mindful Relaxation',
  'Alpine Adventure & Nature',
  'Artisan Gastronomy & Wine',
  'Coastal Escapes & Sailing',
  'Boutique Luxury & Wellness',
];

export default function Create() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('Kyoto, Japan');
  const [days, setDays] = useState(4);
  const [startDate, setStartDate] = useState('2026-11-15');
  const [budget, setBudget] = useState('moderate');
  const [travelerStyle, setTravelerStyle] = useState('Culture & Mindful Relaxation');
  const [prompt, setPrompt] = useState(
    'Private morning shrine visits before crowds, authentic matcha ceremony, tranquil machiya suite, and farm-to-table kaiseki dinner.'
  );

  const [loading, setLoading] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState(0);
  const [generatedTrip, setGeneratedTrip] = useState<TripItinerary | null>(null);

  const applyPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setDestination(preset.destination);
    setDays(preset.days);
    setBudget(preset.budget);
    setTravelerStyle(preset.style);
    setPrompt(preset.prompt);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSynthesisStage(1);

    // Multi-stage visual feedback timer
    const stageTimer1 = setTimeout(() => setSynthesisStage(2), 1200);
    const stageTimer2 = setTimeout(() => setSynthesisStage(3), 2400);

    try {
      const trip = await api.generateItineraryWithGemini({
        destination,
        days: Number(days),
        startDate,
        budget,
        travelerStyle,
        prompt,
      });
      setGeneratedTrip(trip);
    } catch (err) {
      console.error('Synthesis error:', err);
      alert('Itinerary synthesis failed. Please verify backend service connection.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setLoading(false);
      setSynthesisStage(0);
    }
  };

  const handleProceedToTrip = () => {
    if (generatedTrip) {
      navigate(`/trip/${generatedTrip.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Editorial Top Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D45] via-[#163832] to-[#0D1A15] p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wide mb-3 border border-white/10">
              <Sparkles className="size-3.5 text-amber-300" />
              <span>AI Dynamic Tour Architect & Graph Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
              Design Your Curated Journey
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-200 leading-relaxed">
              Synthesize a resilient, day-by-day expedition built with Gemini intelligence, verified partner vendors, and continuous graph adaptability.
            </p>

            {/* Quick Inspiration Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-300 mr-1 flex items-center gap-1">
                <Compass className="size-3.5" />
                Quick Presets:
              </span>
              {INSPIRATION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition border border-white/15 hover:scale-105 active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Workflow: Form & Live Synthesis Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#1F4D45]">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Trip Parameters</h2>
                  <p className="text-xs text-slate-500">Tailor your custom parameters</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Step 1 of 2
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Destination */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Destination & Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 text-sm outline-none transition font-medium"
                    placeholder="e.g. Kyoto, Japan or Swiss Alps"
                  />
                </div>
              </div>

              {/* Days & Start Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration (Days)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 size-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 text-sm font-semibold outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 size-4 text-slate-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 text-xs font-medium outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Quick Buttons */}
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDays(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      days === num
                        ? 'bg-[#1F4D45] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>

              {/* Budget Tier Segmented */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Budget Calibration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'economy', label: 'Value Tier', price: '$' },
                    { id: 'moderate', label: 'Balanced', price: '$$' },
                    { id: 'luxury', label: 'Bespoke VIP', price: '$$$' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudget(tier.id)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        budget === tier.id
                          ? 'border-[#1F4D45] bg-[#1F4D45]/10 text-[#1F4D45] font-bold shadow-xs ring-1 ring-[#1F4D45]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-black text-amber-600">{tier.price}</span>
                      <span className="block text-[11px] mt-0.5">{tier.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Traveler Vibe & DNA
                </label>
                <select
                  value={travelerStyle}
                  onChange={(e) => setTravelerStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 text-xs font-semibold outline-none transition bg-white"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Natural Language Preferences & Specific Desires
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 text-xs outline-none transition leading-relaxed"
                  placeholder="Describe your desired vibe, pace, dining preferences, and specific interests..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80"
              >
                <Sparkles className="size-4 text-amber-300" />
                <span>
                  {loading
                    ? synthesisStage === 1
                      ? 'Querying Gemini Intelligence...'
                      : synthesisStage === 2
                      ? 'Constructing Resilient DAG Engine...'
                      : 'Finalizing Partner Vouchers...'
                    : 'Synthesize Resilient Itinerary'}
                </span>
              </button>
            </form>
          </div>

          {/* Output / Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              /* Synthesis in-progress HUD */
              <div className="bg-white rounded-3xl p-10 sm:p-12 border border-slate-200/90 text-center shadow-sm space-y-6">
                <div className="size-16 rounded-3xl bg-[#1F4D45]/10 border border-[#1F4D45]/20 flex items-center justify-center text-[#1F4D45] mx-auto animate-bounce">
                  <Sparkles className="size-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Synthesizing Itinerary for {destination}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    The engine is dynamically pairing schedule items with high-SLA partner vendors.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-700">Gemini Neural Synthesizer:</span>
                    <span className="text-slate-500">Building tailored {days}-day trajectory</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="size-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="font-semibold text-slate-700">DAG Graph Dependency:</span>
                    <span className="text-slate-500">Mapping upstream transit & accommodation locks</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-semibold text-slate-700">Weather Digital Twin:</span>
                    <span className="text-slate-500">Simulating climate resilience factors</span>
                  </div>
                </div>
              </div>
            ) : generatedTrip ? (
              /* Successfully generated preview */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Result Header */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-[#1F4D45] text-white">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        ✓ Itinerary Successfully Synthesized
                      </span>
                      <h3 className="mt-2.5 text-2xl font-black text-white">
                        {generatedTrip.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                        <MapPin className="size-3.5 text-amber-400" />
                        <span>{generatedTrip.destination}</span>
                        <span>•</span>
                        <Calendar className="size-3.5 text-slate-300" />
                        <span>{generatedTrip.durationDays} Days ({generatedTrip.startDate} to {generatedTrip.endDate})</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
                        Estimated Investment
                      </span>
                      <span className="text-3xl font-black text-amber-300">
                        ${generatedTrip.totalCost?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Taste Profile Alignment Bar */}
                  <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-slate-300 block uppercase font-medium">Adventure</span>
                      <span className="text-sm font-bold text-white">{generatedTrip.tasteProfile.adventure}%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-slate-300 block uppercase font-medium">Culture</span>
                      <span className="text-sm font-bold text-white">{generatedTrip.tasteProfile.culture}%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-slate-300 block uppercase font-medium">Relaxation</span>
                      <span className="text-sm font-bold text-white">{generatedTrip.tasteProfile.relaxation}%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-slate-300 block uppercase font-medium">Budget Efficiency</span>
                      <span className="text-sm font-bold text-white">{generatedTrip.tasteProfile.budgetConscious}%</span>
                    </div>
                  </div>
                </div>

                {/* Day Overview Component List */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Component Schedule ({generatedTrip.components.length} Items)
                    </h4>
                    <span className="text-xs text-slate-400">DAG Dependencies Verified</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2.5 pr-2">
                    {generatedTrip.components.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#1F4D45] px-2.5 py-1 rounded-lg bg-[#1F4D45]/10 border border-[#1F4D45]/20 text-[11px]">
                            Day {comp.day}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{comp.name}</span>
                            <span className="text-slate-500 text-[11px] mt-0.5">
                              {comp.time} • {comp.vendor} ({comp.vendorRating}★)
                            </span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 text-sm">
                          ${comp.cost}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleProceedToTrip}
                      className="w-full py-4 rounded-2xl bg-[#1F4D45] hover:bg-[#2A6559] text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <ShieldCheck className="size-5" />
                      <span>Open Full Itinerary, Weather Twin & Adapt Engine</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Idle Empty State */
              <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-200/90 text-center shadow-xs flex flex-col items-center justify-center min-h-[460px]">
                <div className="size-20 rounded-3xl bg-[#1F4D45]/10 border border-[#1F4D45]/20 flex items-center justify-center text-[#1F4D45] mb-5 shadow-xs">
                  <Compass className="size-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Ready to Architect Your Tour
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
                  Choose a preset above or configure your destination and vibe on the left. ITINERA will compile an end-to-end plan with verified accommodations, transit, and experiences.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    ✓ Real Weather Sync
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    ✓ DAG Dependency Tracking
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    ✓ Operator Escrow Simulation
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
