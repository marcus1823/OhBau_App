import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Gradients } from '../../../assets/styles/colorStyle'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import FormInput from '../components/FormInput'
import ButtonAction from '../components/ButtonAction'
import { useSelector } from 'react-redux'
import { RootState } from '../../../stores/store'
import Toast from 'react-native-toast-message'
import { toastStyles } from '../../../assets/styles/toastStyle'


const ForgotPasswordScreen = ({ navigation }: any) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const logoNoText = require('../../../assets/images/logo/logoNoText.png')
    // const logoWithText = require('../../../assets/images/logo/OHBAU_Logo_Text1.png')
    // lấy role từ redux 
    const selectedRole = useSelector((state: RootState) => state.auth.role);

    // nếu role là FATHER thì hiển thị Bố, ngược lại hiển thị Mẹ
    const parentTitle = selectedRole === 'FATHER' ? 'Bố' : 'Mẹ';

    const handleSendCode = () => {
        if (phoneNumber) {
            navigation.navigate('VerifyCodeScreen', { phoneNumber });
        } else {
            Toast.show({
                ...toastStyles.errorToast,
                text2: 'Vui lòng nhập số điện thoại!',
            })
        }
    };

    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title="Quên mật khẩu?"
                onBackButtonPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Content */}
                <View style={styles.contentContainer}>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image style={styles.logoNoText} source={logoNoText} />
                        {/* <Image style={styles.logoWithText} source={logoWithText} /> */}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Nhập số điện thoại để nhận mã xác nhận!</Text>
                        </View>
                    </View>

                    {/* Sdt */}
                    <View style={styles.formContainer}>
                        <FormInput
                            title="Số điện thoại"
                            placeholder={`Nhập số điện thoại của ${parentTitle}`}
                            keyboardType="phone-pad"
                            onChangeText={setPhoneNumber}
                            value={phoneNumber}
                        />
                    </View>

                    {/* Action */}
                    <View style={styles.actionContainer}>
                        <ButtonAction
                            title="Gửi mã xác nhận"
                            onPress={handleSendCode}
                            color={Colors.textWhite}
                            backgroundColor={Colors.primaryDark}
                        />
                        </View>
                </View>

            </ScrollView>
        </LinearGradient>

    )
}

export default ForgotPasswordScreen

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
        gap: 20,
    },
    logoContainer: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: -100,
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
        resizeMode: "contain",
    },
    logoWithText: {
        width: 350,
        height: 70,
        resizeMode: "contain",
    },
    textContainer: {
        // marginBottom: 20,
        textAlign: 'center',
        width: '85%',
    },
    text: {
        fontSize: 14,
        color: Colors.textWhite,
        fontWeight: '500',
        marginBottom: 5,
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
})