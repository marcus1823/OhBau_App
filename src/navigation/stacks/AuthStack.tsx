import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation/navigation';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import SplashScreen from '../../features/splash/SplashScreen';
import RegisterScreen from '../../features/auth/screens/RegisterScreen';
import StartScreen from '../../features/auth/screens/StartScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashAuth" component={SplashScreen} /> 
      <Stack.Screen name="StartScreen" component={StartScreen} />  
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  )
}
  
export default AuthStack