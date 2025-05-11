import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RequestSupportScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Request Support Screen</Text>
      </View>
    </View>
  )
}

export default RequestSupportScreen

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