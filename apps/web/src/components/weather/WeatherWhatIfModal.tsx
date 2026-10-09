import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Zap, AlertTriangle, X, Play } from 'lucide-react';
import { api } from '../../services/api';
import { ItineraryComponent } from '../../types/itinerary';

interface WeatherWhatIfModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ItineraryComponent[];
}

export const WeatherWhatIfModal: React.FC<WeatherWhatIfModalProps> = ({
  isOpen,
  onClose,
  components,
}) => {
  const [condition, setCondition] = useState<string>('Heavy Rain');
  const [intensity, setIntensity] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  if (!isOpen) return null;

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.simulateWeatherWhatIf(
        { condition, intensity },
        components
      );
      setSimulationResult(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <CloudRain className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Weather What-If Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Stress-test itinerary resilience against hypothetical climate shocks
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {/* Condition selector buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Simulated Climate Shock
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Heavy Rain', icon: CloudRain },
                  { name: 'Severe Thunderstorm', icon: Zap },
                  { name: 'Gale Winds', icon: Wind },
                  { name: 'Blizzard', icon: CloudRain },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = condition === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setCondition(item.name)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-2 ${
                        isSelected
                          ? 'border-[#1F4E79] bg-[#1F4E79]/5 ring-2 ring-[#1F4E79]/20 text-[#1F4E79]'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className="size-4 text-slate-600" />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-500">
                  Shock Intensity Level
                </span>
                <span className="font-bold text-[#1F4E79] bg-indigo-50 px-2 py-0.5 rounded-md">
                  Category {intensity} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#1F4E79] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Cat 1 (Mild)</span>
                <span>Cat 3 (Operational Hazard)</span>
                <span>Cat 5 (Full Emergency)</span>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1F4E79] text-white font-bold text-sm hover:bg-[#183e60] transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="size-4 fill-white" />
              {loading ? 'Evaluating Resilience...' : 'Run Simulation'}
            </button>

            {/* Simulation Results */}
            {simulationResult && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Simulation Output
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      simulationResult.riskLevel === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : simulationResult.riskLevel === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Risk Level: {simulationResult.riskLevel.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {simulationResult.summary}
                </p>

                {simulationResult.atRiskComponents?.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Components At Risk ({simulationResult.atRiskComponents.length})
                    </h5>
                    {simulationResult.atRiskComponents.map((risk: any) => (
                      <div
                        key={risk.componentId}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                      >
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <AlertTriangle className="size-3.5 text-amber-500" />
                          {risk.name}
                        </div>
                        <div className="text-slate-500">{risk.riskReason}</div>
                        <div className="text-indigo-600 font-medium">
                          Suggested Action: {risk.suggestedAction}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
