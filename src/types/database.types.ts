// Database types - will be auto-generated from Supabase later
// For now, we'll define the core types manually

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  preferences?: Record<string, any>;
  loyalty_points: number;
  member_tier?: 'bronze' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'coffee' | 'food' | 'merchandise' | 'beans' | 'equipment';
  subcategory?: string;
  base_price: number;
  image_url?: string;
  images?: string[];
  available: boolean;
  stock_quantity?: number;
  preparation_time?: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_type: 'takeaway' | 'dine-in' | 'marketplace';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  pickup_time?: string;
  table_id?: string;
  session_id?: string;
  shipping_address?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  customizations?: Record<string, any>;
  item_total: number;
  preparation_status?: 'pending' | 'preparing' | 'ready';
  created_at: string;
}
