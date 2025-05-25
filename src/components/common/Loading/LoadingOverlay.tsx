import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface LoadingOverlayProps {
  visible: boolean;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, fullScreen = true }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
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

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        fullScreen ? styles.fullScreen : styles.partialScreen,
      ]}
    >
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.gradientCircle,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          <View style={styles.innerCircle} />
        </Animated.View>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.activityIndicator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    position: 'absolute', // Đặt position absolute để nó phủ lên khu vực cụ thể
  },
  fullScreen: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  partialScreen: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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