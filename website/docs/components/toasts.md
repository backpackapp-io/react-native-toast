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
`'timing' | 'spring'`

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

### globalLimit
`number | undefined`

Set the global limit for the number of toasts that can be shown at once. When this limit is reached, the oldest toast will be removed to make room for the new one.



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
<Toasts
  onToastPress={(t) => {
    console.log(`Toast ${t.id} was pressed.`)
  }}
  overrideDarkMode={isAppDarkMode}
  globalAnimationType="spring"
  globalAnimationConfig={{duration: 500, flingPositionReturnDuration: 200, stiffness: 50, damping: 10}}
/>
```
