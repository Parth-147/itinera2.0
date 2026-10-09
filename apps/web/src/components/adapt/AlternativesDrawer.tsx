import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdaptationResult, ComponentAlternative, ItineraryComponent } from '../../types/itinerary';
import { X, CheckCircle2, Zap, ArrowRight, ShieldCheck, DollarSign, Clock, Star, Heart } from 'lucide-react';

interface AlternativesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  adaptation: AdaptationResult | null;
  originalComponent: ItineraryComponent | null;
  onApplyAlternative: (replacement: ItineraryComponent) => void;
  isApplying?: boolean;
}

export const AlternativesDrawer: React.FC<AlternativesDrawerProps> = ({
  isOpen,
  onClose,
  adaptation,
  originalComponent,
  onApplyAlternative,
  isApplying,
}) => {
  if (!isOpen || !adaptation || !originalComponent) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Slide-out Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-[#1F4E79] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Zap className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Adapt Engine Solutions</h3>
                  <p className="text-xs text-slate-300">
                    Disruption resolution & multi-criteria alternative ranking
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Disruption Context Banner */}
            <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-xs">
              <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                <span>Disrupted:</span>
                <span className="text-white">{originalComponent.name}</span>
              </div>
              <p className="mt-1 text-slate-300 leading-relaxed">
                {adaptation.disruptionDescription}
              </p>
              {adaptation.impactedComponents.length > 0 && (
                <div className="mt-2 text-[11px] text-amber-300">
                  ⚠️ {adaptation.impactedComponents.length} downstream component(s) affected by dependency graph walk.
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Overview */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
              <strong className="font-semibold block mb-1">AI Recommendation:</strong>
              {adaptation.systemRecommendation}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ranked Alternatives ({adaptation.rankedAlternatives.length})
            </h4>

            {adaptation.rankedAlternatives.map((alt: ComponentAlternative, index: number) => {
              const isTop = index === 0;

              return (
                <div
                  key={alt.component.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    isTop
                      ? 'bg-slate-50/80 border-[#1F4E79]/40 ring-2 ring-[#1F4E79]/15 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar with Score */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F4E79] text-white">
                          Top Match
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500">
                        {alt.component.vendor}
                      </span>
                    </div>

                    {/* Composite Score Pill */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        <span>{alt.score}/100 Score</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ${alt.component.cost}
                      </span>
                    </div>
                  </div>

                  {/* Component Title & Rationale */}
                  <div className="mt-3">
                    <h5 className="font-bold text-slate-900 text-base leading-snug">
                      {alt.component.name}
                    </h5>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {alt.explanation}
                    </p>
                  </div>

                  {/* Criteria Score Breakdown Grid */}
                  <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-500">
                        <DollarSign className="size-3" /> Cost (40%)
                      </div>
                      <div className="mt-1 font-bold text-xs text-slate-800">
                        {alt.breakdown.costScore}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-500">
                        <Clock className="size-3" /> Time (30%)
                      </div>
                      <div className="mt-1 font-bold text-xs text-slate-800">
                        {alt.breakdown.timeScore}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-500">
                        <Star className="size-3" /> Vendor (20%)
                      </div>
                      <div className="mt-1 font-bold text-xs text-slate-800">
                        {alt.breakdown.vendorScore}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-500">
                        <Heart className="size-3" /> DNA (10%)
                      </div>
                      <div className="mt-1 font-bold text-xs text-slate-800">
                        {alt.breakdown.tasteScore}%
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Delta: <strong className={alt.costDelta > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {alt.costDelta === 0 ? '$0' : alt.costDelta > 0 ? `+$${alt.costDelta}` : `-$${Math.abs(alt.costDelta)}`}
                      </strong>
                    </div>
                    <button
                      disabled={isApplying}
                      onClick={() => onApplyAlternative(alt.component)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                        isTop
                          ? 'bg-[#1F4E79] text-white hover:bg-[#183e60]'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-300" />
                      Apply Alternative
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
