import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '../../auth/slices/auth.slices';
import { clearData } from '../../../utils/asyncStorage/authStorage';
import { useToast } from '../../../utils/toasts/useToast';
import ButtonAction from '../../auth/components/ButtonAction';
import { Colors } from '../../../assets/styles/colorStyle';

const HomeScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { showSuccess } = useToast();

    const handleLogout = async () => {
        try {
            dispatch(clearAuthData());
            console.log('dispatch clearAuthData');
            await clearData();
            console.log('clearData');
            showSuccess('Đăng xuất thành công!');
            navigation.reset({
                index: 0,
                routes: [{ name: 'SplashScreen' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Home Screen!</Text>
            <ButtonAction 
                title= "Đăng xuất"
                onPress={handleLogout}
                color = {Colors.textWhite}
                backgroundColor = {Colors.primary}
            /> 
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        padding: 10,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
    },
});