import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../components/common/Header/PrimaryHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../../utils/toasts/useToast';
import { clearAuthData } from '../../../auth/slices/auth.slices';
import { clearData } from '../../../../utils/asyncStorage/authStorage';
import ProfileHeader from '../components/ProfileHeader';
import MenuProfile from '../components/MenuProfile';
import { useQuery } from '@tanstack/react-query';
import { getProfileApi } from '../api/profileApi';
import { RootState } from '../../../../stores/store';

const ProfileScreen = ( { navigation }: any ) =>
{
  const dispatch = useDispatch();
  const { showSuccess } = useToast();
  const accessToken = useSelector( ( state: any ) => state.auth.accessToken );
  const role = useSelector( ( state: RootState ) => state.auth.role );

  const {
    data: profileData,
    isLoading,
    // error,
  } = useQuery( {
    queryKey: [ 'profile', accessToken ],
    queryFn: () => getProfileApi( accessToken ),
    enabled: !!accessToken,
    // retry: 1,
  } );

  const handleLogout = async () =>
  {
    try
    {
      navigation.reset( {
        index: 0,
        routes: [ { name: 'SplashScreen' } ],
      } );
      dispatch( clearAuthData() );
      console.log( 'dispatch clearAuthData' );
      await clearData();
      console.log( 'clearData' );
      showSuccess( 'Đăng xuất thành công!' );
    } catch ( err )
    {
      console.log( 'Logout error:', err );
    }
  };

  const handleDeleteAccount = async () =>
  {
    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản của mình không? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => { handleLogout(); }
        },
      ]
    );
  }

  const menuOptionsPress = ( option: string ) =>
  {
    switch ( option )
    {
      case 'Hồ sơ cá nhân':
        navigation.navigate( 'PersonalScreen', { profileData, role } );
        break;
      case 'Danh mục yêu thích':
        navigation.navigate( 'FavoriteScreen' );
        break;
      case 'Khoá học của tôi':
        navigation.navigate( 'MyCourseScreen' );
        break;
      case 'Lịch hẹn đi khám':
        navigation.navigate( 'MyAppointmentScreen' );
        break;
      case 'Lịch sử đi khám':
        navigation.navigate( 'HistoryAppointmentScreen' );
        break;
      case 'Lịch sử mua hàng':
        navigation.navigate( 'HistoryPurchaseScreen' );
        break;
      case 'Yêu cầu hỗ trợ':
        navigation.navigate( 'RequestSupportScreen' );
        break;
      default:
        console.log( 'Tùy chọn không hợp lệ' );
        break;
    }
  };

  // Render profile header with dynamic data
  const renderProfileHeader = () =>
  {
    if ( isLoading )
    {
      return (
        <View style={ styles.loadingContainer }>
          <ActivityIndicator size="large" color={ Gradients.backgroundPrimary[ 0 ] } />
        </View>
      );
    }
    // if (error) {
    //   return (
    //     <View style={styles.errorContainer}>
    //       <Text style={styles.errorText}>
    //         {error instanceof Error ? error.message : 'Không thể tải thông tin hồ sơ'}
    //       </Text>
    //     </View>
    //   );
    // }
    return (
      <ProfileHeader
        // avatarUrl={profileAvatar}
        name={ profileData?.fullName || 'Chưa cập nhật' }
        email={ profileData?.email || 'Chưa cập nhật' }
      />
    );
  };

  return (
    <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.container }>
      <PrimaryHeader
        title="Tài khoản"
        disableBackButton={ true }
        moreButton
        modalTitle="Tùy chọn"
        modalButtons={ [
          { text: 'Đăng xuất', onPress: handleLogout },
          { text: 'Xóa tài khoản', onPress: handleDeleteAccount },
        ] }
        onModalClose={ () => console.log( 'Modal closed' ) }
      />
      <ScrollView style={ styles.contentContainer } showsVerticalScrollIndicator={ false }>
        { renderProfileHeader() }
        <View style={ styles.mainContent }>
          <MenuProfile
            icon="person"
            title="Thông tin cá nhân"
            onPress={ () => menuOptionsPress( 'Hồ sơ cá nhân' ) }
          />
          <MenuProfile
            icon="family-restroom"
            title="Thành viên gia đình"
            onPress={ () => navigation.navigate( 'MyFamilyScreen' ) }
          />
          <MenuProfile
            icon="favorite"
            title="Danh mục yêu thích"
            onPress={ () => menuOptionsPress( 'Danh mục yêu thích' ) }
          />
          {/* <MenuProfile
            icon="calendar-today"
            title="Lịch hẹn đi khám"
            onPress={() => menuOptionsPress('Lịch hẹn đi khám')}
          /> */}
          {/* <MenuProfile
            icon="history"
            title="Lịch sử đi khám"
            onPress={() => menuOptionsPress('Lịch sử đi khám')}
          /> */}
          <MenuProfile
            icon="shopping-bag"
            title="Thanh toán và giao hàng"
            onPress={ () => navigation.navigate( 'PaymentAndDeliveryScreen' ) }
          />
          <MenuProfile
            icon="shopping-cart"
            title="Lịch sử mua hàng"
            onPress={ () => menuOptionsPress( 'Lịch sử mua hàng' ) }
          />
          <MenuProfile
            icon="lock"
            title="Đăng nhập và bảo mật"
            onPress={ () => navigation.navigate( 'LoginAndSecurityScreen' ) }
          />
          <MenuProfile
            icon="help"
            title="Yêu cầu hỗ trợ"
            onPress={ () => menuOptionsPress( 'Yêu cầu hỗ trợ' ) }
          />
          <MenuProfile
            icon="policy"
            title="Chính sách bảo mật"
            onPress={ () => navigation.navigate( 'PolicyScreen' ) }
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
    marginBottom: 100,
  },
  mainContent: {
    flex: 1,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
} );