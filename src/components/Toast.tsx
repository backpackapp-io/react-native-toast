import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextStyle,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
  withTiming,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import type { ExtraInsets, Toast as ToastType } from '../core/types';
import { resolveValue, Toast as T, ToastPosition } from '../core/types';
import { colors, ConstructShadow, useVisibilityChange } from '../utils';
import { toast as toasting } from '../headless';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DEFAULT_TOAST_HEIGHT = 50;

type Props = {
  toast: ToastType;
  updateHeight: (toastId: string, height: number) => void;
  offset: number;
  endPause: () => void;
  startPause: () => void;
  customRenderer?: (toast: ToastType) => React.ReactNode;
  overrideDarkMode?: boolean;
  onToastShow?: (toast: T) => void;
  onToastHide?: (toast: T) => void;
  onToastPress?: (toast: T) => void;
  extraInsets?: ExtraInsets;
  keyboardVisible?: boolean;
  keyboardHeight: number;
  defaultStyle?: {
    pressable?: ViewStyle;
    view?: ViewStyle;
    text?: TextStyle;
    indicator?: ViewStyle;
  };
};

export const Toast: FC<Props> = ({
  toast,
  updateHeight,
  offset,
  startPause,
  endPause,
  overrideDarkMode,
  onToastHide,
  onToastPress,
  onToastShow,
  extraInsets,
  defaultStyle,
  keyboardVisible,
  keyboardHeight,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isSystemDarkMode = useColorScheme() === 'dark';

  const [toastHeight, setToastHeight] = useState<number>(
    toast?.height ? toast.height : DEFAULT_TOAST_HEIGHT
  );
  const [toastWidth, setToastWidth] = useState<number>(
    toast?.width ? toast.width : width - 32 > 360 ? 360 : width - 32
  );

  const isDarkMode =
    overrideDarkMode !== undefined ? overrideDarkMode : isSystemDarkMode;

  const getStartingPosition = useMemo(() => {
    let leftPosition = (width - toastWidth) / 2; // Default to center

    if (
      toast.position === ToastPosition.TOP_LEFT ||
      toast.position === ToastPosition.BOTTOM_LEFT
    ) {
      leftPosition = insets.left + 16 + (extraInsets?.left ?? 0);
    }

    if (
      toast.position === ToastPosition.TOP_RIGHT ||
      toast.position === ToastPosition.BOTTOM_RIGHT
    ) {
      leftPosition =
        width - toastWidth - insets.right - 16 - (extraInsets?.right ?? 0);
    }

    let startY = 0;

    if (
      toast.position === ToastPosition.TOP ||
      toast.position === ToastPosition.TOP_LEFT ||
      toast.position === ToastPosition.TOP_RIGHT
    ) {
      startY = -(toast.height || DEFAULT_TOAST_HEIGHT) - insets.top - 50;
    } else {
      startY =
        height - insets.bottom - Platform.select({ ios: 16, default: 32 });
    }

    return { startY, leftPosition };
  }, [
    height,
    width,
    toastWidth,
    toast.position,
    toast.height,
    insets,
    extraInsets,
  ]);

  const { startY, leftPosition } = getStartingPosition;

  const opacity = useSharedValue(0);
  const position = useSharedValue(startY);
  const offsetY = useSharedValue(startY);

  const onPress = () => onToastPress?.(toast);

  const dismiss = useCallback((id: string) => {
    toasting.dismiss(id);
  }, []);

  const getSwipeDirection = useCallback(() => {
    if (
      toast.position === ToastPosition.TOP ||
      toast.position === ToastPosition.TOP_LEFT ||
      toast.position === ToastPosition.TOP_RIGHT
    ) {
      return Directions.UP;
    } else {
      return Directions.DOWN;
    }
  }, [toast.position]);

  const setPosition = useCallback(() => {
    let timingConfig: WithTimingConfig = { duration: 300 };
    let springConfig: WithSpringConfig = { stiffness: 80 };

    if (toast.animationConfig) {
      const {
        duration = 300,
        easing = Easing.inOut(Easing.quad),
        reduceMotion = ReduceMotion.System,
        ...spring
      } = toast.animationConfig;
      timingConfig = { duration, easing, reduceMotion };
      springConfig = spring;
    }

    const useSpringAnimation = toast.animationType === 'spring';
    const animation = useSpringAnimation ? withSpring : withTiming;

    if (
      toast.position === ToastPosition.TOP ||
      toast.position === ToastPosition.TOP_LEFT ||
      toast.position === ToastPosition.TOP_RIGHT
    ) {
      offsetY.value = animation(
        toast.visible ? offset : startY,
        useSpringAnimation ? springConfig : timingConfig
      );
      position.value = animation(
        toast.visible ? offset : startY,
        useSpringAnimation ? springConfig : timingConfig
      );
    } else {
      let kbHeight = keyboardVisible ? keyboardHeight : 0;
      const val = toast.visible
        ? startY -
          toastHeight -
          offset -
          kbHeight -
          insets.bottom -
          (extraInsets?.bottom ?? 0) -
          Platform.select({
            ios: 32,
            default: 24,
          })
        : startY;

      offsetY.value = animation(
        val,
        useSpringAnimation ? springConfig : timingConfig
      );
      position.value = animation(
        val,
        useSpringAnimation ? springConfig : timingConfig
      );
    }
  }, [
    offset,
    toast.visible,
    keyboardVisible,
    keyboardHeight,
    toastHeight,
    insets.bottom,
    position,
    startY,
    toast.position,
    offsetY,
    extraInsets,
    toast.animationConfig,
    toast.animationType,
  ]);

  const composedGesture = useMemo(() => {
    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        offsetY.value = e.translationY / 4 + position.value;
      })
      .onEnd(() => {
        runOnJS(setPosition)();
      });

    const flingGesture = Gesture.Fling()
      .direction(getSwipeDirection())
      .onEnd(() => {
        offsetY.value = withTiming(startY, {
          duration: toast?.animationConfig?.flingPositionReturnDuration ?? 40,
        });
        runOnJS(dismiss)(toast.id);
      });

    return toast.isSwipeable
      ? Gesture.Simultaneous(flingGesture, panGesture)
      : panGesture;
  }, [
    offsetY,
    startY,
    position,
    setPosition,
    toast.id,
    dismiss,
    toast.isSwipeable,
    toast.animationConfig,
    getSwipeDirection,
  ]);

  useVisibilityChange(
    () => {
      onToastShow?.(toast);
    },
    () => {
      onToastHide?.(toast);
    },
    toast.visible
  );

  useEffect(() => {
    setToastHeight(toast?.height ? toast.height : DEFAULT_TOAST_HEIGHT);
  }, [toast.height]);

  useEffect(() => {
    setToastWidth(
      toast?.width ? toast.width : width - 32 > 360 ? 360 : width - 32
    );
  }, [toast.width, width]);

  useEffect(() => {
    opacity.value = withTiming(toast.visible ? 1 : 0, {
      duration: toast?.animationConfig?.duration ?? 300,
    });
  }, [toast.visible, opacity, toast.animationConfig]);

  useEffect(() => {
    setPosition();
  }, [
    offset,
    toast.visible,
    keyboardVisible,
    keyboardHeight,
    toastHeight,
    setPosition,
  ]);

  const style = useAnimatedStyle(() => {
    //Control opacity and translation of toast
    return {
      opacity: opacity.value,
      transform: [
        {
          translateY: offsetY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector key={toast.id} gesture={composedGesture}>
      <AnimatedPressable
        testID="toast-pressable"
        onPressIn={startPause}
        onPressOut={() => {
          endPause();
        }}
        onPress={onPress}
        style={[
          {
            backgroundColor: !toast.customToast
              ? isDarkMode
                ? colors.backgroundDark
                : colors.backgroundLight
              : undefined,
            borderRadius: 8,
            position: 'absolute',
            left: leftPosition,
            zIndex: toast.visible ? 9999 : undefined,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
          !toast.disableShadow && ConstructShadow('#181821', 0.15, false),
          defaultStyle?.pressable,
          toast.styles?.pressable,
        ]}
      >
        {toast.customToast ? (
          <View
            testID="toast-view"
            onLayout={(event) =>
              updateHeight(toast.id, event.nativeEvent.layout.height)
            }
            key={toast.id}
          >
            {toast.customToast({
              ...toast,
              height: toastHeight,
              width: toastWidth,
            })}
          </View>
        ) : (
          <View
            testID="toast-view"
            onLayout={(event) =>
              updateHeight(toast.id, event.nativeEvent.layout.height)
            }
            style={[
              {
                minHeight: toastHeight,
                width: toastWidth,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
              },
              defaultStyle?.view,
              toast.styles?.view,
            ]}
            key={toast.id}
          >
            {(toast.type === 'error' || toast.type === 'success') && (
              <View
                style={[
                  {
                    backgroundColor:
                      toast.type === 'error'
                        ? colors.error
                        : toast.type === 'success'
                        ? colors.success
                        : isDarkMode
                        ? colors.backgroundDark
                        : colors.backgroundLight,
                    width: 3,
                    height: '100%',
                    borderRadius: 12,
                    marginRight: 12,
                  },
                  defaultStyle?.indicator,
                  toast?.styles?.indicator,
                ]}
              />
            )}
            {typeof toast.icon === 'string' ? (
              <Text>{toast.icon}</Text>
            ) : (
              toast.icon
            )}
            <Text
              style={[
                {
                  color: isDarkMode ? colors.textLight : colors.textDark,
                  padding: 4,
                  flex: 1,
                },
                defaultStyle?.text,
                toast?.styles?.text,
              ]}
            >
              {resolveValue(toast.message, toast)}
            </Text>
          </View>
        )}
      </AnimatedPressable>
    </GestureDetector>
  );
};
