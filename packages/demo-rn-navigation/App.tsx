import { useState } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { EinFormats, SsnFormats, useMask } from '@shjeon0730/mask-hook';
import { MaskScreen } from './src/MaskScreen';

const Tab = createBottomTabNavigator();
enableScreens(false);

function SsnScreen() {
  const defaultMaskedValue = '6789';
  const [storedValue, setStoredValue] = useState(defaultMaskedValue);
  const {
    displayedValue,
    isDirty,
    isNumberVisible,
    canEyeIconVisible,
    handleInputFocused,
    handleInputBlurred,
    setIsNumberVisible,
    onChangeText,
    initialize,
  } = useMask({
    maskInfo: SsnFormats,
    defaultMaskedValue,
    unmaskedValue: storedValue,
    onValueChanged: setStoredValue,
  });

  useFocusEffect(initialize);
  const digitCount = storedValue.replace(/\D/g, '').length;

  return (
    <MaskScreen
      canEyeIconVisible={canEyeIconVisible}
      description="This tab uses React Navigation and calls initialize through useFocusEffect whenever it becomes active."
      digitCount={digitCount}
      displayedValue={displayedValue}
      handleInputBlurred={handleInputBlurred}
      handleInputFocused={handleInputFocused}
      isDirty={isDirty}
      isNumberVisible={isNumberVisible}
      onChangeText={onChangeText}
      placeholder="___-__-____"
      setIsNumberVisible={setIsNumberVisible}
      storedValue={storedValue}
      testIdPrefix="ssn"
      title="SSN screen"
    />
  );
}

function EinScreen() {
  const defaultMaskedValue = '6789';
  const [storedValue, setStoredValue] = useState(defaultMaskedValue);
  const {
    displayedValue,
    isDirty,
    isNumberVisible,
    canEyeIconVisible,
    handleInputFocused,
    handleInputBlurred,
    setIsNumberVisible,
    onChangeText,
    initialize,
  } = useMask({
    maskInfo: EinFormats,
    defaultMaskedValue,
    unmaskedValue: storedValue,
    onValueChanged: setStoredValue,
  });

  useFocusEffect(initialize);
  const digitCount = storedValue.replace(/\D/g, '').length;

  return (
    <MaskScreen
      canEyeIconVisible={canEyeIconVisible}
      description="The EIN tab proves the same pattern works outside Expo Router when navigation focus is managed directly by React Navigation."
      digitCount={digitCount}
      displayedValue={displayedValue}
      handleInputBlurred={handleInputBlurred}
      handleInputFocused={handleInputFocused}
      isDirty={isDirty}
      isNumberVisible={isNumberVisible}
      onChangeText={onChangeText}
      placeholder="__-_______"
      setIsNumberVisible={setIsNumberVisible}
      storedValue={storedValue}
      testIdPrefix="ein"
      title="EIN screen"
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#8a4b2d' }}>
        <Tab.Screen component={SsnScreen} name="SSN" />
        <Tab.Screen component={EinScreen} name="EIN" />
      </Tab.Navigator>
    </NavigationContainer>
  );
}