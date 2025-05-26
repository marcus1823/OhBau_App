
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorStackParamList } from '../../types/navigation/navigation';
import DoctorScreen from '../../features/doctor/screens/DoctorScreen';
import DoctorDetailScreen from '../../features/doctor/screens/DoctorDetailScreen';
import DoctorBookingScreen from '../../features/doctor/screens/DoctorBookingScreen';
import BookingConfirmationScreen from '../../features/doctor/screens/BookingConfirmationScreen';
import BookingStatusScreen from '../../features/doctor/screens/BookingStatusScreen';
import withAuth from '../../components/hoc/withAuth';

const Stack = createNativeStackNavigator<DoctorStackParamList>();
const DoctorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorScreen" component={DoctorScreen} />
      <Stack.Screen name="DoctorDetailScreen" component={DoctorDetailScreen}  />
      <Stack.Screen name="DoctorBookingScreen" component={withAuth(DoctorBookingScreen)} />
      <Stack.Screen name="BookingConfirmationScreen" component={withAuth(BookingConfirmationScreen)} />
      <Stack.Screen name="BookingStatusScreen" component={withAuth(BookingStatusScreen)} />
    </Stack.Navigator>
  )
}

export default DoctorStack