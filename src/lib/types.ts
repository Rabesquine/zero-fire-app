// Types para o app ZERO FIRE

export interface UserProgress {
  quitDate: Date;
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
}

export interface Stats {
  daysSmokeFree: number;
  hoursSmokeFree: number;
  minutesSmokeFree: number;
  secondsSmokeFree: number;
  cigarettesAvoided: number;
  moneySaved: number;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  cravingLevel: number; // 1-10
  triggers: string[];
  feelings: string[];
  notes: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: number;
  type: 'days' | 'cigarettes' | 'money';
}

export interface HealthMilestone {
  days: number;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  daysSmokeFree: number;
  likes: number;
  comments: number;
  createdAt: Date;
}
