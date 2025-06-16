import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';


const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface DoctorCardProps {
  id: string; // Thêm id vào props
  fullName?: string;
  avatar?: string;
  address?: string;
  major?: string;
  onInfoPress?: (id: string) => void; // Thêm callback để xử lý sự kiện nhấn "Thông tin"
}

const DoctorCard: React.FC<DoctorCardProps> = ({ id, fullName = 'N/A', avatar, address, major, onInfoPress }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleInfoPress = () => {
    if (onInfoPress) {
      onInfoPress(id); // Gọi callback với id khi nhấn "Thông tin"
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      {/* Avatar bên trái */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{fullName?.charAt(0)?.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {/* Thông tin bác sĩ */}
        <View style={styles.infoContainer}>
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.major}>{major}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
            <Text style={styles.infoText}>Thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLikeToggle}>
            <Icon
              name={isLiked ? 'favorite' : 'favorite-outline'}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.textLightGray,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: isTablet ? 240 : 120,
    height: isTablet ? 240 : 120,
    borderRadius: isTablet ? 120 : 60,
  },
  avatarPlaceholder: {
    width: isTablet ? 240 : 120,
    height: isTablet ? 240 : 120,
    borderRadius: isTablet ? 120 : 60,
    backgroundColor: Colors.textGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: isTablet ? 48 : 24,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoContainer: {
    marginBottom: 10,
  },
  fullName: {
    fontSize: isTablet ? 36 : 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  major: {
    fontSize: isTablet ? 18 : 12,
    color: Colors.textBlack,
    marginBottom: 4,
  },
  address: {
    fontSize: isTablet ? 18 : 12,
    color: Colors.textBlack,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
  },
});