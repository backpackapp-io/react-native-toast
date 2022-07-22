import React, { FunctionComponent } from 'react';
import { View } from 'react-native';

import { useToaster } from '../headless';
import { Toast } from './Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  overrideDarkMode?: boolean;
};

export const Toasts: FunctionComponent<Props> = ({ overrideDarkMode }) => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top,
        left: insets.left,
        right: insets.right,
        bottom: insets.bottom,
      }}
      pointerEvents={'box-none'}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          startPause={startPause}
          endPause={endPause}
          updateHeight={handlers.updateHeight}
          offset={handlers.calculateOffset(t, {
            reverseOrder: true,
          })}
          overrideDarkMode={overrideDarkMode}
        />
      ))}
    </View>
  );
};
