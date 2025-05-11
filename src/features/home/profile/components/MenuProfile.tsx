import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Sử dụng MaterialIcons từ react-native-vector-icons
import { Colors } from '../../../../assets/styles/colorStyle';

interface MenuProfileProps {
  icon?: string; // Tên icon cho bên trái
  title?: string; // Tiêu đề
  onPress?: () => void; // Hàm xử lý khi nhấn
}

const MenuProfile: React.FC<MenuProfileProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContainer}>
        {icon && <Icon name={icon} size={24} color={Colors.primary} style={styles.icon} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.primary} style={styles.rightIcon} />
    </TouchableOpacity>
  );
};

export default MenuProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12, 
  },
  title: {
    fontSize: 16,
    color: Colors.textBlack,
  },
  rightIcon: {
    marginLeft: 12,
  },
});