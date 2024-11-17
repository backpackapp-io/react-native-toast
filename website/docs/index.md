---
id: index
title: React Native Toast
hide_title: true
sidebar_label: React Native Toast
description: A toast library for React Native, inspired by react-hot-toast. Features include multiple toasts, keyboard handling, swipe-to-dismiss, positional toasts, and support for JS promises. Works on iOS, Android, and web.
slug: /
---

<head>
  <title>React Native Toast</title>
</head>

# React Native Toast

[![Reanimated v3 version](https://img.shields.io/github/package-json/v/backpackapp-io/react-native-toast/master?label=Reanimated%20v3&style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast)
[![license](https://img.shields.io/npm/l/@backpackapp-io/react-native-toast?style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) <br /> ![NPM Downloads](https://img.shields.io/npm/dw/%40backpackapp-io%2Freact-native-toast?style=flat-square)

A toast library for React Native, inspired by [react-hot-toast](https://react-hot-toast.com/docs). Features include multiple toasts, keyboard handling, swipe-to-dismiss, positional toasts, and support for JS promises. Works on iOS, Android, and web.

![video](https://user-images.githubusercontent.com/27066041/180588807-1ca73f29-56d7-4e44-ac0c-9f2e2cdeb94c.mp4)


## Features
- **Multiple toasts, multiple options**. Want a toast on the top, bottom, different colors, or different types at the same time? Got it.
- **Keyboard handling** (both iOS and Android). Move those toasts out of the way and into view when the user opens the keyboard
- **Swipe to dismiss**
- **Positional toasts** (top & bottom)
- **Customizable** (custom styles, dimensions, duration, and even create your own component to be used in the toast)
- Add support for **promises** ==> Really! Call `toast.promise(my_promise)` and watch react-native-toast work its magic, automatically updating the toast with a custom message on success -- or an error message on reject.
- Runs on **web**
- Support for native modals
- Callbacks for onPress, onShow, and onHide
## Installation
```sh
yarn add @backpackapp-io/react-native-toast
```
*OR*
```sh
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

:::info
**React Native Gesture Handler v3** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation). Please **make sure** to wrap your App with `GestureHandlerRootView` when you've upgraded to React Native Gesture Handler ^3.

**React Native Reanimated v3** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).
:::

## Built With ❤️

- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
- [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)


### Thank you [react-hot-toast](https://react-hot-toast.com)

react-native-toast is built with modified react-hot-toast internals? Why? Well, react-native doesn't really need all the unnecessary web fluff (aria what?). So, I trimmed it down and made it *perfect* for mobile development by battle testing it on mobile devices and creating react-native components built specifically for iOS and Android development.


## Author
**[Nick DeBaise on LinkedIn](https://www.linkedin.com/in/nick-debaise/)**

*Email me directly*: nickdebaise@gmail.com


## Contributing
See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License
[MIT](./LICENSE)

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

## Todos

- Add unit tests for Components and hooks
- Allow theming in `<Toasts />`
- Queue manager
