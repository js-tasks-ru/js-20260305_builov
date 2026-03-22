/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  let result = '';
  let prevChar;
  let sameCharCount = 0;

  for (const char of string) {
    if (char !== prevChar) {
      result += char;

      sameCharCount = 0;
    } else if (sameCharCount < size || size === undefined) {
      result += char;
    }

    prevChar = char;
    sameCharCount++;
  }

  return result;
}
