import React from 'react'
import HomeScreen from '../../features/home/screens/HomeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation/navigation';
import ProfileStack from './ProfileStack';
import CartScreen from '../../features/course/screens/CartScreen';
import PaymentScreen from '../../features/course/screens/PaymentScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    
    </Stack.Navigator>
  )
}

export default HomeStack