import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

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
