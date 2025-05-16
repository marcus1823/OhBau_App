import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle'

const HorizontalLine = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
    </View>
  )
}

export default HorizontalLine

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    // marginBottom: 20,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.primary,
  },
});