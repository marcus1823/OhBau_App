import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Danh sách màu background và text tương ứng
const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface CourseCardDetailProps {
  title: string;
  duration: number;
  active: boolean;
  index: number;
}

const CourseCardDetail: React.FC<CourseCardDetailProps> = ({
  title,
  duration,
  active,
  index,
}) => {
  const colorIndex = index % cardColors.length;
  const { background, text } = cardColors[colorIndex];

  // Chọn icon dựa trên trạng thái active
  const iconName = active ? 'favorite-outline' : 'shopping-cart';

  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      {/* Tiêu đề bài học và icon */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={16} color={text} />
        </View>
      </View>

      {/* Thời lượng bài học */}
      <View style={styles.infoRow}>
        <View style={styles.durationContainer}>
          <Icon name="access-time" size={16} color={text} />
          <Text style={[styles.durationText, { color: text }]}>{duration} phút</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 13,
    padding: 15,
    marginBottom: 15,
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
  title: {
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
});

export default CourseCardDetail;