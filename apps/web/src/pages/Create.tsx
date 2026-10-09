import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { TripItinerary } from '../types/itinerary';

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
  const [generatedTrip, setGeneratedTrip] = useState<TripItinerary | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      console.error(err);
      alert('Itinerary synthesis failed. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToTrip = () => {
    if (generatedTrip) {
      navigate(`/trip/${generatedTrip.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="size-3.5" />
            AI Dynamic Tour Architect
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Design Your Personalized Itinerary
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Powered by Gemini AI and ITINERA's Graph Dependency Engine. Built for resilience and instant adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="size-5 text-[#1F4E79]" />
              Trip Parameters
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 text-sm outline-none transition"
                    placeholder="e.g. Kyoto, Japan or Swiss Alps"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 size-4 text-slate-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 text-xs outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 text-sm outline-none transition bg-white"
                >
                  <option value="economy">Economy / Value-conscious</option>
                  <option value="moderate">Moderate / Balanced Comfort</option>
                  <option value="luxury">Luxury / Bespoke VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Natural Language Preferences
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 text-xs outline-none transition"
                  placeholder="Describe your desired vibe, pace, dining preferences, and specific interests..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1F4E79] text-white font-bold text-sm hover:bg-[#183e60] transition shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="size-4 text-amber-300" />
                {loading ? 'Synthesizing Resilient Graph Itinerary...' : 'Generate Itinerary'}
              </button>
            </form>
          </div>

          {/* Output / Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            {generatedTrip ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Itinerary Synthesized
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {generatedTrip.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {generatedTrip.durationDays} Days • {generatedTrip.destination} • {generatedTrip.startDate} to {generatedTrip.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Estimated Cost</span>
                    <span className="text-2xl font-black text-slate-900">
                      ${generatedTrip.totalCost}
                    </span>
                  </div>
                </div>

                {/* Taste Profile DNA Radar Bars */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Trip DNA Taste Alignment
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Adventure</span>
                      <strong className="text-slate-800 font-bold">{generatedTrip.tasteProfile.adventure}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Culture</span>
                      <strong className="text-slate-800 font-bold">{generatedTrip.tasteProfile.culture}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Relaxation</span>
                      <strong className="text-slate-800 font-bold">{generatedTrip.tasteProfile.relaxation}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Budget Efficiency</span>
                      <strong className="text-slate-800 font-bold">{generatedTrip.tasteProfile.budgetConscious}%</strong>
                    </div>
                  </div>
                </div>

                {/* Day Overview List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Schedule Preview ({generatedTrip.components.length} Components)
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {generatedTrip.components.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                            Day {comp.day}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 block">{comp.name}</span>
                            <span className="text-slate-500 text-[11px]">{comp.time} • {comp.vendor}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">${comp.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={handleProceedToTrip}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="size-4" />
                  Open Full Itinerary & Operations Center
                  <ArrowRight className="size-4" />
                </button>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-sm flex flex-col items-center justify-center min-h-[380px]">
                <div className="size-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <Sparkles className="size-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Ready to Craft Your Journey
                </h3>
                <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
                  Fill in your destination and preferences on the left. The engine will synthesize a day-by-day plan with connected DAG dependency graph and resilient alternatives.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
