import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TripItinerary,
  ItineraryComponent,
  AdaptationResult,
  WeatherCondition,
} from '../types/itinerary';
import { api } from '../services/api';
import { TripMap } from '../components/map/TripMap';
import { ComponentCard } from '../components/itinerary/ComponentCard';
import { AlternativesDrawer } from '../components/adapt/AlternativesDrawer';
import { WeatherWhatIfModal } from '../components/weather/WeatherWhatIfModal';
import {
  AlertTriangle,
  Zap,
  Calendar,
  CloudRain,
  CheckCircle,
  CreditCard,
  ArrowLeft,
  DollarSign,
  Layers,
} from 'lucide-react';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);

  // Adapt engine modal & drawer state
  const [activeAdaptation, setActiveAdaptation] = useState<AdaptationResult | null>(null);
  const [selectedDisruptedComp, setSelectedDisruptedComp] = useState<ItineraryComponent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Active filter day
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const tripId = id || 'trip-kyoto-001';
      const data = await api.getTrip(tripId);
      setTrip(data);

      if (data && data.destinationCoords) {
        const weatherData = await api.getWeather(data.destinationCoords);
        setWeather(weatherData);
      }
    } catch (err) {
      console.error('Failed loading trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDisruption = async (componentId: string) => {
    if (!trip) return;
    try {
      const res = await api.triggerDisruption({
        tripId: trip.id,
        componentId,
        cause: 'weather',
        description: 'Sudden localized gale winds and intense rainfall triggered safety suspension.',
      });

      const disruptedComp = trip.components.find((c) => c.id === componentId) || null;
      setSelectedDisruptedComp(disruptedComp);
      setActiveAdaptation(res.adaptation);
      setIsDrawerOpen(true);

      // Reload trip state
      await loadTrip();
    } catch (err) {
      console.error(err);
      alert('Could not trigger disruption simulation.');
    }
  };

  const handleExploreAlternatives = (componentId: string) => {
    if (!trip) return;
    const comp = trip.components.find((c) => c.id === componentId);
    if (!comp) return;

    // Trigger adaptation resolution
    handleTriggerDisruption(componentId);
  };

  const handleApplyAlternative = async (replacement: ItineraryComponent) => {
    if (!trip || !selectedDisruptedComp) return;

    try {
      const res = await api.applyAlternative({
        tripId: trip.id,
        originalComponentId: selectedDisruptedComp.id,
        replacementComponent: replacement,
      });

      setTrip(res.updatedTrip);
      setIsDrawerOpen(false);
      setActiveAdaptation(null);
      setSelectedDisruptedComp(null);
      alert(`Success: ${res.message}`);
    } catch (err) {
      console.error(err);
      alert('Failed applying alternative.');
    }
  };

  const handleBookTrip = async () => {
    if (!trip) return;
    setIsBooking(true);
    try {
      const res = await api.bookTrip(trip.id);
      setBookingSuccess(res);
      await loadTrip();
    } catch (err) {
      console.error(err);
      alert('Booking confirmation failed.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-4 border-[#1F4D45] border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Loading tour operations graph...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900">Trip Not Found</h2>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            The requested itinerary does not exist or has expired.
          </p>
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl bg-[#1F4D45] hover:bg-[#2A6559] text-white text-xs font-bold transition shadow-sm"
          >
            Create New Trip
          </Link>
        </div>
      </div>
    );
  }

  const activeDisruptions = trip.disruptions?.filter((d) => !d.resolved) || [];
  const hasDisruptions = activeDisruptions.length > 0;

  const daysList = Array.from(
    new Set(trip.components.map((c) => c.day))
  ).sort((a, b) => a - b);

  const displayedComponents = selectedDay === 'all'
    ? trip.components
    : trip.components.filter((c) => c.day === selectedDay);

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="bg-white border-b border-stone-200/90 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-900">{trip.title}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    hasDisruptions
                      ? 'bg-rose-100 text-rose-800'
                      : trip.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#1F4D45]/10 text-[#1F4D45]'
                  }`}
                >
                  {hasDisruptions ? 'Disruption Active' : trip.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {trip.destination} • {trip.startDate} to {trip.endDate} ({trip.durationDays} Days)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsWhatIfOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
            >
              <CloudRain className="size-3.5 text-[#1F4D45]" />
              Weather What-If
            </button>

            <button
              onClick={handleBookTrip}
              disabled={isBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1F4D45] text-white hover:bg-[#2A6559] transition shadow-sm"
            >
              <CreditCard className="size-3.5" />
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Booking Banner if just booked */}
        {bookingSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-5 text-emerald-600" />
              <div>
                <strong className="font-bold text-sm">Booking Confirmed!</strong>
                <p className="text-xs text-emerald-700">
                  Ref: {bookingSuccess.bookingReference} • Paid: ${bookingSuccess.totalPaid} {bookingSuccess.currency}
                </p>
              </div>
            </div>
            <button
              onClick={() => setBookingSuccess(null)}
              className="text-xs text-emerald-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Disruption Alert Banner */}
        {hasDisruptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-md flex items-start justify-between gap-4 flex-wrap"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-rose-600 text-white shrink-0 mt-0.5">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-rose-950 text-base">
                    Active Tour Disruption Detected
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                    {activeDisruptions.length} Issue(s)
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed max-w-2xl">
                  {activeDisruptions[0].description}
                </p>
                {activeDisruptions[0].affectedDownstream?.length > 0 && (
                  <p className="text-[11px] font-semibold text-rose-700 mt-1">
                    Graph Walk Impact: {activeDisruptions[0].affectedDownstream.length} downstream component(s) flagged for cascading delay.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleTriggerDisruption(activeDisruptions[0].componentId)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              <Zap className="size-4 text-amber-300" />
              Open Adapt Engine Resolver
            </button>
          </motion.div>
        )}

        {/* Top Summary & Cost Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Budget
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">${trip.totalCost}</span>
              <span className="text-xs text-slate-500">USD</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Avg ${(trip.totalCost / trip.durationDays).toFixed(0)}/day
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Duration & Days
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{trip.durationDays} Days</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {trip.startDate} - {trip.endDate}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Components in DAG
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{trip.components.length}</span>
              <span className="text-xs text-slate-500">Scheduled Nodes</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              100% Graph Connected
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Traveler Taste Profile
            </span>
            <div className="mt-1 text-xs space-y-1 font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Culture: {trip.tasteProfile.culture}%</span>
                <span>Adventure: {trip.tasteProfile.adventure}%</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Relaxation: {trip.tasteProfile.relaxation}%</span>
                <span>Budget: {trip.tasteProfile.budgetConscious}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geospatial Map Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="size-4 text-[#1F4D45]" />
              Geospatial Route & Real-Time Weather Overlay
            </h3>
            <span className="text-xs text-stone-500">
              Interactive Leaflet Map • {trip.components.length} Waypoints
            </span>
          </div>
          <TripMap
            components={trip.components}
            weather={weather}
          />
        </div>

        {/* Day-by-Day Schedule Timeline */}
        <div className="space-y-6">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/90">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedDay === 'all'
                  ? 'bg-[#1F4D45] text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/90'
              }`}
            >
              All Days ({trip.components.length})
            </button>
            {daysList.map((d) => {
              const dayComps = trip.components.filter((c) => c.day === d);
              const dayHasDisruption = dayComps.some((c) => c.status === 'disrupted');

              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
                    selectedDay === d
                      ? 'bg-[#1F4D45] text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/90'
                  }`}
                >
                  <span>Day {d}</span>
                  {dayHasDisruption && (
                    <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedComponents.map((comp) => {
              const isDisrupted = comp.status === 'disrupted';
              const isDownstream = activeDisruptions.some((d) =>
                d.affectedDownstream?.includes(comp.id)
              );

              return (
                <ComponentCard
                  key={comp.id}
                  component={comp}
                  allComponents={trip.components}
                  onTriggerDisruption={handleTriggerDisruption}
                  onExploreAlternatives={handleExploreAlternatives}
                  isDisrupted={isDisrupted}
                  isDownstreamAffected={isDownstream}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Adapt Engine Alternatives Drawer */}
      <AlternativesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        adaptation={activeAdaptation}
        originalComponent={selectedDisruptedComp}
        onApplyAlternative={handleApplyAlternative}
      />

      {/* Weather What-If Modal */}
      <WeatherWhatIfModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        components={trip.components}
      />
    </main>
  );
}
