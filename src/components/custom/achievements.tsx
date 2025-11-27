'use client';

import { Trophy, Lock, Check, Star } from 'lucide-react';
import { Achievement } from '@/lib/types';

interface AchievementsProps {
  achievements: Achievement[];
  stats: {
    daysSmokeFree: number;
    cigarettesAvoided: number;
    moneySaved: number;
  };
}

export function Achievements({ achievements, stats }: AchievementsProps) {
  const getProgress = (achievement: Achievement): number => {
    switch (achievement.type) {
      case 'days':
        return Math.min((stats.daysSmokeFree / achievement.requirement) * 100, 100);
      case 'cigarettes':
        return Math.min((stats.cigarettesAvoided / achievement.requirement) * 100, 100);
      case 'money':
        return Math.min((stats.moneySaved / achievement.requirement) * 100, 100);
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    switch (achievement.type) {
      case 'days':
        return stats.daysSmokeFree >= achievement.requirement;
      case 'cigarettes':
        return stats.cigarettesAvoided >= achievement.requirement;
      case 'money':
        return stats.moneySaved >= achievement.requirement;
      default:
        return false;
    }
  };

  const unlockedCount = achievements.filter(a => isUnlocked(a)).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-[#FF0000]/10 rounded-2xl border border-[#FF0000]/20 mb-4">
          <Trophy className="w-8 h-8 text-[#FF0000]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-geist-sans text-white font-bold">
          Conquistas
        </h2>
        <p className="text-white/60 font-inter">
          {unlockedCount} de {totalCount} conquistas desbloqueadas
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-inter text-white/80">Progresso Geral</span>
          <span className="text-lg font-geist-sans text-[#FF0000] font-bold">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const unlocked = isUnlocked(achievement);
          const progress = getProgress(achievement);

          return (
            <div
              key={achievement.id}
              className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border rounded-xl p-6 transition-all duration-300 ${
                unlocked
                  ? 'border-[#FF0000]/30 shadow-lg shadow-[#FF0000]/10'
                  : 'border-white/5 opacity-70'
              }`}
            >
              {/* Unlocked Badge */}
              {unlocked && (
                <div className="absolute top-4 right-4">
                  <div className="p-2 bg-[#FF0000]/20 border border-[#FF0000]/30 rounded-full">
                    <Check className="w-4 h-4 text-[#FF0000]" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-4 rounded-xl shrink-0 transition-all duration-300 ${
                    unlocked
                      ? 'bg-[#FF0000]/20 border border-[#FF0000]/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {unlocked ? (
                    <Trophy className="w-8 h-8 text-[#FF0000]" />
                  ) : (
                    <Lock className="w-8 h-8 text-white/30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-geist-sans text-white font-semibold mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-white/60 font-inter">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {!unlocked && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-white/40 font-inter">
                        <span>Progresso</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlocked Date */}
                  {unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 text-xs text-[#FF0000]/80 font-inter">
                      <Star className="w-3 h-3" />
                      Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {unlockedCount < totalCount && (
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20 shrink-0">
              <Trophy className="w-6 h-6 text-[#FF0000]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-geist-sans text-white font-semibold">
                Continue conquistando!
              </h3>
              <p className="text-sm text-white/60 font-inter leading-relaxed">
                Cada conquista é uma prova do seu compromisso com uma vida mais saudável.
                Continue assim e desbloqueie todas as conquistas!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
