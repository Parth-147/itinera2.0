import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Dna, Star, Sparkles, Check, RefreshCw, Compass, ShieldCheck } from 'lucide-react';

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
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#1F4E79] to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user?.displayName ? user.displayName.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {user?.displayName || 'Alex Mercer'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="size-3.5" />
                Verified Travel Identity & Escrow Clear
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Switch persona:</span>
            <button
              onClick={() => switchRole(role === 'operator' ? 'traveler' : 'operator')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              Toggle to {role === 'operator' ? 'Traveler' : 'Operator'}
            </button>
          </div>
        </div>

        {/* Trip DNA Calibration Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Dna className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Trip DNA Taste Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Adaptive traveler preference weights utilized by Gemini and Adapt Engine
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveDna} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Adventure */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Adventure & Excursion</span>
                  <span className="text-indigo-600">{dna.adventure}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.adventure}
                  onChange={(e) => setDna({ ...dna, adventure: Number(e.target.value) })}
                  className="w-full accent-[#1F4E79] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Glacier treks, rafting, ridge funiculars
                </span>
              </div>

              {/* Culture */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Culture & Heritage</span>
                  <span className="text-indigo-600">{dna.culture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.culture}
                  onChange={(e) => setDna({ ...dna, culture: Number(e.target.value) })}
                  className="w-full accent-[#1F4E79] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Zen gardens, shrines, historic artisan guilds
                </span>
              </div>

              {/* Relaxation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Mindful Relaxation</span>
                  <span className="text-indigo-600">{dna.relaxation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.relaxation}
                  onChange={(e) => setDna({ ...dna, relaxation: Number(e.target.value) })}
                  className="w-full accent-[#1F4E79] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Private onsen baths, scenic tea rooms, acoustic serenity
                </span>
              </div>

              {/* Budget Conscious */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Budget Optimization</span>
                  <span className="text-indigo-600">{dna.budgetConscious}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dna.budgetConscious}
                  onChange={(e) => setDna({ ...dna, budgetConscious: Number(e.target.value) })}
                  className="w-full accent-[#1F4E79] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  40% weighting on cost delta in Adapt Engine alternative scoring
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#183e60] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
              >
                {saved ? <Check className="size-4 text-emerald-300" /> : <Sparkles className="size-4 text-amber-300" />}
                {saved ? 'Trip DNA Updated & Synced' : 'Save DNA Weighting'}
              </button>
            </div>
          </form>
        </div>

        {/* Post-Trip Review & Feedback Loop */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="size-5 fill-amber-400 text-amber-500" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Post-Trip Review & Adaptive Learning Loop
              </h2>
              <p className="text-xs text-slate-500">
                Your ratings train the Nugen and Gemini engines to improve upcoming recommendations
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Completed Journey
              </label>
              <input
                type="text"
                value={reviewTrip}
                onChange={(e) => setReviewTrip(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1F4E79] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Satisfaction Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`size-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Review & Vendor Feedback
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-[#1F4E79] outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <RefreshCw className="size-3.5" />
              {reviewSubmitted ? 'Taste Vector Recalibrated!' : 'Submit Review & Recalibrate DNA'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
