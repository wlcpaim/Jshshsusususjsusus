import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Users, CheckCircle, Database, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminMaster() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    checkMasterAuth();
  }, []);

  async function checkMasterAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      const { data: role } = await supabase.rpc('generated_app_role');
      if (role === 'admin') {
        setAuthorized(true);
        // Mock tenant listing for multi-tenant SaaS master view
        setTenants([
          { id: '1', name: 'BarberPulse Matriz', plan: 'Enterprise', status: 'Ativo', clientsCount: 142 },
          { id: '2', name: 'BarberPulse Filial Sul', plan: 'Pro', status: 'Ativo', clientsCount: 89 }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="card-surface p-6 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Área Master Restrita</h2>
          <p className="text-zinc-400 mb-6">Você não possui permissão master para acessar esta página.</p>
          <Link to="/admin" className="btn-primary">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-200 border border-zinc-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-500" /> Painel Master SaaS
              </h1>
              <p className="text-zinc-400 text-sm">Gestão global de tenants e assinaturas do BarberPulse</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface p-6">
            <span className="text-zinc-400 text-sm font-medium">Total Tenants</span>
            <div className="text-3xl font-bold text-zinc-100 mt-2">2 Ativos</div>
          </div>
          <div className="card-surface p-6">
            <span className="text-zinc-400 text-sm font-medium">Plano Dominante</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">Enterprise</div>
          </div>
          <div className="card-surface p-6">
            <span className="text-zinc-400 text-sm font-medium">Status do Cluster</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" /> 100% Online
            </div>
          </div>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" /> Instâncias Tenant
            </h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs uppercase">
                <th className="p-4">Nome da Barbearia</th>
                <th className="p-4">Plano</th>
                <th className="p-4">Status</th>
                <th className="p-4">Clientes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-900/30">
                  <td className="p-4 font-medium text-zinc-200">{t.name}</td>
                  <td className="p-4 text-emerald-400 font-medium">{t.plan}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300">{t.clientsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
