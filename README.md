# mask-hook

EIN/SSN masking is hard and tedious. This React hook helps your UI handle masking easily.

Compatible with **React** and **React Native** (no web/DOM dependencies in the library itself).

---

## Installation

```bash
npm install mask-hook
```

> **Peer dependency:** React ≥ 16.8 (hooks required)

---

## Usage

```tsx
import { useMask } from 'mask-hook';

function SSNInput() {
  const { displayValue, onChange, toggleMask, isMasked, isComplete } =
    useMask({ type: 'ssn', defaultMasked: false });

  return (
    <>
      <input
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="___-__-____"
      />
      <button onClick={toggleMask}>{isMasked ? 'Show' : 'Hide'}</button>
      {isComplete && <span>✓ Complete</span>}
    </>
  );
}
```

```tsx
// EIN variant
const { displayValue, onChange } = useMask({ type: 'ein' });
```

---

## API

### `useMask(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `'ssn' \| 'ein'` | *(required)* | Identifier type |
| `initialValue` | `string` | `''` | Starting value (digits or formatted) |
| `defaultMasked` | `boolean` | `false` | Start in masked mode |

### Return value

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Raw digits (e.g. `"123456789"`) |
| `formattedValue` | `string` | Formatted (e.g. `"123-45-6789"` / `"12-3456789"`) |
| `maskedValue` | `string` | Masked, last 4 visible (e.g. `"***-**-6789"`) |
| `displayValue` | `string` | `formattedValue` or `maskedValue` based on `isMasked` |
| `onChange` | `(text: string) => void` | Call on every input change |
| `toggleMask` | `() => void` | Toggle masked / unmasked |
| `setMasked` | `(masked: boolean) => void` | Explicitly set mask state |
| `isMasked` | `boolean` | Current mask state |
| `isComplete` | `boolean` | `true` when all 9 digits are entered |

### Masking format

| Type | Masked (complete) | Formatted (complete) |
|---|---|---|
| SSN | `***-**-6789` | `123-45-6789` |
| EIN | `**-***6789` | `12-3456789` |

---

## Dev environment

This repo uses npm workspaces:

```
packages/
  mask-hook/       ← npm library (TypeScript source shipped as-is)
  sample-app/      ← Vite + React demo app
```

### Commands

```bash
# Install all dependencies
npm install

# Run tests (vitest)
npm test

# Watch mode
npm run test:watch

# Run the sample app (http://localhost:5173)
npm run dev

# Build the sample app
npm run build:sample
```

### Testing

Tests live in `packages/mask-hook/tests/` and use **vitest** + **@testing-library/react**.

```bash
cd packages/mask-hook
npm test
```

### Publishing

The library ships its TypeScript source directly (no build step):

```bash
cd packages/mask-hook
npm publish
```

---

## License

MIT
