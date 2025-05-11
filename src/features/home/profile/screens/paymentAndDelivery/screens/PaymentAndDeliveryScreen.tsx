import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PaymentAndDeliveryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment and Delivery</Text>
    </View>
  )
}

export default PaymentAndDeliveryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})