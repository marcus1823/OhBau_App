import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { OtpInput } from 'react-native-otp-entry';
import ButtonAction from '../components/ButtonAction';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { toastStyles } from '../../../assets/styles/toastStyle';

const VerifyCodeScreen = ({ navigation, route }: any) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const selectedRole = useSelector((state: RootState) => state.auth.role);
    const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

    // Lấy số điện thoại từ route params (truyền từ ForgotPasswordScreen)
    const phoneNumber = route.params?.phoneNumber || '';
    const logoNoText = require('../../../assets/images/logo/logoNoText.png');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Xử lý tự động điền OTP từ SMS (kiểm tra clipboard)
    useEffect(() => {
        const handleAutoFill = async () => {
            const clipboard = await Clipboard.getString();
            const otpMatch = clipboard.match(/\b\d{6}\b/); // Tìm chuỗi 6 số
            if (otpMatch && otpMatch[0]) {
                setOtp(otpMatch[0]);
            }
        };
        handleAutoFill();
    }, []);

    const handleVerify = () => {
        console.log('OTP entered:', otp);
        if (otp.length === 6) {
            navigation.navigate('ChangePasswordScreen', {phoneNumber}); // Giả lập chuyển sang màn hình đặt lại mật khẩu
        } else {
            Toast.show({
                ...toastStyles.errorToast,
                text2: 'Vui lòng nhập đủ 6 chữ số OTP!',
            });
        }
    };

    const resendCode = () => {
        setTimer(60); // Reset timer
        console.log('Mã xác nhận đã được gửi lại');
        Toast.show({
            ...toastStyles.successToast,
            text2: 'Mã xác nhận đã được gửi lại!',
        });
        // Gọi API để gửi lại mã OTP nếu cần
    };

    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title="Xác nhận mã OTP"
                onBackButtonPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Logo và hướng dẫn */}
                    <View style={styles.logoContainer}>
                        <Image style={styles.logoNoText} source={logoNoText} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                Mã xác nhận đã được gửi đến số điện thoại {phoneNumber} của {parentTitle}.
                            </Text>
                            <Text style={styles.text}>
                                Vui lòng nhập mã gồm 6 chữ số!
                            </Text>
                        </View>
                    </View>
                    <View style={styles.otpContainer}>
                        <OtpInput
                            numberOfDigits={6}
                            focusColor={Colors.primary}
                            autoFocus={true}
                            placeholder="*"
                            onTextChange={(text) => setOtp(text)}
                            onFilled={(text) => console.log(`OTP đã điền đầy đủ: ${text}`)}
                            textInputProps={{
                                accessibilityLabel: 'Mã xác nhận một lần',
                            }}
                            textProps={{
                                accessibilityRole: 'text',
                                accessibilityLabel: 'Chữ số OTP',
                                allowFontScaling: false,
                            }}
                            theme={{
                                containerStyle: styles.otpContainerTheme,
                                pinCodeContainerStyle: styles.pinCodeContainer,
                                pinCodeTextStyle: styles.pinCodeText,
                                placeholderTextStyle: styles.placeholderText,
                                focusStickStyle: styles.focusStick,
                                focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
                                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                            }}
                        />
                    </View>
                    <Text style={styles.timerText}>
                        {timer > 0 ? `Thời gian còn lại: ${timer}s` : 'Hết thời gian'}
                    </Text>
                    <TouchableOpacity onPress={resendCode} disabled={timer > 0}>
                        <Text style={[styles.resendText, timer > 0 && styles.disabledText]}>
                            Gửi lại mã?
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.actionContainer}>
                        <ButtonAction
                            title="Xác nhận"
                            onPress={handleVerify}
                            color={Colors.textWhite}
                            backgroundColor={Colors.primaryDark}
                        />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default VerifyCodeScreen;

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
    otpContainer: {
        width: '100%',
        alignItems: 'center',
    },
    otpContainerTheme: {
        width: '80%',
    },
    pinCodeContainer: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinCodeText: {
        fontSize: 18,
        color: Colors.textBlack,
    },
    placeholderText: {
        color: Colors.primary,
    },
    focusStick: {
        width: 2,
        height: 20,
        backgroundColor: Colors.primary,
    },
    focusedPinCodeContainer: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    filledPinCodeContainer: {
        borderColor: Colors.primaryDark,
    },
    timerText: {
        fontSize: 12,
        color: Colors.textBlack,
        fontWeight: '300',
    },
    resendText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    disabledText: {
        color: Colors.textGray,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});