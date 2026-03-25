export type MaskType = 'ein' | 'ssn';

export interface UseMaskOptions {
  /** The type of identifier to mask: 'ein' (Employer Identification Number) or 'ssn' (Social Security Number) */
  type: MaskType;
  /** Initial value (digits only, or formatted with dashes) */
  initialValue?: string;
  /** Whether to start in masked mode (default: false) */
  defaultMasked?: boolean;
}

export interface UseMaskResult {
  /** Raw digits only (e.g., "123456789") */
  value: string;
  /** Formatted with dashes (e.g., "12-3456789" for EIN, "123-45-6789" for SSN) */
  formattedValue: string;
  /**
   * Masked value – shows only the last 4 digits when complete
   * (e.g., "**-*****89" for EIN, "***-**-6789" for SSN).
   * Partial entries are fully masked.
   */
  maskedValue: string;
  /** Either formattedValue or maskedValue depending on isMasked */
  displayValue: string;
  /** Call with the new text (raw digits or formatted) whenever input changes */
  onChange: (text: string) => void;
  /** Toggle between masked and unmasked display */
  toggleMask: () => void;
  /** Explicitly set the masked state */
  setMasked: (masked: boolean) => void;
  /** Whether the display is currently masked */
  isMasked: boolean;
  /** Whether all 9 digits have been entered */
  isComplete: boolean;
}
