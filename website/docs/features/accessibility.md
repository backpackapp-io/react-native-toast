---
id: accessibility
title: Accessibility
sidebar_label: Accessibility
slug: /features/accessibility
---
## Keyboard Handling

Bottom-positioned toasts will automatically move with the keyboard. This behavior can not currently be disabled.

## Screen Reader Support

If the device's screen reader is enabled, react-native-toast will not show the toast. It will announce the toast message to the user using the announceAccessibility method.

### Overriding Screen Reader Detection

You can override the detected screen reader state using the `overrideScreenReaderEnabled` prop on the `<Toasts />` component. This is useful for testing or when you want to force a specific behavior regardless of the actual screen reader state.

```js
// Force the component to behave as if screen reader is disabled
<Toasts overrideScreenReaderEnabled={false} />
```

```js
// Force the component to behave as if screen reader is enabled
<Toasts overrideScreenReaderEnabled={true} />
```

When `overrideScreenReaderEnabled` is set:
- `true`: Toasts will be hidden (unless `preventScreenReaderFromHiding` is also `true`)
- `false`: Toasts will always be shown, even if a screen reader is actually enabled
- `undefined` (default): Auto-detect the screen reader state from the device

This prop works independently from `preventScreenReaderFromHiding`:
- If you set `overrideScreenReaderEnabled={true}` and `preventScreenReaderFromHiding={true}`, toasts will still be shown
- If you set `overrideScreenReaderEnabled={false}`, toasts will always be shown regardless of `preventScreenReaderFromHiding`
