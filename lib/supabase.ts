import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmxidbtrntbnykufucwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteGlkYnRybnRibnlrdWZ1Y3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjM3ODIsImV4cCI6MjA4NTA5OTc4Mn0.pddJmhruBE--UsAP8UNCJGnVn5KXtCp5y8cjzlzkrqE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
