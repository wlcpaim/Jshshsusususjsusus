import { Link } from 'react-router-dom';
import { Scissors, Calendar, Shield, CheckCircle, Clock, MapPin, Phone, Instagram } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Navbar Pública */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">BarberPulse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/agendar" className="btn-primary text-sm">
              Agendar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Calendar className="w-3.5 h-3.5" /> Agendamento Online Rápido e Seguro
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Estilo, Tradição e <span className="text-emerald-500">Precisão</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Garanta seu horário com os melhores profissionais da região em poucos cliques. Sem filas, sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/agendar" className="btn-primary w-full sm:w-auto text-base py-3 px-8">
              Agendar Meu Horário
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4 bg-zinc-900/50 border-t border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-surface p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Agendamento 24/7</h3>
            <p className="text-zinc-400 text-sm">
              Escolha o dia, horário e barbeiro favorito diretamente do seu celular a qualquer hora do dia.
            </p>
          </div>
          <div className="card-surface p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Profissionais Renomados</h3>
            <p className="text-zinc-400 text-sm">
              Nossa equipe é especialista em cortes clássicos, modernos, barbas alinhadas e tratamentos VIP.
            </p>
          </div>
          <div className="card-surface p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Ambiente Premium</h3>
            <p className="text-zinc-400 text-sm">
              Desfrute de um espaço confortável, cerveja gelada, boa música e atendimento de excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-400 text-sm">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-white">BarberPulse</span> &copy; {new Date().getFullYear()} - Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500" /> Rua das Navalhas, 100 - Centro</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-emerald-500" /> (11) 99999-8888</span>
          </div>
          <div>
            <Link to="/admin/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Área Administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}