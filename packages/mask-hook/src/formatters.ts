/** Total digit count for both EIN and SSN */
export const TOTAL_DIGITS = 9;

/** Remove all non-digit characters from a string */
export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format a digit string as EIN: XX-XXXXXXX
 * Accepts any string of up to 9 characters (typically digits or '*' for masking).
 */
export function formatEIN(chars: string): string {
  const c = chars.slice(0, TOTAL_DIGITS);
  if (c.length <= 2) return c;
  return `${c.slice(0, 2)}-${c.slice(2)}`;
}

/**
 * Format a digit string as SSN: XXX-XX-XXXX
 * Accepts any string of up to 9 characters (typically digits or '*' for masking).
 */
export function formatSSN(chars: string): string {
  const c = chars.slice(0, TOTAL_DIGITS);
  if (c.length <= 3) return c;
  if (c.length <= 5) return `${c.slice(0, 3)}-${c.slice(3)}`;
  return `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5)}`;
}

/**
 * Produce a masked EIN string.
 * - Complete (9 digits): shows "**-***XXXX" where XXXX = last 4 digits
 * - Partial: all entered digits are replaced with '*'
 */
export function maskEIN(digits: string): string {
  const d = digits.slice(0, TOTAL_DIGITS);
  if (d.length === 0) return '';
  if (d.length === TOTAL_DIGITS) {
    // Last 4 visible: positions 5-8 (0-indexed)
    return `**-***${d.slice(5)}`;
  }
  // Partial entry: mask all digits
  return formatEIN('*'.repeat(d.length));
}

/**
 * Produce a masked SSN string.
 * - Complete (9 digits): shows "***-**-XXXX" where XXXX = last 4 digits
 * - Partial: all entered digits are replaced with '*'
 */
export function maskSSN(digits: string): string {
  const d = digits.slice(0, TOTAL_DIGITS);
  if (d.length === 0) return '';
  if (d.length === TOTAL_DIGITS) {
    // Last 4 visible: positions 5-8 (0-indexed), which is the final group
    return `***-**-${d.slice(5)}`;
  }
  // Partial entry: mask all digits
  return formatSSN('*'.repeat(d.length));
}
