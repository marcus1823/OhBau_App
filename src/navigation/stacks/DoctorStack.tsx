
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorStackParamList } from '../../types/navigation/navigation';
import DoctorScreen from '../../features/doctor/screens/DoctorScreen';

const Stack = createNativeStackNavigator<DoctorStackParamList>();
const DoctorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorScreen" component={DoctorScreen} />
    </Stack.Navigator>
  )
}

export default DoctorStack