import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../components/common/Header/PrimaryHeader';
import { useDispatch } from 'react-redux';
import { useToast } from '../../../../utils/toasts/useToast';
import { clearAuthData } from '../../../auth/slices/auth.slices';
import { clearData } from '../../../../utils/asyncStorage/authStorage';
import ProfileHeader from '../components/ProfileHeader';
import MenuProfile from '../components/MenuProfile';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { showSuccess } = useToast();

  const handleLogout = async () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SplashScreen' }],
      });
      dispatch(clearAuthData());
      console.log('dispatch clearAuthData');
      await clearData();
      console.log('clearData');
      showSuccess('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuOptionsPress = (option: string) => {
    switch (option) {
      case 'Hồ sơ cá nhân':
        navigation.navigate('PersonalScreen');
        break;
      case 'Danh mục yêu thích':
        navigation.navigate('FavoriteScreen');
        break;
      case 'Khoá học của tôi':
        navigation.navigate('MyCourseScreen');
        break;
      case 'Lịch hẹn tái khám':
        navigation.navigate('MyAppointmentScreen');
        break;
      case 'Lịch sử đi khám':
        navigation.navigate('HistoryAppointmentScreen');
        break;
      case 'Lịch sử mua hàng':
        navigation.navigate('HistoryPurchaseScreen');
        break;
      case 'Yêu cầu hỗ trợ':
        navigation.navigate('RequestSupportScreen');
        break;
      default:
        console.log('Tùy chọn không hợp lệ');
        break;
    }
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Tài khoản"
        disableBackButton={true}
        // onBackButtonPress={() => navigation.goBack()}
        moreButton
        modalTitle="Tùy chọn"
        modalButtons={[
          { text: 'Đăng xuất', onPress: handleLogout },
          { text: 'Xóa tài khoản', onPress: () => console.log('Xóa tài khoản được nhấn') },
        ]}
        onModalClose={() => console.log('Modal closed')}
      />
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          avatarUrl="https://i.pinimg.com/736x/fa/d2/ea/fad2ea48c9b071f3f785395458aebce0.jpg"
          name="Trương Minh Tiền"
          email="marcuschill1823@gmail.com"
        />
        <View style={styles.mainContent}>
          <MenuProfile
            icon="person"
            title="Thông tin cá nhân"
            onPress={() => menuOptionsPress('Hồ sơ cá nhân')}
          />
          <MenuProfile
            icon="family-restroom"
            title="Thành viên gia đình"
            onPress={() => navigation.navigate('MyFamilyScreen')}
          />
          <MenuProfile
            icon="favorite"
            title="Danh mục yêu thích"
            onPress={() => menuOptionsPress('Danh mục yêu thích')}
          />

          <MenuProfile
            icon="calendar-today"
            title="Lịch hẹn tái khám"
            onPress={() => menuOptionsPress('Lịch hẹn tái khám')}
          />
          <MenuProfile
            icon="history"
            title="Lịch sử đi khám"
            onPress={() => menuOptionsPress('Lịch sử đi khám')}
          />

          <MenuProfile
            icon="shopping-bag"
            title="Thanh toán và giao hàng"
            onPress={() => navigation.navigate('PaymentAndDeliveryScreen')}
          />
          <MenuProfile
            icon="shopping-cart"
            title="Lịch sử mua hàng"
            onPress={() => menuOptionsPress('Lịch sử mua hàng')}
          />
          <MenuProfile
            icon="lock"
            title="Đăng nhập và bảo mật"
            onPress={() => navigation.navigate('LoginAndSecurityScreen')}
          />
          <MenuProfile
            icon="help"
            title="Yêu cầu hỗ trợ"
            onPress={() => menuOptionsPress('Yêu cầu hỗ trợ')}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});