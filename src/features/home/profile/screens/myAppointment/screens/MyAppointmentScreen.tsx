import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../stores/store';
import { getBookingsApi } from '../../../../../doctor/api/doctorApi';
import { GetBookingResponse } from '../../../../../doctor/types/doctor.type';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

const MyAppointmentScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['myBookings'],
    queryFn: async ({ pageParam = 1 }) => {
      const request = {
        page: pageParam,
        size: 10,
      };
      if (!accessToken) {
        throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
      }
      try {
        const response = await getBookingsApi(request, accessToken);
        return response;
      } catch (err) {
        throw new Error('Failed to fetch bookings');
      }
    },
    getNextPageParam: (lastPage) => {
      console.log('Last Page:', lastPage);
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
    refetchOnWindowFocus: true, 
  });

  // Add a useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Refresh the data when the screen is focused
      if (refetch) {
        console.log('MyAppointmentScreen focused - refetching data');
        refetch();
      }
      return () => {
        // Cleanup if needed
      };
    }, [refetch])
  );

  console.log('Query States:', { isLoading, isFetching, isFetchingNextPage, hasNextPage });

  // Lọc chỉ các lịch hẹn có trạng thái "Booked"
  const bookings = useMemo(
    () => data?.pages.flatMap((page) => 
      (page.items || []).filter(
        (booking: GetBookingResponse) => booking.type === 'Booked'
      )
    ) || [],
    [data]
  );

  // Hàm load thêm trang
  const handleLoadMore = () => {
    console.log('handleLoadMore called', { hasNextPage, isFetchingNextPage });
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Hàm kiểm tra trạng thái lịch hẹn (Sắp tới hoặc Đã qua)
  const getAppointmentStatus = (date: string) => {
    const currentDate = new Date(); // Ngày hiện tại
    const appointmentDate = new Date(date);
    return appointmentDate >= currentDate ? 'Sắp tới' : 'Đã qua';
  };

  // Tối ưu renderItem bằng useCallback
  const renderItem = useCallback(
    ({ item }: { item: GetBookingResponse }) => {
      const status = getAppointmentStatus(item.date);
      return (
        <View style={styles.appointmentItem}>
          <View style={styles.headerRow}>
            <View style={styles.dateContainer}>
              <Icon name="event" size={20} color={Colors.primaryDark} style={styles.icon} />
              <Text style={styles.dateText}>Ngày: {item.date}</Text>
            </View>
            <Text
              style={[
                styles.statusText,
                status === 'Sắp tới' ? styles.statusUpcoming : styles.statusPast,
              ]}
            >
              {status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="person" size={18} color={Colors.textBlack} style={styles.icon} />
            <Text style={styles.doctorText}>Bác sĩ: {item.doctor.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="access-time" size={18} color={Colors.textTimeDay} style={styles.icon} />
            <Text style={styles.timeText}>
              Giờ: {item.slot.startTime} - {item.slot.endTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="info" size={18} color={Colors.textCardHome1} style={styles.icon} />
            <Text style={styles.moduleText}>Mục đích: {item.bookingModule || 'Chưa có'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="schedule" size={18} color={Colors.primary} style={styles.icon} />
            <Text style={styles.bookingStatusText}>Trạng thái: Đã đặt lịch</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="description" size={18} color={Colors.textGray} style={styles.icon} />
            <Text style={styles.descriptionText}>
              Mô tả: {item.description || 'Chưa có'}
            </Text>
          </View>
        </View>
      );
    },
    []
  );

  // Hiển thị loading hoặc thông báo "đã hết dữ liệu"
  const renderFooter = () => {
    console.log('Render Footer:', { isFetchingNextPage, hasNextPage, bookingsLength: bookings.length });
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primaryDark} />
          <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
        </View>
      );
    }
    if (!hasNextPage && bookings.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Icon name="check-circle" size={20} color={Colors.textGray} style={styles.footerIcon} />
          <Text style={styles.noDataText}>Bạn đã xem hết danh sách lịch hẹn.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader title="Lịch hẹn của tôi" onBackButtonPress={() => navigation.goBack()} />
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.slot.id}-${item.date}-${index}`}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading || isFetching ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colors.primaryDark} />
              <Text style={styles.noDataText}>Đang tải...</Text>
            </View>
          ) : error instanceof Error ? (
            <View style={styles.emptyContainer}>
              <Icon name="error" size={30} color={Colors.textCardHome1} />
              <Text style={styles.noDataText}>Lỗi: {error.message}</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="event-busy" size={30} color={Colors.textBlack} />
              <Text style={styles.noDataText}>Không có lịch hẹn nào để hiển thị.</Text>
            </View>
          )
        }
      />
      <LoadingOverlay
        visible={isLoading || isFetching || isFetchingNextPage}
        fullScreen={false}
      />
    </LinearGradient>
  );
};

export default MyAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  appointmentItem: {
    backgroundColor: Colors.textWhite,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusUpcoming: {
    backgroundColor: Colors.cardHome1,
    color: Colors.textCardHome1,
  },
  statusPast: {
    backgroundColor: Colors.textBlack,
    color: Colors.textDarkGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBlack,
  },
  doctorText: {
    fontSize: 14,
    color: Colors.textBlack,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: Colors.textTimeDay,
    fontWeight: '500',
  },
  moduleText: {
    fontSize: 14,
    color: Colors.textCardHome1,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.border,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 10,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerIcon: {
    marginRight: 8,
  },
  bookingStatusText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});