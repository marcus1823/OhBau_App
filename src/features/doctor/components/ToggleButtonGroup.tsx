import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface ToggleButtonGroupProps {
    options: string[]; // Danh sách các lựa chọn (ví dụ: ["Tôi", "Người khác"])
    onValueChange: (value: string) => void; // Callback khi người dùng chọn giá trị
    defaultValue?: string; // Giá trị mặc định
    disabled?: boolean; // Trạng thái vô hiệu hóa
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ options, onValueChange, defaultValue, disabled }) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

    const handlePress = (value: string) => {
        if (disabled) { return; }
        setSelectedValue(value);
        onValueChange(value);
    };

    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.button,
                        selectedValue === option ? styles.buttonSelected : styles.buttonUnselected,
                    ]}
                    onPress={() => handlePress(option)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            selectedValue === option ? styles.buttonTextSelected : styles.buttonTextUnselected,
                        ]}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ToggleButtonGroup;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    buttonSelected: {
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    buttonUnselected: {
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'light',
    },
    buttonTextSelected: {
        color: Colors.textWhite,
    },
    buttonTextUnselected: {
        color: Colors.primary,
    },
});