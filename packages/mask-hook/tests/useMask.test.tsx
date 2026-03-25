import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMask } from '../src/useMask';
import { SsnFormats, EinFormats } from '../src/patterns';

describe('useMask – SSN', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
      })
    );
    expect(result.current.displayedValue).toBe('');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isNumberVisible).toBe(false);
  });

  it('initializes with default masked value', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '123456789',
        unmaskedValue: '',
      })
    );
    act(() => {
      result.current.initialize();
    });
    expect(result.current.displayedValue).toBe('•••–••–6789');
  });

  it('handles input change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
        onChange,
      })
    );
    act(() => {
      result.current.onChangeText('123456789');
    });
    expect(result.current.displayedValue).toBe('•••–••–6789');
    expect(onChange).toHaveBeenCalledWith('123–45–6789');
  });

  it('toggles number visibility', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '123456789',
        unmaskedValue: '',
      })
    );
    expect(result.current.isNumberVisible).toBe(false);
    act(() => {
      result.current.setIsNumberVisible(true);
    });
    expect(result.current.isNumberVisible).toBe(true);
  });

  it('marks as dirty on input', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
      })
    );
    expect(result.current.isDirty).toBe(false);
    act(() => {
      result.current.onChangeText('123');
    });
    expect(result.current.isDirty).toBe(true);
  });

  it('triggers onBlur callback', () => {
    const onBlur = vi.fn();
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
        onBlur,
      })
    );
    act(() => {
      result.current.onChangeText('123456789');
    });
    act(() => {
      result.current.handleInputBlurred();
    });
    expect(onBlur).toHaveBeenCalled();
  });

  it('shows eye icon when complete', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: SsnFormats,
        defaultMaskedValue: '123456789',
        unmaskedValue: '123-45-6789',
      })
    );
    expect(result.current.canEyeIconVisible).toBe(true);
  });
});

describe('useMask – EIN', () => {
  it('formats EIN correctly', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: EinFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
      })
    );
    act(() => {
      result.current.onChangeText('123456789');
    });
    expect(result.current.displayedValue).toBe('••–•••6789');
  });

  it('masks EIN correctly', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: EinFormats,
        defaultMaskedValue: '123456789',
        unmaskedValue: '',
      })
    );
    act(() => {
      result.current.initialize();
    });
    act(() => {
      result.current.setIsNumberVisible(false);
    });
    expect(result.current.displayedValue).toBe('••–•••6789');
  });

  it('handles partial input', () => {
    const { result } = renderHook(() =>
      useMask({
        maskInfo: EinFormats,
        defaultMaskedValue: '',
        unmaskedValue: '',
      })
    );
    act(() => {
      result.current.onChangeText('123');
    });
    expect(result.current.displayedValue).toBe('••–3');
  });
});
