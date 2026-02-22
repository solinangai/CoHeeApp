import { create } from 'zustand';
import type { CartState, CartItem } from '@/types';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: CartItem) => {
    const items = get().items;
    const existingIndex = items.findIndex(
      (i) => i.productId === item.productId &&
      JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
    );

    let newItems: CartItem[];
    
    if (existingIndex > -1) {
      // Update quantity if item exists with same customizations
      newItems = [...items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + item.quantity,
        itemTotal: newItems[existingIndex].itemTotal + item.itemTotal,
      };
    } else {
      // Add new item
      newItems = [...items, item];
    }

    const total = newItems.reduce((sum, item) => sum + item.itemTotal, 0);
    set({ items: newItems, total });
  },

  removeItem: (productId: string) => {
    const newItems = get().items.filter((item) => item.productId !== productId);
    const total = newItems.reduce((sum, item) => sum + item.itemTotal, 0);
    set({ items: newItems, total });
  },

  updateQuantity: (productId: string, quantity: number) => {
    const items = get().items;
    const newItems = items.map((item) => {
      if (item.productId === productId) {
        const unitPrice = item.itemTotal / item.quantity;
        return {
          ...item,
          quantity,
          itemTotal: unitPrice * quantity,
        };
      }
      return item;
    });
    
    const total = newItems.reduce((sum, item) => sum + item.itemTotal, 0);
    set({ items: newItems, total });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));
