import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qacwmjsapfwqvyrvxapg.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_secret_8LlvLmLIS6W-Y-hHYPRrIw_8Nv10KOx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);