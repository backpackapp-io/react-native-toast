import * as React from 'react';
import { FunctionComponent, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { Toasts } from '../../src/components/Toasts';
import { toast } from '../../src/headless';
import { ToastPosition } from '../../src/core/types';
import { colors } from '../../src/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

export default function App() {
  const { width: screenWidth } = useWindowDimensions();
  const isSystemDarkMode = useColorScheme() === 'dark';
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [isDarkMode, setIsUserDarkMode] = useState(isSystemDarkMode);
  const [position, setPosition] = useState(ToastPosition.TOP);
  const [height, setHeight] = useState(50);
  const [width, setWidth] = useState(
    screenWidth - 32 > 360 ? 360 : screenWidth - 32
  );
  const [duration, setDuration] = useState(4000);

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible, setModalVisible]);

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
                providerKey: 'PERSISTS',
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
              toast(Math.floor(Math.random() * 1000).toString(), {
                position,
                duration,
                height,
                width,
                providerKey: 'PERSISTS',
                onPress: (toast) => {
                  console.log('Toast pressed: ', toast);
                },
                onShow: (toast) => {
                  console.log('Toast shown: ', toast);
                },
                onHide: (toast, reason) => {
                  console.log('Toast hidden: ', toast, reason);
                },
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
              Toast With Handlers
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
                toast.success('Updated success!', {
                  id,
                });
              }, 1500);
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
            onPress={() => {
              toast.loading(<LoadingMessage msg={'Loading...'} />, {
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
              Loading Toast
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
                      email: 'nick@google.com',
                    });
                  } else {
                    reject('Username is undefined');
                  }
                }, 2500);
              });

              toast.promise(
                sleep,
                {
                  loading: (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <ActivityIndicator style={{ marginRight: 16 }} />
                      <Text
                        style={{
                          color: 'white',
                        }}
                      >
                        Loading
                      </Text>
                    </View>
                  ),
                  success: (data: any) => 'Welcome ' + data.username,
                  error: (err) => err.toString(),
                },
                {
                  position,
                  duration,
                  height,
                  width,
                  animationConfig: {
                    stiffness: 300,
                    duration: 200,
                  },
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
          <Button title={'Toggle Modal'} onPress={toggleModal} />
        </ScrollView>
        <Modal style={{ padding: 0, margin: 0 }} isVisible={isModalVisible}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !isDarkMode ? colors.textDark : colors.textLight,
            }}
          >
            <Button title={'Toggle Modal'} onPress={toggleModal} />

            <Pressable
              style={{ marginTop: 64 }}
              onPress={() => {
                toast(Math.floor(Math.random() * 1000).toString(), {
                  position,
                  duration,
                  height,
                  width,
                  providerKey: 'PERSISTS',
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

            <Toasts
              providerKey={'MODAL::1'}
              onToastShow={(t) => {
                console.log('SHOW: ', t);
              }}
              onToastHide={(t) => {
                console.log('HIDE: ', t);
              }}
              onToastPress={(t) => {
                console.log('PRESS: ', t);
              }}
              overrideDarkMode={isDarkMode}
            />
          </View>
        </Modal>
        <Toasts
          onToastShow={(t) => {
            console.log('SHOW: ', t);
          }}
          onToastHide={(t, reason) => {
            console.log('HIDE: ', t, reason);
          }}
          onToastPress={(t) => {
            console.log('PRESS: ', t);
          }}
          overrideDarkMode={isDarkMode}
        />
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
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'normal',
            color: isDarkMode ? colors.textDark : colors.textLight,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <TextInput
          style={{
            color: isDarkMode ? colors.textDark : colors.textLight,
            textAlign: 'right',
          }}
          value={value}
          keyboardType={'numeric'}
          onChangeText={setValue}
        />
      </View>
    </View>
  );
};
