import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle'
import Button from '../../splash/components/Button'

const StartScreen = ({navigation}: any) => {
    const logoNoText = require('../../../assets/images/logo/logoNoText.png')
    const logoWithText = require('../../../assets/images/logo/OHBAU_Logo_Text1.png')

    const title = `Mẹ ơi, Con là bé yêu trong bụng mẹ nè! 💕
Mẹ đã sẵn sàng cùng con trải qua hành trình tuyệt diệu này chưa? Hãy vào đây để con thì thầm với mẹ những điều hay ho mỗi ngày nha!`

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logoNoText} source={logoNoText} />
                <Image style={styles.logoWithText} source={logoWithText} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}  >
                    <Text style={styles.text}>{title}</Text>
                </View>
                <View style={styles.buttonContainer} >
                    <Button title="Đăng nhập" 
                    onPress={() => navigation.navigate('LoginScreen')} 
                    color={Colors.textWhite} 
                    backgroundColor={Colors.primaryDark} />

                    <Button title="Đăng ký" 
                    onPress={() => navigation.navigate('RegisterScreen')} 
                    color={Colors.primary} 
                    backgroundColor={Colors.textWhite} />
                </View>
            </View>
        </View>
    )
}


export default StartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    logoContainer: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        alignItems: 'center',
        gap: 20,
    },
    logoNoText: {
        width: 246,
        height: 248,
        resizeMode: "contain",
    },
    logoWithText: {
        width: 350,
        height: 70,
        resizeMode: "contain",
    },
    contentContainer: {
        bottom: -50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        width: '80%',
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.textWhite,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 18,
        gap: 20,
    }


})