import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, ScanLine, ShieldAlert } from 'lucide-react';
import { CheckInHistoryItem } from '../types/gymloop';

interface QrCheckInProps {
  thisWeekCount: number;
  weeklyGoal: number;
  history: CheckInHistoryItem[];
  onSimulateDeskScan: (code: string) => void;
}

function generateQrMatrix(seedStr: string): boolean[][] {
  const size = 11;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Fixed finder squares (top-left, top-right, bottom-left)
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        grid[r0 + r][c0 + c] = r === 1 && c === 1 ? false : true;
      }
    }
    grid[r0 + 1][c0 + 1] = true;
  };
  drawFinder(0, 0);
  drawFinder(0, size - 3);
  drawFinder(size - 3, 0);

  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTL = r < 4 && c < 4;
      const inTR = r < 4 && c >= size - 4;
      const inBL = r >= size - 4 && c < 4;
      if (inTL || inTR || inBL) continue;
      hash = Math.imul(hash ^ (r * 31 + c * 17), 16777619);
      grid[r][c] = (hash & 1) === 1;
    }
  }
  return grid;
}

export const QrCheckIn: React.FC<QrCheckInProps> = ({
  thisWeekCount,
  weeklyGoal,
  history,
  onSimulateDeskScan,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(18);
  const [rotationNonce, setRotationNonce] = useState(1);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRotationNonce((n) => n + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentCode = useMemo(() => {
    const suffix = (rotationNonce * 7919).toString(36).toUpperCase().slice(0, 4);
    return `IRONDEN-${suffix}-${rotationNonce}`;
  }, [rotationNonce]);

  const matrix = useMemo(() => generateQrMatrix(currentCode), [currentCode]);

  const handleManualRotate = () => {
    setRotationNonce((n) => n + 1);
    setSecondsLeft(30);
  };

  const handleDeskScan = () => {
    onSimulateDeskScan(currentCode);
    setScanSuccess(true);
    handleManualRotate();
    window.setTimeout(() => setScanSuccess(false), 2600);
  };

  const nextDayNumber = Math.min(weeklyGoal, thisWeekCount + 1);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main QR Card */}
      <div className="lg:col-span-7 rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-8 sticker-card flex flex-col items-center text-center">
        <span className="font-pixel text-[11px] text-[#39FF88] tracking-widest mb-2">
          CHECK-IN
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-white mb-6">
          Scan to clock in 🎟️
        </h1>

        {/* White Sticker QR Frame */}
        <div className="relative p-5 rounded-3xl bg-white sticker-green mb-5">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}
            aria-label={`Rotating gym check-in QR code ${currentCode}`}
          >
            {matrix.flatMap((row, rIdx) =>
              row.map((filled, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] transition-colors ${
                    filled ? 'bg-[#0B0A1F]' : 'bg-transparent'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* Countdown Badge + Rotate Button */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD23F] text-[#0B0A1F] font-bold text-xs tabular-nums">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>refreshes in {secondsLeft}s</span>
          </span>
          <button
            type="button"
            onClick={handleManualRotate}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            New code
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mb-6">
          Show this at the desk. Code changes every 30 sec — no checking in from your couch 😉
        </p>

        {/* XP Reward Callout */}
        <div className="w-full rounded-2xl bg-[#0B0A1F] border border-[#39FF88]/30 px-4 py-3 mb-5 text-sm">
          <span className="text-slate-300">This check-in gives </span>
          <strong className="text-[#39FF88] font-bold">+50 XP</strong>
          <span className="text-slate-400"> · </span>
          <span className="text-white font-semibold tabular-nums">
            day {nextDayNumber}/{weeklyGoal}
          </span>
        </div>

        {/* Interactive Desk Scanner Simulator */}
        <button
          type="button"
          onClick={handleDeskScan}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-[#39FF88] hover:bg-[#52FF9A] text-[#0B0A1F] font-display text-base flex items-center justify-center gap-2.5 sticker-green transition-all cursor-pointer"
        >
          <ScanLine className="w-5 h-5" />
          <span>SIMULATE DESK SCAN (+50 XP)</span>
        </button>

        {scanSuccess && (
          <div className="mt-4 w-full rounded-xl bg-[#39FF88]/15 border border-[#39FF88]/50 px-4 py-2.5 text-xs font-semibold text-[#39FF88] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Clocked in at Iron Den! +50 XP added &amp; weekly goal updated.</span>
          </div>
        )}
      </div>

      {/* Right Column: Anti-Cheat Rules & Recent Clock-Ins */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-3xl bg-[#13122E] border border-white/12 p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldAlert className="w-5 h-5 text-[#FF3DA8]" />
            <h2 className="font-display text-lg text-white">No Cheat Codes</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Every check-in token expires in 30 seconds and binds to the Iron Den front desk
            scanner. Screenshots expire before you leave the locker room.
          </p>
          <div className="rounded-2xl bg-[#0B0A1F] p-3.5 border border-white/8 flex items-center justify-between text-xs">
            <span className="text-slate-400">Active Token</span>
            <span className="font-mono text-[#3DD6FF] font-semibold">{currentCode}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-[#13122E] border border-white/12 p-6">
          <h2 className="font-pixel text-[10px] text-slate-400 tracking-wider mb-4">
            RECENT DESK CHECK-INS
          </h2>
          {history.length === 0 ? (
            <p className="text-xs text-slate-400">
              No scans logged yet this session. Tap &ldquo;Simulate Desk Scan&rdquo; to test a live
              front-desk clock-in.
            </p>
          ) : (
            <div className="space-y-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0A1F] border border-white/8 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">Iron Den Desk Scan</p>
                    <p className="text-slate-400 font-mono text-[11px]">{item.timestamp}</p>
                  </div>
                  <span className="font-bold text-[#39FF88] tabular-nums">+{item.xpEarned} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
