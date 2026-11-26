import { createGeneratedAppClient } from './generated-app-client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const projectId = import.meta.env.VITE_WLC_PROJECT_ID || 'barberpulse';

export const supabase = createGeneratedAppClient(supabaseUrl, supabaseKey, projectId);
