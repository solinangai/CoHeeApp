import { MenuItem, Category, PaymentMethod } from '../types';

export const CATEGORIES: Category[] = [
  { name: 'Coffee', count: 22 },
  { name: 'Beverages', count: 9 },
  { name: 'Sandwich', count: 7 },
  { name: 'Rice Bowl', count: 7 },
  { name: 'Sides', count: 7 },
  { name: 'Pasta', count: 2 },
  { name: 'Dessert', count: 3 },
];

export const ALL_MENU_ITEMS: MenuItem[] = [
  // Coffee
  { id: 'c1', name: 'Double Espresso', price: 28, category: 'Coffee' },
  { id: 'c2', name: 'Long Black', price: 32, category: 'Coffee' },
  { id: 'c3', name: 'Espresso Macchiato', price: 32, category: 'Coffee' },
  { id: 'c4', name: 'Piccolo Latte', price: 32, category: 'Coffee' },
  { id: 'c5', name: 'Flat White', price: 38, category: 'Coffee' },
  { id: 'c6', name: 'Caffè Latte', price: 38, category: 'Coffee' },
  { id: 'c7', name: 'Cappuccino', price: 38, category: 'Coffee' },
  { id: 'c8', name: 'Caffè Mocha', price: 43, category: 'Coffee' },
  { id: 'c9', name: 'Creamy Black (Iced)', price: 38, category: 'Coffee' },
  { id: 'c10', name: 'Espresso Tonic', price: 48, category: 'Coffee' },
  { id: 'c11', name: 'Dirty Coco', price: 40, category: 'Coffee' },
  { id: 'c12', name: 'Pistachio Dirty', price: 43, category: 'Coffee' },
  { id: 'c13', name: 'Cold Brew CoHee', price: 68, category: 'Coffee' },
  { id: 'c14', name: 'Affogato', price: 58, category: 'Coffee' },
  { id: 'c15', name: 'Brazil Santo do Amparo', price: 48, category: 'Coffee' },
  { id: 'c16', name: 'Kenya AA', price: 58, category: 'Coffee' },
  { id: 'c17', name: 'Yunnan Baoshan', price: 58, category: 'Coffee' },
  { id: 'c18', name: 'Ethiopia Yirgacheffe', price: 68, category: 'Coffee' },
  { id: 'c19', name: 'Ethiopia Sidama Bombe', price: 68, category: 'Coffee' },
  { id: 'c20', name: 'Costa Rica Finca Las Piedra', price: 68, category: 'Coffee' },
  { id: 'c21', name: 'Colombia Grape Infusion', price: 78, category: 'Coffee' },
  { id: 'c22', name: 'Honduras Masaguara', price: 88, category: 'Coffee' },
  
  // Beverages
  { id: 'nc1', name: 'Hojicha Latte', chinese_name: '焙茶拿鐵', price: 38, category: 'Beverages' },
  { id: 'nc2', name: 'Green Tea Latte', chinese_name: '綠茶拿鐵', price: 38, category: 'Beverages' },
  { id: 'nc3', name: 'Genmaicha Latte', chinese_name: '玄米茶拿鐵', price: 38, category: 'Beverages' },
  { id: 'nc4', name: 'Black Sesame Latte', chinese_name: '黑芝麻拿鐵', price: 38, category: 'Beverages' },
  { id: 'nc5', name: 'Rich Chocolate', price: 43, category: 'Beverages' },
  { id: 'nc6', name: 'Earl Grey Chocolate', price: 40, category: 'Beverages' },
  { id: 'nc7', name: 'Lemonade', price: 38, category: 'Beverages' },
  { id: 'nc8', name: 'Cold-Pressed Orange Juice', price: 38, category: 'Beverages' },
  { id: 'nc9', name: 'Sakura Lychee Sparkling', price: 48, category: 'Beverages' },
  
  // Sandwiches
  { id: 's1', name: 'Thick Egg & Ham', chinese_name: '厚蛋.火腿.芝士', price: 58, category: 'Sandwich' },
  { id: 's2', name: 'Thick Egg & Tomato', chinese_name: '厚蛋.蕃茄.芝士', price: 58, category: 'Sandwich' },
  { id: 's3', name: 'Pork Floss Special', chinese_name: '厚蛋.肉鬆.芝士', price: 63, category: 'Sandwich' },
  { id: 's4', name: 'Katsu Deluxe', chinese_name: '吉利豬扒.芝士.木魚', price: 75, category: 'Sandwich' },
  { id: 's5', name: 'Katsu Garden', chinese_name: '吉利豬扒.蛋沙律.疏菜', price: 75, category: 'Sandwich' },
  { id: 's6', name: 'Katsu Kimchi', chinese_name: '吉利豬扒.蛋沙律.泡菜', price: 75, category: 'Sandwich' },
  { id: 's7', name: 'Garden Egg Salad', chinese_name: '蛋沙律.芝士.疏菜', price: 58, category: 'Sandwich' },
  
  // Rice Bowls
  { id: 'r1', name: 'Salmon Fried Rice', chinese_name: '三文魚.香蔥.蛋.炒飯', price: 73, category: 'Rice Bowl' },
  { id: 'r2', name: 'Chicken Kimchi Fried Rice', chinese_name: '雞肉.泡菜.蛋.炒飯', price: 73, category: 'Rice Bowl' },
  { id: 'r3', name: 'Fluffy Egg Curry Rice', chinese_name: '滑蛋咖哩飯', price: 83, category: 'Rice Bowl' },
  { id: 'r4', name: 'Beef Rice Bowl', chinese_name: '牛肉飯', price: 93, category: 'Rice Bowl' },
  { id: 'r5', name: 'Katsu Rice Deluxe', chinese_name: '吉列豬扒.玉子燒.紫菜飯', price: 98, category: 'Rice Bowl' },
  { id: 'r6', name: 'Katsu Curry Rice', chinese_name: '吉列豬扒.大陽蛋.咖哩飯', price: 98, category: 'Rice Bowl' },
  { id: 'r7', name: 'Unagi Rice Premium', chinese_name: '原條鰻魚，玉子燒.紫菜飯', price: 98, category: 'Rice Bowl' },
  
  // Sides
  { id: 'sd1', name: 'Karaage Chicken (4pcs)', chinese_name: '唐揚炸雞4件', price: 53, category: 'Sides' },
  { id: 'sd2', name: 'Chicken Wings (4pcs)', chinese_name: '炸雞翼4隻', price: 50, category: 'Sides' },
  { id: 'sd3', name: 'Sweet Potato Fries', price: 42, category: 'Sides' },
  { id: 'sd4', name: 'Regular Fries', price: 42, category: 'Sides' },
  { id: 'sd5', name: 'Mixed Vegetable Salad', chinese_name: '雜菜沙律', price: 48, category: 'Sides' },
  { id: 'sd6', name: 'Japanese Potato Salad', chinese_name: '薯仔沙律', price: 48, category: 'Sides' },
  { id: 'sd7', name: 'Toast & Salad Combo', price: 68, category: 'Sides' },
  
  // Pasta
  { id: 'p1', name: 'Dill Salmon Angel Hair', price: 98, category: 'Pasta' },
  { id: 'p2', name: 'Truffle Egg Linguine', price: 98, category: 'Pasta' },
  
  // Desserts
  { id: 'd1', name: 'Basque Burnt Cheesecake', price: 48, category: 'Dessert' },
  { id: 'd2', name: 'Japanese Caramel Pudding', price: 42, category: 'Dessert' },
  { id: 'd3', name: 'Chocolate Brownies', price: 68, category: 'Dessert' },
];

export const FEATURED_ITEMS: MenuItem[] = [
  ALL_MENU_ITEMS.find(i => i.id === 'r1')!,
  ALL_MENU_ITEMS.find(i => i.id === 's4')!,
  ALL_MENU_ITEMS.find(i => i.id === 'c5')!,
  ALL_MENU_ITEMS.find(i => i.id === 'r7')!,
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'apple_pay', name: 'Apple Pay', icon: '🍎', color: '#000000' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳', color: '#4285F4' },
  { id: 'payme', name: 'PayMe', icon: '💰', color: '#7C3AED' },
  { id: 'fps', name: 'FPS (Faster Payment)', icon: '⚡', color: '#FF6B35' },
  { id: 'alipay', name: 'Alipay HK', icon: '🔵', color: '#1677FF' },
  { id: 'wechat', name: 'WeChat Pay', icon: '💬', color: '#07C160' },
];