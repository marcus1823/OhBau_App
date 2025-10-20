import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../../assets/styles/colorStyle';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackNavigationProp } from '../../../types/navigation/navigation';
import { useCartItemsByAccount } from '../../../features/shop/hooks/useCart';

interface SecondaryHeaderProps {
  unreadMessages: number;
  // unreadNotifications: number;
  // onOpenNotificationModal?: () => void;
}

const SecondaryHeader = ({  }: SecondaryHeaderProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const {
    data: totalCartItems 
  } = useCartItemsByAccount(1, 100); // Lấy tất cả các mặt hàng trong giỏ hàng
  console.log('totalCartItems in SecondaryHeader:', totalCartItems?.data.total);
  const totalItems = totalCartItems?.data.total || 0;
  
  // const getCurrentTab = () => {
  //   const state = navigation.getState();
  //   const currentRoute = state.routes[state.index];
  //   if (currentRoute.name === 'TabNavigation') {
  //     const tabState = currentRoute.state;
  //     if (tabState && tabState.routes && tabState.index !== undefined) {
  //       return tabState.routes[tabState.index].name;
  //     }
  //   }
  //   return 'Khóa học'; // Mặc định là Khóa học nếu không xác định được
  // };

  return (
    <View style={styles.contentContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('TabNavigation', { screen: 'ProfileStack' })}
        style={styles.avatarContainer}
      >
        <Image
          source={require('../../../assets/images/skelector/doctorSkelector.jpg')}
          style={styles.avatar}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('TabNavigation', { screen: 'ComingSoonScreen' })}
          style={styles.iconWrapper}
        >
          <Icon name="notifications" size={24} color={Colors.primaryDark} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TabNavigation', {
              screen: 'CartScreen',
              // params: { previousTab: getCurrentTab() },
            })
          }
          style={styles.iconWrapper}
        >
          <Icon name="shopping-cart" size={24} color={Colors.primaryDark} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SecondaryHeader;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
});