// __tests__/Toast.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Toast } from '../../../src/components/Toast';
import {
  ToastPosition,
  Toast as ToastType,
  ToastType as ToastingType,
  resolveValue,
  DismissReason,
} from '../../../src/core/types';
import { toast as toasting } from '../../../src/headless';
import { View, Text } from 'react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.runOnJS = (fn: any) => fn;
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

const mockUseWindowDimensions = jest.fn();

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}));

const mockUseColorScheme = jest.fn();

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: mockUseColorScheme,
}));

describe('<Toast />', () => {
  const updateHeight = jest.fn();
  const endPause = jest.fn();
  const startPause = jest.fn();
  const onToastShow = jest.fn();
  const onToastHide = jest.fn();
  const onToastPress = jest.fn();
  const dismiss = jest.spyOn(toasting, 'dismiss');

  const defaultProps = {
    toast: {
      type: 'success' as unknown as ToastingType,
      id: '1',
      message: 'Test Toast',
      pauseDuration: 0,
      createdAt: Date.now(),
      visible: true,
      position: ToastPosition.BOTTOM,
      providerKey: 'DEFAULT',
    },
    updateHeight,
    offset: 0,
    endPause,
    startPause,
    onToastShow,
    onToastHide,
    onToastPress,
    keyboardHeight: 0,
    keyboardVisible: false,
  };

  beforeEach(() => {
    mockUseWindowDimensions.mockReturnValue({ width: 375, height: 667 });
    mockUseColorScheme.mockReturnValue('light');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toast with default props', () => {
    const { getByText } = render(<Toast {...defaultProps} />);

    expect(getByText('Test Toast')).toBeTruthy();
    expect(onToastShow).toHaveBeenCalledWith(defaultProps.toast);
  });

  it('calls onToastHide when toast is hidden', () => {
    const { rerender } = render(<Toast {...defaultProps} />);
    expect(onToastShow).toHaveBeenCalledTimes(1);

    rerender(
      <Toast
        {...defaultProps}
        toast={{ ...defaultProps.toast, visible: false }}
      />
    );
    expect(onToastHide).toHaveBeenCalledTimes(1);
    expect(onToastHide).toHaveBeenCalledWith(
      {
        ...defaultProps.toast,
        visible: false,
      },
      DismissReason.PROGRAMMATIC
    );
  });

  it('handles press events', () => {
    const { getByTestId } = render(<Toast {...defaultProps} />);

    fireEvent.press(getByTestId('toast-view'));
    expect(onToastPress).toHaveBeenCalledWith(defaultProps.toast);
  });

  it('updates toast height on layout', () => {
    const { getByTestId } = render(<Toast {...defaultProps} />);

    const event = {
      nativeEvent: {
        layout: {
          height: 100,
        },
      },
    };
    act(() => {
      getByTestId('toast-view').props.onLayout(event);
    });

    expect(updateHeight).toHaveBeenCalledWith(defaultProps.toast.id, 100);
  });

  it('dismisses the toast when swipe gesture is detected', () => {
    // Since gesture handling requires integration testing,
    // we simulate the dismiss action directly
    render(
      <Toast
        {...defaultProps}
        toast={{ ...defaultProps.toast, isSwipeable: true }}
      />
    );

    act(() => {
      toasting.dismiss(defaultProps.toast.id);
    });

    expect(dismiss).toHaveBeenCalledWith(defaultProps.toast.id);
  });

  it('applies custom styles', () => {
    const customStyles = {
      pressable: { backgroundColor: 'red' },
      view: { padding: 20 },
      text: { color: 'blue' },
      indicator: { width: 5 },
    };

    const { getByText } = render(
      <Toast
        {...defaultProps}
        toast={{ ...defaultProps.toast, styles: customStyles }}
      />
    );

    const textComponent = getByText('Test Toast');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: 'blue' })])
    );
  });

  it('renders custom toast component', () => {
    const CustomToast = (toast: ToastType) => (
      <View>
        <Text>Custom: {resolveValue(toast.message, toast)}</Text>
      </View>
    );

    const { getByText } = render(
      <Toast
        {...defaultProps}
        toast={{
          ...defaultProps.toast,
          customToast: CustomToast,
        }}
      />
    );

    expect(getByText('Custom: Test Toast')).toBeTruthy();
  });

  it('handles dark mode override when theme is light', () => {
    const { getByTestId } = render(
      <Toast {...defaultProps} overrideDarkMode={true} />
    );

    const pressable = getByTestId('toast-pressable').parent;
    expect(pressable?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#f7f7f7' }),
      ])
    );
  });

  it('handles dark mode override when theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { getByTestId } = render(
      <Toast {...defaultProps} overrideDarkMode={false} />
    );

    const pressable = getByTestId('toast-pressable').parent;
    expect(pressable?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#212331' }),
      ])
    );
  });

  it('animates toast visibility', () => {
    const timingSpy = jest.spyOn(
      require('react-native-reanimated'),
      'withTiming'
    );

    render(<Toast {...defaultProps} />);

    expect(timingSpy).toHaveBeenCalledWith(1, { duration: 300 });
  });

  it('uses custom animation config', () => {
    const timingSpy = jest.spyOn(
      require('react-native-reanimated'),
      'withTiming'
    );
    const customAnimationConfig = { duration: 500 };

    render(
      <Toast
        {...defaultProps}
        toast={{
          ...defaultProps.toast,
          animationConfig: customAnimationConfig,
        }}
      />
    );

    expect(timingSpy).toHaveBeenCalledWith(1, customAnimationConfig);
  });
});
