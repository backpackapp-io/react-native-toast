import React, { FunctionComponent } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Toast as T, useToaster } from '../headless';
import { Toast } from './Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
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
  onToastHide?: (toast: T) => void;
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
}) => {
  const { toasts, handlers } = useToaster({ providerKey });
  const { startPause, endPause } = handlers;
  const insets = useSafeAreaInsets();
  const isScreenReaderEnabled = useScreenReader();
  const { keyboardShown: keyboardVisible, keyboardHeight } = useKeyboard();

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
        bottom: insets.bottom + (extraInsets?.bottom ?? 0) + 16,
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
          extraInsets={extraInsets}
          defaultStyle={defaultStyle}
          keyboardVisible={keyboardVisible}
          keyboardHeight={keyboardHeight}
        />
      ))}
    </View>
  );
};
