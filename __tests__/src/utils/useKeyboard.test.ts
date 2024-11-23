import { renderHook, act } from '@testing-library/react-native';
import { EmitterSubscription, Keyboard } from 'react-native';
import { useKeyboard } from '../../../src/utils';

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    Keyboard: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
    },
  };
});

describe('useKeyboard Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with keyboard hidden', () => {
    const { result } = renderHook(() => useKeyboard());
    expect(result.current.keyboardShown).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('updates when keyboard is shown', () => {
    const keyboardDidShowMock = jest.fn();

    (Keyboard.addListener as jest.Mock).mockImplementation(
      (eventType, callback) => {
        if (eventType === 'keyboardDidShow') {
          keyboardDidShowMock.mockImplementation(callback);
        }
        return {
          remove: jest.fn(),
        } as unknown as EmitterSubscription;
      }
    );

    const { result } = renderHook(() => useKeyboard());

    act(() => {
      keyboardDidShowMock({
        endCoordinates: { height: 100, screenX: 0, screenY: 0, width: 0 },
      });
    });

    expect(result.current.keyboardShown).toBe(true);
    expect(result.current.keyboardHeight).toBe(100);
  });

  it('updates when keyboard is hidden', () => {
    const keyboardDidHideMock = jest.fn();

    (Keyboard.addListener as jest.Mock).mockImplementation(
      (eventType, callback) => {
        if (eventType === 'keyboardDidHide') {
          keyboardDidHideMock.mockImplementation(callback);
        }
        return {
          remove: jest.fn(),
        } as unknown as EmitterSubscription;
      }
    );

    const { result } = renderHook(() => useKeyboard());

    act(() => {
      keyboardDidHideMock();
    });

    expect(result.current.keyboardShown).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });
});
