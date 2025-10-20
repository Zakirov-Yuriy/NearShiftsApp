import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../app/providers/AppProviders';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = observer(({ width = '100%', height = 20, borderRadius = 4 }) => {
  const { themeStore } = useStores();
  const { colors } = themeStore.currentTheme;

  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  skeleton: {
    // backgroundColor будет установлен динамически из темы
  },
});
