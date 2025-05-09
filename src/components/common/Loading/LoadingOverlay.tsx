import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Modal, StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface LoadingOverlayProps {
    visible: boolean;
    fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, fullScreen = true }) => {
    const rotation = useRef(new Animated.Value(0)).current; // Giá trị Animated cho hiệu ứng xoay

    // Tạo hiệu ứng xoay vòng gradient
    useEffect(() => {
        const rotateAnimation = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000, // Thời gian xoay 1 vòng (2 giây)
                useNativeDriver: true,
            })
        );

        if (visible) {
            rotateAnimation.start();
        } else {
            rotateAnimation.stop();
        }

        return () => rotateAnimation.stop();
    }, [visible, rotation]);

    // Chuyển đổi giá trị rotation thành góc xoay (0 -> 360 độ)
    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (!visible) {
        return null;
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => {}}
        >
            <View
                style={[
                    styles.container,
                    fullScreen ? styles.fullScreen : styles.partialScreen,
                ]}
            >
                <View style={styles.loaderContainer}>
                    {/* Vòng tròn gradient xoay */}
                    <Animated.View
                        style={[
                            styles.gradientCircle,
                            { transform: [{ rotate: rotateInterpolate }] },
                        ]}
                    >
                        <View style={styles.innerCircle} />
                    </Animated.View>
                    {/* ActivityIndicator ở giữa */}
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={styles.activityIndicator}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 1000,
    },
    fullScreen: {
        flex: 1,
    },
    partialScreen: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    loaderContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: Colors.primary,
        borderRightColor: Colors.primary,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)', 
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    activityIndicator: {
        position: 'absolute',
    },
});

export default LoadingOverlay;