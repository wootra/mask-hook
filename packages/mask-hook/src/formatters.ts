import { dashPattern, nonNumberPattern, numberPatternForChar } from "./constants";

export const convertToFormatted = (value: string, format: string) => {
    const retCharArr = [] as string[];
    let fi = 0; // format index

    const validFormatMax = format.replaceAll(dashPattern, '').length;

    let valueArr = value.replaceAll(nonNumberPattern, '').split('');
    if (valueArr.length > validFormatMax) {
        valueArr = valueArr.slice(0, validFormatMax);
    }
    const formatArr = format.split('');
    const isDash = (char?: string) => char && dashPattern.test(char);
    const isNumber = (char: string) => numberPatternForChar.test(char);

    for (let vi = 0; vi < valueArr.length; ) {
        const formatChar = formatArr[fi];
        if (!formatChar) {
            break; // no more format chars
        }
        if (isDash(formatChar)) {
            retCharArr.push(formatChar);
            fi++;
            // do it again
            continue;
        } else if (isNumber(formatChar)) {
            retCharArr.push(valueArr[vi]);
            fi++;
            vi++;
            continue;
        }
        // if it is bullet,
        retCharArr.push(formatChar); // bullet can be anything.
        vi++;
        fi++;
    }
    if (isDash(value.at(-1))) {
        if (retCharArr.length === format.length) return retCharArr.join('');
        return retCharArr.join('') + (value.at(-1) ?? '');
    }

    const lastChar = valueArr.at(-1);
    if (retCharArr.length > 0) retCharArr.pop();
    if (value.length > 0) {
        return retCharArr.join('') + (lastChar ?? '');
    }
    return '';
};

export const isOnlyNumber = (value: string) => {
    const regex = /^[\d]+$/;
    return regex.test(value);
};

/**
 * ex> fillNumberOnFormat('XXX-XX-XX99', '1234') => 'XXX-XX-XX34'
 * ex> fillNumberOnFormat('XXX-XX-XX99', '123456') => 'XXX-XX-XX56'
 * ex> fillNumberOnFormat('XXX-XX-XX99', '1') => 'XXX-XX-XX1'
 * ex> fillNumberOnFormat('XXX-XX-XX99', '') => ''
 * @param format ex> XXX-XX-XX99
 * @param numberValue ex> 1234
 * @returns based on the format's number part, pick numberValue and fill up.
 */
export const fillNumberOnFormat = (format:string, numberValue: string) => {
  const numberOnlyValue = numberValue.replaceAll(nonNumberPattern, '');
  if(!numberOnlyValue) return '';
  const numberReversed = numberOnlyValue.split('').reverse();
  return format.split('').reverse().reduce(({arr, numIdx}, char) => {
    const isCharNumber = numberPatternForChar.test(char);
    if(isCharNumber && numberReversed[numIdx]){
      arr.push(numberReversed[numIdx]);
      numIdx++;
    }else if(isCharNumber) {
      arr.push(''); // the number is not ready
    }else{
      arr.push(char);
    }
    return {arr, numIdx};
  }, {arr: [] as string[], numIdx: 0}).arr.reverse().join('');
}

/** 

Merge formatted & masked characters into previous raw value. it returns only number value.

when value is shorter than previous, assume this is deletion, so the length is adjusted.

when value is longer than previous, assume this is addition, but inputValue cannot guarantee the value is numbers. so reference previousValue which is only numbers.

examples: 

getValueFromInput('12–3', '123456789', 9) => '123'

getValueFromInput('**-**5', '1234', 9) => '12345'

getValueFromInput('98–765', '9876', 9) => '98765'

getValueFromInput('**–**', '98765', 9) => '9876'
*/
export const getValueFromInput = (inputValue: string, previousValue: string, maxLen: number) => {
    const inputValueArr = inputValue.replaceAll(dashPattern, '').split('');
    const previousValueArr = Array.from(previousValue.split(''));
    const nextValueArr = new Array(maxLen).fill('');

    for (let i = 0; i < maxLen; i++) {
        if (!inputValueArr[i]) {
            nextValueArr[i] = '';
        } else if (!isOnlyNumber(inputValueArr[i])) {
            nextValueArr[i] = previousValueArr[i] ?? '';
        } else {
            nextValueArr[i] = inputValueArr[i];
        }
    }
    return nextValueArr.join('');
};

