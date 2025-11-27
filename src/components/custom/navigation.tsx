'use client';

import { Home, BookOpen, Heart, Trophy, Users, TrendingUp } from 'lucide-react';

type NavSection = 'dashboard' | 'diary' | 'health' | 'achievements' | 'community' | 'evolution';

interface NavigationProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as NavSection, icon: Home, label: 'Dashboard' },
    { id: 'diary' as NavSection, icon: BookOpen, label: 'Diário' },
    { id: 'evolution' as NavSection, icon: TrendingUp, label: 'Evolução' },
    { id: 'health' as NavSection, icon: Heart, label: 'Saúde' },
    { id: 'achievements' as NavSection, icon: Trophy, label: 'Conquistas' },
    { id: 'community' as NavSection, icon: Users, label: 'Comunidade' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative md:mb-8">
      <div className="bg-[#0D0D0D]/95 backdrop-blur-xl border-t md:border md:rounded-2xl border-white/10 md:border-white/5">
        <div className="flex items-center justify-around md:justify-center md:gap-4 px-4 py-3 md:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${
                  isActive ? 'scale-110' : ''
                }`} />
                <span className="text-xs md:text-sm font-inter tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
