import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import PatientInfo from '../components/PatientInfo';
import ButtonAction from '../../auth/components/ButtonAction';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import { useQuery } from '@tanstack/react-query';
import { getDoctorSlotApi } from '../api/doctorApi';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useToast } from '../../../utils/toasts/useToast';
import { validateDateRequired, validateRequired, formatDateToString } from '../../../utils/validations/validations';

const DoctorBookingScreen = ({ navigation, route }: any) => {
  const { doctorId } = route.params;
  console.log('doctorId in booking:', doctorId);

  const { showError } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<{
    patientType: string;
    name: string;
    age: string;
    address: string;
    gender: string;
    visitPurpose: string[];
    description: string;
    phoneNumber?: string;
  } | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: ['doctorSlots', doctorId, selectedDate],
    queryFn: () =>
      getDoctorSlotApi({
        doctorID: doctorId,
        date: selectedDate.toISOString().split('T')[0].replace(/-/g, '/'),
      }),
    enabled: !!doctorId && !!selectedDate,
  });

  console.log('Doctor slots data:', data);

  if (error) {
    console.error('Error fetching doctor slots:', error);
    return null;
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log('Ngày được chọn:', date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    console.log('Giờ được chọn:', time);
  };

  const handlePatientInfoChange = (info: {
    patientType: string;
    name: string;
    age: string;
    address: string;
    gender: string;
    visitPurpose: string[];
    description: string;
    phoneNumber?: string;
  }) => {
    setPatientInfo(info);
    console.log('Thông tin bệnh nhân:', info);
  };

  const handleProceedToConfirmation = () => {
    // Validate date
    const dateError = validateDateRequired(selectedDate, 'ngày khám');
    if (dateError) {
      showError(dateError);
      return;
    }

    // Validate time
    if (!selectedTime) {
      showError('Vui lòng chọn giờ khám');
      return;
    }

    const requiredFields: { value: string | null | undefined; fieldName: string }[] = [
      { value: patientInfo?.name, fieldName: 'tên bệnh nhân' },
      { value: patientInfo?.age, fieldName: 'tuổi' },
      { value: patientInfo?.address, fieldName: 'địa chỉ' },
      { value: patientInfo?.gender, fieldName: 'giới tính' },
      { value: patientInfo?.description, fieldName: 'mô tả triệu chứng' },
    ];

    for (const field of requiredFields) {
      const validationError = validateRequired(field.value, field.fieldName);
      if (validationError) {
        showError(validationError);
        return;
      }
    }

    // Validate visit purpose
    if (!patientInfo?.visitPurpose || patientInfo.visitPurpose.length === 0) {
      showError('Vui lòng chọn mục đích khám');
      return;
    }

    // Ensure selectedDate is always a string
    const formattedDate = formatDateToString(selectedDate) || 'Chưa chọn';

    // Navigate to BookingConfirmationScreen with serialized selectedDate
    navigation.navigate('BookingConfirmationScreen', {
      selectedDate: formattedDate, // Use fallback if formatDateToString fails
      selectedTime,
      patientInfo: patientInfo || {}, // Ensure patientInfo is not null
      doctorId,
      doctorSlots: data?.doctorSlots || [],
    });
  };

  const sections = [
    { id: '1', component: <DatePicker onDateChange={handleDateChange} /> },
    {
      id: '2',
      component: (
        <TimePicker
          selectedDate={selectedDate}
          onTimeChange={handleTimeChange}
          doctorSlots={data?.doctorSlots || []}
        />
      ),
    },
    { id: '3', component: <PatientInfo onInfoChange={handlePatientInfoChange} /> },
    {
      id: '4',
      component: (
        <ButtonAction
          title="Tiếp Tục"
          onPress={handleProceedToConfirmation}
          backgroundColor={Colors.primary}
          color={Colors.textWhite}
        />
      ),
    },
  ];

  const renderItem = ({ item }: { item: { id: string; component: React.ReactElement } }) => (
    <View
      style={[
        styles.section,
        item.id === '4' && styles.buttonSection,
      ]}
    >
      {item.component}
    </View>
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Đặt Lịch"
        onBackButtonPress={() => navigation.goBack()}
      />
      <View style={styles.flatListContainer}>
        <FlatList
          data={sections}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
        <LoadingOverlay visible={isPending} fullScreen={false} />
      </View>
    </LinearGradient>
  );
};

export default DoctorBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  section: {},
  buttonSection: {
    alignItems: 'center',
    marginTop: 20,
  },
});