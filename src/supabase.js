import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qacwmjsapfwqvyrvxapg.supabase.co/rest/v1/';
const SUPABASE_KEY = '123212321232123';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);