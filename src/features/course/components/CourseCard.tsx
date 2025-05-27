import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddCourseToCart } from '../hooks/useCourse.hook';
import { useSelector } from 'react-redux';

import { useToast } from '../../../utils/toasts/useToast';
import { RootState } from '../../../stores/store';

const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.cardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface CourseCardProps {
  courseId: string;
  name: string;
  rating: number;
  duration: number;
  price: number;
  isPurchased: boolean;
  showBuyButton?: boolean;
  index: number;
  navigation: any;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  name,
  rating,
  duration,
  price,
  isPurchased,
  showBuyButton = false,
  index,
  navigation,
}) => {
  const { mutate, isPending } = useAddCourseToCart();
  const addedCourses = useSelector((state: RootState) => state.cart.addedCourses);
  const { showSuccess, showError } = useToast();
  const isInCart = addedCourses.includes(courseId);

  const handleAddToCart = () => {
    if (!isInCart && !isPending) {
      mutate({ courseId }, {
        onError: (error) => {
          if (error instanceof Error && error.message.includes('208')) {
            showError('Sản phẩm đã có trong giỏ hàng');
          }
        },
      });
    } else if (isInCart) {
      showError('Sản phẩm đã có trong giỏ hàng');
    }
  };

  const handleBuyNow = () => {
    if (!isInCart && !isPending) {
      mutate({ courseId, isBuyNow: true }, {
        onSuccess: () => {
          showSuccess('Thêm vào giỏ hàng thành công!');
          navigation.navigate('CartScreen');
        },
        onError: (error) => {
          if (error instanceof Error && error.message.includes('208')) {
            showError('Sản phẩm đã có trong giỏ hàng');
            navigation.navigate('CartScreen');
          }
        },
      });
    } else {
      showError('Sản phẩm đã có trong giỏ hàng');
      navigation.navigate('CartScreen');
    }
  };

  const iconName = isInCart || isPending ? 'check' : (showBuyButton ? 'shopping-cart' : 'favorite-outline');
  const isIconDisabled = isInCart || isPending;

  return (
    <View style={[styles.card, { backgroundColor: cardColors[index % cardColors.length].background }]}>
      <View style={styles.headerRow}>
        <Text style={styles.courseName} numberOfLines={2}>{name}</Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleAddToCart}
          disabled={isIconDisabled}
        >
          <Icon name={iconName} size={16} color={isIconDisabled ? Colors.disabledBg : cardColors[index % cardColors.length].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.ratingContainer}>
          <Icon name="star-outline" size={16} color={cardColors[index % cardColors.length].text} />
          <Text style={[styles.ratingText, { color: cardColors[index % cardColors.length].text }]}>{rating}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Icon name="access-time" size={16} color={cardColors[index % cardColors.length].text} />
          <Text style={[styles.durationText, { color: cardColors[index % cardColors.length].text }]}>{duration} hours</Text>
        </View>
      </View>

      {!isPurchased && showBuyButton && (
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{price.toLocaleString()} VNĐ</Text>
          </View>
        </View>
      )}

      {!isPurchased && showBuyButton && (
        <View style={styles.buyButtonRow}>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow} disabled={isPending}>
            <Text style={[styles.buyButtonText, { color: cardColors[index % cardColors.length].text }]}>MUA NGAY</Text>
          </TouchableOpacity>
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
  buyButtonRow: {},
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
});

export default CourseCard;