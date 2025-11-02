import { createClient } from '@supabase/supabase-js';

// TODO: Replace with YOUR credentials from Supabase dashboard
const SUPABASE_URL = 'https://hmmfgqmkitmggbcphabd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbWZncW1raXRtZ2diY3BoYWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjExMDMsImV4cCI6MjA3NzMzNzEwM30.M_PSY0AHavV0dVrYdhSK3VeKquut_9obmbGJibtAUDA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const dbHelpers = {
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  async createUser(userData: {
    email: string;
    name: string;
    phone?: string;
    is_hkstp_staff?: boolean;
    auth_provider?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  async updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    return { data, error };
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};
