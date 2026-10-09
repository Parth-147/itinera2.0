import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CloudRain, CheckCircle, ArrowRight, Zap, Info } from 'lucide-react';
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
}

export default function Inbox() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

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
            title: `Operational Alert: ${t.destination}`,
            message: d.description,
            timestamp: d.timestamp,
            tripId: t.id,
            actionUrl: `/trip/${t.id}`,
            actionText: 'Open Adapt Engine',
          });
        });

        // Booking confirmation
        if (t.status === 'confirmed') {
          items.push({
            id: `notif-book-${t.id}`,
            type: 'booking',
            title: `Trip Confirmed: ${t.title}`,
            message: `All ${t.components.length} components locked in with verified partner vouchers. Total: $${t.totalCost}.`,
            timestamp: t.updatedAt,
            tripId: t.id,
            actionUrl: `/trip/${t.id}`,
            actionText: 'View Itinerary',
          });
        }
      });

      // System notification
      items.push({
        id: 'notif-sys-1',
        type: 'system',
        title: 'Nugen Aligned Intelligence Active',
        message: 'Domain-aligned Qwen inference engine is connected to telemetry pipeline.',
        timestamp: new Date().toISOString(),
      });

      setNotifications(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Bell className="size-3.5" />
            Notification & Telemetry Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational Bulletins
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time telemetry, climate warnings, and cascading disruption alerts across your active fleet.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="size-8 border-4 border-[#1F4E79] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Retrieving bulletins...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => {
              const isDisruption = item.type === 'disruption';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap ${
                    isDisruption
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isDisruption
                          ? 'bg-rose-600 text-white'
                          : item.type === 'booking'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isDisruption ? (
                        <AlertTriangle className="size-5" />
                      ) : item.type === 'booking' ? (
                        <CheckCircle className="size-5" />
                      ) : (
                        <Info className="size-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
                        {item.message}
                      </p>
                      <span className="mt-2 text-[10px] text-slate-400 block font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.actionUrl && (
                    <Link
                      to={item.actionUrl}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                        isDisruption
                          ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                          : 'bg-slate-100 text-slate-800 hover:bg-[#1F4E79] hover:text-white'
                      }`}
                    >
                      {item.actionText || 'Inspect'}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
