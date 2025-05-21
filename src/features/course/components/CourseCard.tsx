import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Danh sách màu background và text tương ứng
const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface CourseCardProps {
  name: string;
  rating: number;
  duration: number;
  price: number;
  showBuyButton?: boolean;
  onBuyPress?: () => void;
  index: number; // Index sẽ được điều chỉnh ở CourseScreen
}

const CourseCard: React.FC<CourseCardProps> = ({
  name,
  rating,
  duration,
  price,
  showBuyButton = false,
  onBuyPress,
  index,
}) => {
  // Chọn màu dựa trên index
  const colorIndex = index % cardColors.length;
  const { background, text } = cardColors[colorIndex];

  // Chọn icon dựa trên showBuyButton
  const iconName = showBuyButton ? 'shopping-cart' : 'favorite-outline';

  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      {/* Tên khóa học và biểu tượng */}
      <View style={styles.headerRow}>
        <Text style={styles.courseName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={16} color={text} />
        </View>
      </View>

      {/* Rating và Duration */}
      <View style={styles.infoRow}>
        <View style={styles.ratingContainer}>
          <Icon name="star-outline" size={16} color={text} />
          <Text style={[styles.ratingText, { color: text }]}>{rating}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Icon name="access-time" size={16} color={text} />
          <Text style={[styles.durationText, { color: text }]}>{duration} hours</Text>
        </View>
      </View>

      {/* Giá (ẩn khi showBuyButton là false) */}
      {showBuyButton && (
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: text }]}>{price.toLocaleString()} VNĐ</Text>
          </View>
        </View>
      )}

      {/* Nút MUA NGAY */}
      {showBuyButton && (
        <View style={styles.buyButtonRow}>
          <TouchableOpacity style={styles.buyButton} onPress={onBuyPress}>
            <Text style={[styles.buyButtonText, { color: text }]}>MUA NGAY</Text>
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
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  price: {
    fontSize: 12,
  },
  buyButtonRow: {},
  buyButton: {
    backgroundColor: Colors.textWhite,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  buyButtonText: {
    fontWeight: 500,
    fontSize: 12,
  },
});

export default CourseCard;