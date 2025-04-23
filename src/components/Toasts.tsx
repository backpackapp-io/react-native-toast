import React, { FunctionComponent } from 'react';
import {
  Platform,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import { Toast as T, useToaster } from '../headless';
import { Toast } from './Toast';
import {
  useSafeAreaInsets,
  useSafeAreaFrame,
} from 'react-native-safe-area-context';
import {
  DismissReason,
  ExtraInsets,
  ToastAnimationConfig,
  ToastAnimationType,
} from '../core/types';
import { useScreenReader } from '../utils';
import { useKeyboard } from '../utils';

type Props = {
  overrideDarkMode?: boolean;
  extraInsets?: ExtraInsets;
  onToastShow?: (toast: T) => void;
  onToastHide?: (toast: T, reason?: DismissReason) => void;
  onToastPress?: (toast: T) => void;
  providerKey?: string;
  preventScreenReaderFromHiding?: boolean;
  defaultStyle?: {
    pressable?: ViewStyle;
    view?: ViewStyle;
    text?: TextStyle;
    indicator?: ViewStyle;
  };
  globalAnimationType?: ToastAnimationType;
  globalAnimationConfig?: ToastAnimationConfig;
  fixAndroidInsets?: boolean;
};

export const Toasts: FunctionComponent<Props> = ({
  overrideDarkMode,
  extraInsets,
  onToastHide,
  onToastPress,
  onToastShow,
  providerKey = 'DEFAULT',
  preventScreenReaderFromHiding,
  defaultStyle,
  globalAnimationType,
  globalAnimationConfig,
  fixAndroidInsets = true,
}) => {
  const { toasts, handlers } = useToaster({ providerKey });
  const { startPause, endPause } = handlers;
  const insets = useSafeAreaInsets();
  const safeAreaFrame = useSafeAreaFrame();
  const dimensions = useWindowDimensions();
  const isScreenReaderEnabled = useScreenReader();
  const { keyboardShown: keyboardVisible, keyboardHeight } = useKeyboard();

  // Fix for Android bottom inset bug: https://github.com/facebook/react-native/issues/47080
  const bugFixDelta =
    fixAndroidInsets &&
    Platform.OS === 'android' &&
    Math.abs(safeAreaFrame.height - dimensions.height) > 1
      ? insets.bottom
      : 0;

  if (isScreenReaderEnabled && !preventScreenReaderFromHiding) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top + (extraInsets?.top ?? 0) + 16,
        left: insets.left + (extraInsets?.left ?? 0),
        right: insets.right + (extraInsets?.right ?? 0),
        bottom: insets.bottom + bugFixDelta + (extraInsets?.bottom ?? 0) + 16,
        pointerEvents: 'box-none',
      }}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={{
            ...t,
            animationType: t.animationType || globalAnimationType || 'timing',
            animationConfig: t.animationConfig ||
              globalAnimationConfig || { duration: 300 },
          }}
          startPause={startPause}
          endPause={endPause}
          updateHeight={handlers.updateHeight}
          offset={handlers.calculateOffset(t, {
            reverseOrder: true,
          })}
          overrideDarkMode={overrideDarkMode}
          onToastHide={onToastHide}
          onToastPress={onToastPress}
          onToastShow={onToastShow}
          extraInsets={{
            ...extraInsets,
            bottom: (extraInsets?.bottom ?? 0) + bugFixDelta,
          }}
          defaultStyle={defaultStyle}
          keyboardVisible={keyboardVisible}
          keyboardHeight={keyboardHeight}
        />
      ))}
    </View>
  );
};
