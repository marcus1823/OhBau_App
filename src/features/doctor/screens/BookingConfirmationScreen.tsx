import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Gradients, Colors } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ButtonAction from '../../auth/components/ButtonAction';
import BookingSummary from '../components/BookingSummary';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { useBookingDoctor } from '../hooks/useDoctor.hook';
import { useToast } from '../../../utils/toasts/useToast';
import { formatDateToString } from '../../../utils/validations/validations';
import { CreateBookingRequest } from '../types/doctor.type';

const BookingConfirmationScreen = ({ navigation, route }: any) => {
  const { selectedDate, selectedTime, patientInfo, doctorId, doctorSlots } = route.params || {};
  console.log('Thông tin đặt lịch:', {
    selectedDate,
    selectedTime,
    patientInfo,
    doctorId,
    doctorSlots,
  });

  const { mutate: createBooking } = useBookingDoctor();
  const { showError, showSuccess } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>('Thanh toán trực tiếp');

  const handleConfirmBooking = () => {
    // Chuẩn hóa selectedTime thành định dạng HH:mm:ss (thêm :00 nếu cần)
    const normalizedSelectedTime = selectedTime && selectedTime.includes(':') && !selectedTime.includes(':ss') 
      ? `${selectedTime}:00` 
      : selectedTime;

    // Tìm doctorSlotId dựa trên normalizedSelectedTime
    const selectedSlot = doctorSlots?.find(
      (slot: any) => slot.slot.startTime === normalizedSelectedTime && !slot.isBooking
    );
    console.log('Selected slot:', selectedSlot);

    if (!selectedSlot) {
      showError('Không tìm thấy khung giờ hợp lệ để đặt lịch.');
      return;
    }
    const dotorSlotId = selectedSlot.id;

    const bookingRequest: CreateBookingRequest = {
      dotorSlotId,
      bookingModule: patientInfo?.visitPurpose?.join(',') || '', // Lấy hết mục đích khám theo string
      description: patientInfo?.description || '',
      fullName: patientInfo?.name || '',
      yearOld: patientInfo?.age ? parseInt(patientInfo.age, 10) : undefined,
      address: patientInfo?.address || '',
      phone: patientInfo?.phoneNumber || '',
      date: selectedDate || formatDateToString(new Date()), // Fallback to current date if undefined
    };

    createBooking(bookingRequest, {
      onSuccess: () => {
        showSuccess('Đặt lịch thành công!');
        navigation.navigate('BookingStatusScreen', {
          selectedDate: selectedDate || formatDateToString(new Date()),
          selectedTime,
          patientInfo: patientInfo || {},
          paymentMethod,
        });
      },
      onError: (err: any) => {
        showError('Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
        console.log('Booking error:', err.message);
      },
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
          selectedDate={selectedDate || 'Chưa chọn'} // Fallback if undefined
          selectedTime={selectedTime || 'Chưa chọn'}
          patientInfo={patientInfo || {
            patientType: '',
            name: '',
            age: '',
            address: '',
            gender: '',
            visitPurpose: [],
            description: '',
            phoneNumber: '',
          }}
        />
        <PaymentMethodSelector onMethodChange={setPaymentMethod} />
        <View style={styles.buttonContainer}>
          <ButtonAction
            title="Thanh Toán"
            onPress={handleConfirmBooking}
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
});