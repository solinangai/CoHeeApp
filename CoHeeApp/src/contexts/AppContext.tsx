import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MenuItem, CartItem, Order, Product } from '../types';
import { useAuth } from './AuthContext';
import { tableService, TableSession } from '../services/table.service';
import { MENU_ITEMS } from '../data/menuItems';

interface MarketCartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  marketCart: MarketCartItem[];
  orders: Order[];
  loyaltyPoints: number;
  hkstpDiscount: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'info';
  currentTableSession: TableSession | null;
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  addProductToCart: (product: Product) => void;
  removeFromCart: (itemId: string) => void;
  removeProductFromCart: (productId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearMarketCart: () => void;
  toggleDiscount: () => void;
  createOrder: (order: Order) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  getCartTotal: () => number;
  getMarketCartTotal: () => number;
  getCartCount: () => number;
  getUserActiveOrders: () => Order[];
  startTableSession: (tableInfo: any) => Promise<TableSession | null>;
  endTableSession: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [marketCart, setMarketCart] = useState<MarketCartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [hkstpDiscount, setHkstpDiscount] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [currentTableSession, setCurrentTableSession] = useState<TableSession | null>(null);
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);

  useEffect(() => {
    if (user) {
      loadUserOrders();
      setLoyaltyPoints(user.loyaltyPoints || 0);
    } else {
      setOrders([]);
      setLoyaltyPoints(0);
    }
  }, [user?.id]);

  const loadUserOrders = async () => {
    if (!user) return;
    
    try {
      const { dbHelpers } = await import('../utils/supabase');
      const { data, error } = await dbHelpers.getUserOrders(user.id);
      
      if (!error && data) {
        const userOrders = data.map((order: any) => ({
          id: order.id,
          customer: order.customer_name,
          customerId: order.user_id,
          items: order.items,
          subtotal: parseFloat(order.subtotal),
          discount: parseFloat(order.discount || 0),
          total: parseFloat(order.total),
          status: order.status,
          pickupTime: order.pickup_time || '',
          specialInstructions: order.special_instructions,
          createdAt: new Date(order.created_at),
          paymentMethod: order.payment_method,
        }));
        
        setOrders(userOrders);
      }
    } catch (error) {
      console.log('Using local storage for orders');
    }
  };

  const startTableSession = async (tableInfo: any): Promise<TableSession | null> => {
    try {
      let table = null;

      // Try to get table by token
      if (tableInfo.token) {
        table = await tableService.verifyTableQR(tableInfo.token);
      }

      // Try to get table by ID
      if (!table && tableInfo.tableId) {
        table = await tableService.getTableById(tableInfo.tableId);
      }

      // Try to get table by number
      if (!table && tableInfo.tableNumber) {
        table = await tableService.getTableByNumber(tableInfo.tableNumber);
      }

      if (!table) {
        showToast('Table not found', 'error');
        return null;
      }

      // Start session
      const session = await tableService.startSession(table.id);

      if (session) {
        setCurrentTableSession(session);
        // Clear any existing cart for fresh start
        clearCart();
        return session;
      }

      showToast('Failed to start table session', 'error');
      return null;
    } catch (error) {
      console.error('Error starting table session:', error);
      showToast('Error starting session', 'error');
      return null;
    }
  };

  const endTableSession = async (): Promise<boolean> => {
    if (!currentTableSession) {
      return false;
    }

    try {
      const success = await tableService.endSession(currentTableSession.id);
      
      if (success) {
        setCurrentTableSession(null);
        clearCart();
        return true;
      }

      showToast('Failed to end session', 'error');
      return false;
    } catch (error) {
      console.error('Error ending table session:', error);
      showToast('Error ending session', 'error');
      return false;
    }
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + quantity } 
          : i
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const addProductToCart = (product: Product) => {
    const existingProduct = marketCart.find(p => p.product.id === product.id);
    
    if (existingProduct) {
      setMarketCart(marketCart.map(p => 
        p.product.id === product.id 
          ? { ...p, quantity: p.quantity + 1 } 
          : p
      ));
    } else {
      setMarketCart([...marketCart, { product, quantity: 1 }]);
    }
    
    showToast(`✓ ${product.name} added to cart`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(i => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const removeProductFromCart = (productId: string) => {
    setMarketCart(marketCart.filter(p => p.product.id !== productId));
    showToast('Product removed from cart', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(i => 
        i.id === itemId ? { ...i, quantity } : i
      ));
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeProductFromCart(productId);
    } else {
      setMarketCart(marketCart.map(p => 
        p.product.id === productId ? { ...p, quantity } : p
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearMarketCart = () => {
    setMarketCart([]);
  };

  const toggleDiscount = () => {
    setHkstpDiscount(!hkstpDiscount);
  };

  const createOrder = async (order: Order) => {
    if (!user) {
      showToast('Please login to place an order', 'error');
      return;
    }

    const orderWithUser = {
      ...order,
      customerId: user.id,
      customer: user.name,
    };

    try {
      const { dbHelpers } = await import('../utils/supabase');
      await dbHelpers.createOrder({
        id: orderWithUser.id,
        user_id: user.id,
        customer_name: user.name,
        items: orderWithUser.items,
        subtotal: orderWithUser.subtotal,
        discount: orderWithUser.discount,
        total: orderWithUser.total,
        status: orderWithUser.status,
        pickup_time: orderWithUser.pickupTime,
        payment_method: orderWithUser.paymentMethod,
        special_instructions: orderWithUser.specialInstructions,
      });

      setOrders([orderWithUser, ...orders]);
      
      const newPoints = loyaltyPoints + 1;
      setLoyaltyPoints(newPoints);
      
      await dbHelpers.updateUser(user.id, { loyalty_points: newPoints });
      
    } catch (error) {
      console.error('Failed to create order:', error);
      setOrders([orderWithUser, ...orders]);
      setLoyaltyPoints(loyaltyPoints + 1);
    }

    clearCart();
    setHkstpDiscount(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const discount = hkstpDiscount ? subtotal * 0.1 : 0;
    return subtotal - discount;
  };

  const getMarketCartTotal = () => {
    return marketCart.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0) +
           marketCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getUserActiveOrders = () => {
    if (!user) return [];
    
    return orders.filter(
      order => 
        order.customerId === user.id &&
        order.status !== 'completed' && 
        order.status !== 'cancelled'
    );
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        marketCart,
        orders: orders.filter(o => !user || o.customerId === user.id),
        loyaltyPoints,
        hkstpDiscount,
        toastMessage,
        toastType,
        currentTableSession,
        menuItems,
        addToCart,
        addProductToCart,
        removeFromCart,
        removeProductFromCart,
        updateQuantity,
        updateProductQuantity,
        clearCart,
        clearMarketCart,
        toggleDiscount,
        createOrder,
        showToast,
        getCartTotal,
        getMarketCartTotal,
        getCartCount,
        getUserActiveOrders,
        startTableSession,
        endTableSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
