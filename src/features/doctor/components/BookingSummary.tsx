import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BookingSummaryProps {
  selectedDate: string;
  selectedTime: string | null;
  patientInfo: {
    patientType: string;
    name: string;
    age: string;
    address: string;
    gender: string;
    visitPurpose: string[];
    description: string;
    phoneNumber?: string;
  };
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedDate, selectedTime, patientInfo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <Icon name="event" size={20} color={Colors.textBlack} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Thông Tin Lịch Hẹn</Text>
        </View>
        <View style={styles.infoRow2}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Ngày: <Text style={styles.infoTextBold}>{selectedDate || 'Chưa chọn'}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Giờ: <Text style={styles.infoTextBold}>{selectedTime || 'Chưa chọn'}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <Icon name="person" size={20} color={Colors.textBlack} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Thông Tin Bệnh Nhân</Text>
        </View>
        <View style={styles.infoRow3}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Đặt cho: <Text style={styles.infoTextBold}>{patientInfo.patientType || 'Chưa nhập'}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Giới Tính: <Text style={styles.infoTextBold}>{patientInfo.gender || 'Chưa nhập'}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.infoRow3}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Họ và Tên: <Text style={styles.infoTextBold}>{patientInfo.name || 'Chưa nhập'}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Tuổi: <Text style={styles.infoTextBold}>{patientInfo.age || 'Chưa nhập'}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Địa chỉ: <Text style={styles.infoTextBold}>{patientInfo.address || 'Chưa nhập'}</Text>
          </Text>
        </View>
        {patientInfo.phoneNumber && (
          <View style={styles.infoRow}>
            <Icon name="phone" size={16} color={Colors.textBlack} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Số Điện Thoại: <Text style={styles.infoTextBold}>{patientInfo.phoneNumber}</Text>
            </Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Mục đích khám:{' '}
            <Text style={styles.infoTextBold}>
              {patientInfo.visitPurpose?.length > 0 ? patientInfo.visitPurpose.join(', ') : 'Chưa chọn'}
            </Text>
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Mô Tả Triệu Chứng:{' '}
            <Text style={styles.infoTextBold}>{patientInfo.description || 'Chưa nhập'}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BookingSummary;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.textWhite,
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  summarySection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBlack,
  },
  infoRow2: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 20,
    paddingTop: 5,
  },
  infoRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 25,
    paddingTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
    fontSize: 19,
  },
  infoText: {
    fontSize: 15,
    color: Colors.primary,
    flexShrink: 1,
    fontWeight: 'bold',
  },
  infoTextBold: {
    fontWeight: '400',
    color: Colors.textBlack,
  },
});