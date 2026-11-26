import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import { getServices, getBarbers, createAppointment } from '../services/barber';
import { Service, Barbeiro } from '../types';

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barbeiro[]>([]);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barbeiro | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([getServices(), getBarbers()])
      .then(([s, b]) => {
        setServices(s);
        setBarbers(b);
      });
  }, []);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !date || !clientName || !clientPhone) return;

    setSubmitting(true);
    try {
      const appointment_date = `${date}T${time}:00Z`;
      await createAppointment({
        client_name: clientName,
        client_phone: clientPhone,
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        appointment_date,
        status: 'confirmed'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="card-surface p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Agendamento Confirmado!</h2>
            <p className="text-sm text-zinc-400">
              Tudo pronto, {clientName}. Seu horário com {selectedBarber?.name} foi agendado para {date} às {time}.
            </p>
          </div>
          <Link to="/" className="btn-primary w-full justify-center">
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/50 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <span className="font-bold">Agendamento Online</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 py-8 space-y-8">
        {/* Steps indicator */}
        <div className="flex justify-between border-b border-zinc-800 pb-4 text-xs font-medium text-zinc-400">
          <span className={step === 1 ? 'text-emerald-400 font-bold' : ''}>1. Serviço</span>
          <span className={step === 2 ? 'text-emerald-400 font-bold' : ''}>2. Barbeiro</span>
          <span className={step === 3 ? 'text-emerald-400 font-bold' : ''}>3. Data & Hora</span>
          <span className={step === 4 ? 'text-emerald-400 font-bold' : ''}>4. Seus Dados</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Escolha o Serviço</h2>
            <div className="grid gap-4">
              {services.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`card-surface p-4 flex items-center justify-between cursor-pointer transition ${selectedService?.id === s.id ? 'border-emerald-500 bg-emerald-500/5' : 'hover:border-zinc-700'}`}
                >
                  <div>
                    <h3 className="font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-zinc-400">{s.description} ({s.duration_minutes} min)</p>
                  </div>
                  <span className="font-bold text-emerald-400">R$ {s.price}</span>
                </div>
              ))}
            </div>
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Escolha o Barbeiro</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {barbers.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBarber(b)}
                  className={`card-surface p-4 flex items-center gap-4 cursor-pointer transition ${selectedBarber?.id === b.id ? 'border-emerald-500 bg-emerald-500/5' : 'hover:border-zinc-700'}`}
                >
                  <img src={b.avatar_url} alt={b.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-white">{b.name}</h3>
                    <p className="text-xs text-emerald-400">{b.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl flex-1">
                Voltar
              </button>
              <button
                disabled={!selectedBarber}
                onClick={() => setStep(3)}
                className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Escolha a Data e Hora</h2>
            <div className="card-surface p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Data do Atendimento</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Horário</label>
                <select value={time} onChange={e => setTime(e.target.value)}>
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl flex-1">
                Voltar
              </button>
              <button
                disabled={!date}
                onClick={() => setStep(4)}
                className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleComplete} className="space-y-4">
            <h2 className="text-xl font-bold">Seus Dados</h2>
            <div className="card-surface p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(11) 98888-8888"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(3)} className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl flex-1">
                Voltar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
