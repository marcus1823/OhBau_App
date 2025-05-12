import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../../assets/styles/colorStyle'; // Import màu sắc từ một file riêng
import { useNavigation } from '@react-navigation/native'; // Dùng hook để điều hướng
import Icon from 'react-native-vector-icons/MaterialIcons'; // Dùng icon từ thư viện vector icons
import { RootStackNavigationProp } from '../../../types/navigation/navigation'; // Định nghĩa kiểu navigation

interface SecondaryHeaderProps {
  unreadMessages: number; // Số lượng tin nhắn chưa đọc
  unreadNotifications: number; // Số lượng thông báo chưa đọc
  onOpenNotificationModal: () => void; // Callback mở modal thông báo
}

const SecondaryHeader = ({ unreadMessages, unreadNotifications, onOpenNotificationModal }: SecondaryHeaderProps) => {
  const navigation = useNavigation<RootStackNavigationProp>(); // Dùng navigation prop với kiểu định nghĩa cho RootStack

  return (
    <View style={styles.contentContainer}>
      {/* Avatar */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TabNavigation', {
            screen: 'Cá nhân', // Điều hướng đến tab "Cá nhân"
          })
        }
        style={styles.avatarContainer}
      >
        <Image
          source={require('../../../assets/images/Home/momAvatar.jpg')} // Đường dẫn đến ảnh avatar
          style={styles.avatar}
          resizeMode="contain" // Đảm bảo ảnh không bị bóp méo
        />
      </TouchableOpacity>

      {/* Icon tin nhắn và thông báo */}
      <View style={styles.iconsContainer}>
        {/* Tin nhắn */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatScreen')} // Điều hướng đến màn hình ChatScreen
          style={styles.iconWrapper}
        >
          <Icon name="messenger" size={24} color={Colors.primaryDark} /> {/* Icon Messenger */}
          {unreadMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadMessages}</Text> {/* Hiển thị số lượng tin nhắn chưa đọc */}
            </View>
          )}
        </TouchableOpacity>

        {/* Thông báo */}
        <TouchableOpacity
          onPress={onOpenNotificationModal} // Mở modal thông báo khi nhấn vào thông báo
          style={styles.iconWrapper}
        >
          <Icon name="notifications" size={24} color={Colors.primaryDark} /> {/* Icon Thông báo */}
          {unreadNotifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text> {/* Hiển thị số lượng thông báo chưa đọc */}
            </View>
          )}
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
    right: -5, // Đặt badge ở góc trên bên phải của icon
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
