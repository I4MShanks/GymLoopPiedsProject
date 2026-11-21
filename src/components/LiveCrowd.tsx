import React, { useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { GymZone, HourlyCrowdPoint } from '../types/gymloop';

interface LiveCrowdProps {
  peopleInside: number;
  capacity: number;
  hourlyCrowd: HourlyCrowdPoint[];
  zones: GymZone[];
  lastUpdatedSeconds: number;
  onRefreshCrowd: () => void;
}

export const LiveCrowd: React.FC<LiveCrowdProps> = ({
  peopleInside,
  capacity,
  hourlyCrowd,
  zones,
  lastUpdatedSeconds,
  onRefreshCrowd,
}) => {
  const [selectedHour, setSelectedHour] = useState<HourlyCrowdPoint>(
    hourlyCrowd.find((h) => h.isNow) ?? hourlyCrowd[8]
  );

  const occupancyPct = Math.min(100, Math.round((peopleInside / capacity) * 100));
  const maxHourly = Math.max(...hourlyCrowd.map((h) => h.count), capacity);

  const getBarColor = (point: HourlyCrowdPoint) => {
    if (point.isNow) return '#39FF88';
    if (point.tier === 'packed') return '#FF3DA8';
    if (point.tier === 'moderate') return '#FFD23F';
    return '#39FF88';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-pixel text-[10px] text-[#39FF88] tracking-wider block mb-2">
            LIVE · UPDATED {lastUpdatedSeconds}s AGO
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight text-balance">
            How packed is it rn?
          </h1>
        </div>

        <button
          type="button"
          onClick={onRefreshCrowd}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#13122E] hover:bg-[#1A183D] border border-white/15 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-[#3DD6FF]" />
          <span>Refresh headcount</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Headcount + Chill/Busy/Packed Meter + Floor Zones */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-7 sticker-card text-center">
            <div className="font-display text-6xl sm:text-7xl text-[#39FF88] tabular-nums leading-none mb-2">
              {peopleInside}
            </div>
            <p className="text-sm text-slate-300 tabular-nums mb-6">
              people inside · capacity {capacity} ({occupancyPct}%)
            </p>

            {/* Chill / Busy / Packed Gradient Spectrum */}
            <div className="relative h-3 rounded-full bg-[#0B0A1F] overflow-hidden mb-2.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#39FF88] via-[#FFD23F] to-[#FF3DA8] transition-all duration-300"
                style={{ width: `${Math.max(12, occupancyPct)}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-pixel text-[10px] tracking-wider text-slate-400">
              <span className={occupancyPct < 45 ? 'text-[#39FF88]' : ''}>CHILL</span>
              <span className={occupancyPct >= 45 && occupancyPct < 75 ? 'text-[#FFD23F]' : ''}>
                BUSY
              </span>
              <span className={occupancyPct >= 75 ? 'text-[#FF3DA8]' : ''}>PACKED</span>
            </div>
          </div>

          {/* Pro Move Tip */}
          <div className="rounded-2xl bg-[#13122E] border border-[#FFD23F]/45 p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#FFD23F] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-[#FFD23F]">Pro move:</strong> go at{' '}
              <strong className="text-white">3 PM</strong> — benches are{' '}
              <strong className="text-[#39FF88]">80% free</strong>.
            </p>
          </div>

          {/* Floor Zones Breakdown */}
          <div className="rounded-3xl bg-[#13122E] border border-white/12 p-5 sm:p-6">
            <h2 className="font-pixel text-[10px] text-slate-400 tracking-wider mb-4">
              FLOOR ZONES RIGHT NOW
            </h2>
            <div className="space-y-3">
              {zones.map((zone) => {
                const pct = Math.round((zone.occupied / zone.total) * 100);
                return (
                  <div key={zone.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{zone.name}</span>
                      <span className="text-slate-300 tabular-nums">
                        {zone.occupied}/{zone.total} ·{' '}
                        <span
                          className={
                            zone.status === 'Open'
                              ? 'text-[#39FF88]'
                              : zone.status === 'Moderate'
                                ? 'text-[#FFD23F]'
                                : 'text-[#FF3DA8]'
                          }
                        >
                          {zone.status}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#0B0A1F] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            zone.status === 'Open'
                              ? '#39FF88'
                              : zone.status === 'Moderate'
                                ? '#FFD23F'
                                : '#FF3DA8',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive Today By Hour Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-7 sticker-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <span className="font-pixel text-[10px] text-slate-400 tracking-wider block mb-1">
                TODAY BY HOUR
              </span>
              <p className="text-xs text-slate-300">
                Tap or hover any bar to inspect crowd &amp; bench availability
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#0B0A1F] border border-white/10 text-right">
              <div className="font-pixel text-[10px] text-[#3DD6FF]">{selectedHour.hourLabel}</div>
              <div className="text-xs font-semibold text-white tabular-nums">
                {selectedHour.count} people · {selectedHour.benchFreePct}% benches free
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2 px-1">
            {hourlyCrowd.map((point) => {
              const heightPct = Math.max(12, Math.round((point.count / maxHourly) * 100));
              const isSelected = selectedHour.hourLabel === point.hourLabel;
              const barColor = getBarColor(point);

              return (
                <button
                  key={point.hourLabel}
                  type="button"
                  onClick={() => setSelectedHour(point)}
                  onMouseEnter={() => setSelectedHour(point)}
                  aria-label={`${point.hourLabel}: ${point.count} people`}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-2 group cursor-pointer focus:outline-none"
                >
                  <span
                    className={`text-[10px] font-mono tabular-nums transition-opacity ${
                      isSelected ? 'opacity-100 text-white font-bold' : 'opacity-0 group-hover:opacity-100 text-slate-300'
                    }`}
                  >
                    {point.count}
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition-all duration-200 ${
                      point.isNow
                        ? 'ring-2 ring-white shadow-[0_0_20px_rgba(57,255,136,0.45)]'
                        : isSelected
                          ? 'opacity-100 ring-1 ring-white/60'
                          : 'opacity-70 group-hover:opacity-100'
                    }`}
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      point.isNow
                        ? 'text-[#39FF88] font-bold'
                        : isSelected
                          ? 'text-white font-bold'
                          : 'text-slate-400'
                    }`}
                  >
                    {point.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#39FF88]" /> Chill
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD23F]" /> Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FF3DA8]" /> Rush hour
              </span>
            </div>
            <span>Iron Den Pilani · Avg Tuesday–Saturday trend</span>
          </div>
        </div>
      </div>
    </div>
  );
};
