import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddCourseToMyCourses, useToggleFavoriteCourse, useCourseStatus } from '../hooks/useCourse.hook';
import { useToast } from '../../../utils/toasts/useToast';

const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface CourseCardProps {
  courseId: string;
  name: string;
  rating: number;
  duration: number;
  price?: number; // Giữ lại nhưng không hiển thị
  isPurchased?: boolean;
  showBuyButton?: boolean;
  index: number;
  navigation: any;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  name,
  rating,
  duration,
  isPurchased = false,
  showBuyButton = false,
  index,
  navigation,
}) => {
  const { mutate: addToMyCourses, isPending: isAddingToCourse } = useAddCourseToMyCourses();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavoriteCourse();
  
  // Use API-based status checking instead of Redux
  const { 
    data: courseStatus, 
    isLoading: isLoadingStatus  } = useCourseStatus(courseId);
  
  const { showSuccess, showError } = useToast();
  
  // Use API data instead of Redux state
  const isInMyCourse = (courseStatus?.isInMyCourses || isPurchased) ?? false;
  const isInFavorites = courseStatus?.isInFavorites ?? false;

  // Xử lý thêm/xóa khỏi yêu thích
  const handleToggleFavorite = () => {
    if (!isTogglingFavorite) {
      toggleFavorite(
        { courseId },
        {
          onSuccess: () => {
            const message = isInFavorites 
              ? 'Đã xóa khỏi danh sách yêu thích!'
              : 'Đã thêm vào danh sách yêu thích!';
            showSuccess(message);
          },
          onError: (error) => {
            showError('Đã xảy ra lỗi khi cập nhật danh sách yêu thích');
            console.log('Error toggling favorite:', error);
          },
        }
      );
    }
  };

  // Xử lý thêm vào khóa học của tôi
  const handleAddToMyCourses = () => {
    if (isInMyCourse) {
      showError('Khóa học đã có trong danh sách của bạn');
      navigation.navigate('TabNavigation', {
        screen: 'CourseScreen',
        params: { screen: 'Khóa học', tab: 'myCourses' },
      });
      return;
    }
    
    if (!isAddingToCourse) {
      addToMyCourses(
        { courseId },
        {
          onSuccess: () => {
            showSuccess('Thêm khóa học vào danh sách của tôi thành công!');
            navigation.navigate('TabNavigation', {
              screen: 'CourseScreen',
              params: { screen: 'Khóa học', tab: 'myCourses' },
            });
          },
          onError: (error) => {
            if (error instanceof Error && error.message.includes('208')) {
              const message = error.message.includes('You have already received this course')
                ? 'Bạn đã thêm khóa học này rồi'
                : 'Khóa học đã có trong danh sách của bạn';
              showError(message);
              navigation.navigate('TabNavigation', {
                screen: 'CourseScreen',
                params: { screen: 'Khóa học', tab: 'myCourses' },
              });
            } else {
              showError('Đã xảy ra lỗi khi thêm vào danh sách của tôi');
            }
          },
        }
      );
    }
  };

  // Icon cho nút yêu thích
  const favoriteIconName = isInFavorites ? 'favorite' : 'favorite-outline';
  
  return (
    <View style={[styles.card, { backgroundColor: cardColors[index % cardColors.length].background }]}>
      <View style={styles.headerRow}>
        <Text style={styles.courseName} numberOfLines={2}>
          {name}
        </Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleToggleFavorite}
          disabled={isTogglingFavorite || isLoadingStatus}
        >
          {isLoadingStatus ? (
            <ActivityIndicator size="small" color={cardColors[index % cardColors.length].text} />
          ) : (
            <Icon
              name={favoriteIconName}
              size={16}
              color={cardColors[index % cardColors.length].text}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.ratingContainer}>
          <Icon name="star-outline" size={16} color={cardColors[index % cardColors.length].text} />
          <Text style={[styles.ratingText, { color: cardColors[index % cardColors.length].text }]}>
            {rating}
          </Text>
        </View>
        <View style={styles.durationContainer}>
          <Icon name="access-time" size={16} color={cardColors[index % cardColors.length].text} />
          <Text style={[styles.durationText, { color: cardColors[index % cardColors.length].text }]}>
            {duration} giờ
          </Text>
        </View>
      </View>

      {/* Removed price display */}

      {!isInMyCourse && showBuyButton && !isLoadingStatus && (
        <View style={styles.buyButtonRow}>
          <TouchableOpacity 
            style={styles.buyButton} 
            onPress={handleAddToMyCourses} 
            disabled={isAddingToCourse || isLoadingStatus}
          >
            <Text style={[styles.buyButtonText, { color: cardColors[index % cardColors.length].text }]}>
              THÊM KHOÁ HỌC
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isLoadingStatus && showBuyButton && (
        <View style={styles.buyButtonRow}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.textWhite} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 13,
    padding: 15,
    marginRight: 15,
    width: 225,
    height: 180,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: Colors.textWhite,
    marginRight: 10,
    lineHeight: 22,
    height: 22 * 2,
  },
  iconContainer: {
    backgroundColor: Colors.textWhite,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    marginLeft: 5,
    fontSize: 10,
  },
  // Price styles are commented out as we no longer display prices
  /* 
  priceRow: {
    marginBottom: 10,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  price: {
    fontSize: 14,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  */
  buyButtonRow: {
    marginTop: 'auto',
  },
  buyButton: {
    backgroundColor: Colors.textWhite,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  buyButtonText: {
    fontWeight: '500',
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }
});

export default CourseCard;