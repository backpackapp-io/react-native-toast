# React Native Toast
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) [![GitHub license](https://img.shields.io/github/license/backpackapp-io/react-native-toast)](https://github.com/backpackapp-io/react-native-toast/blob/master/LICENSE) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@backpackapp-io/react-native-toast)

**React Native Toast**는 [react-hot-toast](https://react-hot-toast.com/docs)를 기반으로 구축된 React Native용 토스트(Toast) 라이브러리입니다.  
iOS, Android, Web 환경에서 모두 작동하며, 다중 토스트 표시, 키보드 대응, 스와이프 닫기, 위치 지정, 그리고 Promise 기반 처리와 같은 기능을 제공합니다.

<br />

[video](https://user-images.githubusercontent.com/27066041/180588807-1ca73f29-56d7-4e44-ac0c-9f2e2cdeb94c.mp4)

<br />

### 왜 이 라이브러리를 만들었나요?
아마 이렇게 생각하실 수도 있습니다. (*또 다른 토스트 라이브러리라고? 정말 필요할까?*). 하지만 믿어주세요. **이 라이브러리 하나면 충분합니다.** 제가 직접 앱을 개발하면서 필요한 기능을 모두 담기 위해 만들었고, 사용해보니 완성도가 높아 오픈소스로 공개하게 되었습니다.

## 주요 기능

- **다중 토스트 및 다양한 옵션** 여러 개의 토스트를 동시에 표시하거나, 위치·색상·유형을 각각 다르게 설정할 수 있습니다.
- **키보드 대응** iOS와 Android에서 키보드가 열릴 때 토스트가 자동으로 화면에 잘 보이도록 위치를 조정합니다.
- **스와이프로 닫기**
- **위치 지정 지원** (`top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right`)
- **높은 수준의 커스터마이징** (스타일, 크기, 지속 시간 등을 조정하거나, 사용자 정의 컴포넌트를 표시할 수 있습니다.)
- **Promise 지원** (`toast.promise()`를 사용하면 Promise의 상태에 따라 토스트 메시지가 자동으로 업데이트됩니다.)
- **Web 지원**
- **Native Modal 지원**
- **onPress, onShow, onHide 콜백 지원**

# 문서
전체 문서는 [여기](https://nickdebaise.github.io/packages/react-native-toast/)에서 확인할 수 있습니다.

# 시작하기

## 설치
```sh
yarn add @backpackapp-io/react-native-toast
# 또는
npm i @backpackapp-io/react-native-toast
```
#### 필수 의존성
다음 패키지를 함께 설치해야 합니다.
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

```sh
yarn add react-native-reanimated react-native-safe-area-context react-native-gesture-handler
```
*각 패키지의 설치 가이드를 반드시 참고하세요.*


*Expo를 사용하는 경우*
```sh
npx expo install react-native-reanimated react-native-safe-area-context react-native-gesture-handler
```
<br />

### 사용 방법
앱의 루트 컴포넌트를 ``<GestureHandlerRootView />`` 및 ``<SafeAreaProvider />``로 감싸고, 루트 레벨에 ``<Toasts />`` 컴포넌트를 추가합니다.

이후 앱의 어느 위치에서든 ``toast("메시지")``를 호출할 수 있습니다.

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
        <View>{/* 앱의 나머지 컴포넌트 */}</View>
        <Toasts /> {/* 여기에 추가 */}
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

## 예제

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
