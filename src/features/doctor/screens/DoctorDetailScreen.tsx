import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Gradients } from '../../../assets/styles/colorStyle'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'

const DoctorDetailScreen = ({ navigation, route }: any) => {
  const { id: doctorId } = route.params;
  console.log('doctorId in detail:', doctorId);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Thông tin bác sĩ"
        onBackButtonPress={() => navigation.goBack()}
      />
    </LinearGradient>
  );
};


export default DoctorDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})