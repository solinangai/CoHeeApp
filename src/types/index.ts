export * from './database.types';

// Navigation types
export type RootStackParamList = {
  '(tabs)': undefined;
  'auth/login': undefined;
  'auth/signup': undefined;
  'auth/forgot-password': undefined;
  'order/menu': undefined;
  'order/product-detail': { productId: string };
  'order/cart': undefined;
  'order/checkout': undefined;
  'order/confirmation': { orderId: string };
  'marketplace/products': { category?: string };
  'marketplace/product-detail': { productId: string };
  'profile/settings': undefined;
  'profile/orders': undefined;
  'profile/addresses': undefined;
  'profile/payment-methods': undefined;
};

// Auth types
export interface User {
  id: string;
  email: string;
  profile?: Profile;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  customizations?: Record<string, any>;
  itemTotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Re-export database types
import type { Profile, Product, Order, OrderItem } from './database.types';
export type { Profile, Product, Order, OrderItem };
