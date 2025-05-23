---
id: toast
title: Toast
hide_title: true
sidebar_label: toast()
slug: /api/toast
---

# `toast()` API

Call it to create a toast from anywhere, even outside React components, such as in your state management tools.

**Make sure you add the `<Toasts/>` component to your app first.**


### Basic Usage

```js
import { toast } from '@backpackapp-io/react-native-toast';

// ...

toast('Hello World');

// ...

toast('Hello World', {
  duration: 4000,
  position: ToastPosition.TOP,
  icon: '👏',
  animationType: 'timing',
  animationConfig: {
    duration: 500,
    flingPositionReturnDuration: 200,
    easing: Easing.elastic(1),
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
import { resolveValue } from "@backpackapp-io/react-native-toast";

toast("", {
  customToast: (toast) => (
    <View>
      <Text>{resolveValue(toast.message, toast)}</Text>
    </View>
   )
})
```
Creates a custom notification with JSX. Have complete control over your toast.

#### Full example
```js
import { resolveValue } from "@backpackapp-io/react-native-toast";

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
        <Text>{resolveValue(toast.message, toast)}</Text>
      </View>
    );
  },
});
```


### onPress
You can add a function to be called when the toast is pressed. This is useful for performing an action.

```js
toast('Hello World', {
  onPress: () => {
    console.log('Toast pressed!');
  },
});
```

### Toast Handlers and Dismiss Reasons

You can add individual handlers to each toast for greater control over behavior and responses.

```js
import { DismissReason } from "@backpackapp-io/react-native-toast";

const id = toast('Hello World', {
  // Handler for when toast is pressed
  onPress: (toast) => {
    console.log('Toast pressed!', toast.id);
    // Access component-specific methods or state here
    navigation.navigate('Details', { id: toast.id });
  },

  // Handler for when toast appears
  onShow: (toast) => {
    console.log('Toast shown!', toast.id);
    analytics.logEvent('toast_shown', { id: toast.id });
  },

  // Handler for when toast is dismissed with reason
  onHide: (toast, reason) => {
    console.log(`Toast ${toast.id} dismissed because: ${reason}`);

    // Handle different dismiss reasons
    switch(reason) {
      case DismissReason.TIMEOUT:
        console.log('Toast timed out');
        break;
      case DismissReason.SWIPE:
        console.log('User swiped toast away');
        break;
      case DismissReason.PROGRAMMATIC:
        console.log('Toast was programmatically dismissed');
        break;
      case DismissReason.TAP:
        console.log('User tapped to dismiss toast');
        break;
    }
  }
});
```

#### Dismiss Reasons

When a toast is dismissed, you can now determine why it was dismissed:

| Reason | Description |
|--------|-------------|
| `DismissReason.TIMEOUT` | The toast was dismissed because its duration elapsed |
| `DismissReason.SWIPE` | The toast was dismissed because the user swiped it away |
| `DismissReason.PROGRAMMATIC` | The toast was dismissed programmatically via `toast.dismiss()` |
| `DismissReason.TAP` | The toast was dismissed because the user tapped it |

#### Individual vs Global Handlers

You can use both individual handlers (attached to each toast) and global handlers (provided to the `<Toasts/>` component):

```js
// Individual handler (specific to this toast)
toast('Hello', {
  onPress: (toast) => {
    // This runs only for this specific toast
    console.log('This specific toast was pressed');
  }
});

// In your app component
<Toasts
  onToastPress={(toast) => {
    // This runs for ALL toasts
    console.log('A toast was pressed:', toast.id);
  }}
/>
```

When both are provided, both handlers will be executed when the event occurs.

#### Usage with Component-Specific Logic

Individual handlers are especially useful when you need to access component-specific state, hooks, or navigation:

```js
const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const { orderId } = useRoute().params;
  const { mutate: cancelOrder } = useCancelOrderMutation();

  const showUndoToast = () => {
    toast('Order placed!', {
      onPress: () => {
        // Access component-specific state and functions
        cancelOrder(orderId);
        navigation.navigate('OrderCanceled');
      },
      duration: 5000,
    });
  };

  return (
    <View>
      <Button title="Place Order" onPress={showUndoToast} />
    </View>
  );
};
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



## Default durations

Every type has its own duration. You can overwrite them by using the `duration` field within the toast options.

| type      | duration |
|-----------|----------|
| `blank`   | 4000     |
| `error`   | 4000     |
| `success` | 2000     |
| `custom`  | 4000     |
| `loading` | Infinity |


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

## Animation Options
Control the animation type and configuration for toasts.
*Note: it is important to still supply the duration when configuring the animation. The duration in `animatonConfig` controls the duration of the opacity animation, not the total duration of the toast.*

```js
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


## Adjust toast width to hug text
To have the toast adjust its width based on the content of the text, you can apply the following styles.

```js
AutoWidthStyles = {
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

## All toast() Options

| Name                   | Type         | Default   | Description                                                                                                 |
|------------------------|--------------|-----------|-------------------------------------------------------------------------------------------------------------|
| `duration`             | number       | 3000      | Duration in milliseconds. Set to `Infinity` to keep the toast open until dismissed manually.                |
| `position`             | enum         | 1         | Position of the toast. Can be `ToastPosition.{TOP, BOTTOM, TOP_LEFT, BOTTOM_LEFT, TOP_RIGHT, BOTTOM_RIGHT}` |
| `id`                   | string       |           | Unique id for the toast.                                                                                    |
| `icon`                 | Element      |           | Icon to display on the left of the toast.                                                                   |
| `animationType`        | string       | 'timing'  | Animation type. Can be 'timing' or 'spring'.                                                                |
| `animationConfig`      | object       |           | Animation configuration.                                                                                    |
| `customToast`          | function     |           | Custom toast component.                                                                                     |
| `width`                | number       |           | Width of the toast.                                                                                         |
| `height`               | number       |           | Height of the toast.                                                                                        |
| `disableShadow`        | boolean      | false     | Disable shadow on the toast.                                                                                |
| `isSwipeable`          | boolean      | true      | Disable/Enable swipe to dismiss the toast.                                                                  |
| `providerKey`          | string       | 'DEFAULT' | Provider key for the toast.                                                                                 |
| `accessibilityMessage` | string       |           | Accessibility message for screen readers.                                                                   |
| `styles`               | object       |           | Styles for the toast.                                                                                       |
| `onShow` | function     | | Function called when this specific toast is shown |
| `onHide` | function     | | Function called when this specific toast is hidden, with dismiss reason |
| `onPress` | function     | | Function called when this specific toast is pressed |


