import { create } from 'zustand';
import { supabase } from '@/config/supabase';
import type { AuthState, User } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            profile: profile || undefined,
          },
          session: data.session,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          loyalty_points: 0,
          member_tier: 'bronze',
        });

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
          },
          session: data.session,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data: profile }) => {
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            profile: profile || undefined,
          },
          session,
          loading: false,
        });
      });
  } else {
    useAuthStore.setState({ loading: false });
  }
});

// Listen to auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data: profile }) => {
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            profile: profile || undefined,
          },
          session,
          loading: false,
        });
      });
  } else {
    useAuthStore.setState({ user: null, session: null, loading: false });
  }
});
