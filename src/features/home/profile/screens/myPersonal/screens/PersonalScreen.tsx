import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import PersonalInfoItem from '../components/PersonalInfoItem';

const PersonalScreen = ({ navigation, route }: any) => {
  const { profileData, role } = route.params;
  console.log('PersonalScreen profileData:', profileData);
  console.log('PersonalScreen role:', role);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Cá nhân"
        onBackButtonPress={() => navigation.goBack()}
        moreButton
        modalTitle="Tuỳ chọn"
        modalButtons={[
          { text: 'Chỉnh sửa hồ sơ', onPress: () => console.log('Chỉnh sửa') },
        ]}
        onModalClose={() => console.log('Modal closed')}
      />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar lớn ở giữa */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/fa/d2/ea/fad2ea48c9b071f3f785395458aebce0.jpg' }} // Thay bằng URL ảnh avatar thực tế
            style={styles.avatar}
          />
        </View>

        {/* Nội dung chính */}
        <View style={styles.mainContent}>
          <PersonalInfoItem title="Họ và Tên" value={profileData?.fullName || 'chưa cập nhật'}/>
          <PersonalInfoItem title="Vai trò" value={role || 'chưa cập nhật'} />
          <PersonalInfoItem title="Ngày sinh" value={profileData?.dob || 'chưa cập nhật'} />
          <PersonalInfoItem title="Số điện thoại" value={profileData?.phone || 'chưa cập nhật'} />
          <PersonalInfoItem title="Email" value={profileData?.email || 'chưa cập nhật'} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PersonalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 60, 
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75, // Nửa chiều rộng để tạo hình tròn
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});