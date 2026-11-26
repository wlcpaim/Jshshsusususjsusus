import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Shield, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        // Tenta reivindicar o primeiro admin via RPC
        try {
          await supabase.rpc('claim_generated_app_admin');
        } catch (claimErr) {
          console.warn('Claim admin avisou:', claimErr);
        }

        navigate('/admin');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        try {
          await supabase.rpc('claim_generated_app_admin');
        } catch (claimErr) {
          console.warn('Claim admin avisou:', claimErr);
        }

        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a Home
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? 'Criar Conta de Administrador' : 'Painel Administrativo'}
          </h1>
          <p className="text-sm text-zinc-400">
            {isSignUp ? 'Cadastre o primeiro admin da barbearia' : 'Entre com suas credenciais para gerenciar o negócio'}
          </p>
        </div>

        <div className="card-surface p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">E-mail</label>
              <input
                type="email"
                required
                placeholder="admin@barberpulse.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Senha</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Cadastrar e Entrar' : 'Entrar no Painel')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-emerald-400 hover:underline"
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Primeiro acesso? Cadastre-se aqui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}