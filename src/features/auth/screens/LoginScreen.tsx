import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { RootState } from '../../../stores/store';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import ButtonAction from '../components/ButtonAction';
// import OptionLogin from '../components/OptionLogin';
import { useAuthSync } from '../../../utils/asyncStorage/useAuthSync';
import { useToast } from '../../../utils/toasts/useToast';
import { useLogin } from '../hooks/useLogin.hook';
import { setRole } from '../slices/auth.slices';
import { role } from '../types/auth.types';
import { validatePhone } from '../../../utils/validations/validations';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { Alert } from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [parentTitle, setParentTitle] = useState('Mẹ');
  const { showError } = useToast();
  const { syncAccessToken, syncRole, syncAccountId } = useAuthSync();
  const { mutate: loginUser, isPending } = useLogin();
  const selectedRole = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();

  // Update parentTitle based on selectedRole when component mounts
  useEffect(() => {
    setParentTitle(selectedRole === role.FATHER ? 'Bố' : selectedRole === role.MOTHER ? 'Mẹ' : 'Mẹ');
  }, [selectedRole]);

  const handleLogin = () => {
    if (!phone) {
      showError('Vui lòng nhập số điện thoại');
      return;
    } else if (!validatePhone(phone)) {
      showError('Số điện thoại không hợp lệ');
      return;
    } else if (!password) {
      showError('Vui lòng nhập mật khẩu');
      return;
    }

    loginUser(
      { phone, password },
      {
        onSuccess: async (data) => {
          console.log('Login success, data:', data);
          // showSuccess('Đăng nhập thành công!');
          if (data.accessToken) {
            await syncAccessToken(data.accessToken);
          }
          if (data.role) {
            await syncRole(data.role);
            dispatch(setRole(data.role));
          }
          if (data.id) {
            await syncAccountId(data.id);
          }
          const newParentTitle = data.role === role.FATHER ? 'Bố' : data.role === role.MOTHER ? 'Mẹ' : 'Mẹ';
          setParentTitle(newParentTitle);
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigation' }],
          });
        },
        onError: (error: any) => {
          console.log('Login error:', error);
          showError(error.message || 'Đã xảy ra lỗi trong quá trình đăng nhập');
        },
      }
    );
  };

  const handleForgotPassword = () => {
    // navigation.navigate('ForgotPasswordScreen');
    Alert.alert(
      'Thông báo',
      `Tính năng quên mật khẩu đang được phát triển. Vui lòng thử lại sau.`,
    );
  };

  // const handleOptionLogin = (option: string) => {
  //   Alert.alert(
  //     'Thông báo',
  //     `Tính năng đăng nhập bằng ${option} đang được phát triển. Vui lòng thử lại sau.`,
  //   );
  // };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        roleTitle={parentTitle}
        title="Đăng Nhập Nào!"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTile}>{`Chào ${parentTitle} Yêu!`}</Text>
            <Text style={styles.welcomeMessage}>
              {`Con đang lớn lên từng ngày trong bụng mẹ nè! ${parentTitle} nhớ đăng nhập để con có thể cùng ${parentTitle} theo dõi hành trình tuyệt vời này nhé!`}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <FormInput
              title="Số Điện Thoại"
              placeholder="0123456789"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              value={phone}
            />
            <FormInput
              title="Mật Khẩu"
              placeholder="********"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.8}>
              <Text style={styles.forgotPasswordText}>{parentTitle} quên mật khẩu ạ?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionContainer}>
            <ButtonAction
              title="Đăng Nhập"
              onPress={handleLogin}
              backgroundColor={Colors.primary}
              color={Colors.textWhite}
              disabled={isPending}
            />
            {/* <Text style={styles.optionText}>Hoặc {parentTitle} có thể đăng nhập bằng</Text> */}
            {/* <OptionLogin onPress={handleOptionLogin} /> */}
            <TouchableOpacity
              style={styles.registerOptionContainer}
              onPress={() => navigation.navigate('RegisterScreen')}
            >
              <Text style={styles.registerText}>{parentTitle} chưa có tài khoản sao? </Text>
              <Text style={styles.registerLink}>Đăng ký nhé</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isPending} fullScreen={false} />
    </LinearGradient>
  );
};

export default LoginScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  welcomeContainer: {
    gap: 10,
    marginBottom: 50,
  },
  welcomeTile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  welcomeMessage: {
    fontSize: 12,
    color: Colors.textBlack,
    fontWeight: '300',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'right',
    marginRight: 5,
  },
  actionContainer: {
    gap: 20,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '300',
    color: Colors.textBlack,
  },
  registerOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 2,
  },
  registerText: {
    fontSize: 12,
    color: Colors.textBlack,
    fontWeight: '300',
  },
  registerLink: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});