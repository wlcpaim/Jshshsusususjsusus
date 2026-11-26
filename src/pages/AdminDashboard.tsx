import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Scissors,
  Users,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  LogOut,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Settings
} from 'lucide-react';
import {
  getAppointments,
  getBarbers,
  getClients,
  getFinancialMetrics,
  getServices,
  saveService,
  saveBarber,
  saveFinancialRecord
} from '../services/barber';
import { Appointment, Barbeiro, Client, Service, FinancialRecord } from '../types';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'barbers' | 'clients' | 'financial'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barbeiro[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState({ revenue: 0, expense: 0, profit: 0 });

  // Modals / forms states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: 0, duration_minutes: 30 });

  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [barberForm, setBarberForm] = useState({ name: '', specialization: '', avatar_url: '' });

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [financeForm, setFinanceForm] = useState({ type: 'revenue' as 'revenue' | 'expense', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  async function checkAuthAndLoadData() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      // Verificar role admin
      try {
        const { data: roleData } = await supabase.rpc('generated_app_role');
        if (roleData !== 'admin') {
          setError('Acesso negado: Requer privilégios de administrador.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Erro ao checar role:', err);
      }

      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do painel');
    } finally {
      setLoading(false);
    }
  }

  async function loadData() {
    const [apptsData, srvsData, brbsData, clntsData, finData] = await Promise.all([
      getAppointments(),
      getServices(),
      getBarbers(),
      getClients(),
      getFinancialMetrics()
    ]);
    setAppointments(apptsData);
    setServices(srvsData);
    setBarbers(brbsData);
    setClients(clntsData);
    setFinancialMetrics(finData);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    await saveService(serviceForm);
    setIsServiceModalOpen(false);
    setServiceForm({ name: '', description: '', price: 0, duration_minutes: 30 });
    await loadData();
  }

  async function handleCreateBarber(e: React.FormEvent) {
    e.preventDefault();
    await saveBarber({
      name: barberForm.name,
      specialization: barberForm.specialization,
      avatar_url: barberForm.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    setIsBarberModalOpen(false);
    setBarberForm({ name: '', specialization: '', avatar_url: '' });
    await loadData();
  }

  async function handleCreateFinance(e: React.FormEvent) {
    e.preventDefault();
    await saveFinancialRecord(financeForm);
    setIsFinanceModalOpen(false);
    setFinanceForm({ type: 'revenue', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });
    await loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="card-surface p-6 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Erro de Acesso</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/admin/login" className="btn-primary">
              Fazer Login Admin
            </Link>
            <Link to="/" className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700">
              Voltar à Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-lg text-zinc-100">BarberPulse</span>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <TrendingUp className="w-5 h-5" /> Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'appointments' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <Calendar className="w-5 h-5" /> Agenda ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'services' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <Scissors className="w-5 h-5" /> Serviços ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('barbers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'barbers' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <Users className="w-5 h-5" /> Barbeiros ({barbers.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'clients' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <Users className="w-5 h-5" /> Clientes ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'financial' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            >
              <DollarSign className="w-5 h-5" /> Financeiro
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            to="/admin/master"
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded-xl"
          >
            <Shield className="w-4 h-4" /> Painel Master SaaS
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-950/30 rounded-xl"
          >
            <LogOut className="w-4 h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Dashboard Geral</h1>
                <p className="text-zinc-400 text-sm">Métricas em tempo real da sua barbearia</p>
              </div>
              <Link to="/agendar" target="_blank" className="btn-primary text-sm">
                Ver Link Público
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm font-medium">Faturamento Total</span>
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-zinc-100">
                  R$ {financialMetrics.revenue.toFixed(2)}
                </div>
              </div>
              <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm font-medium">Despesas</span>
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-zinc-100">
                  R$ {financialMetrics.expense.toFixed(2)}
                </div>
              </div>
              <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm font-medium">Lucro Líquido</span>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                  R$ {financialMetrics.profit.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-surface p-6">
                <h2 className="text-lg font-bold text-zinc-100 mb-4">Próximos Agendamentos</h2>
                {appointments.length === 0 ? (
                  <p className="text-zinc-500 text-sm">Nenhum agendamento recente.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((appt) => (
                      <div key={appt.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <div>
                          <p className="font-medium text-zinc-200 text-sm">{appt.client_name}</p>
                          <p className="text-xs text-zinc-400">{appt.appointment_date}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-surface p-6">
                <h2 className="text-lg font-bold text-zinc-100 mb-4">Equipe de Barbeiros</h2>
                <div className="space-y-3">
                  {barbers.map((barber) => (
                    <div key={barber.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <img src={barber.avatar_url} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{barber.name}</p>
                        <p className="text-xs text-zinc-400">{barber.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100">Gestão de Agendamentos</h1>
            <div className="card-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs uppercase">
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Telefone</th>
                      <th className="p-4">Data / Hora</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-sm">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-zinc-900/30">
                        <td className="p-4 font-medium text-zinc-200">{appt.client_name}</td>
                        <td className="p-4 text-zinc-400">{appt.client_phone}</td>
                        <td className="p-4 text-zinc-300">{appt.appointment_date}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-zinc-100">Catálogo de Serviços</h1>
              <button onClick={() => setIsServiceModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" /> Novo Serviço
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="card-surface p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-100 text-lg mb-1">{service.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{service.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <span className="text-emerald-400 font-bold text-lg">R$ {service.price.toFixed(2)}</span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {service.duration_minutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'barbers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-zinc-100">Equipe de Barbeiros</h1>
              <button onClick={() => setIsBarberModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" /> Adicionar Barbeiro
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <div key={barber.id} className="card-surface p-6 text-center">
                  <img src={barber.avatar_url} alt={barber.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
                  <h3 className="font-bold text-zinc-100 text-lg mb-1">{barber.name}</h3>
                  <p className="text-emerald-400 text-sm mb-2">{barber.specialization}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100">Base de Clientes</h1>
            <div className="card-surface overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs uppercase">
                    <th className="p-4">Nome</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4">E-mail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-900/30">
                      <td className="p-4 font-medium text-zinc-200">{client.name}</td>
                      <td className="p-4 text-zinc-400">{client.phone}</td>
                      <td className="p-4 text-zinc-400">{client.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-zinc-100">Gestão Financeira</h1>
              <button onClick={() => setIsFinanceModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" /> Novo Lançamento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-surface p-6">
                <span className="text-zinc-400 text-sm">Receita Total</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">R$ {financialMetrics.revenue.toFixed(2)}</div>
              </div>
              <div className="card-surface p-6">
                <span className="text-zinc-400 text-sm">Despesas Totais</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">R$ {financialMetrics.expense.toFixed(2)}</div>
              </div>
              <div className="card-surface p-6">
                <span className="text-zinc-400 text-sm">Saldo Líquido</span>
                <div className="text-2xl font-bold text-zinc-100 mt-1">R$ {financialMetrics.profit.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card-surface p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Adicionar Serviço</h2>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Ex: Corte Degradê"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detalhes do corte..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Duração (min)</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barber Modal */}
      {isBarberModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card-surface p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Adicionar Barbeiro</h2>
            <form onSubmit={handleCreateBarber} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome do Barbeiro</label>
                <input
                  type="text"
                  required
                  value={barberForm.name}
                  onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Especialização</label>
                <input
                  type="text"
                  required
                  value={barberForm.specialization}
                  onChange={(e) => setBarberForm({ ...barberForm, specialization: e.target.value })}
                  placeholder="Ex: Barba Clássica & Fade"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">URL do Avatar (Opcional)</label>
                <input
                  type="url"
                  value={barberForm.avatar_url}
                  onChange={(e) => setBarberForm({ ...barberForm, avatar_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBarberModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Barbeiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Finance Modal */}
      {isFinanceModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card-surface p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Novo Lançamento Financeiro</h2>
            <form onSubmit={handleCreateFinance} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Tipo</label>
                <select
                  value={financeForm.type}
                  onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value as 'revenue' | 'expense' })}
                >
                  <option value="revenue">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={financeForm.description}
                  onChange={(e) => setFinanceForm({ ...financeForm, description: e.target.value })}
                  placeholder="Ex: Compra de Lâminas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={financeForm.amount}
                    onChange={(e) => setFinanceForm({ ...financeForm, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={financeForm.date}
                    onChange={(e) => setFinanceForm({ ...financeForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFinanceModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
