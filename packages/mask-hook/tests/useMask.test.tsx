import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMask } from '../src/useMask';

describe('useMask – SSN', () => {
  it('initializes with empty value', () => {
    const { result } = renderHook(() => useMask({ type: 'ssn' }));
    expect(result.current.value).toBe('');
    expect(result.current.formattedValue).toBe('');
    expect(result.current.maskedValue).toBe('');
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isMasked).toBe(false);
  });

  it('initializes with provided digits', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123456789' })
    );
    expect(result.current.value).toBe('123456789');
    expect(result.current.formattedValue).toBe('123-45-6789');
    expect(result.current.isComplete).toBe(true);
  });

  it('initializes with formatted SSN string', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123-45-6789' })
    );
    expect(result.current.value).toBe('123456789');
    expect(result.current.formattedValue).toBe('123-45-6789');
  });

  it('updates value via onChange', () => {
    const { result } = renderHook(() => useMask({ type: 'ssn' }));
    act(() => {
      result.current.onChange('123456789');
    });
    expect(result.current.value).toBe('123456789');
    expect(result.current.formattedValue).toBe('123-45-6789');
  });

  it('strips non-digits in onChange', () => {
    const { result } = renderHook(() => useMask({ type: 'ssn' }));
    act(() => {
      result.current.onChange('123-45-6789');
    });
    expect(result.current.value).toBe('123456789');
  });

  it('clamps input to 9 digits', () => {
    const { result } = renderHook(() => useMask({ type: 'ssn' }));
    act(() => {
      result.current.onChange('1234567890');
    });
    expect(result.current.value).toBe('123456789');
  });

  it('starts unmasked by default', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123456789' })
    );
    expect(result.current.isMasked).toBe(false);
    expect(result.current.displayValue).toBe('123-45-6789');
  });

  it('starts masked when defaultMasked=true', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123456789', defaultMasked: true })
    );
    expect(result.current.isMasked).toBe(true);
    expect(result.current.displayValue).toBe('***-**-6789');
  });

  it('toggleMask switches between masked and unmasked', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123456789' })
    );
    act(() => {
      result.current.toggleMask();
    });
    expect(result.current.isMasked).toBe(true);
    expect(result.current.displayValue).toBe('***-**-6789');

    act(() => {
      result.current.toggleMask();
    });
    expect(result.current.isMasked).toBe(false);
    expect(result.current.displayValue).toBe('123-45-6789');
  });

  it('setMasked sets masked state explicitly', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ssn', initialValue: '123456789' })
    );
    act(() => {
      result.current.setMasked(true);
    });
    expect(result.current.isMasked).toBe(true);

    act(() => {
      result.current.setMasked(false);
    });
    expect(result.current.isMasked).toBe(false);
  });

  it('maskedValue is not empty for partial entry', () => {
    const { result } = renderHook(() => useMask({ type: 'ssn' }));
    act(() => {
      result.current.onChange('123');
    });
    expect(result.current.maskedValue).toBe('***');
    expect(result.current.isComplete).toBe(false);
  });
});

describe('useMask – EIN', () => {
  it('initializes with empty value', () => {
    const { result } = renderHook(() => useMask({ type: 'ein' }));
    expect(result.current.value).toBe('');
    expect(result.current.formattedValue).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  it('formats complete EIN', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ein', initialValue: '123456789' })
    );
    expect(result.current.formattedValue).toBe('12-3456789');
    expect(result.current.isComplete).toBe(true);
  });

  it('initializes with formatted EIN string', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ein', initialValue: '12-3456789' })
    );
    expect(result.current.value).toBe('123456789');
    expect(result.current.formattedValue).toBe('12-3456789');
  });

  it('masks complete EIN', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ein', initialValue: '123456789', defaultMasked: true })
    );
    expect(result.current.maskedValue).toBe('**-***6789');
    expect(result.current.displayValue).toBe('**-***6789');
  });

  it('updates value via onChange', () => {
    const { result } = renderHook(() => useMask({ type: 'ein' }));
    act(() => {
      result.current.onChange('12-3456789');
    });
    expect(result.current.value).toBe('123456789');
    expect(result.current.formattedValue).toBe('12-3456789');
  });

  it('maskedValue for partial EIN', () => {
    const { result } = renderHook(() => useMask({ type: 'ein' }));
    act(() => {
      result.current.onChange('12');
    });
    expect(result.current.maskedValue).toBe('**');
    act(() => {
      result.current.onChange('123');
    });
    expect(result.current.maskedValue).toBe('**-*');
  });

  it('toggleMask works for EIN', () => {
    const { result } = renderHook(() =>
      useMask({ type: 'ein', initialValue: '123456789' })
    );
    expect(result.current.displayValue).toBe('12-3456789');
    act(() => {
      result.current.toggleMask();
    });
    expect(result.current.displayValue).toBe('**-***6789');
  });
});
