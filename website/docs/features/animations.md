---
id: animations
title: Animations
sidebar_label: Animations
slug: /features/animations
---

## Animation Types

You can choose three different types of enter/exit animations

- `timing` - This is the default animation type. It uses Reanimated withTiming function to animate the component with a slide + fade animation.
- `spring` - This animation type uses Reanimated withSpring function to animate the component with a slide + fade animation.
- `fade` - This animation type uses only opacity (fade in/out) without any slide animation. The toast appears and disappears in place.

```js
toast('Spring Animation', {
  animationType: 'spring',
});

toast('Fade Animation', {
  animationType: 'fade',
});

toast('Default Timing Animation');
```

### When to use each animation type

- **timing**: Best for smooth, predictable slide-in animations (default)
- **spring**: Best for bouncy, physics-based slide-in animations that feel more natural
- **fade**: Best for subtle, non-intrusive notifications that don't need motion. Great for center-positioned toasts or when you want minimal visual distraction.

## Animation Config

You can also customize the options passed to the withTiming/withSpring function.

In addition, you can customize the animation duration and fling return duration.

-  duration controls the duration of the opacity fade in/out.

- fling return duration controls the duration of the fling return animation once the component is released.

```js
toast('Custom Animation', {
  animationType: 'timing',
  animationConfig: {
    duration: 500,
    flingPositionReturnDuration: 500,
  },
});

// ...

toast('Custom Spring Animation', {
  animationType: 'spring',
  animationConfig: {
    damping: 10,
    stiffness: 80,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    duration: 500, // Note: you can still use duration which won't affect the spring animation but the opacity fade in/out
  },
});
```

## Animated Loading Spinner

To create a custom loading animation, create a custom message component.

```js

const LoadingMessage = ({ msg }: { msg: string }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ActivityIndicator style={{ marginRight: 16 }} />
      <Text
        style={{
          color: isDarkMode ? 'black' : 'white',
        }}
      >
        {msg}
      </Text>
    </View>
  );
};

toast.loading(<LoadingMessage msg="Loading..." />, {
  animationType: 'timing',
  animationConfig: {
    duration: 500,
    flingPositionReturnDuration: 500,
  },
})

// ...

toast.promise(
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise resolved')
    }, 2000)
  }),
  {
    loading: <LoadingMessage msg="Loading..." />,
    success: 'Promise resolved',
    error: 'Promise rejected',
    animationType: 'timing',
    animationConfig: {
      duration: 500,
      flingPositionReturnDuration: 500,
    },
  }
);

```
