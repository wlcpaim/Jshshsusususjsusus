import { supabase } from '../lib/supabase';
import { Service, Barbeiro, Appointment, Client, FinancialRecord } from '../types';

const STORAGE_FALLBACK = {
  services: 'barberpulse_services_seed',
  barbers: 'barberpulse_barbers_seed',
  appointments: 'barberpulse_appointments_seed',
  clients: 'barberpulse_clients_seed',
  financial: 'barberpulse_financial_seed'
};

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error || !data || data.length === 0) {
      const local = localStorage.getItem(STORAGE_FALLBACK.services);
      if (local) return JSON.parse(local);
      const defaultServices: Service[] = [
        { id: '1', name: 'Corte Clássico & Tesoura', description: 'Corte tradicional com acabamento na navalha e lavagem.', price: 50, duration_minutes: 30 },
        { id: '2', name: 'Barba Terapia', description: 'Barba com toalha quente, óleos essenciais e hidratação.', price: 40, duration_minutes: 30 },
        { id: '3', name: 'Combo Corte + Barba', description: 'O serviço completo para renovar o visual com total estilo.', price: 80, duration_minutes: 60 }
      ];
      localStorage.setItem(STORAGE_FALLBACK.services, JSON.stringify(defaultServices));
      return defaultServices;
    }
    return data as Service[];
  } catch {
    const local = localStorage.getItem(STORAGE_FALLBACK.services);
    return local ? JSON.parse(local) : [];
  }
}

export async function getBarbers(): Promise<Barbeiro[]> {
  try {
    const { data, error } = await supabase.from('barbers').select('*');
    if (error || !data || data.length === 0) {
      const local = localStorage.getItem(STORAGE_FALLBACK.barbers);
      if (local) return JSON.parse(local);
      const defaultBarbers: Barbeiro[] = [
        { id: '1', name: 'Carlos Silva', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', specialization: 'Degradê & Barba Clássica' },
        { id: '2', name: 'Marcos Vinícius', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', specialization: 'Estilos Modernos & Coloração' }
      ];
      localStorage.setItem(STORAGE_FALLBACK.barbers, JSON.stringify(defaultBarbers));
      return defaultBarbers;
    }
    return data as Barbeiro[];
  } catch {
    const local = localStorage.getItem(STORAGE_FALLBACK.barbers);
    return local ? JSON.parse(local) : [];
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase.from('appointments').select('*');
    if (error || !data) {
      const local = localStorage.getItem(STORAGE_FALLBACK.appointments);
      return local ? JSON.parse(local) : [];
    }
    return data as Appointment[];
  } catch {
    const local = localStorage.getItem(STORAGE_FALLBACK.appointments);
    return local ? JSON.parse(local) : [];
  }
}

export async function createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at'>): Promise<void> {
  try {
    const newAppt = { ...appointmentData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const { error } = await supabase.from('appointments').insert([newAppt]);
    
    const local = localStorage.getItem(STORAGE_FALLBACK.appointments);
    const list = local ? JSON.parse(local) : [];
    list.push(newAppt);
    localStorage.setItem(STORAGE_FALLBACK.appointments, JSON.stringify(list));

    // Also add or update client
    const clientList = await getClients();
    if (!clientList.some(c => c.phone === newAppt.client_phone)) {
      const newClient: Client = {
        id: crypto.randomUUID(),
        name: newAppt.client_name,
        phone: newAppt.client_phone,
        created_at: new Date().toISOString()
      };
      await saveClient(newClient);
    }

    if (error) throw error;
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    throw err;
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase.from('clients').select('*');
    if (error || !data) {
      const local = localStorage.getItem(STORAGE_FALLBACK.clients);
      return local ? JSON.parse(local) : [];
    }
    return data as Client[];
  } catch {
    const local = localStorage.getItem(STORAGE_FALLBACK.clients);
    return local ? JSON.parse(local) : [];
  }
}

export async function saveClient(client: Client): Promise<void> {
  try {
    await supabase.from('clients').insert([client]);
    const local = localStorage.getItem(STORAGE_FALLBACK.clients);
    const list = local ? JSON.parse(local) : [];
    list.push(client);
    localStorage.setItem(STORAGE_FALLBACK.clients, JSON.stringify(list));
  } catch (err) {
    console.error(err);
  }
}

export async function getFinancialMetrics(): Promise<{ revenue: number; expense: number; profit: number }> {
  try {
    const { data, error } = await supabase.from('financial_records').select('*');
    let records: FinancialRecord[] = [];
    if (error || !data || data.length === 0) {
      const local = localStorage.getItem(STORAGE_FALLBACK.financial);
      records = local ? JSON.parse(local) : [
        { id: '1', type: 'revenue', amount: 2500, description: 'Serviços Semana 1', date: new Date().toISOString() },
        { id: '2', type: 'expense', amount: 800, description: 'Produtos e Insumos', date: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_FALLBACK.financial, JSON.stringify(records));
    } else {
      records = data as FinancialRecord[];
    }

    const revenue = records.filter(r => r.type === 'revenue').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = records.filter(r => r.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { revenue, expense, profit: revenue - expense };
  } catch {
    return { revenue: 2500, expense: 800, profit: 1700 };
  }
}

export async function saveService(service: Omit<Service, 'id'>): Promise<void> {
  const newService = { ...service, id: crypto.randomUUID() };
  try {
    await supabase.from('services').insert([newService]);
    const local = localStorage.getItem(STORAGE_FALLBACK.services);
    const list = local ? JSON.parse(local) : [];
    list.push(newService);
    localStorage.setItem(STORAGE_FALLBACK.services, JSON.stringify(list));
  } catch (err) {
    console.error(err);
  }
}

export async function saveBarber(barber: Omit<Barbeiro, 'id'>): Promise<void> {
  const newBarber = { ...barber, id: crypto.randomUUID() };
  try {
    await supabase.from('barbers').insert([newBarber]);
    const local = localStorage.getItem(STORAGE_FALLBACK.barbers);
    const list = local ? JSON.parse(local) : [];
    list.push(newBarber);
    localStorage.setItem(STORAGE_FALLBACK.barbers, JSON.stringify(list));
  } catch (err) {
    console.error(err);
  }
}

export async function saveFinancialRecord(record: Omit<FinancialRecord, 'id'>): Promise<void> {
  const newRecord = { ...record, id: crypto.randomUUID() };
  try {
    await supabase.from('financial_records').insert([newRecord]);
    const local = localStorage.getItem(STORAGE_FALLBACK.financial);
    const list = local ? JSON.parse(local) : [];
    list.push(newRecord);
    localStorage.setItem(STORAGE_FALLBACK.financial, JSON.stringify(list));
  } catch (err) {
    console.error(err);
  }
}
