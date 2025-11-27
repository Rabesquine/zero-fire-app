'use client';

import { useState } from 'react';
import { BookOpen, Plus, TrendingDown, TrendingUp, Minus, AlertCircle, Calendar, Clock } from 'lucide-react';

interface DiaryEntryForm {
  cravingLevel: number;
  triggers: string[];
  feelings: string[];
  notes: string;
}

export interface DiaryEntryData {
  id: string;
  date: Date;
  cravingLevel: number;
  triggers: string[];
  feelings: string[];
  notes: string;
}

const commonTriggers = [
  'Café', 'Álcool', 'Estresse', 'Ansiedade', 'Tédio', 
  'Após refeição', 'Trabalho', 'Social', 'Manhã', 'Noite'
];

const commonFeelings = [
  'Ansioso', 'Calmo', 'Irritado', 'Feliz', 'Triste',
  'Confiante', 'Inseguro', 'Motivado', 'Cansado', 'Energizado'
];

interface DiaryProps {
  onSave: (entry: DiaryEntryForm) => void;
  entries?: DiaryEntryData[];
}

export function Diary({ onSave, entries = [] }: DiaryProps) {
  const [cravingLevel, setCravingLevel] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev =>
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const entry: DiaryEntryForm = {
      cravingLevel,
      triggers: selectedTriggers,
      feelings: selectedFeelings,
      notes
    };

    await onSave(entry);

    // Reset form
    setCravingLevel(5);
    setSelectedTriggers([]);
    setSelectedFeelings([]);
    setNotes('');
    setIsSaving(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCravingColor = (level: number) => {
    if (level <= 3) return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (level <= 6) return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    return 'text-[#FF0000] border-[#FF0000]/20 bg-[#FF0000]/10';
  };

  const getCravingLabel = (level: number) => {
    if (level <= 3) return 'Baixa';
    if (level <= 6) return 'Média';
    return 'Alta';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-[#FF0000]/10 rounded-2xl border border-[#FF0000]/20 mb-4">
          <BookOpen className="w-8 h-8 text-[#FF0000]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-geist-sans text-white font-bold">
          Diário Interativo
        </h2>
        <p className="text-white/60 font-inter">
          Registre suas compulsões e sentimentos para entender seus gatilhos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nível de Compulsão */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-inter text-white/80 font-medium">
              Nível de Vontade de Fumar
            </label>
            <span className="text-2xl font-geist-sans text-[#FF0000] font-bold">
              {cravingLevel}/10
            </span>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={cravingLevel}
              onChange={(e) => setCravingLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF0000]"
            />
            
            <div className="flex justify-between text-xs text-white/40 font-inter">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Baixa
              </span>
              <span className="flex items-center gap-1">
                <Minus className="w-3 h-3" />
                Média
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Alta
              </span>
            </div>
          </div>

          {cravingLevel >= 8 && (
            <div className="flex items-start gap-3 p-4 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#FF0000] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-inter text-white font-medium">
                  Compulsão forte detectada
                </p>
                <p className="text-xs text-white/60 font-inter">
                  Respire fundo, beba água e lembre-se do seu progresso. Essa vontade vai passar!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Gatilhos */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-4">
          <label className="text-sm font-inter text-white/80 font-medium">
            Gatilhos Identificados
          </label>
          <div className="flex flex-wrap gap-2">
            {commonTriggers.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleTrigger(trigger)}
                className={`px-4 py-2 rounded-lg text-sm font-inter transition-all duration-200 ${
                  selectedTriggers.includes(trigger)
                    ? 'bg-[#FF0000] text-white border border-[#FF0000]'
                    : 'bg-[#0D0D0D] text-white/60 border border-white/10 hover:border-[#FF0000]/30'
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        {/* Sentimentos */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-4">
          <label className="text-sm font-inter text-white/80 font-medium">
            Como você está se sentindo?
          </label>
          <div className="flex flex-wrap gap-2">
            {commonFeelings.map((feeling) => (
              <button
                key={feeling}
                type="button"
                onClick={() => toggleFeeling(feeling)}
                className={`px-4 py-2 rounded-lg text-sm font-inter transition-all duration-200 ${
                  selectedFeelings.includes(feeling)
                    ? 'bg-[#FF0000] text-white border border-[#FF0000]'
                    : 'bg-[#0D0D0D] text-white/60 border border-white/10 hover:border-[#FF0000]/30'
                }`}
              >
                {feeling}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-4">
          <label className="text-sm font-inter text-white/80 font-medium">
            Notas Adicionais (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva o que aconteceu, como você lidou com a situação..."
            rows={4}
            className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-inter font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-[#FF0000]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Registrar no Diário
            </>
          )}
        </button>
      </form>

      {/* Histórico de Registros */}
      {entries.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-lg font-geist-sans text-white font-semibold">
              Histórico de Registros
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300"
              >
                {/* Header do registro */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FF0000]/10 rounded-lg border border-[#FF0000]/20">
                      <Calendar className="w-4 h-4 text-[#FF0000]" />
                    </div>
                    <div>
                      <p className="text-sm font-inter text-white font-medium">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-white/40 font-inter flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.date)}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-inter font-medium ${getCravingColor(entry.cravingLevel)}`}>
                    {getCravingLabel(entry.cravingLevel)} ({entry.cravingLevel}/10)
                  </div>
                </div>

                {/* Gatilhos */}
                {entry.triggers.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-white/40 font-inter mb-2">Gatilhos:</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.triggers.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#0D0D0D] border border-white/10 rounded-md text-xs text-white/70 font-inter"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentimentos */}
                {entry.feelings.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 font-inter mb-2">Sentimentos:</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.feelings.map((feeling, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#0D0D0D] border border-white/10 rounded-md text-xs text-white/70 font-inter"
                        >
                          {feeling}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notas (se houver) */}
                {entry.notes && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-white/40 font-inter mb-1">Notas:</p>
                    <p className="text-sm text-white/70 font-inter leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                <BookOpen className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/40 font-inter">
                Nenhum registro ainda. Comece registrando sua primeira compulsão!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
