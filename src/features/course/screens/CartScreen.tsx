import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CartItemCard from '../components/CartItemCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { createPaymentApi, getCartItemsByAccountApi, getCartItemsDetailsApi } from '../api/courseApi';
import { useToast } from '../../../utils/toasts/useToast';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCreateOrder } from '../hooks/useCourse.hook';
import { GetCartItemsByAccountResponse, GetCartItemsDetailsResponse } from '../types/course.types';
import ButtonAction from '../../auth/components/ButtonAction';

const CartScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isPlacingOrder } = useCreateOrder();

  // Fetch cart items by account
  const { data: cartByAccountData, isLoading: isLoadingByAccount, error: errorByAccount } = useQuery<
    GetCartItemsByAccountResponse,
    Error
  >({
    queryKey: ['cartItemsByAccount'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
      }
      return await getCartItemsByAccountApi(1, 10, accessToken);
    },
    enabled: !!accessToken,
    retry: false,
  });

  // Fetch cart items details
  const { data: cartDetailsData, isLoading: isLoadingDetails, error: errorDetails } = useQuery<
    GetCartItemsDetailsResponse,
    Error
  >({
    queryKey: ['cartItemsDetails'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
      }
      return await getCartItemsDetailsApi(1, 10, accessToken);
    },
    enabled: !!accessToken,
    retry: false,
  });

  // Handle error side effects
  useEffect(() => {
    if (errorByAccount || errorDetails) {
      const error = errorByAccount || errorDetails;
      showError(error?.message || 'Không thể tải giỏ hàng');
      if (error?.message.includes('đăng nhập')) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [errorByAccount, errorDetails, navigation, showError]);

  // Combine data from both APIs
  const cartData = useMemo(() => {
    const cart = cartByAccountData?.items?.[0] || null;
    const details = cartDetailsData?.items?.[0] || null;

    if (!cart || !details) {return { cartItems: [], cartId: null };}

    // Map detailId to itemId by matching on name
    const cartItems = cart.cartItem.map((item) => {
      const detailItem = details.cartItems.find((detail) => detail.name === item.name);
      return {
        ...item,
        itemId: detailItem ? detailItem.detailId : '',
      };
    });

    return {
      cartItems: cartItems.filter((item) => item.itemId),
      cartId: cart.cartId,
    };
  }, [cartByAccountData, cartDetailsData]);

  const { cartItems, cartId } = cartData;
  const isLoading = isLoadingByAccount || isLoadingDetails;

  // Log cartItems to debug
  useEffect(() => {
    console.log('Combined cartItems:', cartItems);
  }, [cartItems]);

  // Handle placing order and payment
  const handlePlaceOrder = async () => {
    if (!cartId) {
      showError('Giỏ hàng trống. Vui lòng thêm sản phẩm để đặt hàng.');
      return;
    }

    if (!accessToken) {
      showError('Vui lòng đăng nhập để đặt hàng');
      navigation.navigate('LoginScreen');
      return;
    }

    createOrder(
      { cartId },
      {
        onSuccess: async (response) => {
          queryClient.invalidateQueries({ queryKey: ['cartItemsByAccount'] });
          queryClient.invalidateQueries({ queryKey: ['cartItemsDetails'] });
          showSuccess('Đặt hàng thành công!');

          try {
            const paymentUrl = await createPaymentApi(response.orderCode, response.orderCode, accessToken); // Pass accessToken
            console.log('Payment URL:', paymentUrl);
            navigation.navigate('PaymentScreen', { url: paymentUrl });
          } catch (error) {
            showError('Không thể tạo liên kết thanh toán: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
          }
        },
        onError: (err) => {
          showError(err instanceof Error ? err.message : 'Không thể đặt hàng');
        },
      }
    );
  };

  const renderItem = ({ item }: { item: { itemId: string; name: string; unitPrice: number } }) => (
    <CartItemCard
      itemId={item.itemId}
      name={item.name}
      unitPrice={item.unitPrice}
    />
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Giỏ Hàng"
        onBackButtonPress={() => navigation.goBack()}
      />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemId}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isLoading ? 'Đang tải...' : errorByAccount || errorDetails ? 'Lỗi tải giỏ hàng' : 'Giỏ hàng của bạn đang trống!'}
          </Text>
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.placeOrderButton}>
          <ButtonAction
            title="Đặt Hàng"
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            backgroundColor={Colors.primary}
            color={Colors.textWhite}
          />
        </View>
      )}
      <LoadingOverlay visible={isLoading || isPlacingOrder} fullScreen={false} />
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
    paddingBottom: 80,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  placeOrderButton: {
    bottom: 100,
    alignItems: 'center',
  },
});

export default CartScreen;