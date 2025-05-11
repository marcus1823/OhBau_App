import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';

const HomeScreen = () => {
  const handleOpenNotificationModal = () => {
    console.log('Open notification modal');
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={5}
        unreadNotifications={3}
        onOpenNotificationModal={handleOpenNotificationModal}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to Home Screen!</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.textBlack,
  },
});