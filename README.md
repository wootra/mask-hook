# mask-hook

mask-hook is a React hook for formatting and masking 9-digit identifiers such as SSN and EIN.

It works in React and React Native and is designed for controlled input flows where you need:
- masked and visible display modes
- stable digit parsing while typing and deleting
- focus-based re-initialization for tab navigation scenarios

## Installation

```bash
npm install @shjeon0730/mask-hook
```

Peer dependency:
- react >= 16.8.0

## Quick Start (React)

```tsx
import { useEffect, useState } from 'react';
import { SsnFormats, useMask } from '@shjeon0730/mask-hook';

export function SsnField() {
  const [storedValue, setStoredValue] = useState('6789');

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

  useEffect(() => {
    initialize();
  }, [initialize]);

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
        {isNumberVisible ? 'Hide digits' : 'Show digits'}
      </button>

      <div>Stored value: {storedValue || 'empty'}</div>
    </>
  );
}
```

## React Native Focus Pattern

When using tab navigation, screens often stay mounted. Call initialize each time the screen gets focus.

Expo Router:

```tsx
import { useFocusEffect } from 'expo-router';

useFocusEffect(initialize);
```

React Navigation:

```tsx
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(initialize);
```

## Exports

```ts
import { useMask, SsnFormats, EinFormats } from '@shjeon0730/mask-hook';
import type { MaskInfo, UseMaskParams } from '@shjeon0730/mask-hook';
```

## API

### useMask(params)

Parameters:

- maskInfo: MaskInfo
  - Formatting rules. Use built-ins (SsnFormats, EinFormats) or provide your own.
- defaultMaskedValue: string
  - Seed value shown when initialize runs and the field is in initial state.
- unmaskedValue: string
  - Current external value (formatted or unformatted input is accepted).
- onChange?: (changedValueUnmasked: string) => void
  - Called on user edits with formatted visible value.
- onBlur?: () => void
  - Called when blur occurs after user has modified input.
- onValueChanged?: (formattedValue: string) => void
  - Called on user edits; useful for syncing parent state.
- onEyeClickedToUpdateRealValue?: () => void
  - Optional flag hook for forcing eye icon visibility behavior.

Return value:

- displayedValue: string
  - Current string to render in the input (masked or visible mode).
- isDirty: boolean
  - True after user-driven edits.
- isNumberVisible: boolean
  - Current visibility mode.
- canEyeIconVisible: boolean
  - Whether visibility toggle should be enabled.
- handleInputFocused: () => void
  - Focus handler (clears seeded default presentation when appropriate).
- handleInputBlurred: () => void
  - Blur handler (restores seeded default presentation when appropriate).
- setIsNumberVisible: (value: boolean) => void
  - Sets masked or visible mode.
- onChangeText: (value: string) => void
  - Input change handler.
- initialize: () => void
  - Re-seeds and normalizes state for focus-driven flows.

## Built-in Formats

- SsnFormats
  - maskedFormat: ***-**-9999 style with masked symbols and last 4 digits visible
  - visibleFormat: 999-99-9999
- EinFormats
  - maskedFormat: **-***9999 style with masked symbols and last 4 digits visible
  - visibleFormat: 99-9999999

## Monorepo Demos

This repository includes multiple demos under packages:

- packages/mask-hook: library source and tests
- packages/demo-web: web demo (React + Vite)
- packages/demo-rn-expo: Expo Router demo
- packages/demo-rn-navigation: React Navigation demo

Root scripts:

```bash
npm install
npm run test
npm run test:watch
npm run dev:web
npm run dev:rn-expo
npm run dev:rn-navigation
npm run build:web
npm run tag -- patch
npm run tag -- minor
npm run tag -- major
```

Library-only scripts:

```bash
npm run test --workspace=packages/mask-hook
npm run test:watch --workspace=packages/mask-hook
npm run typecheck --workspace=packages/mask-hook
```

## Release Flow

Create and publish a release with one command:

```bash
npm run tag -- patch
```

Supported bump types:

- patch
- minor
- major

What the command does:

- bumps the version in packages/mask-hook/package.json
- updates the root package-lock.json workspace entry
- creates a git commit
- creates a matching git tag such as v0.1.1
- pushes the commit and tag to origin

The GitHub Actions publish workflow only deploys when:

- the pushed tag matches the library version exactly
- the version does not already exist on npm
- tests and type checks pass

## License

MIT
