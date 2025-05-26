import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import ButtonAction from '../../auth/components/ButtonAction';

const BookingStatusScreen = ({ navigation }: any) => {
    //   const { status = 'success' } = route.params || {};
    const status = 'success'; // Giả sử trạng thái là 'success' cho ví dụ này

    // Dữ liệu trạng thái
    const statusMap: any = {
        success: {
            icon: 'check-circle',
            text: 'Đặt lịch thành công!',
            color: 'green',
        },
        failed: {
            icon: 'cancel',
            text: 'Đặt lịch thất bại!',
            color: 'red',
        },
        cancelled: {
            icon: 'remove-circle',
            text: 'Đặt lịch đã bị huỷ!',
            color: 'orange',
        },
    };

    const handleNavHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigation' }],
        });
    }
    const handleNavSchedule = () => {
        navigation.navigate('Cá nhân', {
            screen: 'MyAppointmentScreen',
        });

    }

    const currentStatus = statusMap[status] || statusMap.success;

    return (
        <View style={styles.container}>
            <Icon name={currentStatus.icon} size={100} color={currentStatus.color} />
            <Text style={[styles.statusText, { color: currentStatus.color }]}>
                {currentStatus.text}
            </Text>

            <View style={styles.buttonRow}>

                <ButtonAction
                    title="Xem lịch"
                    onPress={handleNavSchedule}
                    backgroundColor={Colors.primary}
                    color={Colors.textWhite}
                />
                <ButtonAction
                    title="Trang chủ"
                    onPress={handleNavHome}
                    backgroundColor={Colors.primary}
                    color={Colors.textWhite}
                />
            </View>
        </View>
    );
};

export default BookingStatusScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    buttonRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 15,
        marginTop: 30,
    },
});
