import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../stores/store';
import { useParentRelationQuery } from '../../../hooks/useParentRelationQuery';
import LoadingOverlay from '../../../../../../components/common/Loading/LoadingOverlay';
import { useFetusByCodeQuery } from '../../../hooks/useFetusByCodeQuery';

// Define interfaces for Parent and other types
interface Parent {
  fullName: string | null;
  dob: string | null;
  phone?: string | null;
}


const MyFamilyScreen = ({ navigation }: any) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken || '');
  const role = useSelector((state: RootState) => state.auth.role || '');
  
  const { data: parentRelationData, isLoading: isParentLoading } = useParentRelationQuery(accessToken);
  const code = parentRelationData?.data?.fetuses?.[0]?.code || '';
  const { data: fetusData, isLoading: isFetusLoading } = useFetusByCodeQuery(code, accessToken);

  const motherData = parentRelationData?.data?.mother as Parent | null;
  const fatherData = parentRelationData?.data?.father as Parent | null;
  const fetusDetail = fetusData?.data?.fetusDetails?.[0];

  console.log('Mother Data:', motherData);
  console.log('Father Data:', fatherData);
  console.log('Fetus Detail:', fetusDetail);

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
          <Text style={styles.sectionTitle}>Thông tin mẹ</Text>
          {motherData ? (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Tên: {motherData.fullName ?? 'Chưa có thông tin'}</Text>
              <Text style={styles.infoText}>Ngày sinh: {motherData.dob ?? 'Chưa có thông tin'}</Text>
              <Text style={styles.infoText}>Số điện thoại: {motherData.phone ?? 'Chưa có thông tin'}</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>Chưa có thông tin mẹ</Text>
          )}
        </View>

        {/* Father's Information (display if user is mother) */}
        {role === 'MOTHER' && (
          <View style={styles.familyMemberContainer}>
            <Text style={styles.sectionTitle}>Thông tin bố</Text>
            {fatherData ? (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Tên: {fatherData.fullName ?? 'Chưa có thông tin'}</Text>
                <Text style={styles.infoText}>Ngày sinh: {fatherData.dob ?? 'Chưa có thông tin'}</Text>
                <Text style={styles.infoText}>Số điện thoại: {fatherData.phone ?? 'Chưa có thông tin'}</Text>
              </View>
            ) : (
              <Text style={styles.noDataText}>Chưa có thông tin bố</Text>
            )}
          </View>
        )}

        {/* Fetus Information */}
        <View style={styles.familyMemberContainer}>
          <Text style={styles.sectionTitle}>Thông tin thai nhi</Text>
          {fetusDetail ? (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Tên: {fetusData?.data?.name ?? 'Chưa đặt tên'}</Text>
              <Text style={styles.infoText}>Tuần thai: {fetusDetail.weekly ?? 0} tuần</Text>
              <Text style={styles.infoText}>Cân nặng: {fetusDetail.weight ?? 0} kg</Text>
              <Text style={styles.infoText}>Chiều dài: {fetusDetail.height ?? 0} cm</Text>
              <Text style={styles.infoText}>Nhịp tim: {fetusDetail.bpm ?? 0} bpm</Text>
              <Text style={styles.infoText}>Chuyển động: {fetusDetail.movement ?? 0} lần</Text>
              <Text style={styles.infoText}>GSD (Đường kính túi thai): {fetusDetail.gsd ?? 0} mm</Text>
              <Text style={styles.infoText}>CRL (Chiều dài đầu mông): {fetusDetail.crl ?? 0} mm</Text>
              <Text style={styles.infoText}>BPD (Đường kính lưỡng đỉnh): {fetusDetail.bpd ?? 0} mm</Text>
              <Text style={styles.infoText}>FL (Chiều dài xương đùi): {fetusDetail.fl ?? 0} mm</Text>
              <Text style={styles.infoText}>HC (Chu vi đầu): {fetusDetail.hc ?? 0} mm</Text>
              <Text style={styles.infoText}>AC (Chu vi bụng): {fetusDetail.ac ?? 0} mm</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>Chưa có thông tin thai nhi</Text>
          )}
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
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  familyMemberContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});