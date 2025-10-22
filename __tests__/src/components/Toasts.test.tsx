// __tests__/Toasts.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Toasts } from '../../../src/components/Toasts';
import { toast } from '../../../src/headless';
import { jest } from '@jest/globals';
import * as hooks from '../../../src/utils/useScreenReader';
import { ToastPosition } from '../../../src/core/types';

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

  it('applies defaultDuration to toasts without explicit duration', () => {
    const { getByText } = render(<Toasts defaultDuration={5000} />);

    act(() => {
      toast('Default Duration Toast', { id: 'duration-test' });
    });

    const toastElement = getByText('Default Duration Toast');
    expect(toastElement).toBeTruthy();
  });

  it('allows individual toasts to override defaultDuration', () => {
    const { getByText } = render(<Toasts defaultDuration={5000} />);

    act(() => {
      toast('Override Duration Toast', { id: 'override-test', duration: 2000 });
    });

    const toastElement = getByText('Override Duration Toast');
    expect(toastElement).toBeTruthy();
  });

  it('applies fade animation type from globalAnimationType prop', () => {
    const { getByText } = render(<Toasts globalAnimationType="fade" />);

    act(() => {
      toast('Fade Animation Toast');
    });

    expect(getByText('Fade Animation Toast')).toBeTruthy();
  });

  it('allows individual toasts to override globalAnimationType', () => {
    const { getByText } = render(<Toasts globalAnimationType="fade" />);

    act(() => {
      toast('Spring Animation Toast', { animationType: 'spring' });
    });

    expect(getByText('Spring Animation Toast')).toBeTruthy();
  });

  it('applies defaultPosition to toasts without explicit position', () => {
    const { getByText } = render(
      <Toasts defaultPosition={ToastPosition.BOTTOM} />
    );

    act(() => {
      toast('Bottom Toast', { id: 'position-test' });
    });

    const toastElement = getByText('Bottom Toast');
    expect(toastElement).toBeTruthy();
  });

  it('allows individual toasts to override defaultPosition', () => {
    const { getByText } = render(
      <Toasts defaultPosition={ToastPosition.BOTTOM} />
    );

    act(() => {
      toast('Top Toast', {
        id: 'override-position-test',
        position: ToastPosition.TOP,
      });
    });

    const toastElement = getByText('Top Toast');
    expect(toastElement).toBeTruthy();
  });

  it('applies toast limit from globalLimit prop', () => {
    const { getByText, queryByText } = render(<Toasts globalLimit={2} />);

    act(() => {
      toast('Toast 1', { id: '1' });
      toast('Toast 2', { id: '2' });
      toast('Toast 3', { id: '3' });
    });

    expect(getByText('Toast 2')).toBeTruthy();
    expect(getByText('Toast 3')).toBeTruthy();
    expect(queryByText('Toast 1')).toBeNull();
  });
});
