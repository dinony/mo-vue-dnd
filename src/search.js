export function binarySearch(sortedArr, getterFn, val) {
  let l = 0
  let r = sortedArr.length-1
  let m, curVal

  while(l < r) {
    m = Math.floor((l+r)/2)
    curVal = getterFn(sortedArr, m)
    if(curVal < val) {
      l = m+1
    } else {
      r = m-1
    }
  }
  return l
}
