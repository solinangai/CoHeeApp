import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, CartItem, Order, Product } from '../types';
import { useAuth } from './AuthContext'; 

// ADD this new interface for market products
interface MarketCartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  marketCart: MarketCartItem[];  // ADD THIS LINE
  orders: Order[];
  loyaltyPoints: number;
  hkstpDiscount: boolean;
  toastMessage: string;
  addToCart: (item: MenuItem) => void;
  addProductToCart: (product: Product) => void;  // ADD THIS LINE
  removeFromCart: (itemId: string) => void;
  removeProductFromCart: (productId: string) => void;  // ADD THIS LINE
  updateQuantity: (itemId: string, quantity: number) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;  // ADD THIS LINE
  clearCart: () => void;
  clearMarketCart: () => void;  // ADD THIS LINE
  toggleDiscount: () => void;
  createOrder: (order: Order) => void;
  showToast: (message: string) => void;
  getCartTotal: () => number;
  getMarketCartTotal: () => number;  // ADD THIS LINE
  getCartCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [marketCart, setMarketCart] = useState<MarketCartItem[]>([]);  // ADD THIS LINE
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [hkstpDiscount, setHkstpDiscount] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Existing food cart functions
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    showToast(`✓ ${item.name} added to cart`);
  };

 
  
 // ADD: Market product cart functions
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
    
    showToast(`✓ ${product.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(i => i.id !== itemId));
    showToast('Item removed from cart');
  };

  // ADD: Remove product from market cart
  const removeProductFromCart = (productId: string) => {
    setMarketCart(marketCart.filter(p => p.product.id !== productId));
    showToast('Product removed from cart');
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

  // ADD: Update product quantity
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

  // ADD: Clear market cart
  const clearMarketCart = () => {
    setMarketCart([]);
  };

  const toggleDiscount = () => {
    setHkstpDiscount(!hkstpDiscount);
  };

  const createOrder = (order: Order) => {
    setOrders([order, ...orders]);
    setLoyaltyPoints(loyaltyPoints + 1);
    clearCart();
    setHkstpDiscount(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const discount = hkstpDiscount ? subtotal * 0.1 : 0;
    return subtotal - discount;
  };

  // ADD: Get market cart total
  const getMarketCartTotal = () => {
    return marketCart.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0) +
           marketCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        marketCart,  // ADD THIS LINE
        orders,
        loyaltyPoints,
        hkstpDiscount,
        toastMessage,
        addToCart,
        addProductToCart,  // ADD THIS LINE
        removeFromCart,
        removeProductFromCart,  // ADD THIS LINE
        updateQuantity,
        updateProductQuantity,  // ADD THIS LINE
        clearCart,
        clearMarketCart,  // ADD THIS LINE
        toggleDiscount,
        createOrder,
        showToast,
        getCartTotal,
        getMarketCartTotal,  // ADD THIS LINE
        getCartCount,
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
