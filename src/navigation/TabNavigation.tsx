import React from 'react';
import { Image, Platform, StyleSheet, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';

import { Colors, Gradients } from '../assets/styles/colorStyle';
import { ifTablet } from '../utils/responsives/responsive';
import HomeStack from './stacks/HomeStack';
import DoctorStack from './stacks/DoctorStack';
import CourseStack from './stacks/CourseStack';
import ShopStack from './stacks/ShopStack';
import CommunityStack from './stacks/CommunityStack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

// Import PNG icons
const homeIcon = require('../assets/icons/homeIcon.png');
const doctorIcon = require('../assets/icons/doctorIcon.png');
const courseIcon = require('../assets/icons/courseIcon.png');
const shopIcon = require('../assets/icons/shopIcon.png');
const communityIcon = require('../assets/icons/communityIcon.png');

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
  iconSource: any;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, iconSource }) => {
  const scale = focused ? 1.2 : 1;
  return (
    <Animated.View style={{
      transform: [{ scale }],
    }}>
      <Image
        source={iconSource}
        style={{
          width: ifTablet(32, 26),
          height: ifTablet(32, 26),
          tintColor: focused ? Colors.textWhite : Colors.textWhite,
        }}
      />
    </Animated.View>
  );
};

// Helper function to get the appropriate TabIcon component for each tab
const getTabBarIcon = (iconSource: any) => ({ focused }: { focused: boolean }) => (
  <TabIcon focused={focused} iconSource={iconSource} />
);

const TabNavigation: React.FC = () => {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={Gradients.backgroundPrimary} style={styles.safeArea}>

      <SafeAreaView style={styles.safeArea}>
      
        <Tab.Navigator
          screenOptions={{
            headerShown: false, // Ẩn header
            tabBarShowLabel: false, // Ẩn label
            tabBarStyle: {
              backgroundColor: Colors.primary,
              height: Platform.OS === 'android' ? 60 : 55,
              paddingBottom: Platform.OS === 'android' ? 0 : 0,
              borderRadius: 30,
              marginHorizontal: ifTablet(50, 30),
              marginBottom: ifTablet(20, 10),
              position: 'absolute',

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
          }}
        >
          <Tab.Screen
            name="Trang Chủ"
            component={HomeStack}
            options={{
              tabBarIcon: getTabBarIcon(homeIcon),
            }}
          />
          <Tab.Screen
            name="Bác sĩ"
            component={DoctorStack}
            options={{
              tabBarIcon: getTabBarIcon(doctorIcon),
            }}
          />
          <Tab.Screen
            name="Khóa học"
            component={CourseStack}
            options={{
              tabBarIcon: getTabBarIcon(courseIcon),
            }}
          />
          <Tab.Screen
            name="Cửa hàng"
            component={ShopStack}
            options={{
              tabBarIcon: getTabBarIcon(shopIcon),
            }}
          />
          <Tab.Screen
            name="Cộng đồng"
            component={CommunityStack}
            options={{
              tabBarIcon: getTabBarIcon(communityIcon),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>

  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

