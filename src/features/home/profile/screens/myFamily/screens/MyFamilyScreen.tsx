import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../stores/store';
import { useParentRelationQuery } from '../../../hooks/useParentRelationQuery';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import { useFetusByCodeQuery } from '../../../hooks/useFetusByCodeQuery';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define interfaces for Parent and other types
interface Parent {
  fullName: string | null;
  dob: string | null;
  phone?: string | null;
}

const InfoItem = ({ icon, title, value }: { icon: string; title: string; value: string | number | null | undefined }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} color={Colors.primary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{title}</Text>
      <Text style={styles.infoValue}>{value || 'Chưa có thông tin'}</Text>
    </View>
  </View>
);

const MyFamilyScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken || '');
  const role = useSelector((state: RootState) => state.auth.role || '');
  
  // Get parent relation data (contains list of fetuses)
  const { data: parentRelationData, isLoading: isParentLoading } = useParentRelationQuery(accessToken);
  
  // Get all fetuses from the data
  const fetuses = parentRelationData?.data?.fetuses || [];
  
  // State to track the currently selected fetus index
  const [selectedFetusIndex, setSelectedFetusIndex] = useState(0);
  
  // Get the code of the currently selected fetus
  const code = fetuses.length > 0 ? fetuses[selectedFetusIndex]?.code || '' : '';
  
  // Get detailed data for the selected fetus
  const { data: fetusData, isLoading: isFetusLoading } = useFetusByCodeQuery(code, accessToken);

  const motherData = parentRelationData?.data?.mother as Parent | null;
  const fatherData = parentRelationData?.data?.father as Parent | null;
  const fetusDetail = fetusData?.data?.fetusDetails?.[0];
  const fetusName = fetusData?.data?.name || 'Bé yêu';

  console.log('Mother Data:', motherData);
  console.log('Father Data:', fatherData);
  console.log('Fetus Detail:', fetusDetail);
  console.log('All Fetuses:', fetuses);

  if (isParentLoading || isFetusLoading) {
    return <LoadingOverlay visible={isParentLoading || isFetusLoading} />;
  }

  const handleAddFamilyMember = () => {
    navigation.navigate('AddFamilyMemberScreen');
  };
  
  const handleEditFetus = () => {
    if (fetusData?.data && fetusDetail) {
      navigation.navigate('EditFetusScreen', {
        fetusData: fetusData.data,
        fetusDetail,
        accessToken,
      });
    } else {
      console.log('No fetus data available to edit');
    }
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Gia đình của tôi"
        onBackButtonPress={() => navigation.goBack()}
        moreButton={true}
        modalTitle="Tùy chọn"
        modalButtons={[
          { text: 'Thêm thành viên', onPress: handleAddFamilyMember },
          { text: 'Chỉnh sửa thai nhi', onPress: handleEditFetus }
        ]}
        onModalClose={() => console.log('Modal closed')}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mother's Information */}
        <View style={styles.familyMemberContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Icon name="pregnant-woman" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Thông tin mẹ</Text>
          </View>
          <View style={styles.divider} />
          
          {motherData ? (
            <View style={styles.infoContainer}>
              <InfoItem icon="person" title="Họ và tên" value={motherData.fullName} />
              <InfoItem icon="cake" title="Ngày sinh" value={motherData.dob} />
              <InfoItem icon="phone" title="Số điện thoại" value={motherData.phone} />
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="info" size={36} color={Colors.textGray} />
              <Text style={styles.noDataText}>Chưa có thông tin mẹ</Text>
            </View>
          )}
        </View>

        {/* Father's Information (display if user is mother) */}
        {role === 'MOTHER' && (
          <View style={[styles.familyMemberContainer, styles.fatherContainer]}>
            <View style={styles.sectionHeaderContainer}>
              <Icon name="face" size={24} color={Colors.primaryDark} />
              <Text style={styles.sectionTitle}>Thông tin bố</Text>
            </View>
            <View style={styles.divider} />
            
            {fatherData ? (
              <View style={styles.infoContainer}>
                <InfoItem icon="person" title="Họ và tên" value={fatherData.fullName} />
                <InfoItem icon="cake" title="Ngày sinh" value={fatherData.dob} />
                <InfoItem icon="phone" title="Số điện thoại" value={fatherData.phone} />
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Icon name="info" size={36} color={Colors.textGray} />
                <Text style={styles.noDataText}>Chưa có thông tin bố</Text>
              </View>
            )}
          </View>
        )}

        {/* Fetus Information */}
        <View style={[styles.familyMemberContainer, styles.fetusContainer]}>
          <View style={styles.sectionHeaderContainer}>
            <Icon name="child-care" size={24} color={Colors.cardHome1} />
            <Text style={styles.sectionTitle}>Thông tin thai nhi</Text>
            <Text style={styles.fetusName}>{fetusName}</Text>
          </View>
          <View style={styles.divider} />
          
          {/* Fetus Selection */}
          {fetuses.length > 0 && (
            <View style={styles.fetusSelectionContainer}>
              <Text style={styles.selectionLabel}>Chọn thai nhi:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.fetusSelectionScroll}
              >
                {fetuses.map((fetus, index) => (
                  <TouchableOpacity 
                    key={fetus.id}
                    style={[
                      styles.fetusOption, 
                      selectedFetusIndex === index && styles.selectedFetusOption
                    ]}
                    onPress={() => setSelectedFetusIndex(index)}
                  >
                    <Text 
                      style={[
                        styles.fetusOptionText,
                        selectedFetusIndex === index && styles.selectedFetusOptionText
                      ]}
                    >
                      {fetus.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          {fetusDetail ? (
            <View style={styles.infoContainer}>
              {/* Basic Info */}
              <Text style={styles.categoryTitle}>Thông tin cơ bản</Text>
              <InfoItem icon="schedule" title="Tuần thai" value={`${fetusDetail.weekly || 0} tuần`} />
              <InfoItem icon="monitor-weight" title="Cân nặng" value={`${fetusDetail.weight || 0} kg`} />
              <InfoItem icon="height" title="Chiều dài" value={`${fetusDetail.height || 0} cm`} />

              {/* Health Indicators */}
              <Text style={[styles.categoryTitle, {marginTop: 16} as StyleProp<TextStyle>]}>Chỉ số sức khỏe</Text>
              <InfoItem icon="favorite" title="Nhịp tim" value={`${fetusDetail.bpm || 0} bpm`} />
              <InfoItem icon="directions-run" title="Chuyển động" value={`${fetusDetail.movement || 0} lần`} />

              {/* Measurements */}
              <Text style={[styles.categoryTitle, {marginTop: 16} as StyleProp<TextStyle>]}>Các chỉ số đo lường</Text>
              <View style={styles.measurementsGrid}>
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>GSD</Text>
                  <Text style={styles.measureValue}>{fetusDetail.gsd || 0} mm</Text>
                  <Text style={styles.measureDesc}>Đường kính túi thai</Text>
                </View>
                
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>CRL</Text>
                  <Text style={styles.measureValue}>{fetusDetail.crl || 0} mm</Text>
                  <Text style={styles.measureDesc}>Chiều dài đầu mông</Text>
                </View>
                
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>BPD</Text>
                  <Text style={styles.measureValue}>{fetusDetail.bpd || 0} mm</Text>
                  <Text style={styles.measureDesc}>Đường kính lưỡng đỉnh</Text>
                </View>
                
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>FL</Text>
                  <Text style={styles.measureValue}>{fetusDetail.fl || 0} mm</Text>
                  <Text style={styles.measureDesc}>Chiều dài xương đùi</Text>
                </View>
                
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>HC</Text>
                  <Text style={styles.measureValue}>{fetusDetail.hc || 0} mm</Text>
                  <Text style={styles.measureDesc}>Chu vi đầu</Text>
                </View>
                
                <View style={styles.measurementItem}>
                  <Text style={styles.measureLabel}>AC</Text>
                  <Text style={styles.measureValue}>{fetusDetail.ac || 0} mm</Text>
                  <Text style={styles.measureDesc}>Chu vi bụng</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="info" size={36} color={Colors.textGray} />
              <Text style={styles.noDataText}>Chưa có thông tin thai nhi</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditFetus}>
            <Icon name="edit" size={16} color={Colors.textWhite} />
            <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MyFamilyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  familyMemberContainer: {
    padding: 16,
    backgroundColor: Colors.textWhite,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  // Fetus Selection Styles
  fetusSelectionContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  selectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textBlack,
    marginBottom: 8,
  },
  fetusSelectionScroll: {
    paddingVertical: 4,
  },
  fetusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.textGray,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFetusOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  fetusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textBlack,
  },
  selectedFetusOptionText: {
    color: Colors.textWhite,
  },
  fatherContainer: {
    borderLeftColor: Colors.primaryDark,
  },
  fetusContainer: {
    borderLeftColor: Colors.cardHome1,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginLeft: 8,
  },
  fetusName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 'auto',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
    opacity: 0.6,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.border,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textBlack,
    fontWeight: '500',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.border,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  measurementItem: {
    width: '48%',
    backgroundColor: Colors.textGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  measureLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  measureValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textBlack,
    marginVertical: 4,
  },
  measureDesc: {
    fontSize: 12,
    color: Colors.cardHome1,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  editButtonText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});