
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import withAuth from '../../components/hoc/withAuth';
import { ChatStackParamList } from '../../types/Navigation/navigation';
import ChatScreen from '../../features/chat/screens/ChatScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();
const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatScreen" component={withAuth(ChatScreen)}  /> 
    </Stack.Navigator>
  )
}

export default ChatStack