import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Kiểu cho AuthStack
export type AuthStackParamList = {
  'LoginScreen': undefined;
  'RegisterScreen': undefined;
  'ForgotPasswordScreen': undefined;
  'VerifyCodeScreen': undefined;
  'ChangePasswordScreen': undefined;
};

// Kiểu cho HomeStack
export type HomeStackParamList = {
  'HomeScreen': undefined;
};

// Kiểu cho DoctorStack
export type DoctorStackParamList = {
  'DoctorScreen': undefined;
  'DoctorDetailScreen': undefined;
  'DoctorBookingScreen': undefined;
  'BookingConfirmationScreen': undefined;
  'BookingStatusScreen': undefined;
};

// Kiểu cho ShopStack
export type ShopStackParamList = {
  'ShopScreen': undefined;
};

// Kiểu cho CourseStack
export type CourseStackParamList = {
  'CourseScreen': undefined;
  'CourseDetailScreen': undefined;
  'CourseChapterScreen': undefined;
  'ChapterDetailScreen': undefined;
};

// Kiểu cho CommunityStack
export type CommunityStackParamList = {
  'CommunityScreen': undefined;
  'BlogDetailScreen': undefined;
  'CreateBlogScreen': undefined;
};

// Kiểu cho ProfileStack
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
};

// Kiểu cho ChatStack
export type ChatStackParamList = {
  'ChatScreen': undefined;
};

// Kiểu cho các tab trong Tab.Navigator
export type TabParamList = {
  'Trang Chủ': undefined;
  'Bác sĩ': undefined;
  'Cộng Đồng': undefined;
  'Khoá học': undefined;
  'Tin nhắn': undefined;
};
// Kiểu cho params của CartScreen
export type CartScreenParams = {
  previousTab?: string; // Cho phép previousTab là tùy chọn
};

// Kiểu cho Stack.Navigator bên trong TabNavigation
export type TabStackParamList = {
  MainTabs: { screen?: keyof TabParamList }; // Các tab chính
  ProfileStack: { screen?: keyof ProfileStackParamList };
  CartScreen: CartScreenParams; // CartScreen với params tùy chọn
  PaymentScreen: undefined;

};

// Kiểu cho RootStack
export type RootStackParamList = {
  SplashScreen: undefined;
  StartScreen: undefined;
  AuthStack: undefined;
  TabNavigation: { screen?: keyof TabStackParamList }; // Cập nhật để phản ánh Stack bên trong TabNavigation
};

// Kiểu cho navigation prop
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type DoctorStackNavigationProp = NativeStackNavigationProp<DoctorStackParamList>;
export type CourseStackNavigationProp = NativeStackNavigationProp<CourseStackParamList>;
export type ShopStackNavigationProp = NativeStackNavigationProp<ShopStackParamList>;
export type ChatStackNavigationProp = NativeStackNavigationProp<ChatStackParamList>;
export type CommunityStackNavigationProp = NativeStackNavigationProp<CommunityStackParamList>;
export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type TabNavigationProp = NativeStackNavigationProp<TabStackParamList>; // Cập nhật để dùng StackNavigationProp
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;