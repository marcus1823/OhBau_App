import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CardInfoStatusProps {
  icon: string; // Tên icon từ MaterialIcons
  title: string; // Tiêu đề
  value: string; // Giá trị
  onPressViewMore?: () => void; // Nút xem thêm
  backgroundColor: string; // Màu nền
  textColor: string; // Màu chữ và icon
}

const CardInfoStatus: React.FC<CardInfoStatusProps> = ({
  icon,
  title,
  value,
  onPressViewMore,
  backgroundColor,
  textColor,
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon name={icon} size={25} color={textColor} style={styles.icon} />
        </View>

        {/* Thông tin */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        </View>
      </View>

      {/* Nút Xem thêm */}
      {onPressViewMore && (
        <TouchableOpacity onPress={onPressViewMore} style={styles.viewMoreButton}>
          <Text style={[styles.viewMoreText, { color: textColor }]}>Xem thêm</Text>
          <Icon name="arrow-forward" size={24} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 15,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    marginRight: 15,
  },
  icon: {
    alignSelf:'center'
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'medium',
    marginBottom: 5,
    fontFamily: 'League Spartan',
  },
  value: {
    fontSize: 12,
    fontFamily: 'League Spartan',
    fontWeight: 'medium',
  },
  viewMoreButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 18,
    fontWeight: 'medium',
    fontFamily: 'League Spartan',
    paddingRight: 5,
  },
});

export default CardInfoStatus;