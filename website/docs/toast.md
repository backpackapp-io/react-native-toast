---
id: toast
title: Toast
hide_title: true
sidebar_label: Toast()
slug: /toast
---

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
  animationType: 'timing' | 'spring',
  animationConfig: {
    flingPositionReturnDuration: number,
    ...(springConfig | timingConfig)
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

## Prevent Swipe to Dismiss

```js
toast('This toast cannot be swiped away', {
  duration: 4000,
  position: ToastPosition.TOP,
  isSwipeable: false, // <-- Add here (defaults to true)
})
```

<br />

## Disable Shadow

You can disable the shadow of the toast by setting `disableShadow` to `true`.

```js
toast('This toast has no shadow', {
  duration: 4000,
  position: ToastPosition.TOP,
  disableShadow: true, // <-- Add here (defaults to false)
})

```

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

## Animation Options
You can now control the animation type and configuration for toasts.

### Props

- **animationType** (`'spring' | 'timing'`, optional): Choose the animation type for toast appearance. By default, toasts positioned at the bottom use spring, and those at the top use timing.
- **animationConfig** (object, optional): Customize the animation configuration for spring or timing.

### Example Usage

```javascript
import { toast } from 'react-native-toast';

// Show a toast with custom animation settings
toast.show('This is a toast message', {
  animationType: 'spring',
  animationConfig: {
    duration: 500,
    stiffness: 100,
  },
  position: 'top',
});
````

### Global Animation Configuration/Type

You can define a `globalAnimationType` and a `globalAnimationConfig` that sets the default animation configuration for all toasts. If an individual toast specifies its own `animationConfig`, it will override this global setting.

#### Props

- **globalAnimationConfig** (object, optional): Provides a default configuration for toast animations using either spring or timing options.

#### Example Usage

```javascript
import { Toasts } from 'react-native-toast';

// In your component
<Toasts
  globalAnimationType="spring"
  globalAnimationConfig={{
    duration: 500,
    stiffness: 120,
  }}
/>

// Or when showing a toast
toast.show('This is a toast message', {
  position: 'bottom',
  animationType: 'spring',
  animationConfig: {
    duration: 400,
    damping: 10,
  },
});
```


## Dismiss toast programmatically

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


## Update an existing toast

Each toast call returns a unique id. Use in the toast options to update the existing toast.

```js
const toastId = toast.loading('Loading...');

// ...

toast.success('This worked', {
  id: toastId,
});
```

<br />

## Prevent duplicate toasts

To prevent duplicates of the same kind, you can provide a unique permanent id.

```js
toast.success('Copied to clipboard!', {
  id: 'clipboard',
});
```

## Adjust toast width to hug text
To have the toast adjust its width based on the content of the text, you can apply the following styles.

```
styles: {
  pressable: {
    maxWidth: width - 32,
    alignSelf: 'center',
    left: null,
    paddingHorizontal: 16
  },
  view: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: width - 32,
    paddingHorizontal: 0,
    width: undefined
  },
  text: {
    flex: undefined,
    flexGrow: 1,
    flexShrink: 1,
    flexWrap: 'wrap'
  }
}
```

These styles can be applied to the defaultStyle prop in the `<Toasts />` component or to each toast instance individually. If you use these styles frequently, I recommend creating an object that you can add directly to each toast call, e.g.,

```js
toast('my toast', {
  styles: AutoWidthStyles
});
```
where `AutoWidthStyles` holds the actual styles for auto width.


<br />
