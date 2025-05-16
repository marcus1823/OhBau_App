import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Gradients } from '../../../assets/styles/colorStyle'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import DoctorDetailCard from '../components/DoctorDetailCard'
import DoctorDetailContent from '../components/DoctorDetailContent'



const DoctorDetailScreen = ({ navigation, route }: any) => {
    const { id: doctorId } = route.params;
    console.log('doctorId in detail:', doctorId);

    const handleBookingDoctorPress = () => {
        navigation.navigate('DoctorBookingScreen', { doctorId });
    };
    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title="Thông tin bác sĩ"
                onBackButtonPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.mainContent}>
                    <DoctorDetailCard
                        fullName="PSG. Nguyễn Thị Ngọc Lan"
                        major="Sản phụ khoa"
                        address="Bệnh viện Đa khoa Quốc tế Vinmec"
                        experience="Hơn 30 năm kinh nghiệm"
                        focus="Tư vấn và hướng dẫn cách chăm sóc sức khỏe cho phụ nữ trong thời kỳ mang thai."
                        rating={4.5}
                        comment="40"
                        schedule="Thứ 2 - Thứ 6: 8h - 17h"
                        avatar="https://i.pinimg.com/736x/99/d4/5d/99d45df0969c2dadbf6d36d96b071665.jpg"
                        bookingDoctorPress={handleBookingDoctorPress}
                    />

                    <DoctorDetailContent
                        profile="Chủ tịch thường trực hội Thấp khớp học Việt Nam.
                            PGS.TS. Phó trưởng Bộ môn Nội Tổng hợp – Trường Đại học Y Hà Nội
                            PGS.TS. Trưởng khoa Cơ Xương khớp Bệnh viện Bạch mai Hà Nội.
                            Phó bí thư chi bộ Liên Bộ Môn Nội Tổng hợp – Trường Đại học Y Hà Nội
                            Giảng viên cao cấp Bộ môn Nội tổng hợp – Trường Đại học Y Hà Nội."
                        careerPath="1989 – 2002: Bác sĩ tại Bệnh viên Sản phụ khoa Hải Phòng.
                            2002 – 2013: Phó khoa Phụ sản Bệnh viên Đại học Y Dược TP Hồ Chí Minh – Cơ sở 4.
                            2013 – 2015: Trưởng khoa Sản tại Bệnh viện Phụ sản Mêkông."
                        outstanding="1999: Chứng nhận phẫu thuật nội soi phụ khoa nâng cao tại Bệnh viện Đại học Clermont – Ferrand của Pháp.
                            2011: Bằng Siêu âm tại Bệnh viện Phụ sản Hùng Vương."
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default DoctorDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 60,
        marginBottom: 100,
    },
    mainContent: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 20,
        gap: 20,
        alignItems: 'center',
    },
});