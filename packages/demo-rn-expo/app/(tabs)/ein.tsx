import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { EinFormats, useMask } from 'mask-hook';
import { MaskScreen } from '../../src/MaskScreen';

export default function EinScreen() {
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
      description="This page mirrors the same focus-driven initialize pattern for the EIN format."
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
      title="EIN screen"
    />
  );
}