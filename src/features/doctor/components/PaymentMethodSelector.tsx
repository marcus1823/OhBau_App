import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PaymentMethodSelectorProps {
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ onMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('Thanh toán trực tiếp');

  const paymentMethods = [
    { name: 'Thanh toán trực tiếp', icon: 'money' },
    { name: 'Chuyển khoản', icon: 'account-balance' },
  ];

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    onMethodChange(method);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="payment" size={22} color={Colors.primary} style={styles.headerIcon} />
        <Text style={styles.title}>Chọn Phương Thức Thanh Toán</Text>
      </View>
      <View style={styles.methodList}>
        {paymentMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectMethod(method.name)}
            style={styles.methodItem}
          >
            <View
              style={[
                styles.methodButton,
                selectedMethod === method.name && styles.methodButtonSelected,
              ]}
            >
              <Icon
                name={method.icon}
                size={26}
                color={selectedMethod === method.name ? Colors.textWhite : Colors.primary}
                style={styles.methodIcon}
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === method.name
                    ? styles.methodTextSelected
                    : styles.methodTextUnselected,
                ]}
              >
                {method.name === 'Thanh toán trực tiếp' ? 'Tiền Mặt' : method.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  methodList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: Colors.textWhite,
  },
  methodButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodIcon: {
    marginRight: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  methodTextSelected: {
    color: Colors.textWhite,
  },
  methodTextUnselected: {
    color: Colors.primary,
  },
});