import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';
import { Colors, Gradients } from '../assets/styles/colorStyle';
import { ifTablet } from '../utils/responsives/responsive';
import HomeStack from './stacks/HomeStack';
// import DoctorStack from './stacks/DoctorStack';
import CourseStack from './stacks/CourseStack';
// import CommunityStack from './stacks/CommunityStack';
import ProfileStack from './stacks/ProfileStack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CartScreen from '../features/course/screens/CartScreen';
import PaymentScreen from '../features/course/screens/PaymentScreen';
import withAuth from '../components/hoc/withAuth';
import ShopStack from './stacks/ShopStack';
import ComingSoonScreen from '../features/home/screens/ComingSoonScreen';
import ChatStack from './stacks/ChatStack';
import CommunityStack from './stacks/CommunityStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Import PNG icons
const homeIcon = require( '../assets/icons/homeIcon.png' );
// const doctorIcon = require('../assets/icons/doctorIcon.png');
const courseIcon = require( '../assets/icons/courseIcon.png' );
const communityIcon = require( '../assets/icons/communityIcon.png' );
const chatIcon = require( '../assets/icons/icons8-chat-48-field.png' );
const shopIcon = require( '../assets/icons/icons8-shop3-48.png' );
const profileIcon = require( '../assets/icons/icons8-person-48.png' );


const TabIcon: React.FC<{ focused: boolean; iconSource: any }> = ( { focused, iconSource } ) =>
{
  const scale = focused ? 1.2 : 1;
  return (
    <Animated.View style={ { transform: [ { scale } ] } }>
      <Image
        source={ iconSource }
        style={ {
          width: ifTablet( 32, 26 ),
          height: ifTablet( 32, 26 ),
          tintColor: focused ? Colors.textWhite : Colors.textWhite,
        } }
      />
    </Animated.View>
  );
};

const getTabBarIcon = ( iconSource: any ) => ( { focused }: { focused: boolean } ) => (
  <TabIcon focused={ focused } iconSource={ iconSource } />
);

const MainTabs = () =>
{
  return (
    <Tab.Navigator
      screenOptions={ ( { route } ) => ( {
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          height: Platform.OS === 'android' ? 60 : 55,
          paddingBottom: Platform.OS === 'android' ? 0 : 0,
          borderRadius: 30,
          marginHorizontal: ifTablet( 50, 30 ),
          marginBottom: ifTablet( 20, 10 ),
          position: 'absolute',
          display: route.name === "Tin nhắn" ? 'none' : 'flex',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textWhite,
        tabBarItemStyle: {
          alignSelf: 'center',
          padding: Platform.OS === 'android' ? 10 : 10,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
      } ) }
    >
      <Tab.Screen
        name="Trang Chủ"
        component={ HomeStack }
        options={ { tabBarIcon: getTabBarIcon( homeIcon ) } }
      />
      {/* <Tab.Screen
        name="Bác sĩ"
        component={DoctorStack}
        options={{ tabBarIcon: getTabBarIcon(doctorIcon) }}
      /> */}
      <Tab.Screen
        name="Khóa học"
        component={ CourseStack }
        options={ { tabBarIcon: getTabBarIcon( courseIcon ) } }
      />
      <Tab.Screen
        name="Tin nhắn"
        component={ ChatStack }
        options={ { tabBarIcon: getTabBarIcon( chatIcon ) } }
      />
      <Tab.Screen
        name="Cộng đồng"
        component={ CommunityStack }
        options={ { tabBarIcon: getTabBarIcon( communityIcon ) } }
      />


      <Tab.Screen
        name="Cửa hàng"
        component={ ShopStack }
        options={ { tabBarIcon: getTabBarIcon( shopIcon ) } }
      />
      <Tab.Screen
        name="Cá nhân"
        component={ ProfileStack }
        options={ { tabBarIcon: getTabBarIcon( profileIcon ) } }
      />
    </Tab.Navigator>
  );
};

const TabNavigation: React.FC = () =>
{
  return (
    <SafeAreaProvider>
      <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.safeArea }>
        <SafeAreaView style={ styles.safeArea }>
          <Stack.Navigator screenOptions={ { headerShown: false } }>
            <Stack.Screen name="MainTabs" component={ MainTabs } />
            <Stack.Screen name="ProfileStack" component={ ProfileStack } />
            <Stack.Screen name="CartScreen" component={ withAuth( CartScreen ) } />
            <Stack.Screen name="PaymentScreen" component={ PaymentScreen } />
            <Stack.Screen name="ComingSoonScreen" component={ ComingSoonScreen } />
          </Stack.Navigator>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default TabNavigation;

const styles = StyleSheet.create( {
  safeArea: {
    flex: 1,
  },
} );