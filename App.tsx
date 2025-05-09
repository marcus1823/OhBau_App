import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './src/navigation/TabNavigation';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './src/types/Navigation/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './src/navigation/stacks/AuthStack';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './src/stores/store';
import SplashScreen from './src/features/splash/SplashScreen';
import StartScreen from './src/features/auth/screens/StartScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthSync } from './src/utils/asyncStorage/useAuthSync';
import LoadingOverlay from './src/components/common/Loading/LoadingOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
        mutations: {
            retry: 1,
        },
    },
});

const AppContent = () => {
    const { initializeAuth } = useAuthSync();
    const globalLoading = useSelector((state: RootState) => state.loading.globalLoading);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            initializeAuth().then(() => {
                setIsInitialized(true);
            }).catch((error) => {
                console.error('initializeAuth error:', error);
                setIsInitialized(true);
            });
        }
    }, [initializeAuth, isInitialized]);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="TabNavigation" component={TabNavigation} />
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="StartScreen" component={StartScreen} />
                <Stack.Screen name="AuthStack" component={AuthStack} />
            </Stack.Navigator>
            <LoadingOverlay visible={globalLoading} fullScreen />
            <Toast />
        </NavigationContainer>
    );
};

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