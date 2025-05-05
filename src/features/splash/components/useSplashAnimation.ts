import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SplashAnimation {
  logoAnimatedStyle: object;
  contentAnimatedStyle: object;
}

const useSplashAnimation = (): SplashAnimation => {
  const logoTranslateY = useSharedValue(0);
  const contentTranslateY = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: logoTranslateY.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  useEffect(() => {
    logoTranslateY.value = withTiming(-10, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    contentTranslateY.value = withTiming(60, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [logoTranslateY, contentTranslateY]);

  return { logoAnimatedStyle, contentAnimatedStyle };
};

export default useSplashAnimation;