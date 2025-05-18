import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import PatientInfo from '../components/PatientInfo';
import ButtonAction from '../../auth/components/ButtonAction';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';

const DoctorBookingScreen = ({ navigation, route }: any) => {
  const { doctorId } = route.params;
  console.log('doctorId in booking:', doctorId);

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

  const handleConfirmBooking = () => {
    console.log('Xác nhận đặt lịch với thông tin:', {
      selectedDate,
      selectedTime,
      patientInfo,
    });
    navigation.navigate('BookingConfirmationScreen', {
      selectedDate,
      selectedTime,
      patientInfo,
    });
  };

  const sections = [
    { id: '1', component: <DatePicker onDateChange={handleDateChange} /> },
    { id: '2', component: <TimePicker selectedDate={selectedDate} onTimeChange={handleTimeChange} /> },
    { id: '3', component: <PatientInfo onInfoChange={handlePatientInfoChange} /> },
    {
      id: '4',
      component: (
        <ButtonAction
          title="Đặt Lịch"
          onPress={handleConfirmBooking}
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
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default DoctorBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  section: {
  },
  buttonSection: {
    alignItems: 'center',
    marginTop: 20,
  },
});