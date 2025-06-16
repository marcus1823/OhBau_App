import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
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
import { useFeedBackBooking } from '../../../../../doctor/hooks/useDoctor.hook';

const HistoryAppointmentScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{bookingId: string, doctorId: string, doctorName: string} | null>(null);
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [feedbackContent, setFeedbackContent] = useState('');
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useFeedBackBooking();

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['historyBookings'],
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
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
  });

  // Lọc chỉ các lịch hẹn có trạng thái "Examined" hoặc "Canceled"
  const historyBookings = useMemo(
    () => data?.pages.flatMap((page) => 
      (page.items || []).filter(
        (booking: GetBookingResponse) => 
          booking.type === 'Examined' || booking.type === 'Canceled'
      )
    ) || [],
    [data]
  );

  // Hàm load thêm trang
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Open feedback modal
  const handleOpenFeedback = (bookingId: string, doctorId: string, doctorName: string) => {
    setSelectedBooking({
      bookingId,
      doctorId,
      doctorName
    });
    setFeedbackModalVisible(true);
  };

  // Close feedback modal and reset
  const handleCloseFeedback = () => {
    setFeedbackModalVisible(false);
    setRating(5);
    setFeedbackContent('');
    setSelectedBooking(null);
  };

  // Submit feedback
  const handleSubmitFeedback = () => {
    if (!selectedBooking) {return;}
    
    if (!feedbackContent.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    submitFeedback({
      bookingId: selectedBooking.bookingId,
      doctorId: selectedBooking.doctorId,
      rating: rating,
      content: feedbackContent
    }, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá bác sĩ');
        handleCloseFeedback();
      },
      onError: (err) => {
        // Display the exact error message from the API
        const errorMessage = err instanceof Error ? err.message : 'Không thể gửi đánh giá';
        Alert.alert('Lỗi', errorMessage);
      }
    });
  };

  // Lấy biểu tượng và màu sắc dựa trên trạng thái
  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Examined':
        return { 
          name: 'check-circle', 
          color: Colors.cardHome1,
          text: 'Đã hoàn thành',
          style: styles.statusCompleted
        };
      case 'Canceled':
        return { 
          name: 'cancel', 
          color: Colors.textCardHome1,
          text: 'Đã hủy',
          style: styles.statusCanceled
        };
      default:
        return { 
          name: 'help', 
          color: Colors.textGray,
          text: type || 'Không xác định',
          style: styles.statusDefault
        };
    }
  };

  // Render feedback stars
  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star}
            onPress={() => setRating(star)}
          >
            <Icon 
              name={star <= rating ? "star" : "star-border"} 
              size={32} 
              color={star <= rating ? "#FFD700" : "#CCCCCC"} 
              style={styles.starIcon} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Tối ưu renderItem bằng useCallback
  const renderItem = useCallback(
    ({ item }: { item: GetBookingResponse }) => {
      const statusInfo = getStatusIcon(item.type || '');
      const canFeedback = item.type === 'Examined'; // Only completed appointments can be rated
      
      return (
        <View style={styles.appointmentItem}>
          <View style={styles.headerRow}>
            <View style={styles.dateContainer}>
              <Icon name="event" size={20} color={Colors.primaryDark} style={styles.icon} />
              <Text style={styles.dateText}>Ngày: {item.date}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Icon name={statusInfo.name} size={16} color={statusInfo.color} style={styles.statusIcon} />
              <Text style={[styles.statusText, statusInfo.style]}>
                {statusInfo.text}
              </Text>
            </View>
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
            <Icon name="description" size={18} color={Colors.textGray} style={styles.icon} />
            <Text style={styles.descriptionText}>
              Mô tả: {item.description || 'Chưa có'}
            </Text>
          </View>
          
          {/* Add feedback button for completed appointments only */}
          {canFeedback && (
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => handleOpenFeedback(
                item.id, // Use the booking ID instead of the slot ID
                item.doctor.id,
                item.doctor.fullName
              )}
            >
              <Icon name="rate-review" size={18} color={Colors.textWhite} style={styles.feedbackIcon} />
              <Text style={styles.feedbackButtonText}>Đánh giá</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    []
  );

  // Hiển thị loading hoặc thông báo "đã hết dữ liệu"
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primaryDark} />
          <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
        </View>
      );
    }
    if (!hasNextPage && historyBookings.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Icon name="check-circle" size={20} color={Colors.textGray} style={styles.footerIcon} />
          <Text style={styles.noDataText}>Bạn đã xem hết lịch sử lịch hẹn.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader title="Lịch sử lịch hẹn" onBackButtonPress={() => navigation.goBack()} />
      <FlatList
        data={historyBookings}
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
              <Icon name="history" size={30} color={Colors.textBlack} />
              <Text style={styles.noDataText}>Không có lịch sử lịch hẹn nào để hiển thị.</Text>
            </View>
          )
        }
      />

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={handleCloseFeedback}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đánh giá bác sĩ</Text>
              <Text style={styles.doctorNameText}>{selectedBooking?.doctorName}</Text>
            </View>

            {/* Rating stars */}
            {renderStars()}

            {/* Feedback text input */}
            <TextInput
              style={styles.feedbackTextInput}
              placeholder="Nhập đánh giá của bạn về buổi thăm khám..."
              placeholderTextColor={Colors.textGray}
              value={feedbackContent}
              onChangeText={setFeedbackContent}
              multiline={true}
              maxLength={500}
            />

            {/* Character count */}
            <Text style={styles.charCount}>
              {feedbackContent.length}/500
            </Text>
            
            {/* Button container */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCloseFeedback}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]} 
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator size="small" color={Colors.textWhite} />
                ) : (
                  <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingOverlay
        visible={isLoading || isFetching || isFetchingNextPage || isSubmittingFeedback}
        fullScreen={false}
      />
    </LinearGradient>
  );
};

export default HistoryAppointmentScreen;

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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusCompleted: {
    color: Colors.cardHome1,
  },
  statusCanceled: {
    color: Colors.textCardHome1,
  },
  statusDefault: {
    color: Colors.textGray,
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
  // Feedback button styles
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  feedbackButtonText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedbackIcon: {
    marginRight: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  doctorNameText: {
    fontSize: 16,
    color: Colors.textBlack,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  feedbackTextInput: {
    width: '100%',
    minHeight: 120,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.textBlack,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 5,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.textGray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
});