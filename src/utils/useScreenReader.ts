import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export const useScreenReader = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled()
      .then((isEnabled) => {
        if (Platform.OS !== 'web') {
          setIsScreenReaderEnabled(isEnabled);
        }
      })
      .catch(() => {
        setIsScreenReaderEnabled(false);
      });
  }, []);
  return isScreenReaderEnabled;
};

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};
