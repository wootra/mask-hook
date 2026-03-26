# @shjeon0730/mask-hook

When handling masking, it usually start with very small logic, and it would work. But the more the complexity is added to support multiple different format of masking, the logic easily go to inconsistent and unstable mutations. 
This hook includes smooth handling logic to handle masking patterns supporting *Any* pattern.

`@shjeon0730/mask-hook` is a React hook for general-purpose numeric formatting and masking — works seamlessly on **web** and **mobile** (React Native / Expo).

> **Cross-platform:** one hook, zero platform-specific code. Drop it into a React web app or a React Native / Expo project and it behaves identically.

Designed for controlled input flows where you need:

- Masked and visible display modes (toggle eye icon pattern)
- Stable digit parsing while typing and deleting
- Focus-based re-initialization for tab navigation scenarios
- Custom patterns for any digit length (not limited to SSN/EIN)
- Even though partial value is given, this hook will make it pretty following the given format. 

## Demo

![mask-hook demo](https://raw.githubusercontent.com/wootra/mask-hook/main/packages/mask-hook/demo.gif)


## Installation

```bash
npm install @shjeon0730/mask-hook
```

Peer dependency: `react >= 16.8.0`

## Quick Start

### React (web)

```tsx
import { useEffect, useState } from 'react';
import { SsnFormats, useMask } from '@shjeon0730/mask-hook';

export function SsnField() {
  const [storedValue, setStoredValue] = useState('');

  const {
    displayedValue,
    isNumberVisible,
    canEyeIconVisible,
    setIsNumberVisible,
    onChangeText,
    handleInputFocused,
    handleInputBlurred,
    initialize,
  } = useMask({
    maskInfo: SsnFormats,
    defaultMaskedValue: '6789',
    unmaskedValue: storedValue,
    onValueChanged: setStoredValue,
  });

  useEffect(initialize, [initialize]);

  return (
    <>
      <input
        value={displayedValue}
        onChange={(e) => onChangeText(e.target.value)}
        onFocus={handleInputFocused}
        onBlur={handleInputBlurred}
        placeholder="___-__-____"
      />
      <button
        type="button"
        onClick={() => setIsNumberVisible(!isNumberVisible)}
        disabled={!canEyeIconVisible}
      >
        {isNumberVisible ? 'Hide' : 'Show'} digits
      </button>
    </>
  );
}
```

### React Native

```tsx
import { useEffect } from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';
import { SsnFormats, useMask } from '@shjeon0730/mask-hook';

export function SsnField({ value, onChange }) {
  const {
    displayedValue,
    isNumberVisible,
    canEyeIconVisible,
    setIsNumberVisible,
    onChangeText,
    handleInputFocused,
    handleInputBlurred,
    initialize,
  } = useMask({
    maskInfo: SsnFormats,
    defaultMaskedValue: '6789',
    unmaskedValue: value,
    onValueChanged: onChange,
  });

  // if unsure re-mounting(i.e. react-navigation screens), use useFocusEffect(initialize)
  useEffect(initialize, [initialize]);

  return (
    <>
      <TextInput
        value={displayedValue}
        onChangeText={onChangeText}
        onFocus={handleInputFocused}
        onBlur={handleInputBlurred}
        placeholder="___-__-____"
      />
      <TouchableOpacity
        onPress={() => setIsNumberVisible(!isNumberVisible)}
        disabled={!canEyeIconVisible}
      >
        <Text>{isNumberVisible ? 'Hide' : 'Show'} digits</Text>
      </TouchableOpacity>
    </>
  );
}
```

### Tab Navigation (Expo Router / React Navigation)
When using navigation, screens often stay mounted. Call `initialize` each time the screen gets focus so the field resets to its default presentation.

**Expo Router:**

```tsx
import { useFocusEffect } from 'expo-router';

useFocusEffect(initialize);
```

**React Navigation:**

```tsx
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(initialize);
```

## API

### `useMask(params)`

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `maskInfo` | `MaskInfo` | ✓ | Formatting rules. Use `SsnFormats`, `EinFormats`, or a custom object. |
| `defaultMaskedValue` | `string` | ✓ | Seed value shown when the field is in its initial (untouched) state. |
| `unmaskedValue` | `string` | ✓ | Current external value (digits only, or formatted — both accepted). |
| `onChange` | `(value: string) => void` | | Called on user edits with the formatted visible value. |
| `onBlur` | `() => void` | | Called on blur after the user has modified the input. |
| `onValueChanged` | `(value: string) => void` | | Called on user edits; useful for syncing parent state. |

#### Return value

| Name | Type | Description |
|------|------|-------------|
| `displayedValue` | `string` | Current string to render in the input (masked or visible). |
| `isDirty` | `boolean` | `true` after any user-driven edit. |
| `isNumberVisible` | `boolean` | Current visibility mode (`true` = digits shown). |
| `canEyeIconVisible` | `boolean` | Whether the visibility toggle should be enabled. |
| `setIsNumberVisible` | `(value: boolean) => void` | Toggles masked / visible mode. |
| `onChangeText` | `(value: string) => void` | Input change handler — pass to `onChange` / `onChangeText`. |
| `handleInputFocused` | `() => void` | Focus handler — clears the seeded default when appropriate. |
| `handleInputBlurred` | `() => void` | Blur handler — restores the seeded default when appropriate. |
| `initialize` | `() => void` | Re-seeds and normalizes state; call on mount and on screen focus. |

### Built-in formats

The package includes SSN and EIN presets for convenience, but you can provide your own `MaskInfo` for any numeric format. 

| Export | `maskedFormat` | `visibleFormat` |
|--------|---------------|-----------------|
| `SsnFormats` | `•••–••–9999` | `999–99–9999` |
| `EinFormats` | `••–•••9999` | `99–9999999` |

### Custom format

You can supply any `MaskInfo` object:

```ts
import type { MaskInfo } from '@shjeon0730/mask-hook';

const MyFormat: MaskInfo = {
  maskedFormat: '••••9999',   // • = masked digit, 9 = visible digit
  visibleFormat: '99999999',  // 9 = visible digit
};
```
> **Note**: the number part can be any number. `***-**-0000` is also a valid format

## Types

```ts
import type { MaskInfo, UseMaskParams } from '@shjeon0730/mask-hook';

type MaskInfo = {
  maskedFormat: string;
  visibleFormat: string;
};

type UseMaskParams = {
  maskInfo: MaskInfo;
  defaultMaskedValue: string;
  unmaskedValue: string;
  onChange?: (changedValueUnmasked: string) => void;
  onBlur?: () => void;
  onValueChanged?: (formattedValue: string) => void;
  onEyeClickedToUpdateRealValue?: () => void;
};
```

## License

MIT
