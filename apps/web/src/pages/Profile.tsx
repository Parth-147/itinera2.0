import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Dna,
  Star,
  Sparkles,
  Check,
  RefreshCw,
  Compass,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  TrendingUp,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

const DNA_PRESETS = [
  {
    name: '🏛️ Cultural Connoisseur',
    adventure: 50,
    culture: 95,
    relaxation: 70,
    budgetConscious: 60,
  },
  {
    name: '🧗 Alpine Trailblazer',
    adventure: 95,
    culture: 60,
    relaxation: 45,
    budgetConscious: 55,
  },
  {
    name: '🍵 Mindful Epicurean',
    adventure: 40,
    culture: 85,
    relaxation: 95,
    budgetConscious: 65,
  },
  {
    name: '⚖️ Balanced Explorer',
    adventure: 75,
    culture: 75,
    relaxation: 75,
    budgetConscious: 70,
  },
];

export default function Profile() {
  const { user, role, switchRole } = useAuth();

  // Dynamic Trip DNA state
  const [dna, setDna] = useState({
    adventure: 75,
    culture: 92,
    relaxation: 68,
    budgetConscious: 60,
  });

  const [saved, setSaved] = useState(false);

  // Review submission simulator
  const [reviewTrip, setReviewTrip] = useState('Kyoto Imperial Machiya & Shrine Journey');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState(
    'The morning meditation before public opening was unforgettable. The river punting alternative proposed by Adapt Engine saved our day!'
  );
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const applyPreset = (preset: typeof DNA_PRESETS[0]) => {
    setDna({
      adventure: preset.adventure,
      culture: preset.culture,
      relaxation: preset.relaxation,
      budgetConscious: preset.budgetConscious,
    });
  };

  const handleSaveDna = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    // Recalibrate DNA taste vector
    setDna((prev) => ({
      adventure: Math.min(100, prev.adventure + 2),
      culture: Math.min(100, prev.culture + 3),
      relaxation: Math.min(100, prev.relaxation + 1),
      budgetConscious: prev.budgetConscious,
    }));
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Editorial Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D45] via-[#163832] to-[#0D1A15] p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg ring-4 ring-white/10">
                {user?.displayName ? user.displayName.charAt(0) : 'A'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
                    {user?.displayName || 'Alex Mercer'}
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                    {role === 'operator' ? 'Operator Commander' : 'Elite Connoisseur'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{user?.email || 'alex.mercer@itinera.vip'}</p>
                <div className="flex items-center gap-2 text-xs text-emerald-300 pt-1 font-semibold">
                  <ShieldCheck className="size-4" />
                  <span>Verified Identity • Smart Escrow Clearance Active</span>
                </div>
              </div>
            </div>

            {/* Persona Switcher Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-semibold">Active Persona</span>
                <span className="text-xs font-bold text-white capitalize">{role} Mode</span>
              </div>
              <button
                onClick={() => switchRole(role === 'operator' ? 'traveler' : 'operator')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition shadow-sm hover:scale-105 active:scale-95"
              >
                Switch to {role === 'operator' ? 'Traveler' : 'Operator'}
              </button>
            </div>
          </div>

          {/* Key Traveler Stats */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Curated Journeys</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">4 Trips</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Days Traveled</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">16 Days</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Adapt Resilience</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">98.4%</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Escrow Clearance</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">Verified</span>
            </div>
          </div>
        </div>

        {/* Trip DNA Taste Matrix Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#1F4D45]/10 text-[#1F4D45]">
                <Dna className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Trip DNA Taste Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Adaptive preference weights driving Gemini synthesis and Adapt Engine alternative ranking
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
              {DNA_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveDna} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Adventure */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">Adventure & Excursion</span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-black">
                    {dna.adventure}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.adventure}
                  onChange={(e) => setDna({ ...dna, adventure: Number(e.target.value) })}
                  className="w-full accent-[#1F4D45] cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Weights alpine summits, catamaran cruises, and untamed natural explorations.
                </span>
              </div>

              {/* Culture */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">Culture & Heritage</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#1F4D45]/15 text-[#1F4D45] font-black">
                    {dna.culture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.culture}
                  onChange={(e) => setDna({ ...dna, culture: Number(e.target.value) })}
                  className="w-full accent-[#1F4D45] cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Prioritizes UNESCO heritage temples, historic docents, and artisan guild workshops.
                </span>
              </div>

              {/* Relaxation */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">Mindful Relaxation & Wellness</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black">
                    {dna.relaxation}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.relaxation}
                  onChange={(e) => setDna({ ...dna, relaxation: Number(e.target.value) })}
                  className="w-full accent-[#1F4D45] cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Balances private hot springs, peaceful tea ceremonies, and restorative pacing.
                </span>
              </div>

              {/* Budget Conscious */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">Budget Optimization Weighting</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-black">
                    {dna.budgetConscious}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.budgetConscious}
                  onChange={(e) => setDna({ ...dna, budgetConscious: Number(e.target.value) })}
                  className="w-full accent-[#1F4D45] cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Determines 40% weighting on cost delta in Adapt Engine alternative ranking scoring.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
              >
                {saved ? <Check className="size-4 text-emerald-300" /> : <Sparkles className="size-4 text-amber-300" />}
                <span>{saved ? 'DNA Taste Vector Synced!' : 'Save & Calibrate DNA Matrix'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Post-Trip Review & Feedback Loop */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Star className="size-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Post-Trip Review & Adaptive Learning Loop
              </h2>
              <p className="text-xs text-slate-500">
                Your feedback continuously refines AI vendor scoring and future itinerary personalization
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Completed Journey Expedition
              </label>
              <input
                type="text"
                value={reviewTrip}
                onChange={(e) => setReviewTrip(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Satisfaction Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`size-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating === 5 ? '5.0 — Exceptional Journey' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Vendor Feedback & Adapt Engine Experience
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 text-xs focus:border-[#1F4D45] focus:ring-2 focus:ring-[#1F4D45]/20 outline-none transition leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
              >
                <RefreshCw className="size-3.5" />
                <span>
                  {reviewSubmitted
                    ? 'Taste Vector Recalibrated & Logged!'
                    : 'Submit Review & Recalibrate DNA'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
