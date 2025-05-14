
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorStackParamList } from '../../types/navigation/navigation';
import DoctorScreen from '../../features/doctor/screens/DoctorScreen';
import DoctorDetailScreen from '../../features/doctor/screens/DoctorDetailScreen';

const Stack = createNativeStackNavigator<DoctorStackParamList>();
const DoctorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorScreen" component={DoctorScreen} />
      <Stack.Screen name="DoctorDetailScreen" component={DoctorDetailScreen}  />
    </Stack.Navigator>
  )
}

export default DoctorStack