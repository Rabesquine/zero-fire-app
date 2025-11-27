'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Award, Zap, Target, Brain, Shield, Star, Flame, ChevronRight } from 'lucide-react';
import { DiaryEntry } from '@/lib/types';

interface EvolutionProps {
  diaryEntries: DiaryEntry[];
  daysSmokeFree: number;
}

interface EvolutionMetrics {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  streak: number;
  cravingTrend: 'improving' | 'stable' | 'attention';
  averageCraving: number;
  strongestDay: string;
  badges: Badge[];
  skills: Skill[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  icon: any;
  description: string;
  color: string;
}

export function Evolution({ diaryEntries, daysSmokeFree }: EvolutionProps) {
  const [metrics, setMetrics] = useState<EvolutionMetrics | null>(null);

  useEffect(() => {
    calculateMetrics();
  }, [diaryEntries, daysSmokeFree]);

  const calculateMetrics = () => {
    // XP System: 10 XP por dia sem fumar + 5 XP por registro no diário
    const baseXP = daysSmokeFree * 10;
    const diaryXP = diaryEntries.length * 5;
    const totalXP = baseXP + diaryXP;

    // Level System: 100 XP por nível
    const level = Math.floor(totalXP / 100) + 1;
    const xp = totalXP % 100;
    const xpToNextLevel = 100;

    // Calcular tendência de compulsão
    const recentEntries = diaryEntries.slice(0, 7); // últimos 7 registros
    const averageCraving = recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.cravingLevel, 0) / recentEntries.length
      : 0;

    let cravingTrend: 'improving' | 'stable' | 'attention' = 'stable';
    if (recentEntries.length >= 3) {
      const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
      const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, e) => sum + e.cravingLevel, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, e) => sum + e.cravingLevel, 0) / secondHalf.length;

      if (secondAvg < firstAvg - 1) cravingTrend = 'improving';
      else if (secondAvg > firstAvg + 1) cravingTrend = 'attention';
    }

    // Encontrar dia mais forte (menor compulsão)
    const strongestEntry = diaryEntries.length > 0
      ? diaryEntries.reduce((min, entry) => entry.cravingLevel < min.cravingLevel ? entry : min)
      : null;
    const strongestDay = strongestEntry
      ? strongestEntry.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : 'N/A';

    // Streak de registros consecutivos
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < diaryEntries.length; i++) {
      const entryDate = new Date(diaryEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === i) streak++;
      else break;
    }

    // Badges
    const badges: Badge[] = [
      {
        id: 'first-entry',
        name: 'Primeiro Passo',
        description: 'Registrou sua primeira compulsão',
        icon: Star,
        unlocked: diaryEntries.length >= 1,
        rarity: 'common'
      },
      {
        id: 'week-warrior',
        name: 'Guerreiro Semanal',
        description: '7 dias sem fumar',
        icon: Shield,
        unlocked: daysSmokeFree >= 7,
        rarity: 'rare'
      },
      {
        id: 'diary-master',
        name: 'Mestre do Diário',
        description: '10 registros no diário',
        icon: Brain,
        unlocked: diaryEntries.length >= 10,
        rarity: 'rare'
      },
      {
        id: 'month-champion',
        name: 'Campeão do Mês',
        description: '30 dias sem fumar',
        icon: Award,
        unlocked: daysSmokeFree >= 30,
        rarity: 'epic'
      },
      {
        id: 'craving-crusher',
        name: 'Destruidor de Compulsões',
        description: 'Média de compulsão abaixo de 3',
        icon: Flame,
        unlocked: averageCraving > 0 && averageCraving < 3,
        rarity: 'epic'
      },
      {
        id: 'legendary-hero',
        name: 'Herói Lendário',
        description: '100 dias sem fumar',
        icon: Zap,
        unlocked: daysSmokeFree >= 100,
        rarity: 'legendary'
      }
    ];

    // Skills (baseadas nos dados do diário)
    const skills: Skill[] = [
      {
        name: 'Autocontrole',
        level: Math.min(10, Math.floor(daysSmokeFree / 3)),
        maxLevel: 10,
        icon: Shield,
        description: 'Sua capacidade de resistir às compulsões',
        color: '#3B82F6'
      },
      {
        name: 'Autoconhecimento',
        level: Math.min(10, Math.floor(diaryEntries.length / 2)),
        maxLevel: 10,
        icon: Brain,
        description: 'Entendimento dos seus gatilhos e padrões',
        color: '#8B5CF6'
      },
      {
        name: 'Resiliência',
        level: Math.min(10, Math.floor(streak / 2) + Math.floor(daysSmokeFree / 10)),
        maxLevel: 10,
        icon: Flame,
        description: 'Força para continuar mesmo nos dias difíceis',
        color: '#EF4444'
      },
      {
        name: 'Disciplina',
        level: Math.min(10, Math.floor((daysSmokeFree + diaryEntries.length) / 5)),
        maxLevel: 10,
        icon: Target,
        description: 'Consistência na sua jornada',
        color: '#10B981'
      }
    ];

    setMetrics({
      level,
      xp,
      xpToNextLevel,
      totalXP,
      streak,
      cravingTrend,
      averageCraving,
      strongestDay,
      badges,
      skills
    });
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#FF0000]/30 border-t-[#FF0000] rounded-full animate-spin" />
      </div>
    );
  }

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const trendConfig = {
    improving: {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'Melhorando! 📈'
    },
    stable: {
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'Estável 📊'
    },
    attention: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'Atenção ⚠️'
    }
  };

  const trend = trendConfig[metrics.cravingTrend];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-[#FF0000]/10 rounded-2xl border border-[#FF0000]/20 mb-4">
          <TrendingUp className="w-8 h-8 text-[#FF0000]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-geist-sans text-white font-bold">
          Sua Evolução
        </h2>
        <p className="text-white/60 font-inter">
          Acompanhe seu progresso gamificado e conquiste novas habilidades
        </p>
      </div>

      {/* Level & XP Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-transparent blur-2xl" />
        <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                  <Zap className="w-6 h-6 text-[#FF0000]" />
                </div>
                <div>
                  <p className="text-sm text-white/60 font-inter">Nível Atual</p>
                  <p className="text-3xl font-geist-sans text-white font-bold">
                    {metrics.level}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60 font-inter">XP Total</p>
              <p className="text-2xl font-geist-sans text-[#FF0000] font-bold">
                {metrics.totalXP}
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-inter">
              <span className="text-white/60">Progresso para Nível {metrics.level + 1}</span>
              <span className="text-white font-medium">
                {metrics.xp} / {metrics.xpToNextLevel} XP
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF6B6B] transition-all duration-500 rounded-full"
                style={{ width: `${(metrics.xp / metrics.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-sm text-white/60 font-inter">Sequência</p>
          </div>
          <p className="text-3xl font-geist-sans text-white font-bold mb-1">
            {metrics.streak} dias
          </p>
          <p className="text-xs text-white/40 font-inter">
            Registros consecutivos
          </p>
        </div>

        {/* Average Craving */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-white/60 font-inter">Compulsão Média</p>
          </div>
          <p className="text-3xl font-geist-sans text-white font-bold mb-1">
            {metrics.averageCraving > 0 ? metrics.averageCraving.toFixed(1) : 'N/A'}/10
          </p>
          <div className={`inline-flex items-center gap-1 px-2 py-1 ${trend.bg} ${trend.border} border rounded-full`}>
            <p className={`text-xs font-inter font-medium ${trend.color}`}>
              {trend.text}
            </p>
          </div>
        </div>

        {/* Strongest Day */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-white/60 font-inter">Dia Mais Forte</p>
          </div>
          <p className="text-3xl font-geist-sans text-white font-bold mb-1">
            {metrics.strongestDay}
          </p>
          <p className="text-xs text-white/40 font-inter">
            Menor compulsão registrada
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-geist-sans text-white font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-[#FF0000]" />
          Habilidades Desenvolvidas
        </h3>

        <div className="space-y-4">
          {metrics.skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${skill.color}20` }}>
                    <skill.icon className="w-4 h-4" style={{ color: skill.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-inter text-white font-medium">{skill.name}</p>
                    <p className="text-xs text-white/40 font-inter">{skill.description}</p>
                  </div>
                </div>
                <span className="text-sm font-geist-sans text-white/60">
                  Nv. {skill.level}/{skill.maxLevel}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${(skill.level / skill.maxLevel) * 100}%`,
                    backgroundColor: skill.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-geist-sans text-white font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FF0000]" />
          Conquistas Desbloqueadas
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative group ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-white/10'
                  : 'bg-[#0D0D0D] border-white/5 opacity-40'
              } border rounded-xl p-4 transition-all duration-300 hover:scale-105`}
            >
              {badge.unlocked && (
                <div className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br ${rarityColors[badge.rarity]} rounded-full flex items-center justify-center`}>
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-xl ${
                  badge.unlocked
                    ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
                    : 'bg-white/5'
                }`}>
                  <badge.icon className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-white/30'}`} />
                </div>
                <div>
                  <p className={`text-sm font-inter font-medium ${
                    badge.unlocked ? 'text-white' : 'text-white/30'
                  }`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-white/40 font-inter mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20 shrink-0">
            <Zap className="w-6 h-6 text-[#FF0000]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-geist-sans text-white font-semibold">
              Como Ganhar Mais XP
            </h3>
            <ul className="space-y-2 text-sm text-white/60 font-inter">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#FF0000]" />
                <span>+10 XP por cada dia sem fumar</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#FF0000]" />
                <span>+5 XP por cada registro no diário</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#FF0000]" />
                <span>Mantenha uma sequência de registros para aumentar Resiliência</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#FF0000]" />
                <span>Reduza sua compulsão média para desbloquear conquistas épicas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
