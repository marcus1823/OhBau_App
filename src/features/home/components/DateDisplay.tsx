import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

const DateDisplay = () => {
  const today = new Date(); // Lấy ngày hiện tại: 22/05/2025
  const month = (today.getMonth() + 1).toString(); // Tháng: 5
  const currentDay = today.getDate(); // Ngày: 22

  // Tạo mảng 7 ngày của tuần (từ thứ 2 đến chủ nhật)
  const getWeekDays = (date: Date) => {
    const days = [];
    const startDay = date.getDay(); // Ngày hiện tại là thứ 4 (3)
    const daysToMonday = startDay === 0 ? 6 : startDay - 1; // Số ngày từ hôm nay về thứ 2
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToMonday);

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(monday);
      newDate.setDate(monday.getDate() + i);
      days.push(newDate);
    }
    return days;
  };

  const weekDays = getWeekDays(today);
  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']; 

  return (
    <View style={styles.container}>
      {/* Phần tháng */}
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>Tháng {month}</Text>
      </View>
      {/* Phần tuần */}
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => {
          const dayNumber = day.getDate();
          const isToday = dayNumber === currentDay;
          return (
            <View key={index} style={styles.dayWrapper}>
              <Text style={styles.dayName}>{dayNames[index]}</Text>
              <View style={styles.dayItem}>
                <Text style={styles.dayText}>{dayNumber}</Text>
                {isToday && <View style={styles.todayCircle} />}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthContainer: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textTimeMonth,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: Colors.textTimeDay, 
    marginBottom: 2,
  },
  dayItem: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textTimeDay,
    zIndex: 1,
  },
  todayCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary, // Màu hồng nổi bật cho ngày hiện tại
    zIndex: 0,
  },
});

export default DateDisplay;