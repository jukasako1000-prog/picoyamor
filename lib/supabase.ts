import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmxidbtrrtbnykufucwi.supabase.co';
const supabaseAnonKey = 'sb_publishable_uydbe8OmbEHYW12aYMOHQQ_V_zctFRz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
