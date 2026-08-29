import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynljwateongqgbgfzpkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CyhLcKzUf6AwJDGF-6tApQ_xTPFwMdL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
