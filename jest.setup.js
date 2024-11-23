// jest.setup.ts
import 'react-native-gesture-handler/jestSetup';

require('react-native-reanimated').setUpTests();

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

import { NativeModules } from 'react-native';
import { jest } from '@jest/globals';

NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: {
    AppleLocale: 'en_US',
    AppleLanguages: ['en'],
  },
  getConstants: () => ({
    settings: {
      AppleLocale: 'en_US',
      AppleLanguages: ['en'],
    },
  }),
};

NativeModules.I18nManager = NativeModules.I18nManager || {
  localeIdentifier: 'en_US',
};
