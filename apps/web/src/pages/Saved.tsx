import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Layers,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { TripItinerary } from '../types/itinerary';

// Curated destination cover photos matching ITINERA aesthetic
const DESTINATION_IMAGES: Record<string, string> = {
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
  japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
  alps: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
  swiss: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
  interlaken: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
  greece: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
  amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
  italy: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
  patagonia: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1200&auto=format&fit=crop',
  chile: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1200&auto=format&fit=crop',
  cape: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop',
  africa: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop',
  iceland: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1200&auto=format&fit=crop',
  reykjavik: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1200&auto=format&fit=crop',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop',
  banff: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1200&auto=format&fit=crop',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
  france: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop';

function getCoverPhoto(destinationStr?: string): string {
  if (!destinationStr) return DEFAULT_COVER;
  const lower = destinationStr.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return DEFAULT_COVER;
}

export default function Saved() {
  const [trips, setTrips] = useState<TripItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'disruptions'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await api.getTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics summary
  const totalValue = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.totalCost || 0), 0);
  }, [trips]);

  const totalDisruptions = useMemo(() => {
    return trips.reduce((acc, t) => {
      const active = t.disruptions?.filter((d) => !d.resolved) || [];
      return acc + active.length;
    }, 0);
  }, [trips]);

  const confirmedTripsCount = useMemo(() => {
    return trips.filter((t) => t.status === 'confirmed').length;
  }, [trips]);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const hasDisruptions = (trip.disruptions?.filter((d) => !d.resolved) || []).length > 0;

      if (activeFilter === 'confirmed' && trip.status !== 'confirmed') return false;
      if (activeFilter === 'disruptions' && !hasDisruptions) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = trip.title.toLowerCase().includes(query);
        const matchesDest = trip.destination.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDest) return false;
      }

      return true;
    });
  }, [trips, activeFilter, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Editorial Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D45] via-[#163832] to-[#0D1A15] p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wide mb-3 border border-white/10">
                <Bookmark className="size-3.5" />
                <span>Curated Expeditions & Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Saved Itineraries
              </h1>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Review your personalized journeys, monitor real-time disruption resilience, and access full graph dependencies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/create"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-lg inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="size-4" />
                <span>Architect New Journey</span>
              </Link>
              <Link
                to="/search"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition border border-white/15 inline-flex items-center gap-2"
              >
                <Search className="size-4 text-slate-300" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Total Journeys</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">{trips.length}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Locked & Confirmed</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">{confirmedTripsCount}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Active Disruptions</span>
              <span className={`text-xl sm:text-2xl font-black mt-0.5 block ${totalDisruptions > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {totalDisruptions}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Portfolio Value</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Journeys ({trips.length})
            </button>
            <button
              onClick={() => setActiveFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'confirmed'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Confirmed ({confirmedTripsCount})
            </button>
            <button
              onClick={() => setActiveFilter('disruptions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'disruptions'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Review ({totalDisruptions})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or destination..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1F4D45] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="size-10 border-4 border-[#1F4D45] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Retrieving your itinerary repository...</p>
            <p className="text-xs text-slate-400 mt-1">Cross-referencing graph dependency models</p>
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const activeDisruptions = trip.disruptions?.filter((d) => !d.resolved) || [];
              const hasDisruptions = activeDisruptions.length > 0;
              const coverPhoto = getCoverPhoto(trip.destination);

              return (
                <motion.div
                  key={trip.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Photo Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={coverPhoto}
                        alt={trip.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                      {/* Header Floating Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/15">
                          {trip.durationDays} Days • {trip.components.length} Activities
                        </span>

                        {hasDisruptions ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-400/40 shadow-sm animate-pulse">
                            <AlertTriangle className="size-3" />
                            Disruption Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <ShieldCheck className="size-3" />
                            Confirmed
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Overlay Info */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-200">
                          <MapPin className="size-3.5 text-amber-400" />
                          {trip.destination}
                        </span>
                        <span className="font-semibold text-slate-300">
                          {trip.startDate}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#1F4D45] transition line-clamp-1">
                        {trip.title}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-slate-400 shrink-0" />
                        <span>Schedule: {trip.startDate} to {trip.endDate}</span>
                      </p>

                      {/* DNA Taste Pills */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {trip.tasteProfile.favoriteStyles?.slice(0, 3).map((style, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60"
                          >
                            {style}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 rounded-md bg-[#1F4D45]/10 text-[#1F4D45] text-[10px] font-semibold">
                          DNA {trip.tasteProfile.culture}% Cult
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                        Estimated Total
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ${trip.totalCost?.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/trip/${trip.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition shadow-xs hover:scale-105"
                    >
                      <span>View Itinerary</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
            <div className="size-16 rounded-3xl bg-[#1F4D45]/10 text-[#1F4D45] flex items-center justify-center mx-auto mb-4 border border-[#1F4D45]/20">
              <Bookmark className="size-8 text-[#1F4D45]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? 'No Matching Journeys Found' : 'No Saved Itineraries Yet'}
            </h3>
            <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No trips match "${searchQuery}". Try a different keyword or reset your filters.`
                : 'Synthesize a bespoke travel plan with Gemini AI and ITINERA’s adaptive graph engine to track your journeys here.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  Clear Search
                </button>
              ) : (
                <>
                  <Link
                    to="/create"
                    className="px-6 py-3 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition shadow-md inline-flex items-center gap-2"
                  >
                    <Compass className="size-4" />
                    <span>Create Your First Journey</span>
                  </Link>
                  <Link
                    to="/search"
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Browse Inspirations
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
