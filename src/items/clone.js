function isValue(val) {
  const t = typeof val
  return t === 'number' || t === 'string' || t === 'boolean'
}

export function cloneItemFn(item) {
  if(isValue(item)) {
    return item
  } else if(item instanceof Array) {
    return item.slice()
  } else {
    return Object.assign({}, item)
  }
}
