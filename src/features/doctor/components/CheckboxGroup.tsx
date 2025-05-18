import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface CheckboxGroupProps {
  options: string[];
  onValueChange: (selected: string[]) => void;
  defaultValues?: string[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, onValueChange, defaultValues = [] }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValues);

  const handlePress = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelected);
    onValueChange(newSelected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {options.slice(0, 2).map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => handlePress(option)}
          >
            <View style={[
              styles.checkbox,
              selectedOptions.includes(option) && styles.checkboxSelected
            ]}>
              {selectedOptions.includes(option) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.label}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {options.slice(2, 4).map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => handlePress(option)}
          >
            <View style={[
              styles.checkbox,
              selectedOptions.includes(option) && styles.checkboxSelected
            ]}>
              {selectedOptions.includes(option) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.label}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CheckboxGroup;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '400',
  },
});