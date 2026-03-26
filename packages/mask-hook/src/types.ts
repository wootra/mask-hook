export type MaskInfo = {
    maskedFormat: string;
    visibleFormat: string;
}

export type UseMaskParams = {
  maskInfo: MaskInfo;
  defaultMaskedValue: string;
  unmaskedValue: string;
  onChange?: (changedValueUnmasked: string) => void;
  onBlur?: () => void;
  onValueChanged?: (formattedValue: string) => void;
};