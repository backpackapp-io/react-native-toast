---
id: usage
title: Usage
hide_title: true
sidebar_label: Usage
slug: /usage
---

## Usage

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

