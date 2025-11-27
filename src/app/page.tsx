'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Cigarette, DollarSign, Calendar, BookOpen, Heart, Trophy, Users, Sparkles, TrendingUp, LogOut } from 'lucide-react';
import { TimerDisplay } from '@/components/custom/timer-display';
import { StatsCard } from '@/components/custom/stats-card';
import { Navigation } from '@/components/custom/navigation';
import { OnboardingModal } from '@/components/custom/onboarding-modal';
import { Diary } from '@/components/custom/diary';
import { Health } from '@/components/custom/health';
import { Achievements } from '@/components/custom/achievements';
import { Community } from '@/components/custom/community';
import { Evolution } from '@/components/custom/evolution';
import { UserProgress, Stats, DiaryEntry, CommunityPost } from '@/lib/types';
import { calculateStats, formatCurrency, formatNumber, getHealthMilestones, getAchievements } from '@/lib/utils-zerofire';
import { supabase } from '@/lib/supabase';

type NavSection = 'dashboard' | 'diary' | 'health' | 'achievements' | 'community' | 'evolution';

export default function ZeroFireApp() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<Stats>({
    daysSmokeFree: 0,
    hoursSmokeFree: 0,
    minutesSmokeFree: 0,
    secondsSmokeFree: 0,
    cigarettesAvoided: 0,
    moneySaved: 0
  });
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  // Check authentication
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Load user data from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedProgress = localStorage.getItem('zerofire_progress');
    const savedPosts = localStorage.getItem('zerofire_posts');

    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      progress.quitDate = new Date(progress.quitDate);
      setUserProgress(progress);
      
      const initialStats = calculateStats(progress);
      setStats(initialStats);
    } else {
      setShowOnboarding(true);
    }

    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      setCommunityPosts(posts.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
    }

    // Load diary entries from Supabase
    loadDiaryEntries();
  }, [isAuthenticated]);

  const loadDiaryEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diario')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;

      if (data) {
        const entries: DiaryEntry[] = data.map((entry: any) => {
          // Criar data/hora a partir dos dados salvos
          // Se temos created_at (timestamp), usar ele; senão usar a data
          const timestamp = entry.created_at || entry.data;
          return {
            id: entry.id,
            date: new Date(timestamp),
            cravingLevel: entry.nivel_vontade,
            triggers: entry.gatilhos ? entry.gatilhos.split(',').map((t: string) => t.trim()) : [],
            feelings: entry.sentimentos ? entry.sentimentos.split(',').map((f: string) => f.trim()) : [],
            notes: ''
          };
        });
        setDiaryEntries(entries);
      }
    } catch (error) {
      console.error('Erro ao carregar registros do diário:', error);
      // Fallback to localStorage
      const savedEntries = localStorage.getItem('zerofire_diary');
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        setDiaryEntries(entries.map((e: any) => ({ ...e, date: new Date(e.date) })));
      }
    }
  };

  const handleOnboardingComplete = (progress: UserProgress) => {
    setUserProgress(progress);
    localStorage.setItem('zerofire_progress', JSON.stringify(progress));
    setShowOnboarding(false);
    
    const initialStats = calculateStats(progress);
    setStats(initialStats);
  };

  const handleStatsUpdate = (newStats: Stats) => {
    setStats(newStats);
  };

  const handleDiarySave = async (entry: any) => {
    try {
      // Criar timestamp atual
      const now = new Date();
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('diario')
        .insert([
          {
            data: now.toISOString(),
            nivel_vontade: entry.cravingLevel,
            sentimentos: entry.feelings.join(', '),
            gatilhos: entry.triggers.join(', ')
          }
        ])
        .select();

      if (error) throw error;

      // Reload entries
      await loadDiaryEntries();

      // Show success message
      alert('Registro salvo com sucesso no Supabase! 🎉');
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error);
      
      // Fallback to localStorage
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date(),
        cravingLevel: entry.cravingLevel,
        triggers: entry.triggers,
        feelings: entry.feelings,
        notes: entry.notes
      };

      const updatedEntries = [newEntry, ...diaryEntries];
      setDiaryEntries(updatedEntries);
      localStorage.setItem('zerofire_diary', JSON.stringify(updatedEntries));

      alert('Registro salvo localmente! 🎉');
    }
  };

  const handleNewPost = async (content: string) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Você',
      content,
      daysSmokeFree: stats.daysSmokeFree,
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };

    const updatedPosts = [newPost, ...communityPosts];
    setCommunityPosts(updatedPosts);
    localStorage.setItem('zerofire_posts', JSON.stringify(updatedPosts));
  };

  const handleLike = (postId: string) => {
    const updatedPosts = communityPosts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setCommunityPosts(updatedPosts);
    localStorage.setItem('zerofire_posts', JSON.stringify(updatedPosts));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#FF0000]/30 border-t-[#FF0000] rounded-full animate-spin mx-auto" />
          <p className="text-white/60 font-inter">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // No user progress yet
  if (!userProgress) {
    return (
      <>
        {showOnboarding && (
          <OnboardingModal
            onComplete={handleOnboardingComplete}
            onClose={() => setShowOnboarding(false)}
          />
        )}
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#FF0000]/30 border-t-[#FF0000] rounded-full animate-spin mx-auto" />
            <p className="text-white/60 font-inter">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  const healthMilestones = getHealthMilestones().map(milestone => ({
    ...milestone,
    achieved: stats.daysSmokeFree >= milestone.days
  }));

  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d7e3f0ef-4b0a-4a4e-b637-d4e5284e80dd.png"
                  alt="ZERO FIRE Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-geist-sans text-white tracking-tight">
                  ZERO FIRE
                </h1>
                <p className="text-xs md:text-sm text-white/40 font-inter">
                  Sua jornada livre do cigarro
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-full">
                <Sparkles className="w-4 h-4 text-[#FF0000]" />
                <span className="text-sm font-inter text-[#FF0000] font-medium">
                  Nível {Math.floor(stats.daysSmokeFree / 7) + 1}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-white/40 group-hover:text-[#FF0000] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {activeSection === 'dashboard' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
            {/* Timer Central */}
            <div className="mt-8">
              <TimerDisplay stats={stats} onUpdate={handleStatsUpdate} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <StatsCard
                icon={Calendar}
                label="DIAS SEM FUMAR"
                value={stats.daysSmokeFree}
                subtitle="Continue firme!"
                trend="up"
              />
              <StatsCard
                icon={Cigarette}
                label="CIGARROS EVITADOS"
                value={formatNumber(stats.cigarettesAvoided)}
                subtitle={`${formatNumber(Math.floor(stats.cigarettesAvoided / userProgress.cigarettesPerPack))} maços`}
                trend="up"
              />
              <StatsCard
                icon={DollarSign}
                label="DINHEIRO ECONOMIZADO"
                value={formatCurrency(stats.moneySaved)}
                subtitle="Investido em você"
                trend="up"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <QuickActionCard
                icon={BookOpen}
                label="Registrar Compulsão"
                onClick={() => setActiveSection('diary')}
              />
              <QuickActionCard
                icon={TrendingUp}
                label="Ver Evolução"
                onClick={() => setActiveSection('evolution')}
              />
              <QuickActionCard
                icon={Heart}
                label="Ver Melhorias"
                onClick={() => setActiveSection('health')}
              />
              <QuickActionCard
                icon={Trophy}
                label="Conquistas"
                onClick={() => setActiveSection('achievements')}
              />
              <QuickActionCard
                icon={Users}
                label="Comunidade"
                onClick={() => setActiveSection('community')}
              />
            </div>

            {/* Motivational Quote */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-transparent blur-2xl" />
              <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20 shrink-0">
                    <Sparkles className="w-6 h-6 text-[#FF0000]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-geist-sans text-white font-semibold">
                      Você está incrível!
                    </h3>
                    <p className="text-sm md:text-base text-white/60 font-inter leading-relaxed">
                      Cada segundo sem fumar é uma vitória. Seu corpo já está se recuperando e você está mais forte do que imagina.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'diary' && (
          <Diary onSave={handleDiarySave} entries={diaryEntries} />
        )}

        {activeSection === 'evolution' && (
          <Evolution diaryEntries={diaryEntries} daysSmokeFree={stats.daysSmokeFree} />
        )}

        {activeSection === 'health' && (
          <Health milestones={healthMilestones} daysSmokeFree={stats.daysSmokeFree} />
        )}

        {activeSection === 'achievements' && (
          <Achievements
            achievements={achievements}
            stats={{
              daysSmokeFree: stats.daysSmokeFree,
              cigarettesAvoided: stats.cigarettesAvoided,
              moneySaved: stats.moneySaved
            }}
          />
        )}

        {activeSection === 'community' && (
          <Community
            posts={communityPosts}
            currentUserDays={stats.daysSmokeFree}
            onNewPost={handleNewPost}
            onLike={handleLike}
          />
        )}
      </main>
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-4 md:p-6 transition-all duration-300 hover:border-[#FF0000]/30 hover:shadow-lg hover:shadow-[#FF0000]/10 hover:scale-105"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="p-3 bg-[#FF0000]/10 rounded-lg border border-[#FF0000]/20 group-hover:bg-[#FF0000]/20 transition-colors">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#FF0000]" />
        </div>
        <span className="text-xs md:text-sm font-inter text-white/70 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
    </button>
  );
}
