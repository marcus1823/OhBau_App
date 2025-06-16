import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors, Gradients } from '../../../assets/styles/colorStyle'
import LinearGradient from 'react-native-linear-gradient'
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader'

const ComingSoonScreen = ({ navigation }: any) => {
    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title="Tính năng mới"
                onBackButtonPress={() => navigation.goBack()}
            />
            <View style={styles.content}>
                <Text style={styles.text}>Tính năng sắp được ra mắt</Text>
            </View>
        </LinearGradient>
    )
}

export default ComingSoonScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: Colors.textBlack,
        textAlign: 'center',
        marginTop: 20,
    },
})