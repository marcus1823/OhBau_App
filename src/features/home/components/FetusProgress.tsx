import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface FetusProgressProps {
  weeks: number; // Số tuần của thai nhi
  name: string; // Tên thai nhi
  startDate: string; // Ngày bắt đầu
  endDate: string; // Ngày kết thúc
}

const FetusImage = require('../../../assets/images/Home/Baby_Image.png');

const FetusProgress: React.FC<FetusProgressProps> = ({ weeks, startDate, endDate }) => {
  // Tính tiến độ dựa trên ngày
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(); // Ngày hiện tại: 22/05/2025

  const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Tổng số ngày
  const elapsedDuration = (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Số ngày đã qua
  const progressPercentage = Math.min((elapsedDuration / totalDuration) * 100, 100); // Tỷ lệ phần trăm (tối đa 100%)
  const days = Math.ceil(elapsedDuration); // Số ngày chính xác (làm tròn lên)

  // Logic hiển thị tuần hoặc ngày
  const displayText = weeks >= 1 
    ? `Mẹ ơi con được ${weeks} tuần rồi nè!` 
    : `Mẹ ơi con được ${days} ngày rồi nè!`;

  return (
    <View style={styles.container}>
      {/* Câu nói của thai nhi */}
      <Text style={styles.progressText}>
        {displayText}
      </Text>

      {/* Thanh tiến độ */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
          >
            {/* Điểm nút tiến độ */}
            <View style={styles.progressDot} />
          </View>
        </View>
      </View>

      {/* Hình ảnh thai nhi */}
      <Image
        source={FetusImage}
        style={styles.fetusImage}
        resizeMode="contain"
      />

      {/* Đoạn text mô tả */}
      <Text style={styles.descriptionText}>Hôm nay mẹ thấy thế nào?</Text>
      <Text style={styles.descriptionText}>
        Nhớ chăm sóc bản thân nha, con thương mẹ lắm!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressContainer: {
    width: 250, 
    marginBottom: 15,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: Colors.textWhite, 
    borderRadius: 30,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary, 
    borderRadius: 30,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end', // Đảm bảo điểm nút ở cuối thanh điền đầy
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: Colors.primary, 
    borderWidth: 1.5,
    borderColor: Colors.textWhite, 
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  fetusImage: {
    width: 185,
    height: 195,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 11,
    color: Colors.textWhite,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default FetusProgress;