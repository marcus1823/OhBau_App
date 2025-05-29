import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
// import { useToast } from '../../../utils/toasts/useToast';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import FetusTrackerCard from '../components/FetusTrackerCard';
import FetusInfoStatus from '../components/FetusInfoStatus';
import MotherInfoStatus from '../components/MotherInfoStatus';
import { getParentRelationApi, getFetusByCodeApi } from '../api/familyApi';
import { RootState } from '../../../stores/store';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { Fetus } from '../types/family.type';

const HomeScreen = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  // const { showError } = useToast();

  // Dữ liệu dự phòng khi không có dữ liệu từ API
  const fallbackFetusData: Fetus = {
    id: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    name: 'Chưa có dữ liệu',
    code: '',
    fetusDetails: [],
  };

  // Fetch parent-relation data (chạy ngay cả khi không có accessToken)
  const {
    data: parentRelationData,
    isLoading: isRelationLoading,
    error: errorRelation,
  } = useQuery({
    queryKey: ['parentRelation'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Không có token truy cập. Vui lòng đăng nhập để xem thông tin đầy đủ.');
      }
      return await getParentRelationApi(accessToken);
    },
    enabled: true, // Bỏ điều kiện accessToken
    retry: false,
  });

  // Lấy fetusCode, dùng mã giả nếu không có
  const fetusCode = parentRelationData?.data?.fetuses[0]?.code || 'DEFAULT_FAKE_CODE';

  // Fetch fetus data (chạy ngay cả khi không có accessToken)
  const {
    data: fetusData,
    isLoading: isFetusLoading,
    error: errorFetus,
  } = useQuery({
    queryKey: ['fetusData', fetusCode],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Không có token truy cập. Vui lòng đăng nhập để xem thông tin thai nhi.');
      }
      if (!fetusCode) {
        throw new Error('Không tìm thấy mã thai nhi.');
      }
      return await getFetusByCodeApi(fetusCode, accessToken);
    },
    enabled: true, // Bỏ điều kiện accessToken
    retry: false,
  });

  // Log data in HomeScreen
  useEffect(() => {
    console.log('HomeScreen - Parent Relation Data:', parentRelationData);
    console.log('HomeScreen - Fetus Code:', fetusCode);
    console.log('HomeScreen - Fetus Data:', fetusData);
    console.log('HomeScreen - Fetus Details Array:', fetusData?.data?.fetusDetails || 'No details available');
    if (errorRelation || errorFetus) {
      console.log(errorRelation?.message || errorFetus?.message || 'Không thể tải dữ liệu.');
    
    }
  }, [parentRelationData, fetusCode, fetusData, errorRelation, errorFetus]);

  // Handle loading state
  if (isRelationLoading || isFetusLoading) {
    return <LoadingOverlay visible={true} />;
  }

  // Sử dụng fetus data hoặc fallback
  const fetus = fetusData?.data || fallbackFetusData;

  // Calculate weeks
  const startDate = new Date(fetus.startDate);
  const currentDate = new Date('2025-05-28T12:57:00+07:00'); // Sử dụng thời gian hiện tại từ hệ thống
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);

  const handleOpenNotificationModal = () => {
    console.log('Mở modal thông báo');
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={5}
        unreadNotifications={3}
        onOpenNotificationModal={handleOpenNotificationModal}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.trackerCardWrapper}>
          <FetusTrackerCard
            weeks={weeks}
            name={fetus.name}
            startDate={fetus.startDate}
            endDate={fetus.endDate}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Thông tin của con đây ạ</Text>
          <FetusInfoStatus fetusDetails={fetus.fetusDetails} />
          <Text style={styles.title}>Thông tin của mẹ đây ạ</Text>
          <MotherInfoStatus />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  trackerCardWrapper: {
    marginBottom: 20,
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'League Spartan',
    marginVertical: 20,
  },
});

export default HomeScreen;