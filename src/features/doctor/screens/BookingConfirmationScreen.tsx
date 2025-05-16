import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ButtonAction from '../../auth/components/ButtonAction';
import { Colors } from '../../../assets/styles/colorStyle';
import BookingSummary from '../components/BookingSummary';
import PaymentMethodSelector from '../components/PaymentMethodSelector';

const BookingConfirmationScreen = ({ navigation, route }: any) => {
  const { selectedDate, selectedTime, patientInfo } = route.params;
  console.log('Thông tin đặt lịch:', {
    selectedDate,
    selectedTime,
    patientInfo,
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('Thanh toán trực tiếp');

  const handleConfirmPayment = () => {
    console.log('Xác nhận thanh toán với thông tin:', {
      selectedDate,
      selectedTime,
      patientInfo,
      paymentMethod,
    });
    navigation.navigate('BookingStatusScreen', {
      selectedDate,
      selectedTime,
      patientInfo,
      paymentMethod,
    });
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Xác Nhận Đặt Lịch"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <BookingSummary
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          patientInfo={patientInfo}
        />
        <PaymentMethodSelector onMethodChange={setPaymentMethod} />
        <View style={styles.buttonContainer}>
          <ButtonAction
            title="Xác Nhận Thanh Toán"
            onPress={handleConfirmPayment}
            backgroundColor={Colors.primary}
            color={Colors.textWhite}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
});