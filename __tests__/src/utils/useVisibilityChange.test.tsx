import { renderHook } from '@testing-library/react-native';
import { useVisibilityChange } from '../../../src/utils';

describe('useVisibilityChange', () => {
  it('should call onShow when visible becomes true', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const { rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useVisibilityChange(onShow, onHide, visible),
      {
        initialProps: { visible: false },
      }
    );

    rerender({ visible: true });

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('should call onHide when visible becomes false', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const { rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useVisibilityChange(onShow, onHide, visible),
      {
        initialProps: { visible: true },
      }
    );

    rerender({ visible: false });

    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should not call callbacks unnecessarily', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const { rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useVisibilityChange(onShow, onHide, visible),
      {
        initialProps: { visible: true },
      }
    );

    rerender({ visible: true });

    expect(onShow).toHaveBeenCalled();
    expect(onHide).not.toHaveBeenCalled();
  });
});
