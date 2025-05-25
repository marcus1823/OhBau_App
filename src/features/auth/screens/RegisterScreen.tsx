import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import FormInput from '../components/FormInput';
import ButtonAction from '../components/ButtonAction';
import DatePickerComponent from '../components/DatePicker';
import { useToast } from '../../../utils/toasts/useToast';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useRegister } from '../hooks/useRegister.hook';
import {
    validatePhone,
    validateEmail,
    validateRequired,
    validateDateRequired,
    validatePasswordMatch,
    validateRole,
    formatDateToString,
} from '../../../utils/validations/validations'
import { useAuthSync } from '../../../utils/asyncStorage/useAuthSync';
import { setRole } from '../slices/auth.slices';
const RegisterScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [role, setRole] = useState('');
    const [dob, setDob] = useState<Date | null>(null);

    const { showError, showSuccess } = useToast();
    const { mutate: registerUser, isPending } = useRegister();
    const { syncRole } = useAuthSync();
    const dispatch = useDispatch();

    // lấy role từ redux 
    const selectedRole = useSelector((state: RootState) => state.auth.role);
    console.log('Selected role from Redux:', selectedRole);

    // nếu role là FATHER thì hiển thị Bố, ngược lại hiển thị Mẹ
    const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

    const handleRegister = () => {
        let errorMessage: string | null;
        errorMessage = validateRequired(fullName, 'họ và tên');
        // Kiểm tra các trường thông tin
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        errorMessage = validateRequired(phone, 'số điện thoại');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        if (!validatePhone(phone)) {
            showError('Số điện thoại không hợp lệ');
            return;
        }
        errorMessage = validateRequired(email, 'email');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        if (!validateEmail(email)) {
            showError('Email không hợp lệ');
            return;
        }
        errorMessage = validateRequired(password, 'mật khẩu');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        errorMessage = validateRequired(confirmPassword, 'xác nhận mật khẩu');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        errorMessage = validatePasswordMatch(password, confirmPassword);
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        errorMessage = validateDateRequired(dob, 'ngày sinh');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        errorMessage = validateRole(selectedRole, 'vai trò');
        if (errorMessage) {
            showError(errorMessage);
            return;
        }

        // Định dạng payload theo api
        if (!selectedRole) {
            showError('Vui lòng chọn vai trò');
            return;
        }
        
        const payload = {
            phone,
            email,
            password,
            role: selectedRole, // Sử dụng role từ Redux (đã được kiểm tra không null)
            registerParentRequest: {
                fullName,
                dob: formatDateToString(dob!), // Sử dụng formatDateToString từ validation.ts
            },
        };

        registerUser(payload, {
            onSuccess: async (data) => {
                console.log('Register success, data:', data);
                // Đồng bộ role với Redux và AsyncStorage
                if (data?.data?.role && data?.data?.role !== selectedRole) {
                    await syncRole(data.data.role);
                    dispatch(setRole(data.data.role));
                }
                showSuccess(`Chúc mừng ${parentTitle} đã đăng ký thành công`);
                // Điều hướng về LoginScreen
                navigation.navigate('LoginScreen');
            },
            onError: (error: any) => {
                showError(error.message || 'Đã xảy ra lỗi khi đăng ký tài khoản');
            },
        });

    };

    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                roleTitle={parentTitle}
                title="Đăng Ký Nào!"
                onBackButtonPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.formContainer}>
                        {/* Form fullName, phone, email, dob, password, role */}
                        <FormInput
                            title="Họ và tên"
                            placeholder={`Nhập họ và tên của ${parentTitle}`}
                            keyboardType="default"
                            onChangeText={(text) => setFullName(text)}
                            value={fullName}
                        />

                        <FormInput
                            title="Số điện thoại"
                            placeholder={`Nhập số điện thoại của ${parentTitle}`}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                        />

                        <FormInput
                            title="Email"
                            placeholder={`Nhập email của ${parentTitle}`}
                            keyboardType="email-address"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                        />

                        <DatePickerComponent
                            selectedDate={dob || new Date()} // Mặc định là ngày hiện tại nếu chưa chọn
                            onDateChange={(date) => setDob(date)}
                            title="Ngày sinh"
                            placeholder={`Chọn ngày sinh của ${parentTitle}`}

                        />

                        <FormInput
                            title="Mật khẩu"
                            placeholder={`Nhập mật khẩu của ${parentTitle}`}
                            secureTextEntry={true}
                            keyboardType="default"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />

                        <FormInput
                            title="Xác nhận mật khẩu"
                            placeholder={`Nhập lại mật khẩu của ${parentTitle}`}
                            secureTextEntry={true}
                            keyboardType="default"
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                        />
                    </View>

                    {/* Action */}
                    <View style={styles.actionContainer}>
                        <ButtonAction
                            title="Đăng Ký"
                            backgroundColor={Colors.primary}
                            color={Colors.textWhite}
                            onPress={handleRegister}
                        />

                        <TouchableOpacity style={styles.loginOptionContainer} onPress={() => navigation.navigate('LoginScreen')} >
                            <Text style={styles.loginText}>{parentTitle} đã có tài khoản sao? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} disabled={isPending}>
                                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <LoadingOverlay visible={isPending} fullScreen={false} />

        </LinearGradient>
    );
};

export default RegisterScreen;

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
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginTop: 30,
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginOptionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 2,
    },
    loginText: {
        fontSize: 12,
        color: Colors.textBlack,
        fontWeight: '300',
    },
    loginLink: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '500',
    },
});