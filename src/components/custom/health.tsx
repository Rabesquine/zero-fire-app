'use client';

import { Heart, Check, Lock } from 'lucide-react';
import { HealthMilestone } from '@/lib/types';

interface HealthProps {
  milestones: HealthMilestone[];
  daysSmokeFree: number;
}

export function Health({ milestones, daysSmokeFree }: HealthProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-[#FF0000]/10 rounded-2xl border border-[#FF0000]/20 mb-4">
          <Heart className="w-8 h-8 text-[#FF0000]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-geist-sans text-white font-bold">
          Melhorias na Saúde
        </h2>
        <p className="text-white/60 font-inter">
          Acompanhe os benefícios que seu corpo está conquistando
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const isAchieved = daysSmokeFree >= milestone.days;
          const isNext = !isAchieved && (index === 0 || milestones[index - 1].days <= daysSmokeFree);

          return (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border rounded-xl p-6 transition-all duration-300 ${
                isAchieved
                  ? 'border-[#FF0000]/30 shadow-lg shadow-[#FF0000]/10'
                  : isNext
                  ? 'border-[#FF0000]/20'
                  : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-xl shrink-0 transition-all duration-300 ${
                    isAchieved
                      ? 'bg-[#FF0000]/20 border border-[#FF0000]/30'
                      : isNext
                      ? 'bg-[#FF0000]/10 border border-[#FF0000]/20'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {isAchieved ? (
                    <Check className="w-6 h-6 text-[#FF0000]" />
                  ) : isNext ? (
                    <Heart className="w-6 h-6 text-[#FF0000]" />
                  ) : (
                    <Lock className="w-6 h-6 text-white/30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-geist-sans text-white font-semibold">
                      {milestone.title}
                    </h3>
                    {isAchieved && (
                      <span className="px-3 py-1 bg-[#FF0000]/20 border border-[#FF0000]/30 rounded-full text-xs font-inter text-[#FF0000] font-medium">
                        Conquistado
                      </span>
                    )}
                    {isNext && !isAchieved && (
                      <span className="px-3 py-1 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full text-xs font-inter text-[#FF0000]/80 font-medium">
                        Próximo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 font-inter leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Progress bar for next milestone */}
                  {isNext && !isAchieved && milestone.days > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-white/40 font-inter mb-2">
                        <span>Progresso</span>
                        <span>
                          {daysSmokeFree} / {milestone.days} dias
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] transition-all duration-500"
                          style={{
                            width: `${Math.min((daysSmokeFree / milestone.days) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20 shrink-0">
            <Heart className="w-6 h-6 text-[#FF0000]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-geist-sans text-white font-semibold">
              Seu corpo está se recuperando!
            </h3>
            <p className="text-sm text-white/60 font-inter leading-relaxed">
              Cada dia sem fumar é uma vitória para sua saúde. Continue firme nessa jornada e
              celebre cada conquista, por menor que pareça.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
