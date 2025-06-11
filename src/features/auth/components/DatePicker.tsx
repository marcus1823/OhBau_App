import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import FormInput from './FormInput';

interface DatePickerProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    title?: string;
    placeholder?: string;
    allowFutureDates?: boolean; 
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
    selectedDate,
    onDateChange,
    title = 'Ngày sinh',
    placeholder = 'Chọn ngày sinh của bạn',
    allowFutureDates = false, // Default to false to maintain current behavior
}) => {
    const [open, setOpen] = useState(false);

    // Format date to DD/MM/YYYY string
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.8} style={styles.touchableArea}>
                <FormInput
                    title={title}
                    placeholder={placeholder}
                    value={selectedDate ? formatDate(selectedDate) : ''}
                    editable={false}
                />
            </TouchableOpacity>

            <DatePicker
                modal
                open={open}
                date={selectedDate}
                mode="date"
                onConfirm={(date) => {
                    setOpen(false);
                    onDateChange(date);
                }}
                onCancel={() => setOpen(false)}
                title="Chọn ngày"
                confirmText="Xác nhận"
                cancelText="Hủy"
                locale="vi"
                maximumDate={allowFutureDates ? undefined : new Date()} 
            />
        </View>
    );
};

export default DatePickerComponent;

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    touchableArea: {
        width: '100%', // Ensure the entire input area is pressable
    },
});