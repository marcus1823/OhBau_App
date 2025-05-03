import { StyleSheet, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle'

export interface ButtonProps {
    title: string
    onPress: () => void
    color?: string
    backgroundColor?: string
}

const Button: React.FC<ButtonProps> = ({ title, onPress, color, backgroundColor }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.textWhite,
        padding: 7,
        paddingHorizontal: 15,
        width: 173,
        height: 36,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
