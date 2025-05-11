import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MyAppointmentScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>My Appointment Screen</Text>
      </View>
    </View>
  )
}

export default MyAppointmentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})