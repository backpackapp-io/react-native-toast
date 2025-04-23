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
- **Positional toasts** (top, bottom, top-left, top-right, bottom-left, bottom-right)
- **Customizable** (custom styles, dimensions, duration, and even create your own component to be used in the toast)
- Add support for **promises** <-- Really! Call `toast.promise(my_promise)` and watch react-native-toast work its magic, automatically updating the toast with a custom message on success -- or an error message on reject.
- Runs on **web**
- Support for native modals
- Callbacks for onPress, onShow, and onHide

# Documentation
View the full documentation [here](https://nickdebaise.github.io/packages/react-native-toast/)

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
