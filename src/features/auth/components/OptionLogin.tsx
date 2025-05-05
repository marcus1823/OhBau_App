import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../../../assets/styles/colorStyle';

interface OptionLoginProps {
    onPress?: (option: string) => void;
}

const OptionLogin: React.FC<OptionLoginProps> = ({ onPress }) => {
    const ggIcon = require('../../../assets/icons/icons8-google-48.png');
    const fbIcon = require('../../../assets/icons/icons8-facebook-50.png');
    const faceIdIcon = require('../../../assets/icons/icons8-face-scan-48.png');

    return (
        <View style={styles.container}>
            {/* Option 1 Google */}
            <TouchableOpacity style={styles.iconContainer} onPress={() => onPress?.('Google')}>
                <Image 
                    source={ggIcon} 
                    style={styles.icon}        
                />
            </TouchableOpacity>

            {/* Option 2 Facebook */}
            <TouchableOpacity style={styles.iconContainer} onPress={() => onPress?.('Facebook')}>
                <Image
                    source={fbIcon}
                    style={styles.iconfb}
                />
            </TouchableOpacity>

            {/* Option 3 Face ID */}
            <TouchableOpacity style={styles.iconContainer} onPress={() => onPress?.('Face ID')}>
                <Image
                    source={faceIdIcon}
                    style={styles.icon}
                />
            </TouchableOpacity> 
        </View>
    );
};

export default OptionLogin;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconfb: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});