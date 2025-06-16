import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useMemo, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrdersApi } from '../api/orderApi';
import { RootState } from '../../../../../../stores/store';
import { useSelector } from 'react-redux';
import { Order, PaymentStatus } from '../types/order.types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import { useFocusEffect } from '@react-navigation/native';

const PAGE_SIZE = 10;

const HistoryPurchaseScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken || '');

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['orders'],
    queryFn: async ({ pageParam = 1 }) => {
      return await getOrdersApi(pageParam as number, PAGE_SIZE, accessToken);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) {return undefined;}
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!accessToken,
  });

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (refetch) {
        refetch();
      }
      return () => {};
    }, [refetch])
  );

  const orders: Order[] = useMemo(() => {
    if (!data) {return [];}
    return data.pages.flatMap((page) => page.data?.items || []);
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case 'Paid': return Colors.cardHome1;
      case 'Pending': return Colors.primary;
      case 'Failed': return '#ff4444';
      case 'Cancelled': return Colors.textDarkGray;
      case 'Refunded': return '#8B8000';
      default: return Colors.textGray;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => console.log('Order details:', item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Icon name="receipt" size={18} color={Colors.textBlack} style={styles.icon} />
          <Text style={styles.orderId}>Mã đơn: {item.id.substring(0, 8)}...</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.paymentStatus) }]}>
          <Text style={styles.statusText}>{item.paymentStatus}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="event" size={16} color={Colors.textGray} style={styles.icon} />
          <Text style={styles.infoText}>Ngày đặt: {formatDate(item.createdDate)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="email" size={16} color={Colors.textGray} style={styles.icon} />
          <Text style={styles.infoText}>Email: {item.email || 'Chưa cập nhật'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="phone" size={16} color={Colors.textGray} style={styles.icon} />
          <Text style={styles.infoText}>SĐT: {item.phone || 'Chưa cập nhật'}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.totalPrice}>
          Tổng tiền: {item.totalPrice.toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.footerText}>Đang tải thêm...</Text>
        </View>
      );
    }
    if (!hasNextPage && orders.length > 0) {
      return <Text style={styles.footerText}>Không còn đơn hàng nào nữa</Text>;
    }
    return null;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader 
        title="Lịch sử mua hàng" 
        onBackButtonPress={() => navigation.goBack()} 
      />

      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-long" size={60} color={Colors.textGray} />
              <Text style={styles.emptyText}>
                {error ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Không có đơn hàng nào'}
              </Text>
              {error && (
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      />
      
      <LoadingOverlay visible={isLoading && !isFetchingNextPage} fullScreen={false} />
    </LinearGradient>
  );
};

export default HistoryPurchaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginTop: 60,
  },
  orderCard: {
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textBlack,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  cardBody: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textBlack,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 15,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  retryText: {
    color: Colors.textWhite,
    fontWeight: '500',
  },
});