import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import CardInfoStatus from './CardInfoStatus';

const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

const MotherInfoStatus = () => {
  // Dữ liệu giả định
  const motherInfo = [
    { icon: 'medication', title: 'Lịch uống thuốc', value: '10h: Uống 1 viên sắt' },
    { icon: 'calendar-today', title: 'Lịch siêu âm', value: 'Tuần 17 thai kì' },
    { icon: 'auto-stories', title: 'Nhật ký', value: 'Tuần 14: Thiên thần nhỏ bé của mẹ' },
    { icon: 'shopping-bag', title: 'Giỏ đồ đi sinh', value: 'Tã lót' },
  ];

  return (
    <View>
      {Array.from({ length: Math.ceil(motherInfo.length / 2) }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {motherInfo.slice(rowIndex * 2, rowIndex * 2 + 2).map((info, index) => {
            const colorIndex = (rowIndex * 2 + index) % cardColors.length;
            const { background, text } = cardColors[colorIndex];
            return (
              <CardInfoStatus
                key={index}
                icon={info.icon}
                title={info.title}
                value={info.value}
                backgroundColor={background}
                textColor={text}
                onPressViewMore={() => Alert.alert('Thông tin', 'Tính năng này đang được phát triển')}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default MotherInfoStatus;