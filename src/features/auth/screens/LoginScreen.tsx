import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { RootState } from '../../../stores/store';
import { useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import ButtonAction from '../components/ButtonAction';
import OptionLogin from '../components/OptionLogin';

const LoginScreen = ({ navigation }: any) => {
  // lấy role từ redux 
  const selectedRole = useSelector((state: RootState) => state.auth.role);
  console.log('selectedRole', selectedRole);

  // nếu role là FATHER thì hiển thị Bố, ngược lại hiển thị Mẹ
  const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

  const welcomeTitle = `Chào ${parentTitle} Yêu!`;
  const welcomeMessage = `Con đang lớn lên từng ngày trong bụng mẹ nè! ${parentTitle} nhớ đăng nhập để con có thể cùng ${parentTitle} theo dõi hành trình tuyệt vời này nhé!`;

  const handleLogin = () => {
    console.log('Login button pressed');
    navigation.navigate('TabNavigation');
  }
  const handleForgotPassword = () => {
    console.log('Forgot password button pressed');
    navigation.navigate('ForgotPasswordScreen');
  }

  const handleOptionLogin = (option: string) => {
    switch (option) {
      case 'Facebook':
        console.log('Facebook login option selected');
        break;
      case 'Face ID':
        console.log('Face ID login option selected');
        break;
      case 'Google':
        console.log('Google login option selected');
        break;
      default:
        console.log('Unknown login option selected');
    }
  }

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        roleTitle={parentTitle}
        title="Đăng Nhập Nào!"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} >

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Welcome */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTile}>{welcomeTitle}</Text>
            <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <FormInput
              title="Email hoặc số điện thoại"
              placeholder="example@example.com"
              keyboardType="email-address"
              onChangeText={(text) => console.log(text)}
            />
            <FormInput
              title="Mật Khẩu"
              placeholder="********"
              secureTextEntry={true}
              onChangeText={(text) => console.log(text)}
            />
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.8}> 
              <Text style={styles.forgotPasswordText}>{parentTitle} quên mật khẩu ạ?</Text>
            </TouchableOpacity>
          </View>
          {/* Action */}
          <View style={styles.actionContainer}>
            {/* Button Action */}
            <ButtonAction
              title="Đăng Nhập"
              onPress={handleLogin}
              backgroundColor={Colors.primary}
              color={Colors.textWhite}
            />

            <Text style={styles.optionText}>Hoặc {parentTitle} có thể đăng nhập bằng</Text>

            {/* Option Login */}
            <OptionLogin
              onPress={(option) => handleOptionLogin(option)}
            />

            <TouchableOpacity style={styles.registerOptionContainer} onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.registerText}>{parentTitle} chưa có tài khoản sao? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerLink}>Đăng ký nhé</Text>
              </TouchableOpacity>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>

    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Ensures ScrollView content takes up necessary space
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
    // gap: 20,
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
    alignItems: 'center'
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