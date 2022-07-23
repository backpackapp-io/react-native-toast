import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Directions, FlingGestureHandler } from 'react-native-gesture-handler';

import type { Toast as ToastType } from '../core/types';
import { ToastPosition } from '../core/types';
import { colors, ConstructShadow, useKeyboard } from '../utils';
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
};

export const Toast: FC<Props> = ({
  toast,
  updateHeight,
  offset,
  startPause,
  endPause,
  overrideDarkMode,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { keyboardShown: keyboardVisible, keyboardHeight } = useKeyboard();
  const isDarkMode = useColorScheme() === 'dark' || overrideDarkMode;

  const [toastHeight, setToastHeight] = useState<number>(
    toast?.height ? toast.height : DEFAULT_TOAST_HEIGHT
  );
  const [toastWidth, setToastWidth] = useState<number>(
    toast?.width ? toast.width : width - 32
  );

  const startingY = useMemo(
    () =>
      toast.position === ToastPosition.TOP
        ? -50
        : height - insets.bottom - Platform.select({ ios: 0, default: 32 }),
    [height, toast.position, insets.bottom]
  );

  const opacity = useSharedValue(0);
  const position = useSharedValue(startingY);

  const setPosition = useCallback(() => {
    //control the position of the toast when rendering
    //based on offset, visibility, keyboard, and toast height
    if (toast.position === ToastPosition.TOP) {
      position.value = withTiming(toast.visible ? offset : startingY);
    } else {
      let kbHeight = keyboardVisible ? keyboardHeight : 0;
      position.value = withSpring(
        toast.visible
          ? startingY - toastHeight - offset - kbHeight - insets.bottom - 24
          : startingY,
        {
          stiffness: 80,
        }
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
    startingY,
    toast.position,
  ]);

  useEffect(() => {
    //set the toast height if it updates while rendered
    setToastHeight(toast?.height ? toast.height : DEFAULT_TOAST_HEIGHT);
  }, [toast.height]);

  useEffect(() => {
    //set the toast width if it updates while rendered
    setToastWidth(toast?.width ? toast.width : width - 32);
  }, [toast.width, width]);

  useEffect(() => {
    //Control visibility of toast when rendering
    opacity.value = withTiming(toast.visible ? 1 : 0, {
      duration: 300,
    });
  }, [toast.visible, opacity]);

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
          translateY: position.value,
        },
      ],
    };
  });

  return (
    <FlingGestureHandler
      key={toast.id}
      direction={
        toast.position === ToastPosition.TOP ? Directions.UP : Directions.DOWN
      }
      onActivated={() => {
        position.value = withTiming(startingY, {
          duration: 40,
        });
        toasting.dismiss(toast.id);
      }}
    >
      <AnimatedPressable
        onPressIn={startPause}
        onPressOut={() => {
          endPause();
        }}
        style={[
          {
            position: 'absolute',
            maxHeight: toastHeight,
            left: (width - toastWidth) / 2,
            zIndex: toast.visible ? 9999 : undefined,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
          ConstructShadow('#181821', 0.15, false),
          toast.styles?.pressable,
        ]}
      >
        {toast.customToast ? (
          toast.customToast(toast)
        ) : (
          <View
            onLayout={(event) =>
              updateHeight(toast.id, event.nativeEvent.layout.height)
            }
            style={[
              {
                height: toastHeight,
                backgroundColor: isDarkMode
                  ? colors.backgroundDark
                  : colors.backgroundLight,
                width: toastWidth,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
              },
              toast.styles?.view,
            ]}
            key={toast.id}
          >
            <View
              style={{
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
              }}
            />
            {typeof toast.icon === 'string' ? (
              <Text>{toast.icon}</Text>
            ) : (
              toast.icon
            )}
            <Text
              style={{
                color: isDarkMode ? colors.textLight : colors.textDark,
                padding: 4,
                flex: 1,
              }}
            >
              {toast.message}
            </Text>
          </View>
        )}
      </AnimatedPressable>
    </FlingGestureHandler>
  );
};
