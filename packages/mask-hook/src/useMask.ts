import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dashPattern, nonNumberPattern } from "./constants";
import {
  convertToFormatted,
  fillNumberOnFormat,
  getValueFromInput,
} from "./formatters";
import { UseMaskParams } from "./types";
import { EinFormats } from "./patterns";

export const useMask = ({
  maskInfo = EinFormats,
  defaultMaskedValue,
  unmaskedValue,
  onChange,
  onBlur,
  onEyeClickedToUpdateRealValue,
  onValueChanged,
}: UseMaskParams) => {
  const [displayedValue, setDisplayedValue] = useState("");
  const [isNumberVisible, setIsNumberVisible] = useState(false);
  const valueRef = useRef<string>("");
  const isDirtyRef = useRef<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);
  const defaultValueCloneRef = useRef<string>("");
  const displayValueRef = useRef<string>("");
  const { maskedFormat, visibleFormat } = maskInfo;
  const defaultValue = useMemo(
    () => fillNumberOnFormat(maskedFormat, defaultMaskedValue ?? ""),
    [defaultMaskedValue],
  );
  defaultValueCloneRef.current = defaultValue;
  displayValueRef.current = displayedValue;
  const maxLen = useMemo(() => {
    return visibleFormat.replaceAll(nonNumberPattern, "").length;
  }, [visibleFormat]);

  const canEyeIconVisible = useMemo(() => {
    return (
      unmaskedValue.replaceAll(/\D/g, "").length === maxLen ||
      isDirty ||
      !!onEyeClickedToUpdateRealValue
    );
  }, [unmaskedValue, maxLen, isDirty, onEyeClickedToUpdateRealValue]);

  const onChangeText = useCallback(
    (text: string) => {
      const realValue = getValueFromInput(text, valueRef.current ?? "", maxLen);
      const realValueWithFormat = convertToFormatted(realValue, visibleFormat);
      const format = isNumberVisible ? visibleFormat : maskedFormat;
      const formatText = convertToFormatted(realValue, format);
      // this function is not triggered when the field's value is changed through the prop.
      // so isdirtyRef.current setting to true is valid.
      isDirtyRef.current = true;
      valueRef.current = realValue;
      if (!isDirty) {
        setIsDirty(true);
      }
      setDisplayedValue(formatText);
      onChange?.(realValueWithFormat);
      onValueChanged?.(realValueWithFormat);
    },
    [
      isNumberVisible,
      maskedFormat,
      maxLen,
      onChange,
      onValueChanged,
      visibleFormat,
    ],
  );

  const handleInputFocused = useCallback(() => {
    if (defaultValue && !isDirtyRef.current) {
      setDisplayedValue("");
    }
  }, [defaultValue]);

  const handleInputBlurred = useCallback(() => {
    if (displayValueRef.current.trim() === "" && defaultValue && !isDirtyRef.current) {
      setDisplayedValue(defaultValue);
      isDirtyRef.current = false;
    }
    if (isDirty !== isDirtyRef.current) {
      setIsDirty(isDirtyRef.current);
    }
    if (isDirtyRef.current) {
      onBlur?.();
    }
  }, [defaultValue, onBlur, isDirty]);

  // this is initialization when the component is shown when the parent is "focused".
  // with react-native-navigation, the component is not unmounted when we switch to another screen, so this is needed to set the default value to the input when we come back to the screen.
  const initialize = useCallback(() => {
    const defaultValueData = defaultValueCloneRef.current;
    if (defaultValueData?.trim()) {
      if (defaultValueData.replaceAll(dashPattern, "").match(/\D/)) {
        setDisplayedValue(defaultValueData);
      } else {
        const onlyNumbersInMask = maskedFormat.replaceAll(/\D/g, "");
        const onlyNumbersInDefaultValue = defaultValueData.slice(
          -onlyNumbersInMask.length,
        );
        const onlyMaskInMask = maskedFormat.replaceAll(/\d/g, "");
        setDisplayedValue(`${onlyMaskInMask}${onlyNumbersInDefaultValue}`);
      }
      isDirtyRef.current = false;
      setIsDirty(false);
      const onlyNumbersFromFormValue = defaultValueData.replaceAll(/\D/g, "");
      if (onlyNumbersFromFormValue.length === maxLen) {
        valueRef.current = onlyNumbersFromFormValue;
      } else {
        valueRef.current = "";
      }
    }
  }, []);

  useEffect(() => {
    // trigger only when isNumberVisible is changed and was not showing numbers before.
    const wasNumberVisible =
      displayedValue.replaceAll(dashPattern, "").length ===
      displayedValue.replaceAll(/\D/g, "").length;
    if (
      (isNumberVisible && !wasNumberVisible) ||
      (!isNumberVisible && wasNumberVisible)
    ) {
      const realValue = getValueFromInput(
        unmaskedValue ?? "",
        valueRef.current ?? "",
        maxLen,
      );
      const format = isNumberVisible ? visibleFormat : maskedFormat;
      const formatText = convertToFormatted(realValue, format);
      valueRef.current = realValue;
      setDisplayedValue(formatText);
    }
  }, [isNumberVisible, maskedFormat, maxLen, unmaskedValue, visibleFormat]);

  return {
    isDirty,
    displayedValue,
    isNumberVisible,
    canEyeIconVisible,
    handleInputFocused,
    handleInputBlurred,
    setIsNumberVisible,
    onChangeText,
    initialize,
  };
};
