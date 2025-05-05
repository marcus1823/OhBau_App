import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Gradients } from '../../../assets/styles/colorStyle'
import LinearGradient from 'react-native-linear-gradient'

const HomeScreen = () => {
  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
    </LinearGradient>
  )
}

export default HomeScreen

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