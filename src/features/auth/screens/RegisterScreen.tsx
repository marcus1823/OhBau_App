import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import FormInput from '../components/FormInput';
import ButtonAction from '../components/ButtonAction';
import DatePickerComponent from '../components/DatePicker';

const RegisterScreen = ({ navigation }: any) => {
    const [dob, setDob] = useState<Date | null>(null);

    // lấy role từ redux 
    const selectedRole = useSelector((state: RootState) => state.auth.role);

    // nếu role là FATHER thì hiển thị Bố, ngược lại hiển thị Mẹ
    const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

    const handleRegister = () => {
        console.log('Register button pressed');
        navigation.navigate('LoginScreen');
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
                        />

                        <FormInput
                            title="Số điện thoại"
                            placeholder={`Nhập số điện thoại của ${parentTitle}`}
                            keyboardType="phone-pad"
                        />

                        <FormInput
                            title="Email"
                            placeholder={`Nhập email của ${parentTitle}`}
                            keyboardType="email-address"
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
                        />

                        <FormInput
                            title="Xác nhận mật khẩu"
                            placeholder={`Nhập lại mật khẩu của ${parentTitle}`}
                            secureTextEntry={true}
                            keyboardType="default"
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
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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