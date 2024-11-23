import { renderHook, act } from '@testing-library/react-hooks';
import { AccessibilityInfo } from 'react-native';
import { useScreenReader, announceForAccessibility } from '../../../src/utils';
import { toast } from '../../../src';

describe('useScreenReader', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return false by default', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValueOnce(false);

    const { result } = renderHook(() => useScreenReader());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });

  it('should return true when screen reader is enabled', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValueOnce(true);

    const { result } = renderHook(() => useScreenReader());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });

  it('should return false if an error occurs while checking screen reader status', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockRejectedValueOnce(new Error('Error fetching status'));

    const { result } = renderHook(() => useScreenReader());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });
});

describe('announceForAccessibility', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should call announceForAccessibility with the provided message', () => {
    const mockMessage = 'Hello, this is a test announcement';
    const mockAnnounce = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => {});

    announceForAccessibility(mockMessage);

    expect(mockAnnounce).toHaveBeenCalledWith(mockMessage);
    expect(mockAnnounce).toHaveBeenCalledTimes(1);
  });

  it('when toast is called and screen reader is enabled, it should call announceForAccessibility', async () => {
    const mockMessage = 'Hello, this is a test announcement';
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValueOnce(true);
    const mockAnnounce = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useScreenReader());

    await act(async () => {
      await Promise.resolve();
    });

    toast(mockMessage);

    expect(result.current).toBe(true);
    expect(mockAnnounce).toHaveBeenCalledWith(mockMessage);
    expect(mockAnnounce).toHaveBeenCalledTimes(1);
  });
});
