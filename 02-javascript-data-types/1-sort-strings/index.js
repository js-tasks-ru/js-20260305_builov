/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sortedArr = {};
  let arrToSort = [...arr];

  if (param === 'asc') {
    sortedArr = arrToSort.sort((a, b) => a.localeCompare(b, undefined, {caseFirst: "upper"}));
  } else {
    sortedArr = arrToSort.sort((a, b) => b.localeCompare(a, undefined, {caseFirst: "upper"}));
  }

  return [...sortedArr];
}
