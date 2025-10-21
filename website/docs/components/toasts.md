---
id: toasts
title: <Toasts />
hide_title: true
sidebar_label: <Toasts />
slug: /components/toasts
---

# `<Toasts />`

Include the `<Toasts />` component in the root of your app.

## Props

### globalAnimationType
`'timing' | 'spring' | 'fade'`

Set the global animation type for all toasts. This can be overridden by the toast options.
```js
<Toasts globalAnimationType="spring" />
```

### globalAnimationConfig
`object`

Set the global animation config for all toasts. This can be overridden by the toast options.
```js
<Toasts globalAnimationConfig={{duration: 500, flingPositionReturnDuration: 200, easing: Easing.elastic(1)}} />
```

### defaultPosition
`ToastPosition | undefined`

Set the default position for all toasts rendered in this component. Individual toasts can override this by specifying their own position. If not specified, toasts will use their individual position settings or fall back to the library default.

Available positions: `ToastPosition.TOP`, `ToastPosition.BOTTOM`, `ToastPosition.TOP_LEFT`, `ToastPosition.TOP_RIGHT`, `ToastPosition.BOTTOM_LEFT`, `ToastPosition.BOTTOM_RIGHT`

```js
import { ToastPosition } from '@backpackapp-io/react-native-toast';

<Toasts defaultPosition={ToastPosition.BOTTOM} />
```

Now all toasts will appear at the bottom by default, unless they specify their own position:
```js
// This toast will appear at BOTTOM (using default)
toast("Hello!");

// This toast will appear at TOP (overriding default)
toast("World!", { position: ToastPosition.TOP });
```

### defaultDuration
`number | undefined`

Set the default duration (in milliseconds) for all toasts rendered in this component. Individual toasts can override this by specifying their own duration.

```js
<Toasts defaultDuration={5000} />
```

Now all toasts will display for 5 seconds by default:
```js
// This toast will display for 5000ms (using default)
toast("Hello!");

// This toast will display for 2000ms (overriding default)
toast("Quick message", { duration: 2000 });
```

### overrideDarkMode
`boolean | undefined`

Override the system dark mode. If a value is supplied (I.e. `true` or `false`), then the toast components will use that value for the dark mode. For example, if `overrideDarkMode = {false}`, dark mode will be disabled, regardless of the system's preferences.

### extraInsets
`object`

Supply the container for the toasts with extra padding.
```
extraInsets?: {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};
```

### onToastShow
`function`

When a toast is shown, this callback will fire, returning the toast object that was shown. _Note, the toast object is "shown" when the toast is mounted._
```
onToastShow?: (toast: T) => void;
```
### onToastHide
`function`

When a toast is hidden, this callback will fire, returning the toast object that was hidden. _Note, the toast object is "hidden" when the toast is unmounted._
```
onToastHide?: (toast: T) => void;
```
### onToastPress
`function`

When a toast is pressed, this callback will fire, returning the toast object that was pressed.
```
onToastPress?: (toast: T) => void;
```

### preventScreenReaderFromHiding
`boolean`

Prevent screen readers from hiding the toast component. This is useful if you want to override the default behavior of screen readers hiding the toast component.

```js
<Toasts preventScreenReaderFromHiding={true} />
```

### defaultStyle
(`object`)

Supply default styles for the toast component. This will be applied to all toasts unless overridden by the toast options.
```
defaultStyle?: {
  view?: ViewStyle;
  pressable?: ViewStyle;
  text?: TextStyle;
  indicator?: ViewStyle;
};
```

### providerKey
`string`

Provide the Toasts component with a providerKey to conditionally render toasts in a component. Useful for rendering toasts in native modals.
```js
// Component in native modal
<Toasts providerKey="MODAL::1" />

//...
// Root component
<Toasts /> //has default providerKey of DEFAULT

//...
// Call toast in root modal

const id = toast("Hello from root modal") //default providerKey of DEFAULT

// Native modal becomes visible
const id = toast("Hello from native modal", {providerKey: "MODAL::1"})
//Now, toast is shown only in native modal
```

If you want to persist toasts across components (i.e. when you open/close a modal and want to keep the same toasts), your toasts should be assigned a providerKey of "PERSISTS".

```js
toast("Message...", {providerKey: "PERSISTS"})
```

Or, if you cannot do so, you can update each toast manually.

```js
const { toasts } = useToasterStore(); //Note, no provider key passed in

useEffect(() => {
  toasts.forEach((t) => {
    toast(t.message, {
      ...t,
      providerKey: isModalVisible ? 'MODAL::1' : 'DEFAULT', //Switch provider key here
    });
  });
}, [isModalVisible]);
```

### fixAndroidInsets
`boolean` *Defaults to true*

Fix for Android bottom inset bug: https://github.com/facebook/react-native/issues/47080




## Example
```js
import { Toasts, ToastPosition } from '@backpackapp-io/react-native-toast';

<Toasts
  onToastPress={(t) => {
    console.log(`Toast ${t.id} was pressed.`)
  }}
  overrideDarkMode={isAppDarkMode}
  globalAnimationType="fade"
  globalAnimationConfig={{duration: 500}}
  defaultPosition={ToastPosition.BOTTOM}
  defaultDuration={4000}
/>
```
