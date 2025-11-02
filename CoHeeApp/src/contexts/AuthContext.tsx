import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, dbHelpers } from '../utils/supabase';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, isHKSTPStaff?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    checkSupabaseSession();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSupabaseSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: dbUser } = await dbHelpers.getUserByEmail(session.user.email!);
        if (dbUser) {
          const userData: User = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            phone: dbUser.phone,
            isHKSTPStaff: dbUser.is_hkstp_staff,
            loyaltyPoints: dbUser.loyalty_points,
            createdAt: new Date(dbUser.created_at),
          };
          saveUser(userData);
        }
      }
    } catch (error) {
      console.log('No active session');
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
        return false;
      }

      if (data.user) {
        const { data: dbUser } = await dbHelpers.getUserByEmail(email);
        
        if (dbUser) {
          const userData: User = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            phone: dbUser.phone,
            isHKSTPStaff: dbUser.is_hkstp_staff,
            loyaltyPoints: dbUser.loyalty_points,
            createdAt: new Date(dbUser.created_at),
          };
          
          await saveUser(userData);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    isHKSTPStaff?: boolean
  ): Promise<boolean> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (authError) {
        Alert.alert('Registration Failed', authError.message);
        return false;
      }

      if (authData.user) {
        const { data: dbUser } = await dbHelpers.createUser({
          email,
          name,
          phone,
          is_hkstp_staff: isHKSTPStaff,
          auth_provider: 'email',
        });

        if (dbUser) {
          const userData: User = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            phone: dbUser.phone,
            isHKSTPStaff: dbUser.is_hkstp_staff,
            loyaltyPoints: 0,
            createdAt: new Date(),
          };

          await saveUser(userData);

          Alert.alert(
            'Verify Your Email',
            'We\'ve sent a verification link to your email. Please verify to continue.',
            [{ text: 'OK' }]
          );

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      saveUser(updatedUser);
      dbHelpers.updateUser(user.id, updates);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
