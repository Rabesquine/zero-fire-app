'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, Loader2, Cigarette, KeyRound } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    confirmationCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          router.push('/');
          router.refresh();
        }
      } else {
        // Validar confirmação de senha
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }

        // Primeiro, criar o usuário com signUp (sem enviar email)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.nome
            },
            emailRedirectTo: undefined
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Criar perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: signUpData.user.id,
                email: formData.email,
                nome: formData.nome
              }
            ]);

          if (profileError) console.error('Erro ao criar perfil:', profileError);

          // Agora enviar o código OTP por email
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: formData.email,
            options: {
              shouldCreateUser: false // Usuário já foi criado
            }
          });

          if (otpError) throw otpError;

          // Mostrar tela de confirmação de código
          setUserEmail(formData.email);
          setNeedsConfirmation(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar código OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: formData.confirmationCode,
        type: 'email'
      });

      if (error) throw error;

      if (data.user) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  // Tela de confirmação de código
  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo e Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d7e3f0ef-4b0a-4a4e-b637-d4e5284e80dd.png"
                  alt="ZERO FIRE Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold font-geist-sans text-white tracking-tight">
                ZERO FIRE
              </h1>
            </div>
            <p className="text-white/60 font-inter">
              Confirme seu cadastro
            </p>
          </div>

          {/* Card de Confirmação */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF0000]/10 rounded-full mb-4">
                <Mail className="w-8 h-8 text-[#FF0000]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 font-geist-sans">
                Verifique seu e-mail
              </h2>
              <p className="text-sm text-white/60 font-inter">
                Enviamos um código de confirmação para<br />
                <span className="text-white font-semibold">{userEmail}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmCode} className="space-y-5">
              {/* Código de Confirmação */}
              <div className="space-y-2">
                <label className="text-sm font-inter text-white/80 font-medium">
                  Código de Confirmação
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.confirmationCode}
                    onChange={(e) => setFormData({ ...formData, confirmationCode: e.target.value })}
                    placeholder="000000"
                    required
                    maxLength={6}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white font-inter text-center text-2xl tracking-widest placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-white/40 font-inter text-center">
                  Digite o código de 6 dígitos
                </p>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-400 font-inter">{error}</p>
                </div>
              )}

              {/* Botão de confirmar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-inter font-semibold py-3.5 rounded-lg hover:shadow-lg hover:shadow-[#FF0000]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Cigarette className="w-5 h-5" />
                    Confirmar Cadastro
                  </>
                )}
              </button>
            </form>

            {/* Voltar */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setNeedsConfirmation(false);
                  setError('');
                  setFormData({ ...formData, confirmationCode: '' });
                }}
                className="text-sm text-white/60 hover:text-[#FF0000] font-inter transition-colors"
              >
                Voltar para o cadastro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12">
              <Image
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d7e3f0ef-4b0a-4a4e-b637-d4e5284e80dd.png"
                alt="ZERO FIRE Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold font-geist-sans text-white tracking-tight">
              ZERO FIRE
            </h1>
          </div>
          <p className="text-white/60 font-inter">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta e comece sua jornada'}
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome (apenas no cadastro) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-inter text-white/80 font-medium">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    required={!isLogin}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-inter text-white/80 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-sm font-inter text-white/80 font-medium">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors"
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-white/40 font-inter">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {/* Confirmar Senha (apenas no cadastro) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-inter text-white/80 font-medium">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required={!isLogin}
                    minLength={6}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white font-inter placeholder:text-white/30 focus:outline-none focus:border-[#FF0000]/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400 font-inter">{error}</p>
              </div>
            )}

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-inter font-semibold py-3.5 rounded-lg hover:shadow-lg hover:shadow-[#FF0000]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Cigarette className="w-5 h-5" />
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </button>
          </form>

          {/* Toggle entre Login e Cadastro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-white/60 hover:text-[#FF0000] font-inter transition-colors"
            >
              {isLogin ? (
                <>
                  Não tem uma conta?{' '}
                  <span className="text-[#FF0000] font-semibold">Cadastre-se</span>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <span className="text-[#FF0000] font-semibold">Entrar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mensagem motivacional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/40 font-inter">
            Sua jornada para uma vida livre do cigarro começa aqui 🚭
          </p>
        </div>
      </div>
    </div>
  );
}
