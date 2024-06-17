# React Native Toast
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) [![GitHub license](https://img.shields.io/github/license/backpackapp-io/react-native-toast)](https://github.com/backpackapp-io/react-native-toast/blob/master/LICENSE) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast)

A toast library for react-native, built on [react-hot-toast](https://react-hot-toast.com/docs). It supports features such as multiple toasts, keyboard handling, swipe to dismiss, positional toasts, and JS promises. It runs on iOS, android, and web.

<br />

[video](https://user-images.githubusercontent.com/27066041/180588807-1ca73f29-56d7-4e44-ac0c-9f2e2cdeb94c.mp4)

<br />

### Why?
I know what you might be thinking (*jeez, another toast library?*). Trust me here, this is the last toast library you will need. I built this library to meet my specific app needs and decided to open-source it after realizing that it truly is a top-notch toast library. Just give it a try.

# Features
- **Multiple toasts, multiple options**. Want a toast on the top, bottom, different colors, or different types at the same time? Got it.
- **Keyboard handling** (both iOS and Android). Move those toasts out of the way and into view when the user opens the keyboard
- **Swipe to dismiss**
- **Positional toasts** (top & bottom)
- **Customizable** (custom styles, dimensions, duration, and even create your own component to be used in the toast)
- Add support for **promises** <-- Really! Call `toast.promise(my_promise)` and watch react-native-toast work its magic, automatically updating the toast with a custom message on success -- or an error message on reject.
- Runs on **web**
- Support for native modals
- Callbacks for onPress, onShow, and onHide

# Getting Started

## Installation
```sh
yarn add @backpackapp-io/react-native-toast
# or
npm i @backpackapp-io/react-native-toast
```
#### Peer Dependencies
Install and link [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/), [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context), and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

```sh
yarn add react-native-reanimated react-native-safe-area-context react-native-gesture-handler
```
*Ensure you follow the installation of each package*


*Using expo?*
```sh
npx expo install react-native-reanimated react-native-safe-area-context react-native-gesture-handler
```
<br />

### Cool, now what?
Wrap your App with ``<GestureHandlerRootView />`` and ``<SafeAreaProvider />`` & add the ``<Toasts />`` component to the root of your app.

Call ``toast("My Toast Message")`` whenever you are ready from *anywhere* in your app.

```js
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { toast, Toasts } from '@backpackapp-io/react-native-toast';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    toast('Hello');
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <View>{/*The rest of your app*/}</View>
        <Toasts /> {/* <---- Add Here */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

<br />

## Example

#### Regular Toast
```js
toast("This is my first toast", {
  duration: 3000,
});
```

#### Promise Toast
```js
const sleep = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve({
        username: 'Nick',
      });
    } else {
      reject('Username is undefined');
    }
  }, 2500);
});

toast.promise(
  sleep,
  {
    loading: 'Loading...',
    success: (data: any) => 'Welcome ' + data.username,
    error: (err) => err.toString(),
  },
  {
    position: ToastPosition.BOTTOM,
  }
);
```

#### Loading Toast
```js
const id = toast.loading('I am loading. Dismiss me whenever...');

setTimeout(() => {
  toast.dismiss(id);
}, 3000);
```

#### Success Toast
```js
toast.success('Success!', {
  width: 300
});
```
#### Error Toast
```js
toast.error('Wow. That Sucked!');
```

<br />


# Documentation

# `<Toasts />`

Include the `<Toasts />` component in the root of your app.

### Props

#### overrideDarkMode (`boolean | undefined`) _<font size = 2>(optional)</font>_
Override the system dark mode. If a value is supplied (I.e. `true` or `false`), then the toast components will use that value for the dark mode. For example, if `overrideDarkMode = {false}`, dark mode will be disabled, regardless of the system's preferences.

#### extraInsets (`object`) _<font size = 2>(optional)</font>_
Supply the container for the toasts extra padding.
```
extraInsets?: {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};
```

#### onToastShow (`function`) _<font size = 2>(optional)</font>_
When a toast is shown, this callback will fire, returning the toast object that was shown. _Note, the toast object is "shown" when the toast is mounted._
```
onToastShow?: (toast: T) => void;
```
#### onToastHide (`function`) _<font size = 2>(optional)</font>_
When a toast is hidden, this callback will fire, returning the toast object that was hidden. _Note, the toast object is "hidden" when the toast is unmounted._
```
onToastHide?: (toast: T) => void;
```
#### onToastPress (`function`) _<font size = 2>(optional)</font>_
When a toast is pressed, this callback will fire, returning the toast object that was pressed.
```
onToastPress?: (toast: T) => void;
```

#### providerKey (`string`)  _<font size = 2>(optional)</font>_
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



### Example
```
<Toasts
  onToastPress={(t) => {
    console.log(`Toast ${t.id} was pressed.`)
  }}
  overrideDarkMode={isAppDarkMode}
