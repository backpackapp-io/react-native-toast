import * as React from 'react';
import { FunctionComponent, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import { Toasts } from '../../src/components/Toasts';
import { toast } from '../../src/headless';
import { ToastPosition } from '../../src/core/types';
import { colors } from '../../src/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { width: screenWidth } = useWindowDimensions();
  const isSystemDarkMode = useColorScheme() === 'dark';

  const [isUserDarkMode, setIsUserDarkMode] = useState(true);
  const [position, setPosition] = useState(ToastPosition.TOP);
  const [height, setHeight] = useState(50);
  const [width, setWidth] = useState(screenWidth - 32);
  const [duration, setDuration] = useState(4000);

  const isDarkMode = useMemo(
    () => (isUserDarkMode ? isUserDarkMode : isSystemDarkMode),
    [isUserDarkMode, isSystemDarkMode]
  );

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          scrollEnabled={false}
          keyboardDismissMode={'interactive'}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#181821' : '#f6f6f6',
          }}
        >
          <ToggleSwitch
            isDarkMode={isDarkMode}
            value={isDarkMode}
            setValue={setIsUserDarkMode}
            text={'Dark Mode?'}
          />
          <ToggleSwitch
            isDarkMode={isDarkMode}
            value={ToastPosition.TOP === position}
            setValue={(val) =>
              setPosition(val ? ToastPosition.TOP : ToastPosition.BOTTOM)
            }
            text={'Top Position?'}
          />

          <NumericInput
            isDarkMode={isDarkMode}
            value={height.toString()}
            setValue={(text) => {
              setHeight(parseInt(text, 10) ? parseInt(text, 10) : 0);
            }}
            text={'Toast Height:'}
          />

          <NumericInput
            isDarkMode={isDarkMode}
            value={width.toString()}
            setValue={(text) => {
              setWidth(parseInt(text, 10) ? parseInt(text, 10) : 0);
            }}
            text={'Toast Width:'}
          />
          <NumericInput
            isDarkMode={isDarkMode}
            value={duration.toString()}
            setValue={(text) => {
              setDuration(parseInt(text, 10) ? parseInt(text, 10) : 0);
            }}
            text={'Toast Duration:'}
          />

          <Pressable
            style={{ marginTop: 64 }}
            onPress={() => {
              toast(Math.floor(Math.random() * 1000).toString(), {
                position,
                duration,
                height,
                width,
              });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: isDarkMode ? colors.textDark : colors.textLight,
              }}
            >
              Normal Toast
            </Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 16 }}
            onPress={() => {
              const id = toast.success('Success!', {
                position,
                duration,
                height,
                width,
              });

              setTimeout(() => {
                toast.success('new success', {
                  id,
                });
              }, 600);
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: isDarkMode ? colors.textDark : colors.textLight,
              }}
            >
              Success Toast
            </Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 16 }}
            onPress={() => {
              const sleep = new Promise((resolve, reject) => {
                setTimeout(() => {
                  if (Math.random() > 0.5) {
                    resolve({
                      username: 'Nick',
                      email: 'nick@backpackapp.io',
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
                  position,
                  duration,
                  height,
                  width,
                }
              );
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: isDarkMode ? colors.textDark : colors.textLight,
              }}
            >
              Promise Toast
            </Text>
          </Pressable>
        </ScrollView>
        <Toasts overrideDarkMode={isDarkMode} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

type ToggleSwitchProps = {
  isDarkMode: boolean;
  value: boolean;
  setValue: (value: boolean) => void;
  text: string;
};

const ToggleSwitch: FunctionComponent<ToggleSwitchProps> = ({
  isDarkMode,
  setValue,
  value,
  text,
}) => {
  return (
    <View
      style={{
        width: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 32,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'normal',
          color: isDarkMode ? colors.textDark : colors.textLight,
        }}
      >
        {text}
      </Text>
      <Switch value={value} onValueChange={(val) => setValue(val)} />
    </View>
  );
};

type NumericInputProps = {
  isDarkMode: boolean;
  value: string;
  setValue: (value: string) => void;
  text: string;
};

const NumericInput: FunctionComponent<NumericInputProps> = ({
  isDarkMode,
  text,
  value,
  setValue,
}) => {
  return (
    <View
      style={{
        width: 200,
        marginTop: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'normal',
          color: isDarkMode ? colors.textDark : colors.textLight,
        }}
      >
        {text}
      </Text>
      <TextInput
        style={{
          color: isDarkMode ? colors.textDark : colors.textLight,
        }}
        value={value}
        keyboardType={'numeric'}
        onChangeText={setValue}
      />
    </View>
  );
};
