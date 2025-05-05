import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle'

interface ButtonActionProps {
        title: string
        onPress: () => void
        color?: string
        backgroundColor?: string
}

const ButtonAction: React.FC<ButtonActionProps>  = ({ title, onPress, color, backgroundColor }) => {
  return (
       <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
         <Text style={[styles.buttonText, { color }]}>{title}</Text>
       </TouchableOpacity>
  )
}

export default ButtonAction

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.textWhite,
        // padding: 7,
        // paddingHorizontal: 15,
        width: 220,
        height: 48,
        borderRadius: 30,
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
