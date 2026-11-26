import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createGeneratedAppClient(supabaseUrl: string, supabaseKey: string, projectId: string): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL ou Key não fornecidas. Utilizando modo fallback em memória/localStorage.');
  }
  const client = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key', {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-wlc-project-id': projectId,
      }
    }
  });
  return client;
}