export type Service = { id: string; name: string; description: string; price: number; duration_minutes: number; created_at?: string };
export type Barbeiro = { id: string; name: string; avatar_url: string; specialization: string; created_at?: string };
export type Appointment = { id: string; client_name: string; client_phone: string; service_id: string; barber_id: string; appointment_date: string; status: 'confirmed' | 'cancelled' | 'completed'; created_at?: string };
export type Client = { id: string; name: string; phone: string; email?: string; created_at?: string };
export type FinancialRecord = { id: string; type: 'revenue' | 'expense'; amount: number; description: string; date: string; created_at?: string };