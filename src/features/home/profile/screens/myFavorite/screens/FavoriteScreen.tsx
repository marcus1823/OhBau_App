import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FavoriteScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Favorite Screen</Text>
      </View>
    </View>
  )
}

export default FavoriteScreen

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