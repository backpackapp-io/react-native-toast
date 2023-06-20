import type { TextStyle, ViewStyle } from 'react-native';

export type ToastType = 'success' | 'error' | 'loading' | 'blank';
export enum ToastPosition {
  TOP = 1,
  BOTTOM = 2,
}

export type Element = JSX.Element | string | null;

export interface IconTheme {
  primary: string;
  secondary: string;
}

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
  icon?: Element;
  duration?: number;
  pauseDuration: number;
  position?: ToastPosition;
  disableShadow?: boolean;
  createdAt: number;
  visible: boolean;
  height?: number;
  width?: number;
  styles?: {
    pressable?: ViewStyle;
    view?: ViewStyle;
    text?: TextStyle;
    indicator?: ViewStyle;
  };
  customToast?: (toast: Toast) => JSX.Element;
  providerKey: string;
}

export type ToastOptions = Partial<
  Pick<
    Toast,
    | 'id'
    | 'icon'
    | 'duration'
    | 'position'
    | 'styles'
    | 'height'
    | 'width'
    | 'customToast'
    | 'disableShadow'
    | 'providerKey'
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
