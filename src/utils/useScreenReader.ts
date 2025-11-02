import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Hook to detect if a screen reader is enabled on the device.
 *
 * @param override - Optional boolean to override the detected screen reader state.
 *                   When provided, this value will be returned instead of the detected state.
 *                   Useful for testing or forcing a specific screen reader state.
 * @returns {boolean} True if screen reader is enabled (or overridden to true), false otherwise.
 *
 * @example
 * // Auto-detect screen reader
 * const isScreenReaderEnabled = useScreenReader();
 *
 * @example
 * // Force screen reader to be enabled
 * const isScreenReaderEnabled = useScreenReader(true);
 *
 * @example
 * // Force screen reader to be disabled
 * const isScreenReaderEnabled = useScreenReader(false);
 */
export const useScreenReader = (override?: boolean) => {
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
  return override !== undefined ? override : isScreenReaderEnabled;
};

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};