/>
```

## `toast()` API

Call it to create a toast from anywhere, even outside React (*hello* errors from controllers). Make sure you add the `<Toasts/>`component to your app first.

## Available toast options

You can provide `ToastOptions` as the second argument. *All arguments are optional*.

```js
toast('Hello World', {
  duration: 4000,
  position: ToastPosition.TOP,
  icon: '👏',
  styles: {
    view: ViewStyle,
    pressable: ViewStyle,
    text: TextStyle,
    indicator: ViewStyle
  },
});
```

## Creating a toast

### Blank

```js
toast('Hello World');
```

The most basic variant.

### Success

```js
toast.success('Successfully created!');
```

Creates a notification with a success indicator on the left.

### Error

```js
toast.error('This is an error!');
```

Creates a notification with an error indicator on the left.

### Custom (JSX)

```js
toast("", {
  customToast: (toast) => (
    <View>
      <Text>{toast.message}</Text>
    </View>
   )
})
```
Creates a custom notification with JSX. Have complete control over your toast.

#### Full example
```js
toast(Math.floor(Math.random() * 1000).toString(), {
  width: screenWidth,
  disableShadow: true,
  customToast: (toast) => {
    return (
      <View
        style={{
          height: toast.height,
          width: toast.width,
          backgroundColor: 'yellow',
          borderRadius: 8,
        }}
      >
        <Text>{toast.message}</Text>
      </View>
    );
  },
});
```


### Loading

```js
const id = toast.loading('Waiting...');

//Somewhere later in your code...

toast.dismiss(id);
```

This will create a loading notification. Most likely, you want to update it afterwards. For a friendly alternative, check out `toast.promise()`, which takes care of that automatically.

### Promise

This shorthand is useful for mapping a promise to a toast. It will update automatically when the promise resolves or fails.

#### Simple Usage

```js
const myPromise = fetchData();

toast.promise(myPromise, {
  loading: 'Loading',
  success: 'Got the data',
  error: 'Error when fetching',
});
```

#### Advanced

You can provide a function to the success/error messages to incorporate the result/error of the promise. The third argument is `toastOptions`.

```js
toast.promise(
  myPromise,
  {
    loading: 'Loading',
    success: (data) => `Successfully saved ${data.name}`,
    error: (err) => `This just happened: ${err.toString()}`,
  },
  {
    duration: 2000
  }
);
```

<br />


## Default durations

Every type has its own duration. You can overwrite them `duration` with the toast options.

| type      | duration |
|-----------|----------|
| `blank`   | 4000     |
| `error`   | 4000     |
| `success` | 2000     |
| `custom`  | 4000     |
| `loading` | Infinity |

<br />


### Dismiss toast programmatically

You can manually dismiss a notification with `toast.dismiss`. Be aware that it triggers the exit animation and does not remove the Toast instantly. Toasts will auto-remove after 1 second by default.

#### Dismiss a single toast

```js
const toastId = toast('Loading...');

// ...

toast.dismiss(toastId);
```

You can dismiss all toasts at once, by leaving out the `toastId`.

#### Dismiss all toasts at once

```js
toast.dismiss();
```

To remove toasts instantly without any animations, use `toast.remove`.

#### Remove toasts instantly

```js
toast.remove(toastId);

// or

toast.remove();
```

<br />


### Update an existing toast

Each toast call returns a unique id. Use in the toast options to update the existing toast.

```js
const toastId = toast.loading('Loading...');

// ...

toast.success('This worked', {
  id: toastId,
});
```

<br />

### Prevent duplicate toasts

To prevent duplicates of the same kind, you can provide a unique permanent id.

```js
toast.success('Copied to clipboard!', {
  id: 'clipboard',
});
```

<br />

### ToastOptions *all optional*
| Option Name     | Type                                              | Possible Values                                                                                                                                                     |
|-----------------|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *id*            | `string`                                          | Given an id, update the toast with the following options                                                                                                            |
| *message*       | `string`                                          | The message to render in the toast                                                                                                                                  |
| *position*      | `ToastPosition.TOP, ToastPosition.BOTTOM, number` | The position of the toast. Use the ToastPosition enum to effectively set it                                                                                         |
| *duration*      | `number`                                          | the duration (in ms) to show the toast for                                                                                                                          |
| *customToast*   | `function`                                        | override the toast body and apply a custom toast. Receives the toast as a parameter I.e. `(toast: Toast) => JSX.Element`                                            |
| *height*        | `number`                                          | the height of the toast **Must set here even if you are using a custom toast or applying it in the styles.view/pressable to ensure calculations are accurate**      |
| *width*         | `number`                                          | the width of the toast                                                                                                                                              |
| *icon*          | `JSX.Element, string`                             | Render an icon to the left of the message                                                                                                                           |
| *styles*        | `object`                                          | the styles to apply to the toast                                                                                                                                    |
| *disableShadow* | `boolean`                                         | Disable the shadow underneath the toast                                                                                                                             |

**Styles object**
```
{
  pressable?: ViewStyle;
  view?: ViewStyle;
  text?: TextStyle;
  indicator?: ViewStyle;
};
```

<br />

### Thank you [react-hot-toast](https://react-hot-toast.com)

react-native-toast is built with modified react-hot-toast internals? Why? Well, react-native doesn't really need all the unnecessary web fluff (aria what?). So, I trimmed it down and made it *perfect* for mobile development by battle testing it on mobile devices and creating react-native components built specifically for iOS and Android development.

<br />

# Author
**[Nick DeBaise on LinkedIn](https://www.linkedin.com/in/nick-debaise/)**

*Email me directly*: nickdebaise@gmail.com

<br />

# Contributing
See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

# License
[MIT](./LICENSE)

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

### Todos

- Add support for multiline toasts
- Add unit tests for Components and hooks
- Allow theming in `<Toasts />`
- Queue manager
