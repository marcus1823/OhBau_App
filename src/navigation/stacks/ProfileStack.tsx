import React from 'react'
import { ProfileStackParamList } from '../../types/navigation/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonalScreen from '../../features/home/profile/screens/myPersonal/screens/PersonalScreen';
import FavoriteScreen from '../../features/home/profile/screens/myFavorite/screens/FavoriteScreen';
import MyAppointmentScreen from '../../features/home/profile/screens/myAppointment/screens/MyAppointmentScreen';
import HistoryAppointmentScreen from '../../features/home/profile/screens/myHistoryAppointment/screens/HistoryAppointmentScreen';
import HistoryPurchaseScreen from '../../features/home/profile/screens/myHistoryPurchase/screens/HistoryPurchaseScreen';
import RequestSupportScreen from '../../features/home/profile/screens/requestSupport/screens/RequestSupportScreen';
import withAuth from '../../components/hoc/withAuth';
import MyFamilyScreen from '../../features/home/profile/screens/myFamily/screens/MyFamilyScreen';
import LoginAndSecurityScreen from '../../features/home/profile/screens/loginAndSecurity/screens/LoginAndSecurityScreen';
import PaymentAndDeliveryScreen from '../../features/home/profile/screens/paymentAndDelivery/screens/PaymentAndDeliveryScreen';
import ProfileScreen from '../../features/home/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     {/*  Profile  */}
     <Stack.Screen name="ProfileScreen" component={withAuth(ProfileScreen)} />
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
      <Stack.Screen name="MyFamilyScreen" component={MyFamilyScreen} /> 
      <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
      <Stack.Screen name="MyAppointmentScreen" component={MyAppointmentScreen} />
      <Stack.Screen name="HistoryAppointmentScreen" component={HistoryAppointmentScreen} />
      <Stack.Screen name="LoginAndSecurityScreen" component={LoginAndSecurityScreen} />
      <Stack.Screen name="PaymentAndDeliveryScreen" component={PaymentAndDeliveryScreen} />
      <Stack.Screen name="HistoryPurchaseScreen" component={HistoryPurchaseScreen} />
      <Stack.Screen name="RequestSupportScreen" component={RequestSupportScreen} />
    </Stack.Navigator>
  )
}

export default ProfileStack