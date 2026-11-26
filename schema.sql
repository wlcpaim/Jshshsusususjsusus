-- Schema SQL para BarberPulse (Gerenciado via WLC 1.9.9)

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  specialization TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  barber_id UUID REFERENCES barbers(id),
  appointment_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read barbers" ON barbers FOR SELECT USING (true);
CREATE POLICY "Authenticated full access clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Authenticated full access financial" ON financial_records FOR ALL USING (auth.role() = 'authenticated');

-- Seed inicial
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Corte Clássico & Tesoura', 'Corte tradicional com acabamento na navalha e lavagem.', 50, 30),
('Barba Terapia', 'Barba com toalha quente, óleos essenciais e hidratação.', 40, 30),
('Combo Corte + Barba', 'O serviço completo para renovar o visual com total estilo.', 80, 60)
ON CONFLICT DO NOTHING;

INSERT INTO barbers (name, avatar_url, specialization) VALUES
('Carlos Silva', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Degradê & Navalha'),
('Marcos Vinícius', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Barba Clássica & Estilo'),
('André Santos', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Cortes Modernos')
ON CONFLICT DO NOTHING;
