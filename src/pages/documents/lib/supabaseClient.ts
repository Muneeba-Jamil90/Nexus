// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqsxwgnjadwjbczpnfrj.supabase.co'; // Yahan apni URL likhein
const supabaseAnonKey = 'sb_publishable_OFGwih17xGwuMH0_WrF73w_y1Ug7tnH'; // Yahan apni Key likhein

export const supabase = createClient(supabaseUrl, supabaseAnonKey);