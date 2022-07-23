# React Native Toast
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) [![GitHub license](https://img.shields.io/github/license/backpackapp-io/react-native-toast)](https://github.com/backpackapp-io/react-native-toast/blob/master/LICENSE) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast)

A toasting library for react-native, built on [react-hot-toast](https://react-hot-toast.com/docs). Supports features such as multiple toasts, keyboard handling, swipe to dismiss, positional toasts, and JS promises.

![video](./Github.mp4)

### Why?
I found the lack of support for some features in a toast library to be quite painful. I was better off developing my own package that I could customize for my app [Backpack](https://backpackapp.io). I decided to open source this library because I felt it worked very well and met *all of my needs*.

# Features
- **Multiple toasts, multiple options**. Want a toast on the top, bottom, different colors, or different types at the same time? Got it.
- **Keyboard handling** (both iOS and Android). Move those toasts out of the way and into view when the user opens the keyboard
- **Swipe to dismiss**
- **Positional toasts** (top & bottom)
- **Customizable** (custom styles, dimensions, duration, and even create your own component to be used in the toast)
- Add support for **promises** <-- Really! Call `toast.promise(my_promise)` and watch react-native-toast work its magic, automatically updating the toast with a custom message on success -- or an error message on reject.

# Getting Started

## Installation
```sh
yarn add @backpackapp-io/react-native-toast
# or
npm i @backpackapp-io/react-native-toast
```
#### Peer Dependencies
Install and link [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/), [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context), and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

```sh
yarn add react-native-reanimated react-native-safe-area-context react-native-gesture
```
*Ensure you follow the installation of each package*


*Using expo?*
```sh
expo install react-native-reanimated react-native-safe-area-context react-native-gesture
```
<br />

### Cool, now what?
Add the ``<Toasts />`` component into the root of your app. Whenever you are ready, call `toast("My Toast Message")` from *anywhere* in your app.

```js
import { StyleSheet, Text } from "react-native";
import {
  toast, Toasts,
} from "@backpackapp-io/react-native-toast";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
	toast("Hello");
  }, []);

 return (
  <View style={styles.container}>
	<View>
	  {/*The rest of your app*/}
	</View>
	<Toasts /> {/* <---- Add Here */}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
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
    position: ToastPositions.Bottom
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

## `toast()` API

Call it to create a toast from anywhere, even outside React (*hello* errors from controllers). Make sure you add the `<Toasts/>`component to your app first.

## Available toast options

You can provide `ToastOptions` as the second argument. *All arguments are optional*.

```js
toast('Hello World', {
  duration: 4000,
  position: ToastPositions.TOP,
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

Every type has its own duration. You can overwrite them `duration` with the toast options. This can be done per toast options or globally by the [`<Toaster/>`](/docs/toaster).

| type      | duration |
| --------- | -------- |
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
| Option Name | Type |Possible Values |
|-----|-----|-----|
| *id* | `string` | Given an id, update the toast with the following options |
| *icon* | `JSX.Element, string` | Render an icon to the left of the message |
| *message* | `string` | The message to render in the toast |
| *duration* | `number` | the duration (in ms) to show the toast for |
| *position* | `ToastPositions.TOP, ToastPositions.BOTTOM, number` | The position of the toast. Use the ToastPositions enum to effectively set it |
| *styles* | `object` | the styles to apply to the toast |
| *height* | `number` | the height of the toast **Must set here even if you are using a custom toast or applying it in the styles.view/pressable to ensure calculations are acurrate** |
| *width* | `number` | the width of the toast |
| *customToast* | `function` | override the toast body and apply a custom toast. Receives the toast as a parameter I.e. `(toast: Toast) => JSX.Element` |


**Styles object**
```js{
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
