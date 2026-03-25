import { describe, it, expect } from 'vitest';
import {
  stripNonDigits,
  formatEIN,
  formatSSN,
  maskEIN,
  maskSSN,
  TOTAL_DIGITS,
} from '../src/formatters';

describe('stripNonDigits', () => {
  it('removes dashes', () => {
    expect(stripNonDigits('12-3456789')).toBe('123456789');
  });
  it('removes spaces', () => {
    expect(stripNonDigits('123 45 6789')).toBe('123456789');
  });
  it('removes all non-digit chars', () => {
    expect(stripNonDigits('abc-123')).toBe('123');
  });
  it('returns empty string for empty input', () => {
    expect(stripNonDigits('')).toBe('');
  });
  it('returns digits unchanged', () => {
    expect(stripNonDigits('123456789')).toBe('123456789');
  });
});

describe('TOTAL_DIGITS', () => {
  it('is 9', () => {
    expect(TOTAL_DIGITS).toBe(9);
  });
});

describe('formatEIN', () => {
  it('formats 0 digits', () => {
    expect(formatEIN('')).toBe('');
  });
  it('formats 1 digit', () => {
    expect(formatEIN('1')).toBe('1');
  });
  it('formats 2 digits', () => {
    expect(formatEIN('12')).toBe('12');
  });
  it('formats 3 digits with dash', () => {
    expect(formatEIN('123')).toBe('12-3');
  });
  it('formats 9 digits (complete EIN)', () => {
    expect(formatEIN('123456789')).toBe('12-3456789');
  });
  it('truncates beyond 9 digits', () => {
    expect(formatEIN('12345678901')).toBe('12-3456789');
  });
  it('works with star chars (for masking)', () => {
    expect(formatEIN('*'.repeat(9))).toBe('**-*******');
  });
});

describe('formatSSN', () => {
  it('formats 0 digits', () => {
    expect(formatSSN('')).toBe('');
  });
  it('formats 1 digit', () => {
    expect(formatSSN('1')).toBe('1');
  });
  it('formats 3 digits', () => {
    expect(formatSSN('123')).toBe('123');
  });
  it('formats 4 digits with first dash', () => {
    expect(formatSSN('1234')).toBe('123-4');
  });
  it('formats 5 digits', () => {
    expect(formatSSN('12345')).toBe('123-45');
  });
  it('formats 6 digits with second dash', () => {
    expect(formatSSN('123456')).toBe('123-45-6');
  });
  it('formats 9 digits (complete SSN)', () => {
    expect(formatSSN('123456789')).toBe('123-45-6789');
  });
  it('truncates beyond 9 digits', () => {
    expect(formatSSN('12345678901')).toBe('123-45-6789');
  });
  it('works with star chars (for masking)', () => {
    expect(formatSSN('*'.repeat(9))).toBe('***-**-****');
  });
});

describe('maskEIN', () => {
  it('returns empty string for empty input', () => {
    expect(maskEIN('')).toBe('');
  });
  it('masks partial entry (1 digit)', () => {
    expect(maskEIN('1')).toBe('*');
  });
  it('masks partial entry (3 digits)', () => {
    expect(maskEIN('123')).toBe('**-*');
  });
  it('shows last 4 digits for complete EIN', () => {
    expect(maskEIN('123456789')).toBe('**-***6789');
  });
  it('masks the first 5 digits', () => {
    const masked = maskEIN('123456789');
    expect(masked.startsWith('**-***')).toBe(true);
  });
  it('does not expose first 5 digits', () => {
    const masked = maskEIN('987654321');
    expect(masked).toBe('**-***4321');
  });
});

describe('maskSSN', () => {
  it('returns empty string for empty input', () => {
    expect(maskSSN('')).toBe('');
  });
  it('masks partial entry (2 digits)', () => {
    expect(maskSSN('12')).toBe('**');
  });
  it('masks partial entry (4 digits)', () => {
    expect(maskSSN('1234')).toBe('***-*');
  });
  it('shows last 4 digits for complete SSN', () => {
    expect(maskSSN('123456789')).toBe('***-**-6789');
  });
  it('does not expose first 5 digits', () => {
    const masked = maskSSN('987654321');
    expect(masked).toBe('***-**-4321');
  });
  it('last 4 matches actual digits', () => {
    const digits = '111223333';
    const masked = maskSSN(digits);
    expect(masked.endsWith('3333')).toBe(true);
  });
});
