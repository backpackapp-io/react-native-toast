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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import type { Toast as ToastType } from '../core/types';
import { resolveValue, Toast as T, ToastPosition } from '../core/types';
import {
  colors,
  ConstructShadow,
  useKeyboard,
  useVisibilityChange,
} from '../utils';
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
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { keyboardShown: keyboardVisible, keyboardHeight } = useKeyboard();

  useVisibilityChange(
    () => {
      onToastShow?.(toast);
    },
    () => {
      onToastHide?.(toast);
    },
    toast.visible
  );

  const isSystemDarkMode = useColorScheme() === 'dark';
  const isDarkMode =
    overrideDarkMode !== undefined ? overrideDarkMode : isSystemDarkMode;

  const [toastHeight, setToastHeight] = useState<number>(
    toast?.height ? toast.height : DEFAULT_TOAST_HEIGHT
  );
  const [toastWidth, setToastWidth] = useState<number>(
    toast?.width ? toast.width : width - 32 > 360 ? 360 : width - 32
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
  const offsetY = useSharedValue(startingY);

  const onPress = () => onToastPress?.(toast);

  const setPosition = useCallback(() => {
    //control the position of the toast when rendering
    //based on offset, visibility, keyboard, and toast height
    if (toast.position === ToastPosition.TOP) {
      offsetY.value = withTiming(toast.visible ? offset : startingY);
      position.value = withTiming(toast.visible ? offset : startingY);
    } else {
      let kbHeight = keyboardVisible ? keyboardHeight : 0;
      const val = toast.visible
        ? startingY - toastHeight - offset - kbHeight - insets.bottom - 24
        : startingY;
      offsetY.value = withSpring(val, {
        stiffness: 80,
      });

      position.value = withSpring(val, {
        stiffness: 80,
      });
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
    offsetY,
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
      .direction(
        toast.position === ToastPosition.TOP ? Directions.UP : Directions.DOWN
      )
      .onEnd(() => {
        offsetY.value = withTiming(startingY, {
          duration: 40,
        });
        runOnJS(toasting.dismiss)(toast.id);
      });

    return Gesture.Simultaneous(flingGesture, panGesture);
  }, [offsetY, startingY, position, setPosition, toast.position, toast.id]);

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
          translateY: offsetY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector key={toast.id} gesture={composedGesture}>
      <AnimatedPressable
        onPressIn={startPause}
        onPressOut={() => {
          endPause();
        }}
        onPress={onPress}
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
          !toast.disableShadow && ConstructShadow('#181821', 0.15, false),
          toast.styles?.pressable,
        ]}
      >
        {toast.customToast ? (
          <View
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
              numberOfLines={1}
              style={[
                {
                  color: isDarkMode ? colors.textLight : colors.textDark,
                  padding: 4,
                  flex: 1,
                },
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
