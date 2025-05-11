import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MyFamilyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Family</Text>
    </View>
  )
}

export default MyFamilyScreen

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