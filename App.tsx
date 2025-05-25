import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { RootState, store } from './src/stores/store';
import { RootStackParamList } from './src/types/Navigation/navigation';
import TabNavigation from './src/navigation/TabNavigation';
import AuthStack from './src/navigation/stacks/AuthStack';
import SplashScreen from './src/features/splash/SplashScreen';
import StartScreen from './src/features/auth/screens/StartScreen';
import LoadingOverlay from './src/components/common/Loading/LoadingOverlay';
import { useCreateQuery } from './src/hooks/useCreateQuery';
import { useAuthSync } from './src/utils/asyncStorage/useAuthSync';
import { useSyncQueriesExternal } from "react-query-external-sync"; // 
import { Platform } from 'react-native';

/**
 * Khởi tạo stack navigator cho ứng dụng
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Cấu hình QueryClient với các tùy chọn mặc định
 * - queries: retry 2 lần, staleTime 5 phút, gcTime 10 phút
 * - mutations: retry 1 lần
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 phút
      gcTime: 10 * 60 * 1000, // 10 phút
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Component chính của ứng dụng, quản lý navigation và trạng thái auth
 */
const AppContent = () => {
  // Set up the sync hook - automatically disabled in production!
  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
  });

  const { initializeAuth } = useAuthSync();
  const globalLoading = useSelector((state: RootState) => state.loading.globalLoading);

  // Sử dụng useCreateQuery để khởi tạo auth từ AsyncStorage
  const { isLoading, isError, data } = useCreateQuery(
    ['auth', 'initialize'] as const,
    () => initializeAuth(),
    'Khởi tạo auth thành công',
    'Lỗi khi khởi tạo auth'
  );

  // Hiển thị loading khi đang khởi tạo auth hoặc có global loading
  if (isLoading || globalLoading) {
    return <LoadingOverlay visible={true} fullScreen />;
  }

  // Nếu có lỗi khi khởi tạo auth, chuyển hướng đến StartScreen
  if (isError || (data && !data.success)) {
    return <StartScreen />;
  }

  // Navigation chính của ứng dụng
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

/**
 * Root component của ứng dụng, cung cấp Redux store và QueryClient
 */
const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;