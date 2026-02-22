// Color palette inspired by coffee and tech aesthetics
export const Colors = {
  // Primary - Coffee tones
  primary: '#6F4E37', // Coffee brown
  primaryDark: '#4A3325',
  primaryLight: '#8B6F47',
  
  // Secondary - Complementary
  secondary: '#D4A574', // Latte
  secondaryDark: '#B8935F',
  secondaryLight: '#E8C9A1',
  
  // Accent - Energetic
  accent: '#E67E22', // Espresso shot
  accentDark: '#CA6510',
  accentLight: '#F39C42',
  
  // Neutrals
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  surface: '#F5F5F5',
  surfaceDark: '#2C2C2C',
  
  // Text
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textDark: '#000000',
  
  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // UI Elements
  border: '#E0E0E0',
  divider: '#BDBDBD',
  disabled: '#9E9E9E',
  
  // Order Status Colors
  statusPending: '#FFA726',
  statusPreparing: '#42A5F5',
  statusReady: '#66BB6A',
  statusCompleted: '#9E9E9E',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
