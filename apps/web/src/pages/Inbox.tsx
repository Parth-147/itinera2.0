import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CloudRain,
  CheckCircle,
  ArrowRight,
  Zap,
  Info,
  ShieldAlert,
  Activity,
  CheckCircle2,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { TripItinerary } from '../types/itinerary';

interface NotificationItem {
  id: string;
  type: 'disruption' | 'weather' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  tripId?: string;
  actionUrl?: string;
  actionText?: string;
  severity?: 'critical' | 'warning' | 'info' | 'success';
}

export default function Inbox() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'disruption' | 'booking' | 'system'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const trips = await api.getTrips();
      const items: NotificationItem[] = [];

      trips.forEach((t) => {
        // Disruption notifications
        t.disruptions?.forEach((d) => {
          items.push({
            id: `notif-${d.id}`,
            type: 'disruption',
            title: `Operational Disruption: ${t.destination}`,
            message: d.description,
            timestamp: d.timestamp,
            tripId: t.id,
            actionUrl: `/trip/${t.id}`,
            actionText: 'Open Adapt Engine',
            severity: d.severity === 'critical' ? 'critical' : 'warning',
          });
        });

        // Booking confirmation
        if (t.status === 'confirmed') {
          items.push({
            id: `notif-book-${t.id}`,
            type: 'booking',
            title: `Expedition Confirmed: ${t.title}`,
            message: `All ${t.components.length} components locked in with verified partner vouchers. Total investment: $${t.totalCost?.toLocaleString()}.`,
            timestamp: t.updatedAt,
            tripId: t.id,
            actionUrl: `/trip/${t.id}`,
            actionText: 'View Itinerary',
            severity: 'success',
          });
        }
      });

      // System notification
      items.push({
        id: 'notif-sys-1',
        type: 'system',
        title: 'Nugen Aligned Intelligence Active',
        message: 'Domain-aligned Qwen & Gemini inference engine is connected to the real-time telemetry pipeline.',
        timestamp: new Date().toISOString(),
        severity: 'info',
      });

      setNotifications(items);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics summary
  const disruptionCount = useMemo(
    () => notifications.filter((n) => n.type === 'disruption').length,
    [notifications]
  );
  const bookingCount = useMemo(
    () => notifications.filter((n) => n.type === 'booking').length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Editorial Top Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F4D45] via-[#163832] to-[#0D1A15] p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wide mb-3 border border-white/10">
                <Activity className="size-3.5 text-emerald-400" />
                <span>Live Fleet & Disruption Telemetry</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Operational Bulletins
              </h1>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Real-time climate telemetry, cascading disruptions, and automated partner booking receipts across your scheduled expeditions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadNotifications}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition border border-white/15 flex items-center gap-2"
              >
                <RefreshCw className="size-3.5" />
                <span>Refresh Stream</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Operational Alerts</span>
              <span className={`text-xl sm:text-2xl font-black mt-0.5 block ${disruptionCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {disruptionCount}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Confirmed Vouchers</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">{bookingCount}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider block">Telemetry SLA</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">100% Healthy</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
          {[
            { id: 'all', label: `All Bulletins (${notifications.length})` },
            { id: 'disruption', label: `Disruptions (${disruptionCount})` },
            { id: 'booking', label: `Confirmations (${bookingCount})` },
            { id: 'system', label: 'System & AI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#1F4D45] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="size-10 border-4 border-[#1F4D45] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Retrieving operational bulletins...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((item) => {
              const isDisruption = item.type === 'disruption';
              const isBooking = item.type === 'booking';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-3xl border transition-all flex items-start justify-between gap-5 flex-wrap sm:flex-nowrap ${
                    isDisruption
                      ? 'bg-rose-50/60 border-rose-200/90 shadow-xs'
                      : isBooking
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                      : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        isDisruption
                          ? 'bg-rose-600 text-white shadow-sm'
                          : isBooking
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#1F4D45]/15 text-[#1F4D45]'
                      }`}
                    >
                      {isDisruption ? (
                        <AlertTriangle className="size-5" />
                      ) : isBooking ? (
                        <CheckCircle className="size-5" />
                      ) : (
                        <Zap className="size-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isDisruption
                              ? 'bg-rose-100 text-rose-700'
                              : isBooking
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
                        {item.message}
                      </p>

                      <span className="text-[11px] text-slate-400 block pt-1 font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {item.actionUrl && (
                    <Link
                      to={item.actionUrl}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition self-center sm:self-start shadow-xs hover:scale-105 ${
                        isDisruption
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-[#1F4D45] hover:bg-[#2A6559] text-white'
                      }`}
                    >
                      <span>{item.actionText || 'Inspect'}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
            <div className="size-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              All Operational Bulletins Clear
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              No bulletins match this filter. Real-time telemetry is running nominal across all connected expeditions.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
