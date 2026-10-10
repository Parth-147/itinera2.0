import React from 'react';
import { motion } from 'framer-motion';
import {
  ItineraryComponent,
} from '../../types/itinerary';
import {
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ComponentCardProps {
  component: ItineraryComponent;
  allComponents: ItineraryComponent[];
  onTriggerDisruption: (componentId: string) => void;
  onExploreAlternatives: (componentId: string) => void;
  isDisrupted?: boolean;
  isDownstreamAffected?: boolean;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  allComponents,
  onTriggerDisruption,
  onExploreAlternatives,
  isDisrupted,
  isDownstreamAffected,
}) => {
  // Find names of prerequisite components
  const prerequisiteNames = (component.dependsOn || [])
    .map((depId) => allComponents.find((c) => c.id === depId)?.name)
    .filter(Boolean);

  const getStatusBadge = () => {
    if (isDisrupted || component.status === 'disrupted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="size-3.5 text-rose-600" />
          Disrupted
        </span>
      );
    }
    if (isDownstreamAffected) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <GitBranch className="size-3.5 text-amber-600" />
          Downstream Impact
        </span>
      );
    }
    if (component.status === 'swapped') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <RefreshCw className="size-3.5 text-sky-600" />
          Adapted Alternative
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        Confirmed
      </span>
    );
  };

  const getTypeColor = () => {
    switch (component.type) {
      case 'stay':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'transport':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'dining':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-2xl p-5 border transition-all ${
        isDisrupted
          ? 'bg-rose-50/40 border-rose-300 ring-2 ring-rose-400/20 shadow-md'
          : isDownstreamAffected
          ? 'bg-amber-50/30 border-amber-300 shadow-sm'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getTypeColor()}`}>
            {component.type}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Clock className="size-3.5" />
            {component.time} • {component.duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-base font-bold text-slate-900">
            ${component.cost}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mt-3">
        <h4 className="text-base font-bold text-slate-900 leading-snug">
          {component.name}
        </h4>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Location & Vendor Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{component.location.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Vendor: <strong>{component.vendor}</strong></span>
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-500" />
            {component.vendorRating}
          </span>
        </div>
      </div>

      {/* DAG Dependency Indicators */}
      {prerequisiteNames.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <GitBranch className="size-3.5 text-[#1F4D45] shrink-0" />
          <span>Depends on: <strong className="text-slate-700">{prerequisiteNames.join(', ')}</strong></span>
        </div>
      )}

      {/* Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        {isDisrupted || component.status === 'disrupted' ? (
          <button
            onClick={() => onExploreAlternatives(component.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F4D45] text-white hover:bg-[#2A6559] transition shadow-sm"
          >
            <Zap className="size-3.5 text-amber-300" />
            Resolve with Adapt Engine
          </button>
        ) : (
          <>
            <button
              onClick={() => onExploreAlternatives(component.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <RefreshCw className="size-3 text-slate-500" />
              Alternatives
            </button>
            <button
              onClick={() => onTriggerDisruption(component.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              title="Simulate disruption for hackathon demonstration"
            >
              <AlertTriangle className="size-3 text-rose-500" />
              Trigger Disruption (Demo)
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
