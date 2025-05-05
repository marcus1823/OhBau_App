import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './src/navigation/TabNavigation';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './src/types/Navigation/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './src/navigation/stacks/AuthStack';
import { Provider } from 'react-redux';
import { store } from './src/stores/store';
import SplashScreen from './src/features/splash/SplashScreen';
import StartScreen from './src/features/auth/screens/StartScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();



const App = () => {
  return (
    <Provider store={store}>
      {/* <SafeAreaProvider> */}
        {/* <SafeAreaView style={styles.safeArea}> */}
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="TabNavigation" component={TabNavigation} />
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="StartScreen" component={StartScreen} />
              <Stack.Screen name="AuthStack" component={AuthStack} />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        {/* </SafeAreaView> */}
      {/* </SafeAreaProvider> */}
    </Provider>
  );
};

export default App;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
// })  