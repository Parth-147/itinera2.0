import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Calendar, ArrowRight, ShieldCheck, AlertTriangle, Compass } from 'lucide-react';
import { api } from '../services/api';
import { TripItinerary } from '../types/itinerary';

export default function Saved() {
  const [trips, setTrips] = useState<TripItinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await api.getTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Bookmark className="size-3.5" />
              Saved Itineraries & Operations
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Curated Journeys
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Access scheduled trips, monitor live disruptions, and review itinerary graphs.
            </p>
          </div>

          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#183e60] transition shadow-sm inline-flex items-center gap-2"
          >
            <Compass className="size-4" />
            Plan New Trip
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="size-8 border-4 border-[#1F4E79] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Fetching saved itineraries...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const activeDisruptions = trip.disruptions?.filter((d) => !d.resolved) || [];
              const hasDisruptions = activeDisruptions.length > 0;

              return (
                <motion.div
                  key={trip.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {trip.durationDays} Days
                      </span>
                      {hasDisruptions ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="size-3" />
                          Disruption
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="size-3" />
                          Confirmed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="size-3 text-slate-400" />
                      {trip.startDate} to {trip.endDate}
                    </p>

                    {/* DNA tags */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {trip.tasteProfile.favoriteStyles?.slice(0, 3).map((style, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-200/60"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                        Total
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ${trip.totalCost}
                      </span>
                    </div>

                    <Link
                      to={`/trip/${trip.id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#1F4E79] hover:text-white text-xs font-bold text-slate-700 transition"
                    >
                      View Trip
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Bookmark className="size-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Saved Trips Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Create an AI-customized tour to begin tracking its graph.
            </p>
            <Link
              to="/create"
              className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white text-xs font-bold"
            >
              Start Planning
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
