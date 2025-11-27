'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
}

export function StatsCard({ icon: Icon, label, value, subtitle, trend }: StatsCardProps) {
  return (
    <div className="group relative">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-[#FF0000] opacity-0 group-hover:opacity-10 blur-xl rounded-2xl transition-opacity duration-500" />
      
      <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#FF0000]/30 hover:shadow-xl hover:shadow-[#FF0000]/10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
            <Icon className="w-6 h-6 text-[#FF0000]" />
          </div>
          
          {trend && (
            <div className={`text-xs font-inter px-2 py-1 rounded-full ${
              trend === 'up' 
                ? 'bg-[#FF0000]/10 text-[#FF0000]' 
                : 'bg-white/5 text-white/40'
            }`}>
              {trend === 'up' ? '↑' : '↓'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-inter text-white/50 tracking-wide">
            {label}
          </p>
          <p className="text-3xl md:text-4xl font-bold font-geist-sans text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs font-inter text-white/30">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
