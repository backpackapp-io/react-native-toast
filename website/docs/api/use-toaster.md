---
id: use-toaster
title: useToaster()
sidebar_label: useToaster()
slug: /api/use-toaster
---


The `useToaster` hook provides a way to handle the state of toasts within your React components. It manages toast lifecycle events, rendering, and animations. This hook integrates seamlessly with the ```<Toasts />``` component and the ```toast()``` API.

## **Importing**

```tsx
import { useToaster } from '@backpackapp-io/react-native-toast';
```

## Usage

The useToaster hook is typically used internally by the ```<Toasts />``` component but can also be leveraged for advanced customization.

```js
const { toasts, handlers } = useToaster();
```

## Return Value

The useToaster hook returns an object with the following properties:

1. toasts

- Type: Toast[]
- Description: An array of active toasts currently managed by the hook.
 ```js
const { toasts } = useToaster();
console.log(toasts); // [{ id: '1', message: 'Toast 1', ... }]
```
2. handlers

- Type: ToastHandlers
- Description: An object containing methods to interact with the toasts.
```
handlers: {
  endPause: () => void,
  updateHeight: (toastId: string, height: number) => void,
  startPause: () => void,
  calculateOffset: (toast: Toast, opts?: {reverseOrder?: boolean, gutter?: number, defaultPosition?: ToastPosition}) => number}
}
```

## Advanced Usage

You can combine useToaster with custom components for advanced use cases:

```js
import React from 'react';
import { useToaster } from '@backpackapp-io/react-native-toast';

export const CustomToaster = () => {
  const { toasts } = useToaster();

  useEffect(() => {
    toasts.forEach((toast) => {
      if(toast.id === 'ERROR') {
        console.error(toast.message);
      }
    });
  }, [toasts]);
};
```

## Integration with ```<Toasts />```

useToaster is used internally by the ```<Toasts />``` component to render toasts. You can still use this hook if you want to create a custom implementation of ```<Toasts />```.

