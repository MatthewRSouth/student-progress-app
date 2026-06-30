import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        'Missing Supabase env vars: check VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env',
    );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
