import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const useScreenReader = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled()
      .then(setIsScreenReaderEnabled)
      .catch(() => {
        setIsScreenReaderEnabled(false);
      });
  }, []);
  return isScreenReaderEnabled;
};

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};
