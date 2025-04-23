// __tests__/Toasts.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Toasts } from '../../../src/components/Toasts';
import { toast } from '../../../src/headless';
import { jest } from '@jest/globals';
import * as hooks from '../../../src/utils/useScreenReader';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 350,
      height: 650,
    }),
  };
});

describe('<Toasts />', () => {
  beforeEach(() => {
    jest.spyOn(hooks, 'useScreenReader').mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      toast.dismiss();
    });
  });

  it('renders multiple toasts and maintains order', () => {
    const { getByText } = render(<Toasts />);

    act(() => {
      toast('First Toast', { id: '1' });
      toast('Second Toast', { id: '2' });
    });

    expect(getByText('First Toast')).toBeTruthy();
    expect(getByText('Second Toast')).toBeTruthy();
  });

  it('does not render when screen reader is enabled', () => {
    jest.spyOn(hooks, 'useScreenReader').mockReturnValue(true);
    const { queryByTestId } = render(<Toasts />);
    expect(queryByTestId('toast-view')).toBeNull();
  });

  it('renders nothing when useScreenReader returns true', () => {
    jest.spyOn(hooks, 'useScreenReader').mockReturnValue(true);
    const { queryByTestId } = render(<Toasts />);

    act(() => {
      toast('Accessible Toast');
    });

    expect(queryByTestId('toast-view')).toBeNull();
  });
});
