import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { SsnFormats, useMask } from 'mask-hook';
import { MaskScreen } from '../../src/MaskScreen';

export default function SsnScreen() {
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
      description="Expo Router tab screens call initialize through useFocusEffect when the tab gains focus."
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
      title="SSN screen"
    />
  );
}