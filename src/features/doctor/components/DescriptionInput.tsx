import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface DescriptionInputProps {
  title?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  titleFontSize?: number; // Thêm prop mới
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  title,
  placeholder,
  onChangeText,
  value,
  titleFontSize = 22, // Mặc định lớn hơn (22)
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { fontSize: titleFontSize }]}>{title}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        multiline
        numberOfLines={4}
        placeholderTextColor={Colors.primary}
      />
    </View>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    color: Colors.textBlack,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 15,
    fontSize: 12,
    fontWeight: '400',
    textAlignVertical: 'top',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 130, // Chiều cao cố định cho TextInput
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});