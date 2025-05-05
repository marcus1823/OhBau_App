import { StyleSheet, Text } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Gradients } from '../../../assets/styles/colorStyle'

const ShopScreen = () => {
  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <Text style={styles.text}>ShopScreen</Text>
    </LinearGradient>
  )
}

export default ShopScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
})