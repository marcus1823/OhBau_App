import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import { GetDoctorSlotResponse } from '../types/doctor.type'; // Import type từ doctor.type.ts

interface TimePickerProps {
  selectedDate: Date;
  onTimeChange: (time: string) => void;
  doctorSlots: GetDoctorSlotResponse[];
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedDate, onTimeChange, doctorSlots }) => {
  const currentDate = new Date();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateTimeSlots = () => {
    const timeSlots: string[] = [];
    const startHour = 6; // 6:00
    const endHour = 23; // 23:00
    const isToday =
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    if (selectedDay < today) {
      return ['Ngày đã qua'];
    }

    for (let hour = startHour; hour <= endHour; hour++) {
      const date = new Date(selectedDate);
      date.setHours(hour, 0, 0, 0);

      if (isToday && date <= currentDate) {
        continue;
      }

      const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
      });
      timeSlots.push(timeString);
    }

    if (isToday && timeSlots.length === 0) {
      timeSlots.push('Hết giờ');
    }

    return timeSlots;
  };

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots());

  useEffect(() => {
    const newTimeSlots = generateTimeSlots();
    setTimeSlots(newTimeSlots);
    setSelectedTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const isTimeInDoctorSlots = (timeString: string) => {
    if (timeString === 'Ngày đã qua' || timeString === 'Hết giờ') {
      return false;
    }

    const date = new Date(selectedDate);
    const [hourStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);
    date.setHours(hour, 0, 0, 0);
    const slotStartTime = date.getTime();

    return doctorSlots.some((doctorSlot) => {
      const { startTime, endTime } = doctorSlot.slot; // Lấy từ doctorSlot.slot
      const isBooking = doctorSlot.isBooking; // Assuming isBooking is on doctorSlot, not doctorSlot.slot
      if (isBooking) {return false;} // Bỏ qua slot đã được đặt

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const startDate = new Date(selectedDate);
      startDate.setHours(startHour, startMinute, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      const slotStartTimestamp = startDate.getTime();
      const slotEndTimestamp = endDate.getTime();

      return slotStartTime >= slotStartTimestamp && slotStartTime < slotEndTimestamp;
    });
  };

  const handleTimeSelect = (time: string) => {
    if (time === 'Hết giờ' || time === 'Ngày đã qua' || !isTimeInDoctorSlots(time)) {
      return;
    }
    setSelectedTime(time);
    onTimeChange(time);
  };

  const renderTimeItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedTime;
    const isDisabled = item === 'Hết giờ' || item === 'Ngày đã qua' || !isTimeInDoctorSlots(item);
    return (
      <TouchableOpacity
        style={[
          styles.timeItem,
          isSelected && styles.timeItemSelected,
          isDisabled && styles.timeItemDisabled,
        ]}
        onPress={() => handleTimeSelect(item)}
        disabled={isDisabled}
      >
        <Text
          style={[
            styles.timeText,
            isSelected && styles.timeTextSelected,
            isDisabled && styles.timeTextDisabled,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chọn giờ hẹn</Text>
      <FlatList
        data={timeSlots}
        renderItem={renderTimeItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={5}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    marginLeft: 10,
  },
  grid: {
    paddingVertical: 5,
  },
  row: {
    marginBottom: 10,
  },
  timeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.textWhite,
    marginHorizontal: 4,
  },
  timeItemSelected: {
    backgroundColor: Colors.primaryDark,
  },
  timeItemDisabled: {
    backgroundColor: Colors.disabledBg,
  },
  timeText: {
    fontSize: 12,
    color: Colors.primary,
  },
  timeTextSelected: {
    color: Colors.textWhite,
  },
  timeTextDisabled: {
    color: Colors.disabledText,
  },
});