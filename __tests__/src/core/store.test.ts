import {
  ActionType,
  dispatch,
  reducer,
  useStore,
} from '../../../src/core/store';
import { act, renderHook } from '@testing-library/react-native';
import {
  DismissReason,
  ToastPosition,
  ToastType,
} from '../../../src/core/types';

describe('Toast Store', () => {
  const initialState = { toasts: [], pausedAt: undefined };

  const mockToast = {
    id: '1',
    type: 'success' as ToastType,
    message: 'Test toast',
    visible: true,
    createdAt: Date.now(),
    pauseDuration: 0,
    providerKey: 'DEFAULT',
  };

  beforeEach(() => {
    act(() => {
      dispatch({ type: ActionType.REMOVE_TOAST });
    });
  });

  describe('reducer', () => {
    it('handles ADD_TOAST action', () => {
      const state = reducer(initialState, {
        type: ActionType.ADD_TOAST,
        toast: mockToast,
      });

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0]).toEqual(mockToast);
    });

    it('handles UPDATE_TOAST action', () => {
      const stateWithToast = reducer(initialState, {
        type: ActionType.ADD_TOAST,
        toast: mockToast,
      });

      const updatedState = reducer(stateWithToast, {
        type: ActionType.UPDATE_TOAST,
        toast: { id: '1', message: 'Updated message' },
      });

      expect(updatedState.toasts[0]?.message).toBe('Updated message');
    });

    it('handles UPSERT_TOAST action', () => {
      const stateAfterInsert = reducer(initialState, {
        type: ActionType.UPSERT_TOAST,
        toast: mockToast,
      });
      expect(stateAfterInsert.toasts).toHaveLength(1);

      const updatedToast = { ...mockToast, message: 'Updated message' };
      const stateAfterUpdate = reducer(stateAfterInsert, {
        type: ActionType.UPSERT_TOAST,
        toast: updatedToast,
      });
      expect(stateAfterUpdate.toasts).toHaveLength(1);
      expect(stateAfterUpdate.toasts[0]?.message).toBe('Updated message');
    });

    it('handles DISMISS_TOAST action', () => {
      const stateWithToast = reducer(initialState, {
        type: ActionType.ADD_TOAST,
        toast: mockToast,
      });

      const updatedState = reducer(stateWithToast, {
        type: ActionType.DISMISS_TOAST,
        toastId: '1',
        reason: DismissReason.TIMEOUT,
      });

      expect(updatedState.toasts[0]?.visible).toBe(false);
    });

    it('handles START_PAUSE and END_PAUSE actions', () => {
      const time = Date.now();
      const stateWithPause = reducer(initialState, {
        type: ActionType.START_PAUSE,
        time,
      });

      expect(stateWithPause.pausedAt).toBe(time);

      const stateAfterPause = reducer(stateWithPause, {
        type: ActionType.END_PAUSE,
        time: time + 1000,
      });

      expect(stateAfterPause.pausedAt).toBeUndefined();
    });
  });

  describe('useStore', () => {
    it('returns the current state', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.toasts).toEqual([]);
    });

    it('filters toasts by provider key', () => {
      const { result } = renderHook(() => useStore({ providerKey: 'CUSTOM' }));

      act(() => {
        dispatch({
          type: ActionType.ADD_TOAST,
          toast: { ...mockToast, providerKey: 'CUSTOM' },
        });
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('merges toast options correctly', () => {
      const toastOptions = {
        duration: 5000,
        position: ToastPosition.TOP,
      };

      const { result } = renderHook(() => useStore(toastOptions));

      act(() => {
        dispatch({
          type: ActionType.ADD_TOAST,
          toast: mockToast,
        });
      });

      expect(result.current.toasts[0]).toHaveProperty('duration', 5000);
      expect(result.current.toasts[0]).toHaveProperty(
        'position',
        ToastPosition.TOP
      );
    });
  });
});
