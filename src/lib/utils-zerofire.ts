// Utilities para cálculos do ZERO FIRE
import { UserProgress, Stats, HealthMilestone, Achievement } from './types';

export function calculateStats(progress: UserProgress): Stats {
  const now = new Date();
  const quitDate = new Date(progress.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  const cigarettesAvoided = Math.floor((diffMs / (1000 * 60 * 60 * 24)) * progress.cigarettesPerDay);
  const packsAvoided = cigarettesAvoided / progress.cigarettesPerPack;
  const moneySaved = packsAvoided * progress.pricePerPack;
  
  return {
    daysSmokeFree: days,
    hoursSmokeFree: hours,
    minutesSmokeFree: minutes,
    secondsSmokeFree: seconds,
    cigarettesAvoided,
    moneySaved
  };
}

export function getHealthMilestones(): HealthMilestone[] {
  return [
    {
      days: 0,
      title: '20 minutos',
      description: 'Frequência cardíaca e pressão arterial começam a normalizar',
      icon: 'heart',
      achieved: true
    },
    {
      days: 1,
      title: '24 horas',
      description: 'Risco de ataque cardíaco começa a diminuir',
      icon: 'activity',
      achieved: true
    },
    {
      days: 2,
      title: '48 horas',
      description: 'Terminações nervosas começam a se regenerar, olfato e paladar melhoram',
      icon: 'sparkles',
      achieved: false
    },
    {
      days: 3,
      title: '72 horas',
      description: 'Respiração fica mais fácil, energia aumenta',
      icon: 'wind',
      achieved: false
    },
    {
      days: 7,
      title: '1 semana',
      description: 'Primeira semana completa! Você está no caminho certo',
      icon: 'trophy',
      achieved: false
    },
    {
      days: 30,
      title: '1 mês',
      description: 'Função pulmonar melhora significativamente',
      icon: 'zap',
      achieved: false
    },
    {
      days: 90,
      title: '3 meses',
      description: 'Circulação sanguínea melhora drasticamente',
      icon: 'target',
      achieved: false
    },
    {
      days: 365,
      title: '1 ano',
      description: 'Risco de doença cardíaca reduz pela metade',
      icon: 'award',
      achieved: false
    }
  ];
}

export function getAchievements(): Achievement[] {
  return [
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Parou de fumar!',
      icon: 'flag',
      unlocked: true,
      requirement: 0,
      type: 'days'
    },
    {
      id: '2',
      title: 'Guerreiro',
      description: 'Complete 7 dias sem fumar',
      icon: 'shield',
      unlocked: false,
      requirement: 7,
      type: 'days'
    },
    {
      id: '3',
      title: 'Campeão',
      description: 'Complete 30 dias sem fumar',
      icon: 'trophy',
      unlocked: false,
      requirement: 30,
      type: 'days'
    },
    {
      id: '4',
      title: 'Lenda',
      description: 'Complete 100 dias sem fumar',
      icon: 'crown',
      unlocked: false,
      requirement: 100,
      type: 'days'
    },
    {
      id: '5',
      title: 'Economista',
      description: 'Economize R$ 500',
      icon: 'dollar-sign',
      unlocked: false,
      requirement: 500,
      type: 'money'
    },
    {
      id: '6',
      title: 'Pulmões Limpos',
      description: 'Evite 1000 cigarros',
      icon: 'heart-pulse',
      unlocked: false,
      requirement: 1000,
      type: 'cigarettes'
    }
  ];
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
