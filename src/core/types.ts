import type { TextStyle, ViewStyle } from 'react-native';
import { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'loading' | 'blank';
export enum ToastPosition {
  TOP = 1,
  BOTTOM = 2,
  TOP_LEFT = 3,
  TOP_RIGHT = 4,
  BOTTOM_LEFT = 5,
  BOTTOM_RIGHT = 6,
}

export type Element = JSX.Element | string | null;

export enum DismissReason {
  TIMEOUT = 'timeout',
  SWIPE = 'swipe',
  PROGRAMMATIC = 'programmatic',
  TAP = 'tap',
}

export interface IconTheme {
  primary: string;
  secondary: string;
}
export type ToastAnimationType = 'spring' | 'timing' | 'fade';

export type ToastAnimationConfig =
  | (WithSpringConfig & WithTimingConfig) & {
      duration?: number;
      flingPositionReturnDuration?: number;
    };

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> =
  | TValue
  | ValueFunction<TValue, TArg>;

const isFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> =>
  typeof valOrFunction === 'function';

export const resolveValue = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>,
  arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

export interface Toast {
  type: ToastType;
  id: string;
  message: ValueOrFunction<Element, Toast>;
  accessabilityMessage?: string;
  icon?: Element;
  duration?: number;
  pauseDuration: number;
  position?: ToastPosition;
  disableShadow?: boolean;
  createdAt: number;
  visible: boolean;
  height?: number;
  width?: number;
  maxWidth?: number;
  onPress?: (toast: Toast) => void;
  onHide?: (toast: Toast, reason: DismissReason) => void;
  onShow?: (toast: Toast) => void;
  dismissReason?: DismissReason;
  styles?: {
    pressable?: ViewStyle;
    view?: ViewStyle;
    text?: TextStyle;
    indicator?: ViewStyle;
  };
  customToast?: (toast: Toast) => JSX.Element;
  providerKey: string;
  isSwipeable?: boolean;
  animationType?: ToastAnimationType;
  animationConfig?: ToastAnimationConfig;
}

export type ToastOptions = Partial<
  Pick<
    Toast,
    | 'id'
    | 'icon'
    | 'accessabilityMessage'
    | 'duration'
    | 'position'
    | 'styles'
    | 'height'
    | 'width'
    | 'customToast'
    | 'disableShadow'
    | 'providerKey'
    | 'isSwipeable'
    | 'animationConfig'
    | 'animationType'
    | 'maxWidth'
    | 'onPress'
    | 'onHide'
    | 'onShow'
  >
>;

export type DefaultToastOptions = ToastOptions & {
  [key in ToastType]?: ToastOptions;
};

export interface ToasterProps {
  position?: ToastPosition;
  toastOptions?: DefaultToastOptions;
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  children?: (toast: Toast) => JSX.Element;
}

export type ExtraInsets = {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};
