import { ScrollView, StyleSheet, Text, View, Image, } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import FormInput from '../components/FormInput';
import ButtonAction from '../components/ButtonAction';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import Toast from 'react-native-toast-message';
import { toastStyles } from '../../../assets/styles/toastStyle';

const ChangePasswordScreen = ({ navigation }: any) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const selectedRole = useSelector((state: RootState) => state.auth.role);
    const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

    
    // const phoneNumber = route.params?.phoneNumber || '';
    const logoNoText = require('../../../assets/images/logo/logoNoText.png');

    const handleChangePassword = () => {
        if (!newPassword || !confirmPassword) {
            Toast.show({
                ...toastStyles.errorToast,
                text2: 'Vui lòng nhập đầy đủ mật khẩu!',
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            Toast.show({
                ...toastStyles.errorToast,
                text2: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
            });
            return;
        }
        console.log('Mật khẩu mới:', newPassword);
        Toast.show({
            ...toastStyles.successToast,
            text2: 'Mật khẩu đã được thay đổi thành công!',
        });
        navigation.navigate('LoginScreen'); 
    };

    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title="Đổi mật khẩu"
                onBackButtonPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Logo và hướng dẫn */}
                    <View style={styles.logoContainer}>
                        <Image style={styles.logoNoText} source={logoNoText} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                Vui lòng nhập mật khẩu mới cho tài khoản của {parentTitle}!
                            </Text>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <FormInput
                            title="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            secureTextEntry={true}
                            keyboardType="default"
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                        <FormInput
                            title="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu mới"
                            secureTextEntry={true}
                            keyboardType="default"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                        />
                    </View>
                    <View style={styles.actionContainer}>
                        <ButtonAction
                            title="Xác nhận"
                            onPress={handleChangePassword}
                            color={Colors.textWhite}
                            backgroundColor={Colors.primaryDark}
                        />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default ChangePasswordScreen;

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
        gap: 20,
    },
    logoContainer: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        alignItems: 'center',
        gap: 20,
        backgroundColor: Colors.primaryDark,
        width: '100%',
        paddingVertical: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    logoNoText: {
        width: 198,
        height: 200,
        resizeMode: 'contain',
    },
    textContainer: {
        textAlign: 'center',
        width: '85%',
    },
    text: {
        fontSize: 14,
        color: Colors.textWhite,
        fontWeight: '500',
        marginBottom: 5,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginBottom: 10,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});