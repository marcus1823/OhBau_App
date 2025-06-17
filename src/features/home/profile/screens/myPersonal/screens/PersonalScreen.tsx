import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import PersonalInfoItem from '../components/PersonalInfoItem';
import { useFocusEffect } from '@react-navigation/native';

const PersonalScreen = ({ navigation, route }: any) => {
  const [userData, setUserData] = useState(route.params?.profileData || {});
  const [userRole, setUserRole] = useState(route.params?.role || '');
  
  // Handle updates when screen receives focus or route params change
  useFocusEffect(
    React.useCallback(() => {
      // Update local state if new data is passed via route params
      if (route.params?.profileData) {
        setUserData(route.params.profileData);
      }
      if (route.params?.role) {
        setUserRole(route.params.role);
      }
      
      // Optional: You could also fetch fresh data from API here
      // if (route.params?.refresh) {
      //   fetchUserProfileData();
      // }
    }, [route.params])
  );

  console.log('PersonalScreen profileData:', userData);
  console.log('PersonalScreen role:', userRole);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Cá nhân"
        onBackButtonPress={() => navigation.goBack()}
        moreButton
        modalTitle="Tuỳ chọn"
        modalButtons={[
          { text: 'Chỉnh sửa hồ sơ', onPress: () => navigation.navigate('UpdateProfileScreen', { profileData: userData, role: userRole }) },
        ]}
        onModalClose={() => console.log('Modal closed')}
      />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar lớn ở giữa */}
        <View style={styles.avatarContainer}>
          <Image
            source={userData?.avatar ? { uri: userData.avatar } : require('../../../../../../assets/images/skelector/doctorSkelector.jpg')}
            style={styles.avatar}
          />
        </View>

        {/* Nội dung chính */}
        <View style={styles.mainContent}>
          <PersonalInfoItem title="Họ và Tên" value={userData?.fullName || 'chưa cập nhật'}/>
          <PersonalInfoItem title="Vai trò" value={userRole || 'chưa cập nhật'} />
          <PersonalInfoItem title="Ngày sinh" value={userData?.dob || 'chưa cập nhật'} />
          <PersonalInfoItem title="Số điện thoại" value={userData?.phone || 'chưa cập nhật'} />
          <PersonalInfoItem title="Email" value={userData?.email || 'chưa cập nhật'} />
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