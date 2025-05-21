import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

// Danh sách màu background và text tương ứng (đồng bộ với CourseCard và CourseCardDetail)
const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface ChapterCardProps {
  name: string;
  description: string;
  progress: number;
  index: number; // Thêm index để chọn màu random
}

const ChapterCard: React.FC<ChapterCardProps> = ({ name, description, progress, index }) => {
  // Chọn màu dựa trên index
  const colorIndex = index % cardColors.length;
  const { background, text } = cardColors[colorIndex];

  // Tính vị trí của text dựa trên progress
  const progressPercentage = progress * 100;
  const textPosition = progressPercentage === 0 ? 50 : progressPercentage; // Nếu progress là 0%, đặt text ở giữa (50%)
  
  // Đảm bảo text không vượt quá biên (giới hạn trong khoảng 5% đến 95% để không bị cắt)
  const adjustedTextPosition = Math.min(Math.max(textPosition, 5), 95);

  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      {/* Tiêu đề chương */}
      <Text style={[styles.chapterTitle]} numberOfLines={2}>
        {name}
      </Text>

      {/* Mô tả chương */}
      <Text style={[styles.chapterDescription]}>{description}</Text>

      {/* Thanh tiến độ */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercentage}%` }, 
          ]}
        />
        <Text
          style={[
            styles.progressText,
            { color: text }, 
            { left: `${adjustedTextPosition}%`, transform: [{ translateX: -15 }] },
          ]}
        >
          {progressPercentage.toFixed(0)}%
        </Text>
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
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textWhite,
  },
  chapterDescription: {
    fontSize: 14,
    color: Colors.textWhite,
    marginBottom: 10,
  },
  progressBarContainer: {
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    height: 18,
    overflow: 'hidden',
    position: 'relative', // Để định vị text tuyệt đối bên trong
  },
  progressBarFill: {
    backgroundColor:'#16A34A',
    height: '100%',
  },
  progressText: {
    position: 'absolute',
    top: 2,
    fontSize: 10,
    width: 30, 
    textAlign: 'center',
  },
});

export default ChapterCard;