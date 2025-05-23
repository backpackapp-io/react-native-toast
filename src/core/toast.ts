import {
  DefaultToastOptions,
  DismissReason,
  Element,
  resolveValue,
  Toast,
  ToastOptions,
  ToastPosition,
  ToastType,
  ValueOrFunction,
} from './types';
import { genId } from './utils';
import { announceForAccessibility } from '../utils';
import { ActionType, dispatch } from './store';

type Message = ValueOrFunction<Element, Toast>;

type ToastHandler = (message: Message, options?: ToastOptions) => string;

const createToast = (
  message: Message,
  type: ToastType = 'blank',
  opts?: ToastOptions
): Toast => ({
  createdAt: Date.now(),
  visible: true,
  type,
  message,
  pauseDuration: 0,
  position: ToastPosition.TOP,
  providerKey: 'DEFAULT',
  isSwipeable: true,
  animationType: opts?.animationType,
  animationConfig: opts?.animationConfig,
  ...opts,
  id: opts?.id || genId(),
});

const createHandler =
  (type?: ToastType): ToastHandler =>
  (message, options) => {
    const toast = createToast(message, type, options);
    dispatch({ type: ActionType.UPSERT_TOAST, toast });

    if (toast.accessabilityMessage) {
      announceForAccessibility(toast.accessabilityMessage);
    }

    return toast.id;
  };

const toast = (message: Message, opts?: ToastOptions) =>
  createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');

toast.dismiss = (
  toastId?: string,
  reason: DismissReason = DismissReason.PROGRAMMATIC
) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId,
    reason,
  });
};

toast.remove = (toastId?: string) =>
  dispatch({ type: ActionType.REMOVE_TOAST, toastId });

toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Element;
    success: ValueOrFunction<Element, T>;
    error: ValueOrFunction<Element, any>;
  },
  opts?: DefaultToastOptions
) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      });
      return p;
    })
    .catch((e) => {
      toast.error(resolveValue(msgs.error, e), {
        id,
        ...opts,
        ...opts?.error,
      });
    });

  return promise;
};

export { toast };
