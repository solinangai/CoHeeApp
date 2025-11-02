// Existing types
export interface MenuItem {
  id: string;
  name: string;
  chinese_name?: string;
  price: number;
  category: string;
  description?: string;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  pickupTime: string;
  specialInstructions?: string;
  createdAt: Date;
  paymentMethod?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Category {
  name: string;
  count: number;
  icon?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// NEW TYPES FOR V2.0

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isHKSTPStaff?: boolean;
  loyaltyPoints: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'beans' | 'equipment' | 'accessories';
  image?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartProduct {
  product: Product;
  quantity: number;
}

export type Screen = 'landing' | 'login' | 'register' | 'home' | 'menu' | 'cart' | 'checkout' | 'orderStatus' | 'market' | 'profile';
