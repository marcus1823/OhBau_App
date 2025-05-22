import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import FetusTrackerCard from '../components/FetusTrackerCard';
import FetusInfoStatus from '../components/FetusInfoStatus';
import MotherInfoStatus from '../components/MotherInfoStatus';

const HomeScreen = () => {
  const handleOpenNotificationModal = () => {
    console.log('Open notification modal');
  };

  // Hard code dữ liệu
  const fetusData = {
    id: 'aa971648-3e04-4cbe-b37c-f6a92e2c094a',
    startDate: '2025-04-10',
    endDate: '2026-01-11',
    name: 'Marcus',
    code: 'akjshdkj',
    weight: 0,
    height: 0,
  };

  // Tính số tuần
  const startDate = new Date(fetusData.startDate);
  const currentDate = new Date(); 
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Số ngày chênh lệch
  const weeks = Math.floor(diffDays / 7); // Số tuần (làm tròn xuống)

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={5}
        unreadNotifications={3}
        onOpenNotificationModal={handleOpenNotificationModal}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Thêm contentContainerStyle
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
      >
        {/* Gọi FetusTrackerCard */}
        <View style={styles.trackerCardWrapper}>
          <FetusTrackerCard
            weeks={weeks}
            name={fetusData.name}
            startDate={fetusData.startDate}
            endDate={fetusData.endDate}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Thông tin của con đây ạ</Text>
          {/* Component FetusInfoStatus */}
          <FetusInfoStatus />
          <Text style={styles.title}>Thông tin của mẹ đây ạ</Text>
          {/* Component MotherInfoStatus */}
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
    marginVertical: 20
  },
});

export default HomeScreen;