import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation/navigation';
import LoginScreen from '../../features/auth/screens/LoginScreen';
// import SplashScreen from '../../features/splash/SplashScreen';
import RegisterScreen from '../../features/auth/screens/RegisterScreen';
// import StartScreen from '../../features/auth/screens/StartScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../assets/styles/colorStyle';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../../features/auth/screens/VerifyCodeScreen';
import ChangePasswordScreen from '../../features/auth/screens/ChangePasswordScreen';


const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack = () => {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={Gradients.backgroundPrimary} style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="SplashAuth" component={SplashScreen} />  */}
          {/* <Stack.Screen name="StartScreen" component={StartScreen} /> */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} /> 
          <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        </Stack.Navigator>
      </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  )
}

export default AuthStack

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});