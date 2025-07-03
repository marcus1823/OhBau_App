import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FormInputProps {
    title?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    value?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    numberOfLines?: number;
    disabled?: boolean;
    editable?: boolean;
    titleFontSize?: number;
    multiline?: boolean; // Add multiline support
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'; // Add text alignment
}

const FormInput: React.FC<FormInputProps> = ({
    title,
    placeholder,
    secureTextEntry,
    onChangeText,
    value,
    keyboardType = 'default',
    numberOfLines = 1,
    disabled = false,
    editable = true,
    titleFontSize = 18,
    multiline = false,
    textAlignVertical = 'center',
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry || false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            {title && <Text style={[styles.title, { fontSize: titleFontSize }]}>{title}</Text>}
            <View style={[
                styles.inputContainer, 
                multiline && styles.inputContainerMultiline
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.inputMultiline
                    ]}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                    numberOfLines={numberOfLines}
                    editable={editable && !disabled}
                    placeholderTextColor={Colors.primary}
                    multiline={multiline}
                    textAlignVertical={textAlignVertical}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                        <Icon
                            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                            size={20}
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    title: {
        color: Colors.textBlack,
        marginBottom: 5,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 13,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    inputContainerMultiline: {
        alignItems: 'flex-start',
        minHeight: 80,
    },
    input: {
        height: 50,
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 12,
        fontWeight: '400',
    },
    inputMultiline: {
        minHeight: 80,
        paddingVertical: 15,
    },
    iconContainer: {
        padding: 10,
    },
});