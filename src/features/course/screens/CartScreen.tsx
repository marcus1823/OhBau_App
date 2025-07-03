import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CartItemCard from '../components/CartItemCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useToast } from '../../../utils/toasts/useToast';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useQueryClient } from '@tanstack/react-query';
import ButtonAction from '../../auth/components/ButtonAction';
import { useFocusEffect } from '@react-navigation/native';
import { CartItemDetailed } from '../../shop/types/shops.types'; // Add this import
import { 
  useInfiniteCartItemsByAccount, 
  useInfiniteCartItemsDetails,
  useExtractCartItems,
  useExtractCartItemsDetails 
} from '../../shop/hooks/useInfiniteCart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FormInput from '../../auth/components/FormInput';


const CartScreen = ({ navigation, route }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showError } = useToast();
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0); 
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Lấy previousTab từ route params, không đặt mặc định
  const previousTab = route.params?.previousTab || 'Trang Chủ';

  // Làm mới dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });
      
      // Force refetch to ensure fresh data
      queryClient.refetchQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.refetchQueries({ queryKey: ['cartItemsDetailsInfinite'] });
    }, [queryClient])
  );

  // Function to force refresh the cart data
  const forceRefreshCart = useCallback(() => {
    try {
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });
      
      // Add a small delay before refetching to allow React Query to stabilize
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['cartItemsByAccountInfinite'] })
          .catch(e => console.error("Error refetching cart items:", e));
          
        queryClient.refetchQueries({ queryKey: ['cartItemsDetailsInfinite'] })
          .catch(e => console.error("Error refetching cart details:", e));
          
        setRefreshKey(prev => prev + 1); // Increment refresh key to force re-render
      }, 100);
    } catch (e) {
      console.error("Error during cart refresh:", e);
      // Still increment the refresh key as a fallback
      setRefreshKey(prev => prev + 1);
    }
  }, [queryClient]);

  const handleBackPress = () => {
    const previousScreen = route.params?.previousScreen;
    const previousStack = route.params?.previousStack;

    if (navigation.canGoBack()) {
      navigation.goBack(); // Quay lại màn hình trước đó trong stack
    } else if (previousScreen && previousStack) {
      // Nếu có thông tin previousScreen và previousStack
      navigation.navigate('TabNavigation', {
        screen: previousStack,
        params: { screen: previousScreen },
      });
    } else {
      // Mặc định quay lại tab
      navigation.navigate('TabNavigation', {
        screen: 'MainTabs',
        params: { screen: previousTab },
      });
    }
  };

  // Infinite Query cho cart items by account
  const cartByAccountQuery = useInfiniteCartItemsByAccount(10);
  
  // Infinite Query cho cart items details
  const cartDetailsQuery = useInfiniteCartItemsDetails(10);

  // Extract data from queries
  const cartItems = useExtractCartItems(cartByAccountQuery);
  const cartItemsDetails = useExtractCartItemsDetails(cartDetailsQuery);

  // Handle error side effects
  useEffect(() => {
    const error = cartByAccountQuery.error || cartDetailsQuery.error;
    if (error) {
      showError(error instanceof Error ? error.message : 'Không thể tải giỏ hàng');
      if (error instanceof Error && error.message.includes('đăng nhập')) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [cartByAccountQuery.error, cartDetailsQuery.error, navigation, showError]);

  // Kết hợp dữ liệu từ cả hai API
  const combinedCartData = useMemo(() => {
    if (!cartItems.length || !cartItemsDetails.length) {
      return { combinedItems: [], cartId: null, totalPrice: 0 };
    }

    const cart = cartItems[0];
    const details = cartItemsDetails[0];

    if (!cart || !details) {
      return { combinedItems: [], cartId: null, totalPrice: 0 };
    }

    // Map cart items with their detailed information
    const combinedItems = cart.cartItem.map((item: { itemId: string; }) => {
      const detailedItem = details.cartItems.find((detail: CartItemDetailed) => detail.itemId === item.itemId);
      return {
        ...item,
        quantity: detailedItem?.quantity || 1,
        brand: detailedItem?.brand || '',
        ageRange: detailedItem?.ageRange || ''
      };
    });

    return {
      combinedItems,
      cartId: cart.cartId,
      totalPrice: cart.totalPrice
    };
  }, [cartItems, cartItemsDetails]);

  const { combinedItems, totalPrice } = combinedCartData;
  
  const isLoading = cartByAccountQuery.isLoading || cartDetailsQuery.isLoading;
  const isFetchingNextPage = cartByAccountQuery.isFetchingNextPage || cartDetailsQuery.isFetchingNextPage;

  // Xử lý load thêm dữ liệu khi cuộn đến cuối danh sách
  const handleEndReached = () => {
    if (cartByAccountQuery.hasNextPage) {
      cartByAccountQuery.fetchNextPage();
    }
    if (cartDetailsQuery.hasNextPage) {
      cartDetailsQuery.fetchNextPage();
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]); // Clear selections when toggling mode
  }, [selectionMode]);

  // Handle item selection
  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  // Select all items
  const handleSelectAll = useCallback(() => {
    if (combinedItems.length > 0) {
      const allItemIds = combinedItems.map((item: { itemId: any; }) => item.itemId);
      setSelectedItems(allItemIds);
    }
  }, [combinedItems]);

  // Clear all selections
  const handleClearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Exit selection mode
  const handleExitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedItems([]);
  }, []);

  // Calculate total price for selected items
  const selectedItemsTotal = useMemo(() => {
    if (!selectionMode || selectedItems.length === 0) {
      return totalPrice; // Return full cart total when not in selection mode
    }
    
    return combinedItems
      .filter((item: { itemId: string; }) => selectedItems.includes(item.itemId))
      .reduce((sum: number, item: { unitPrice: number; quantity: any; }) => {
        const itemPrice = item.unitPrice * (item.quantity || 1);
        return sum + itemPrice;
      }, 0);
  }, [combinedItems, selectedItems, selectionMode, totalPrice]);

  // Handle payment for selected items
  const handlePlaceOrder = useCallback(() => {
    if (!accessToken) {
      showError('Vui lòng đăng nhập để đặt hàng');
      navigation.navigate('LoginScreen');
      return;
    }

    const itemsToOrder = selectionMode ? selectedItems : combinedItems.map((item: { itemId: any; }) => item.itemId);
    
    if (!itemsToOrder.length) {
      showError(selectionMode ? 'Vui lòng chọn sản phẩm để thanh toán' : 'Giỏ hàng trống. Vui lòng thêm sản phẩm để đặt hàng.');
      return;
    }

    // Show address input modal
    setShowAddressModal(true);
  }, [accessToken, navigation, selectionMode, selectedItems, combinedItems, showError]);

  const handleConfirmOrder = useCallback(() => {
    if (!deliveryAddress.trim()) {
      showError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    const itemsToOrder = selectionMode ? selectedItems : combinedItems.map((item: { itemId: any; }) => item.itemId);
    
    // Navigate to payment screen with required parameters
    navigation.navigate('PaymentScreen', { 
      itemIds: itemsToOrder,
      totalPrice: selectionMode ? selectedItemsTotal : totalPrice,
      address: deliveryAddress.trim()
    });
    
    // Close modal and exit selection mode
    setShowAddressModal(false);
    setDeliveryAddress('');
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedItems([]);
    }
  }, [deliveryAddress, selectionMode, selectedItems, combinedItems, selectedItemsTotal, totalPrice, navigation, showError]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <CartItemCard 
      itemId={item.itemId}
      name={item.name}
      unitPrice={item.unitPrice}
      quantity={item.quantity || 1}
      imageUrl={item.imageUrl}
      color={item.color}
      size={item.size}
      onUpdate={forceRefreshCart}
      isSelected={selectedItems.includes(item.itemId)}
      onSelect={handleSelectItem}
      selectionMode={selectionMode}
      onLongPress={!selectionMode ? toggleSelectionMode : undefined}
    />
  ), [forceRefreshCart, handleSelectItem, selectedItems, selectionMode, toggleSelectionMode]);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader 
        title={selectionMode ? `Đã chọn ${selectedItems.length}/${combinedItems.length}` : "Giỏ Hàng"} 
        onBackButtonPress={selectionMode ? handleExitSelectionMode : handleBackPress}
        rightComponent={selectionMode && (
          <View style={styles.selectionControls}>
            <TouchableOpacity 
              style={styles.selectionButton} 
              onPress={handleSelectAll}
            >
              <Icon name="select-all" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.selectionButton} 
              onPress={handleClearSelection}
            >
              <Icon name="clear" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
      
      {combinedItems.length > 0 && !selectionMode && (
        <View style={styles.selectionHintContainer}>
          <Text style={styles.selectionHintText}>
            Nhấn giữ để chọn sản phẩm thanh toán
          </Text>
        </View>
      )}
      
      <FlatList
        key={refreshKey} // Use refreshKey to force re-render
        data={combinedItems}
        renderItem={renderItem}
        keyExtractor={item => item.itemId}
        contentContainerStyle={[
          styles.content, 
          selectionMode && styles.contentWithSelectionMode
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text style={styles.loadingMore}>Đang tải thêm...</Text>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isLoading ? 'Đang tải...' : 'Giỏ hàng của bạn đang trống!'}
          </Text>
        }
      />
      
      {combinedItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalPrice}>
              {(selectionMode ? selectedItemsTotal : totalPrice).toLocaleString('vi-VN')} VNĐ
              {selectionMode && selectedItems.length === 0 && (
                <Text style={styles.noItemSelectedText}> (chưa chọn sản phẩm)</Text>
              )}
            </Text>
          </View>
          <ButtonAction
            title={selectionMode ? "Thanh Toán Đã Chọn" : "Thanh Toán Tất Cả"}
            onPress={handlePlaceOrder}
            backgroundColor={Colors.primary}
            color={Colors.textWhite}
            disabled={selectionMode && selectedItems.length === 0}
          />
        </View>
      )}
      
      {/* Address Input Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Địa chỉ giao hàng</Text>
            <FormInput
              title="Địa chỉ"
              placeholder="Nhập địa chỉ giao hàng của bạn"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <LoadingOverlay visible={isLoading} fullScreen={false} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 120,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingMore: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    padding: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.textWhite,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 5,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textBlack,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#red',
  },
  errorMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.textBlack,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  selectionControls: {
    flexDirection: 'row',
  },
  selectionButton: {
    padding: 8,
    marginLeft: 10,
  },
  contentWithSelectionMode: {
    paddingBottom: 140, 
  },
  selectionHintContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 60,
    marginBottom: -50, 
    zIndex: 5,
    alignItems: 'center',
  },
  selectionHintText: {
    fontSize: 14,
    color: Colors.textGray,
    fontStyle: 'italic',
  },
  noItemSelectedText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBlack,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.textGray,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.textBlack,
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: Colors.textWhite,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CartScreen;