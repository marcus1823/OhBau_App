import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle';

interface DoctorDetailContentProps {
    profile?: string[];
    careerPath?: string[];
    outstanding?: string[];
}

const DoctorDetailContent = ({ profile, careerPath, outstanding }: DoctorDetailContentProps) => {
  return (
    <View style={styles.container}>
        <View style={styles.contentContainer}>
            <Text style={styles.title}>Hồ sơ</Text>
            {profile?.map((item, index) => (
                <Text key={index} style={styles.content}>
                    • {item}
                </Text>
            ))}
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.title}>Kinh nghiệm</Text>
            {careerPath?.map((item, index) => (
                <Text key={index} style={styles.content}>
                    • {item}
                </Text>
            ))}
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.title}>Nổi bật</Text>
            {outstanding?.map((item, index) => (
                <Text key={index} style={styles.content}>
                    • {item}
                </Text>
            ))}
        </View>
    </View>
  )
}

export default DoctorDetailContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary
    },
    content: {
        fontSize: 12,
        color: Colors.textBlack,
        marginTop: 5,
        lineHeight: 20,
        fontWeight: 'light',
        textAlign: 'justify',
    },
})