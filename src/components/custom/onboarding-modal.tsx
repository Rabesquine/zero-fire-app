'use client';

import { useState } from 'react';
import { X, Calendar, Cigarette, DollarSign } from 'lucide-react';
import { UserProgress } from '@/lib/types';

interface OnboardingModalProps {
  onComplete: (progress: UserProgress) => void;
  onClose: () => void;
}

export function OnboardingModal({ onComplete, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [quitDate, setQuitDate] = useState('');
  const [cigarettesPerDay, setCigarettesPerDay] = useState('20');
  const [pricePerPack, setPricePerPack] = useState('12');
  const [cigarettesPerPack, setCigarettesPerPack] = useState('20');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const progress: UserProgress = {
      quitDate: new Date(quitDate),
      cigarettesPerDay: parseInt(cigarettesPerDay),
      pricePerPack: parseFloat(pricePerPack),
      cigarettesPerPack: parseInt(cigarettesPerPack)
    };
    
    onComplete(progress);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#FF0000]/20 rounded-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-geist-sans text-white font-bold">
              Bem-vindo ao ZERO FIRE
            </h2>
            <p className="text-white/60 font-inter text-sm">
              Vamos configurar sua jornada livre do cigarro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data que parou */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-inter text-white/80">
                <Calendar className="w-4 h-4 text-[#FF0000]" />
                Quando você parou de fumar?
              </label>
              <input
                type="date"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter focus:outline-none focus:border-[#FF0000]/50 transition-colors"
              />
            </div>

            {/* Cigarros por dia */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-inter text-white/80">
                <Cigarette className="w-4 h-4 text-[#FF0000]" />
                Quantos cigarros fumava por dia?
              </label>
              <input
                type="number"
                value={cigarettesPerDay}
                onChange={(e) => setCigarettesPerDay(e.target.value)}
                min="1"
                required
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter focus:outline-none focus:border-[#FF0000]/50 transition-colors"
              />
            </div>

            {/* Preço do maço */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-inter text-white/80">
                <DollarSign className="w-4 h-4 text-[#FF0000]" />
                Preço do maço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={pricePerPack}
                onChange={(e) => setPricePerPack(e.target.value)}
                min="0"
                required
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter focus:outline-none focus:border-[#FF0000]/50 transition-colors"
              />
            </div>

            {/* Cigarros por maço */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-inter text-white/80">
                <Cigarette className="w-4 h-4 text-[#FF0000]" />
                Cigarros por maço
              </label>
              <input
                type="number"
                value={cigarettesPerPack}
                onChange={(e) => setCigarettesPerPack(e.target.value)}
                min="1"
                required
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter focus:outline-none focus:border-[#FF0000]/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-inter font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF0000]/30 transition-all duration-300"
            >
              Começar Jornada
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
