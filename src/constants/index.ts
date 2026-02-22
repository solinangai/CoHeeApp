export * from './theme';

// App Configuration
export const APP_NAME = 'CoHeeApp';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const ITEMS_PER_PAGE = 20;

// Order Configuration
export const MIN_PICKUP_TIME_MINUTES = 15;
export const MAX_ADVANCE_ORDER_DAYS = 7;

// Cart Configuration
export const MIN_ORDER_AMOUNT = 0; // HKD
export const FREE_DELIVERY_THRESHOLD = 200; // HKD
export const DELIVERY_FEE = 30; // HKD

// Loyalty Points
export const POINTS_PER_DOLLAR = 1;
export const POINTS_TO_DOLLAR = 0.01; // 100 points = 1 HKD

// Product Categories
export const PRODUCT_CATEGORIES = {
  COFFEE: 'coffee',
  FOOD: 'food',
  MERCHANDISE: 'merchandise',
  BEANS: 'beans',
  EQUIPMENT: 'equipment',
} as const;

// Order Types
export const ORDER_TYPES = {
  TAKEAWAY: 'takeaway',
  DINE_IN: 'dine-in',
  MARKETPLACE: 'marketplace',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Member Tiers
export const MEMBER_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
} as const;

// Time Formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
