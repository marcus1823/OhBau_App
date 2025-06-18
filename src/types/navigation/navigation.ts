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
  'ViewChartScreen': undefined;
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
  'ProductDetailScreen': undefined;
};

// Kiểu cho CourseStack
export type CourseStackParamList = {
  'CourseScreen': undefined;
  'CourseDetailScreen': {
    courseId: string;
    courseName: string;
    isPurchased?: boolean;
    description?: string;
  };
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
  'UpdateProfileScreen': undefined;
  'FavoriteScreen': undefined;
  'MyFamilyScreen': undefined;
  'AddFamilyMemberScreen': undefined;
  'EditFetusScreen': undefined;
  'MyAppointmentScreen': undefined;
  'PaymentAndDeliveryScreen': undefined;
  'LoginAndSecurityScreen': undefined;
  'HistoryAppointmentScreen': undefined;
  'HistoryPurchaseScreen': undefined;
  'RequestSupportScreen': undefined;
  'PolicyScreen': undefined;
};

// Kiểu cho ChatStack
export type ChatStackParamList = {
  'ChatScreen': { conversationId?: string };
};

// Kiểu cho các tab trong Tab.Navigator
export type TabParamList = {
  'Trang Chủ': undefined;
  'Bác sĩ': undefined;
  // 'Cộng Đồng': undefined;
  'Khoá học': undefined;
  'Tin nhắn': undefined;
  'Cửa hàng': undefined;
  'Cá nhân': undefined;
};
// Kiểu cho params của CartScreen
export type CartScreenParams = {
  previousTab?: string; // Cho phép previousTab là tùy chọn
};

// Kiểu cho Stack.Navigator bên trong TabNavigation
export type TabStackParamList = {
  MainTabs: { screen?: keyof TabParamList }; 
  ProfileStack: { screen?: keyof ProfileStackParamList };
  CartScreen: CartScreenParams;
  PaymentScreen: undefined;
  ComingSoonScreen: undefined;
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