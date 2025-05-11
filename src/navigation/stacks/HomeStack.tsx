import React from 'react'
import HomeScreen from '../../features/home/screens/HomeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation/navigation';
import ChatScreen from '../../features/home/chat/screens/ChatScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack