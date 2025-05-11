import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginAndSecurityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login and Security</Text>
    </View>
  )
}

export default LoginAndSecurityScreen

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