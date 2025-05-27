import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../../assets/styles/colorStyle';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackNavigationProp } from '../../../types/navigation/navigation';

interface SecondaryHeaderProps {
  unreadMessages: number;
  unreadNotifications: number;
  onOpenNotificationModal: () => void;
}

const SecondaryHeader = ({ unreadMessages, unreadNotifications, onOpenNotificationModal }: SecondaryHeaderProps) => {
  const navigation = useNavigation<RootStackNavigationProp>(); // Use RootStackNavigationProp

  return (
    <View style={styles.contentContainer}>
      {/* Avatar */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileStack')} // Navigate to ProfileScreen in ProfileStack
        style={styles.avatarContainer}
      >
        <Image
          source={require('../../../assets/images/Home/momAvatar.jpg')}
          style={styles.avatar}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Icon tin nhắn và thông báo */}
      <View style={styles.iconsContainer}>
        {/* Tin nhắn
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatScreen')} // Assuming ChatScreen is in HomeStack
          style={styles.iconWrapper}
        >
          <Icon name="messenger" size={24} color={Colors.primaryDark} />
          {unreadMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity> */}


        {/* Thông báo */}
        <TouchableOpacity
          onPress={onOpenNotificationModal}
          style={styles.iconWrapper}
        >
          <Icon name="notifications" size={24} color={Colors.primaryDark} />
          {unreadNotifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>


        {/* Giỏ hàng */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Trang Chủ', { screen: 'CartScreen' })}

          style={styles.iconWrapper}
        >
          <Icon name="shopping-cart" size={24} color={Colors.primaryDark} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
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