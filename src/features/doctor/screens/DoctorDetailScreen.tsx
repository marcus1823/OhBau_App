import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Gradients } from '../../../assets/styles/colorStyle'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'
import DoctorDetailCard from '../components/DoctorDetailCard'
import DoctorDetailContent from '../components/DoctorDetailContent'
import { useQuery } from '@tanstack/react-query'
import { getDoctorByIdApi } from '../api/doctorApi'
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay'

const DoctorDetailScreen = ({ navigation, route }: any) => {
    const { id: doctorId } = route.params;
    console.log('doctorId in detail:', doctorId);

    // hàm lấy thôn tin bác sĩ theo id
    const {data, isLoading, error} = useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: () => getDoctorByIdApi({ doctorID: doctorId }),
    });

    if (isLoading) {
        return <LoadingOverlay visible={isLoading} />;
    }
    if (error) {
        console.log('Error fetching doctor details:', error);
        return;
    }

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
                        fullName={data?.fullName || 'Chưa cập nhật tên'}
                        major={data?.major || 'Chưa cập nhật chuyên khoa'}
                        address={data?.address || 'Chưa cập nhật địa chỉ'}
                        experence={data?.experence || []}
                        focus={data?.focus || []} // Sử dụng mảng rỗng làm giá trị mặc định
                        rating={data?.rating || 0}
                        totalFeedbacks={data?.totalFeedbacks || 0}
                        workSchedule={data?.workSchedule || ['Chưa cập nhật'] }
                        avatar={data?.avatar || ''}
                        bookingDoctorPress={handleBookingDoctorPress}
                    />

                    <DoctorDetailContent
                        medicalProfile={data?.medicalProfile || ['Chưa cập nhật hồ sơ y tế']}
                        careerPath={data?.careerPath || ['Chưa cập nhật lộ trình sự nghiệp']}
                        outStanding={data?.outStanding || ['Chưa cập nhật thành tựu nổi bật']   }
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
        justifyContent: 'center',
    },
});