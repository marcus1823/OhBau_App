import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Kiểu cho AuthStack
export type AuthStackParamList = {
    // 'SplashAuth': undefined;
    // 'StartScreen': undefined;
    'LoginScreen': undefined;
    'RegisterScreen': undefined;
    'ForgotPasswordScreen': undefined;
    'VerifyCodeScreen': undefined;
    'ChangePasswordScreen': undefined;
};

// kiểu cho HomeStack
export type HomeStackParamList = {
    'HomeScreen': undefined;

    'ChatScreen': undefined;

}

//  kiểu cho DoctorStack
export type DoctorStackParamList = {
    'DoctorScreen': undefined;
    'DoctorDetailScreen': undefined
}

// kiểu cho ShopStack
export type ShopStackParamList = {
    'ShopScreen': undefined;
}

// kiểu cho CourseStack
export type CourseStackParamList = {
    'CourseScreen': undefined;
}

// kiểu cho CommunityStack
export type CommunityStackParamList = {
    'CommunityScreen': undefined;
}

// kiểu cho ProfileStack
export type ProfileStackParamList = {
    'ProfileScreen': undefined;
    'PersonalScreen': undefined;
    'FavoriteScreen': undefined;
    'MyFamilyScreen': undefined;
    'MyAppointmentScreen': undefined;
    'PaymentAndDeliveryScreen': undefined;
    'LoginAndSecurityScreen': undefined;
    'HistoryAppointmentScreen': undefined;
    'HistoryPurchaseScreen': undefined;
    'RequestSupportScreen': undefined;
}

// kiểu cho TabNavigation
export type TabParamList = {
    'Trang Chủ': undefined;
    'Bác sĩ': undefined;
    'Cộng Đồng': undefined;
    'Khoá Học': undefined;
    'Cá nhân': undefined;
    // 'Cửa Hàng': undefined;
}

// Kiểu cho RootStack
export type RootStackParamList = {
    SplashScreen: undefined;
    StartScreen: undefined;
    AuthStack: undefined;
    TabNavigation: { screen?: keyof TabParamList }; // Cho phép truyền screen vào TabNavigation
};

// Kiểu cho navigation prop 
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type DoctorStackNavigationProp = NativeStackNavigationProp<DoctorStackParamList>;
export type CourseStackNavigationProp = NativeStackNavigationProp<CourseStackParamList>;
export type ShopStackNavigationProp = NativeStackNavigationProp<ShopStackParamList>;
export type CommunityStackNavigationProp = NativeStackNavigationProp<CommunityStackParamList>;
export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
