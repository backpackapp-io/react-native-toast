---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

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


After wrapping your app with `GestureHandlerRootView` and `SafeAreaProvider`, and rendering `Toasts` in your root view, you can call `toast("My Toast Message")` from anywhere in your app.

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

