import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/styles/colorStyle'
import Button from './components/Button'
import Animated from 'react-native-reanimated'
import useSplashAnimation from './components/useSplashAnimation'
import { role } from '../auth/types/auth.types'
import { useDispatch } from 'react-redux'
import { setRole } from '../auth/slices/auth.slices'

const SplashScreen = ({navigation}: any) => {
    const logoNoText = require('../../assets/images/logo/logoNoText.png')
    const { logoAnimatedStyle, contentAnimatedStyle } = useSplashAnimation();

    const dispatch = useDispatch();

    const handleButtonPress = (selectedRole: string) => {
        let roleValue: role;

        switch(selectedRole) {
            case 'Bố':
                roleValue = role.FATHER;
                break;
            case 'Mẹ':
                roleValue = role.MOTHER;
                break;
            default:
                roleValue = role.MOTHER;
                break;        
        }
        // Dispatch the role to the Redux store
        dispatch(setRole(roleValue))
        
        navigation.navigate('StartScreen');
    }
    return (
        <View style={styles.container}>

            {/* animation for logo */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]} >
                <Image style={styles.logoNoText} source={logoNoText} />
            </Animated.View>

            {/* animation for content */}
            <Animated.View style={[styles.contentContainer, contentAnimatedStyle]} >
                <View style={styles.contentContainer}>
                    <Text style={styles.text}>Bạn Là?</Text>
                    <Button title="Bố" 
                    onPress={() => handleButtonPress('Bố')}
                    color={Colors.primary} backgroundColor={Colors.textWhite}  />
                    <Button title="Mẹ" 
                    onPress={() => handleButtonPress('Mẹ')}
                    color={Colors.primary} backgroundColor={Colors.textWhite} />
                    <Button title="Khác" 
                    onPress={() => handleButtonPress('Khác')}
                    color={Colors.primary} backgroundColor={Colors.textWhite} />
                </View>
            </Animated.View>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    logoContainer: {
        alignContent: 'center',
        justifyContent: 'center',
    },
    logoNoText: {
        width: 246,
        height: 248,
    },
    contentContainer: {
        gap: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 37,
        color: Colors.textWhite,
        fontWeight: 'bold',
        textAlign: 'center',

    },

})