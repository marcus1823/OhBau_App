import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';

// Định nghĩa kiểu props cho component
interface DatePickerProps {
  onDateChange: (date: Date) => void; // Callback khi người dùng chọn ngày
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  // Lấy ngày hiện tại thực tế
  const currentDate = new Date(); // 04:55 PM +07, 15/05/2025
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [displayDate, setDisplayDate] = useState<Date>(currentDate); // Ngày để hiển thị tuần
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false); // Trạng thái modal tháng

  // Lấy danh sách 6 ngày từ T2 đến T7
  const getWeekDays = (startDate: Date) => {
    const days = [];
    const startDay = startDate.getDay(); // 0 = Chủ Nhật, 1 = Thứ Hai, ...
    const daysToMonday = (startDay + 6) % 7; // Tính số ngày để quay về T2
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() - daysToMonday);

    for (let i = 0; i < 6; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Lấy tuần hiện tại
  const daysToShow = getWeekDays(displayDate);

  // Kiểm tra xem có thể chuyển sang tuần trước không
  const canGoPrevWeek = () => {
    const firstDayOfWeek = daysToShow[0]; // Ngày đầu tiên trong tuần hiện tại (T2)
    const prevWeekDate = new Date(firstDayOfWeek);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7); // T2 của tuần trước

    // Cho phép quay lại tuần trước nếu tuần đó vẫn có ngày từ 15/05/2025 trở đi
    const earliestAllowedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return prevWeekDate >= earliestAllowedDate || daysToShow.some(day => day >= earliestAllowedDate);
  };

  // Chuyển sang tuần trước
  const handlePrevWeek = () => {
    if (!canGoPrevWeek()) {return;}
    const newDate = new Date(displayDate);
    newDate.setDate(newDate.getDate() - 7);
    setDisplayDate(newDate);
  };

  // Chuyển sang tuần sau
  const handleNextWeek = () => {
    const newDate = new Date(displayDate);
    newDate.setDate(newDate.getDate() + 7);
    setDisplayDate(newDate);
  };

  // Mở modal để chọn tháng
  const handleOpenMonthModal = () => {
    setIsMonthModalVisible(true);
  };

  // Chọn tháng và đặt tuần đầu tiên của tháng (hoặc tuần hiện tại nếu là tháng hiện tại)
  const handleSelectMonth = (month: number) => {
    const year = displayDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Không cho phép chọn tháng trong quá khứ
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return;
    }

    const firstDayOfMonth = new Date(year, month, 1);
    const isCurrentMonth = month === currentDate.getMonth() && year === currentDate.getFullYear();
    setDisplayDate(isCurrentMonth ? currentDate : firstDayOfMonth);
    setIsMonthModalVisible(false);
  };

  // Hàm khi người dùng chọn ngày
  const handleDateSelect = (date: Date) => {
    // Không cho phép chọn ngày trong quá khứ
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    if (date < today) {
      return;
    }

    setSelectedDate(date);
    onDateChange(date); // Gọi callback để truyền ngày được chọn
  };

  // Lấy tên tháng bằng tiếng Việt
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const currentMonthIndex = currentDate.getMonth();
  const displayMonthIndex = displayDate.getMonth();
  const currentMonth = monthNames[displayDate.getMonth()];

  // Lấy ngày trong tuần bằng tiếng Việt (T2, T3, T4, T5, T6, T7)
  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const getDayName = (date: Date) => {
    const dayIndex = (date.getDay() + 6) % 7; // Điều chỉnh để T2 là 0, T7 là 5
    return dayNames[dayIndex];
  };

  // Render item cho danh sách tháng trong modal
  const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
    const isCurrentMonth = index === currentMonthIndex;
    const isSelectedMonth = index === displayMonthIndex;
    const currentYear = currentDate.getFullYear();
    const displayYear = displayDate.getFullYear();
    const isPastMonth = displayYear < currentYear || (displayYear === currentYear && index < currentMonthIndex);

    return (
      <TouchableOpacity
        style={[
          styles.monthItem,
          isCurrentMonth && styles.monthItemCurrent,
          isSelectedMonth && styles.monthItemSelected,
          isPastMonth && styles.monthItemDisabled,
        ]}
        onPress={() => handleSelectMonth(index)}
        disabled={isPastMonth}
      >
        <Text
          style={[
            styles.monthItemText,
            isCurrentMonth && styles.monthItemTextCurrent,
            isSelectedMonth && styles.monthItemTextSelected,
            isPastMonth && styles.monthItemTextDisabled,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header: Tháng và nút mở modal */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.monthContainer} onPress={handleOpenMonthModal}>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <Icon name="keyboard-arrow-down" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Danh sách ngày và nút điều hướng */}
      <View style={styles.daysWrapper}>
        <TouchableOpacity
          onPress={handlePrevWeek}
          style={[styles.navButton, !canGoPrevWeek() && styles.navButtonDisabled]}
          disabled={!canGoPrevWeek()}
        >
          <Icon name="chevron-left" size={24} color={canGoPrevWeek() ? Colors.textWhite : '#A0A0A0'} />
        </TouchableOpacity>
        <View style={styles.daysContainer}>
          {daysToShow.map((date, index) => {
            const isCurrentDay =
              date.getDate() === currentDate.getDate() &&
              date.getMonth() === currentDate.getMonth() &&
              date.getFullYear() === currentDate.getFullYear();
            const isSelected =
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            const isPastDay = date < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayItem,
                  isSelected && styles.dayItemSelected,
                  isCurrentDay && styles.dayItemCurrent,
                  isPastDay && styles.dayItemDisabled,
                ]}
                onPress={() => handleDateSelect(date)}
                disabled={isPastDay}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isCurrentDay && styles.dayTextCurrent,
                    isPastDay && styles.dayTextDisabled,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dayName,
                    isSelected && styles.dayNameSelected,
                    isCurrentDay && styles.dayNameCurrent,
                    isPastDay && styles.dayNameDisabled,
                  ]}
                >
                  {getDayName(date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Icon name="chevron-right" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Modal chọn tháng */}
      <Modal
        visible={isMonthModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsMonthModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#FF6F61', '#FFB3B6']}
              style={styles.modalGradient}
            >
              <FlatList
                data={monthNames}
                renderItem={renderMonthItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3} // 4 hàng, mỗi hàng 3 tháng
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 17,
    backgroundColor: '#ECCBCA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginLeft: 25,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginRight: 2,
  },
  daysWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 2,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 65,
    borderRadius: 18,
    backgroundColor: Colors.textWhite,
  },
  dayItemSelected: {
    backgroundColor: Colors.primaryDark,
  },
  dayItemCurrent: {
    borderColor: Colors.primary,
  },
  dayItemDisabled: {
    backgroundColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  dayTextSelected: {
    color: Colors.textWhite,
  },
  dayTextCurrent: {
    // color: Colors.textBlack,
    color: 'blue',
  },
  dayTextDisabled: {
    color: '#A0A0A0',
  },
  dayName: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  dayNameSelected: {
    color: Colors.textWhite,
    fontWeight: '900',
  },
  dayNameCurrent: {
    // color: Colors.textBlack,
    color: 'blue',
    // opacity: 0.8
  },
  dayNameDisabled: {
    color: '#A0A0A0',
  },
  navButton: {
    padding: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.textWhite,
    borderRadius: 13,
    padding: 12,
    width: '80%',
    maxHeight: '60%',
  },
  modalGradient: {
    borderRadius: 13,
  },
  grid: {
    justifyContent: 'space-around',
  },
  row: {
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  monthItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 50,
    borderRadius: 12,
    margin: 5,
    backgroundColor: '#FFF5F5',
  },
  monthItemCurrent: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  monthItemSelected: {
    backgroundColor: Colors.primaryDark,
  },
  monthItemDisabled: {
    backgroundColor: '#E0E0E0',
  },
  monthItemText: {
    fontSize: 14,
    color: Colors.textBlack,
  },
  monthItemTextCurrent: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  monthItemTextSelected: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  monthItemTextDisabled: {
    color: '#A0A0A0',
  },
});