import React from 'react'
import HomeScreen from '../../features/home/screens/HomeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const HomStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default HomStack