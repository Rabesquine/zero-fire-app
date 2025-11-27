'use client';

import { useEffect, useState } from 'react';
import { Stats } from '@/lib/types';

interface TimerDisplayProps {
  stats: Stats;
  onUpdate: (stats: Stats) => void;
}

export function TimerDisplay({ stats, onUpdate }: TimerDisplayProps) {
  const [currentStats, setCurrentStats] = useState(stats);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(prev => {
        const newStats = { ...prev };
        newStats.secondsSmokeFree += 1;
        
        if (newStats.secondsSmokeFree >= 60) {
          newStats.secondsSmokeFree = 0;
          newStats.minutesSmokeFree += 1;
        }
        
        if (newStats.minutesSmokeFree >= 60) {
          newStats.minutesSmokeFree = 0;
          newStats.hoursSmokeFree += 1;
        }
        
        if (newStats.hoursSmokeFree >= 24) {
          newStats.hoursSmokeFree = 0;
          newStats.daysSmokeFree += 1;
        }
        
        onUpdate(newStats);
        return newStats;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onUpdate]);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[#FF0000] opacity-20 blur-3xl rounded-full" />
      
      <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/30 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center space-y-6">
          <h2 className="text-xl md:text-2xl font-inter text-white/60 tracking-wide">
            TEMPO SEM FUMAR
          </h2>
          
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            <TimeUnit value={currentStats.daysSmokeFree} label="DIAS" />
            <TimeUnit value={currentStats.hoursSmokeFree} label="HORAS" />
            <TimeUnit value={currentStats.minutesSmokeFree} label="MIN" />
            <TimeUnit value={currentStats.secondsSmokeFree} label="SEG" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-3 md:p-4 w-full min-h-[80px] md:min-h-[100px] flex items-center justify-center transition-all duration-300 hover:border-[#FF0000]/50 hover:shadow-lg hover:shadow-[#FF0000]/20">
        <span className="text-3xl md:text-5xl lg:text-6xl font-bold font-geist-sans text-[#FF0000] tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm font-inter text-white/40 tracking-widest">
        {label}
      </span>
    </div>
  );
}
