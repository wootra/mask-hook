import { useState, useCallback } from 'react';
import { formatEIN, formatSSN, maskEIN, maskSSN, stripNonDigits, TOTAL_DIGITS } from './formatters';
import type { UseMaskOptions, UseMaskResult } from './types';

/**
 * React hook for EIN/SSN masking.
 *
 * Handles formatting and optional masking of 9-digit identifiers.
 * Compatible with React Native (no DOM/web dependencies).
 *
 * @example
 * // SSN input
 * const { displayValue, onChange, toggleMask, isMasked } = useMask({ type: 'ssn' });
 *
 * @example
 * // EIN with masking on by default
 * const { displayValue, onChange, isComplete } = useMask({ type: 'ein', defaultMasked: true });
 */
export function useMask(options: UseMaskOptions): UseMaskResult {
  const { type, initialValue = '', defaultMasked = false } = options;

  const [digits, setDigits] = useState<string>(() =>
    stripNonDigits(initialValue).slice(0, TOTAL_DIGITS)
  );
  const [isMasked, setIsMasked] = useState<boolean>(defaultMasked);

  const format = type === 'ein' ? formatEIN : formatSSN;
  const mask = type === 'ein' ? maskEIN : maskSSN;

  const formattedValue = format(digits);
  const maskedValue = mask(digits);
  const displayValue = isMasked ? maskedValue : formattedValue;
  const isComplete = digits.length === TOTAL_DIGITS;

  const onChange = useCallback((text: string) => {
    const newDigits = stripNonDigits(text).slice(0, TOTAL_DIGITS);
    setDigits(newDigits);
  }, []);

  const toggleMask = useCallback(() => setIsMasked((prev) => !prev), []);

  return {
    value: digits,
    formattedValue,
    maskedValue,
    displayValue,
    onChange,
    toggleMask,
    setMasked: setIsMasked,
    isMasked,
    isComplete,
  };
}
