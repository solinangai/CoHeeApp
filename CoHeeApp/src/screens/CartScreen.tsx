import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useApp } from '../contexts/AppContext';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function CartScreen({ onNavigate }: Props) {
  const {
    cart,
    marketCart,
    updateQuantity,
    updateProductQuantity,
    removeFromCart,
    removeProductFromCart,
    hkstpDiscount,
    toggleDiscount,
    getCartTotal,
    getMarketCartTotal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'market'>('orders');

  const foodSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const marketSubtotal = getMarketCartTotal();
  const discount = hkstpDiscount ? foodSubtotal * 0.1 : 0;
  const foodTotal = foodSubtotal - discount;
  const grandTotal = foodTotal + marketSubtotal;

  const totalItems = cart.length + marketCart.length;

  if (totalItems === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add some delicious items from our menu or shop our market!
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => onNavigate('menu')}
        >
          <Text style={styles.shopButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            🍱 Orders ({cart.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'market' && styles.tabActive]}
          onPress={() => setActiveTab('market')}
        >
          <Text style={[styles.tabText, activeTab === 'market' && styles.tabTextActive]}>
            🛍️ Market ({marketCart.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Food Orders Tab */}
        {activeTab === 'orders' && (
          <View>
            {cart.length === 0 ? (
              <View style={styles.emptyTab}>
                <Text style={styles.emptyTabText}>No food items in cart</Text>
                <TouchableOpacity onPress={() => onNavigate('menu')}>
                  <Text style={styles.browseLink}>Browse Menu →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {cart.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.itemImage}>
                      <Text style={styles.itemEmoji}>🍱</Text>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.chinese_name && (
                        <Text style={styles.itemChinese}>{item.chinese_name}</Text>
                      )}
                      <Text style={styles.itemPrice}>HK${item.price}</Text>
                    </View>
                    <View style={styles.itemControls}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* HKSTP Discount Toggle */}
                <View style={styles.discountCard}>
                  <View style={styles.discountHeader}>
                    <Text style={styles.discountTitle}>🎓 HKSTP Staff Discount</Text>
                    <TouchableOpacity
                      style={[styles.discountToggle, hkstpDiscount && styles.discountToggleActive]}
                      onPress={toggleDiscount}
                    >
                      <Text style={styles.discountToggleText}>
                        {hkstpDiscount ? 'Applied' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {hkstpDiscount && (
                    <Text style={styles.discountAmount}>Save HK${discount.toFixed(2)}</Text>
                  )}
                </View>
              </>
            )}
          </View>
        )}

        {/* Market Products Tab */}
        {activeTab === 'market' && (
          <View>
            {marketCart.length === 0 ? (
              <View style={styles.emptyTab}>
                <Text style={styles.emptyTabText}>No products in cart</Text>
                <TouchableOpacity onPress={() => onNavigate('market')}>
                  <Text style={styles.browseLink}>Browse Market →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {marketCart.map((item) => (
                  <View key={item.product.id} style={styles.cartItem}>
                    <View style={styles.itemImage}>
                      <Text style={styles.itemEmoji}>
                        {item.product.category === 'beans' ? '☕' : 
                         item.product.category === 'equipment' ? '🔧' : '🎁'}
                      </Text>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>HK${item.product.price}</Text>
                    </View>
                    <View style={styles.itemControls}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateProductQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateProductQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeProductFromCart(item.product.id)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Summary */}
      {totalItems > 0 && (
        <View style={styles.summary}>
          {cart.length > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Food Subtotal</Text>
                <Text style={styles.summaryValue}>HK${foodSubtotal.toFixed(2)}</Text>
              </View>
              {hkstpDiscount && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount (10%)</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    -HK${discount.toFixed(2)}
                  </Text>
                </View>
              )}
            </>
          )}
          {marketCart.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Market Subtotal</Text>
              <Text style={styles.summaryValue}>HK${marketSubtotal.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>HK${grandTotal.toFixed(2)}</Text>
          </View>
          {cart.length > 0 && (
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => onNavigate('checkout')}
            >
              <Text style={styles.checkoutButtonText}>
                Checkout Order (HK${foodTotal.toFixed(2)})
              </Text>
            </TouchableOpacity>
          )}
          {marketCart.length > 0 && (
            <TouchableOpacity
              style={styles.marketCheckoutButton}
              onPress={() => {
                alert('Market checkout coming soon!');
              }}
            >
              <Text style={styles.marketCheckoutButtonText}>
                Checkout Market (HK${marketSubtotal.toFixed(2)})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2C1810',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#2C1810',
  },
  content: {
    flex: 1,
  },
  emptyTab: {
    padding: 60,
    alignItems: 'center',
  },
  emptyTabText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  browseLink: {
    fontSize: 16,
    color: '#E85D2C',
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  itemChinese: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#E85D2C',
    fontWeight: '600',
  },
  itemControls: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#999',
  },
  discountCard: {
    backgroundColor: '#FFF8F0',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  discountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  discountToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4A574',
  },
  discountToggleActive: {
    backgroundColor: '#2C1810',
  },
  discountToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C1810',
  },
  discountAmount: {
    fontSize: 14,
    color: '#E85D2C',
    marginTop: 8,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  discountValue: {
    color: '#E85D2C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  checkoutButton: {
    backgroundColor: '#2C1810',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  marketCheckoutButton: {
    backgroundColor: '#E85D2C',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  marketCheckoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
