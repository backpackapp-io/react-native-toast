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

const Accordion: FunctionComponent<{
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  defaultOpen?: boolean;
}> = ({ title, children, isDarkMode, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View
      style={{
        width: '100%',
        marginBottom: 16,
        backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDarkMode ? '#3a3a3a' : '#e0e0e0',
      }}
    >
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={{
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: isDarkMode ? colors.textDark : colors.textLight,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: isDarkMode ? colors.textDark : colors.textLight,
          }}
        >
          {isOpen ? '−' : '+'}
        </Text>
      </Pressable>
      {isOpen && <View style={{ padding: 16 }}>{children}</View>}
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
  const [animationType, setAnimationType] = useState<
    'timing' | 'spring' | 'fade'
  >('timing');
  const [useGlobalDefaults, setUseGlobalDefaults] = useState(false);

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible, setModalVisible]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          keyboardDismissMode={'interactive'}
          contentContainerStyle={{
            paddingVertical: 32,
            paddingHorizontal: 16,
            backgroundColor: isDarkMode ? '#181821' : '#f6f6f6',
            marginTop: 48,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: isDarkMode ? colors.textDark : colors.textLight,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            React Native Toast Demo
          </Text>

          <View
            style={{
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <ToggleSwitch
              isDarkMode={isDarkMode}
              value={isDarkMode}
              setValue={setIsUserDarkMode}
              text={'Dark Mode'}
            />
          </View>

          {/* Settings Section */}
          <Accordion title="⚙️ Toast Settings" isDarkMode={isDarkMode}>
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

            <ToggleSwitch
              isDarkMode={isDarkMode}
              value={useGlobalDefaults}
              setValue={setUseGlobalDefaults}
              text={'Use Global Defaults?'}
            />

            <View
              style={{
                width: '100%',
                marginTop: 16,
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
                Animation:
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => setAnimationType('timing')}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor:
                      animationType === 'timing' ? '#007AFF' : '#666',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>Timing</Text>
                </Pressable>
                <Pressable
                  onPress={() => setAnimationType('spring')}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor:
                      animationType === 'spring' ? '#007AFF' : '#666',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>Spring</Text>
                </Pressable>
                <Pressable
                  onPress={() => setAnimationType('fade')}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor:
                      animationType === 'fade' ? '#007AFF' : '#666',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>Fade</Text>
                </Pressable>
              </View>
            </View>
          </Accordion>

          {/* Global Defaults Test Section */}
          <Accordion
            title="🧪 Global Defaults Test"
            isDarkMode={isDarkMode}
            defaultOpen={true}
          >
            <Text
              style={{
                fontSize: 10,
                color: isDarkMode ? '#999' : '#666',
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              Hardcoded: BOTTOM, 5000ms, FADE
            </Text>

            <Pressable
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 8,
              }}
              onPress={() => {
                toast('Uses ALL global defaults', {
                  providerKey: 'PERSISTS',
                });
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                1. No Options (Should use globals)
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#34C759',
                padding: 12,
                borderRadius: 6,
                marginBottom: 8,
              }}
              onPress={() => {
                toast('Overrides position to TOP', {
                  providerKey: 'PERSISTS',
                  position: ToastPosition.TOP,
                  duration: 1500,
                  animationType: 'spring',
                });
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                2. Override Pos, Type, Duration
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#FF9500',
                padding: 12,
                borderRadius: 6,
              }}
              onPress={() => {
                toast('Overrides duration to 1000ms', {
                  providerKey: 'PERSISTS',
                  duration: 1000,
                });
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                3. Override Duration (1000ms)
              </Text>
            </Pressable>
          </Accordion>

          {/* Basic Toasts Section */}
          <Accordion title="🔵 Basic Toasts" isDarkMode={isDarkMode}>
            <Pressable
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
              }}
              onPress={() => {
                toast(Math.floor(Math.random() * 1000).toString(), {
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
                  providerKey: 'PERSISTS',
                });
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Normal Toast
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#34C759',
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
              }}
              onPress={() => {
                const id = toast.success('Success!', {
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
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
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Success Toast
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#FF3B30',
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
              }}
              onPress={() => {
                toast.error('Error!', {
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
                });
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Error Toast
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#FF9500',
                padding: 12,
                borderRadius: 6,
              }}
              onPress={() => {
                toast.loading(<LoadingMessage msg={'Loading...'} />, {
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
                });
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Loading Toast
              </Text>
            </Pressable>
          </Accordion>

          {/* Advanced Toasts Section */}
          <Accordion title="⚡ Advanced Toasts" isDarkMode={isDarkMode}>
            <Pressable
              style={{
                backgroundColor: '#5856D6',
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
              }}
              onPress={() => {
                toast(Math.floor(Math.random() * 1000).toString(), {
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
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
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Toast With Handlers
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#FF2D55',
                padding: 12,
                borderRadius: 6,
              }}
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
                    position: useGlobalDefaults ? undefined : position,
                    duration: useGlobalDefaults ? undefined : duration,
                    height,
                    width,
                    animationType: useGlobalDefaults
                      ? undefined
                      : animationType,
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
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Promise Toast
              </Text>
            </Pressable>
          </Accordion>

          {/* Modal Demo Section */}
          <Accordion title="📱 Modal Demo" isDarkMode={isDarkMode}>
            <Pressable
              style={{
                backgroundColor: '#32ADE6',
                padding: 12,
                borderRadius: 6,
              }}
              onPress={toggleModal}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Toggle Modal
              </Text>
            </Pressable>
          </Accordion>
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
                  position: useGlobalDefaults ? undefined : position,
                  duration: useGlobalDefaults ? undefined : duration,
                  height,
                  width,
                  animationType: useGlobalDefaults ? undefined : animationType,
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
              defaultPosition={
                useGlobalDefaults ? ToastPosition.BOTTOM : undefined
              }
              defaultDuration={useGlobalDefaults ? 5000 : undefined}
              globalAnimationType={'fade'}
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
          defaultPosition={ToastPosition.BOTTOM}
          defaultDuration={5000}
          globalAnimationType={'fade'}
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
