import React, { useEffect, useMemo, useCallback } from 'react';
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
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCreateOrder } from '../hooks/useCourse.hook';
import { GetCartItemsByAccountResponse, GetCartItemsDetailsResponse } from '../types/course.types';
import ButtonAction from '../../auth/components/ButtonAction';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation, route }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isPlacingOrder } = useCreateOrder();


  // Lấy previousTab từ route params, không đặt mặc định
  const previousTab = route.params?.previousTab || 'Trang Chủ';


  // Làm mới dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });
    }, [queryClient])
  );


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
  const {
    data: cartByAccountData,
    fetchNextPage: fetchNextCartItems,
    hasNextPage: hasNextCartItems,
    isLoading: isLoadingByAccount,
    isFetchingNextPage: isFetchingNextCartItems,
    error: errorByAccount,
  } = useInfiniteQuery<GetCartItemsByAccountResponse, Error>({
    queryKey: ['cartItemsByAccountInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
      }
      return await getCartItemsByAccountApi(pageParam as number, 10, accessToken);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
    retry: false,
  });

  // Infinite Query cho cart items details
  const {
    data: cartDetailsData,
    fetchNextPage: fetchNextDetails,
    hasNextPage: hasNextDetails,
    isLoading: isLoadingDetails,
    isFetchingNextPage: isFetchingNextDetails,
    error: errorDetails,
  } = useInfiniteQuery<GetCartItemsDetailsResponse, Error>({
    queryKey: ['cartItemsDetailsInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
      }
      return await getCartItemsDetailsApi(pageParam as number, 10, accessToken);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
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

  // Kết hợp dữ liệu từ cả hai API
  const cartData = useMemo(() => {
    const cartItemsByAccount = cartByAccountData?.pages.flatMap((page) => page.items) || [];
    const cartDetails = cartDetailsData?.pages.flatMap((page) => page.items) || [];

    const cart = cartItemsByAccount[0] || null;
    const details = cartDetails[0] || null;

    if (!cart || !details) {
      return { cartItems: [], cartId: null };
    }

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
  const isFetchingNextPage = isFetchingNextCartItems || isFetchingNextDetails;

  // Xử lý load thêm dữ liệu khi cuộn đến cuối danh sách
  const handleEndReached = () => {
    if (hasNextCartItems) { fetchNextCartItems(); }
    if (hasNextDetails) { fetchNextDetails(); }
  };

  // Handle đặt hàng và thanh toán
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
          queryClient.invalidateQueries({ queryKey: ['cartItemsByAccountInfinite'] });
          queryClient.invalidateQueries({ queryKey: ['cartItemsDetailsInfinite'] });
          showSuccess('Đặt hàng thành công!');

          try {
            const paymentUrl = await createPaymentApi(response.orderCode, response.orderCode, accessToken);
            navigation.navigate('TabNavigation', {
              screen: 'PaymentScreen',
              params: { url: paymentUrl, previousTab },
            });
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
    <CartItemCard itemId={item.itemId} name={item.name} unitPrice={item.unitPrice} />
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader title="Giỏ Hàng" onBackButtonPress={handleBackPress} />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemId}
        contentContainerStyle={styles.content}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text style={styles.loadingMore}>Đang tải thêm...</Text>
          ) : null
        }
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
  loadingMore: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    padding: 10,
  },
  placeOrderButton: {
    bottom: 100,
    alignItems: 'center',
  },
});

export default CartScreen;