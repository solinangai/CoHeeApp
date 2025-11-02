export function calculateSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100);
}

export function calculateTotal(subtotal: number, discount: number): number {
  return subtotal - discount;
}

export function formatPrice(amount: number): string {
  return `HK$${amount.toFixed(2)}`;
}

export function calculateTax(amount: number, taxRate: number = 0): number {
  return amount * taxRate;
}
