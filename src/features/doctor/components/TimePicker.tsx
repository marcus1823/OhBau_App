import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

// Định nghĩa kiểu props cho component
interface TimePickerProps {
    selectedDate: Date; // Ngày được chọn từ DatePicker
    onTimeChange: (time: string) => void; // Callback khi người dùng chọn giờ
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedDate, onTimeChange }) => {
    const currentDate = new Date();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Tạo danh sách giờ khả dụng (8:00 AM đến 4:00 PM, cách nhau 1 tiếng)
    const generateTimeSlots = () => {
        const timeSlots: string[] = [];
        const startHour = 8; // 8:00 AM
        const endHour = 16; // 4:00 PM (8 tiếng từ 8:00 AM)
        const isToday =
            selectedDate.getDate() === currentDate.getDate() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

        // Kiểm tra nếu ngày được chọn là ngày trong quá khứ
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        if (selectedDay < today) {
            return ['Ngày đã qua'];
        }

        for (let hour = startHour; hour <= endHour; hour++) {
            const date = new Date(selectedDate);
            date.setHours(hour, 0, 0, 0); // Đặt giờ, phút = 0

            // Nếu là ngày hiện tại, chỉ thêm các khung giờ từ hiện tại trở đi
            if (isToday && date <= currentDate) {
                continue;
            }

            const timeString = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }); // Giữ khoảng cách (8:00 AM)
            timeSlots.push(timeString);
        }

        // Đảm bảo có ít nhất một khung giờ nếu không có khung giờ nào khả dụng
        if (isToday && timeSlots.length === 0) {
            timeSlots.push('Hết giờ');
        }

        return timeSlots;
    };

    // Cập nhật danh sách giờ khi ngày thay đổi
    const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots());

    useEffect(() => {
        const newTimeSlots = generateTimeSlots();
        setTimeSlots(newTimeSlots);
        setSelectedTime(null); // Reset giờ được chọn khi ngày thay đổi
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    // Xử lý khi người dùng chọn giờ
    const handleTimeSelect = (time: string) => {
        if (time === 'Hết giờ' || time === 'Ngày đã qua') {return;} // Không cho chọn nếu hết giờ hoặc ngày trong quá khứ
        setSelectedTime(time);
        onTimeChange(time);
    };

    // Render item cho danh sách giờ
    const renderTimeItem = ({ item }: { item: string }) => {
        const isSelected = item === selectedTime;
        const isDisabled = item === 'Hết giờ' || item === 'Ngày đã qua';
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
                numColumns={5} // Tối đa 5 khung giờ mỗi hàng
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
        // paddingVertical: 20,
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