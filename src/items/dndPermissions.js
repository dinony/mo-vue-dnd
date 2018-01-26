export default class DnDPermissions {
  constructor(_in=null, out=null) {
    this.in = _in
    this.out = out
  }
}

const reducePerms = (accum, key) => {
  accum[key] = true
  return accum
}

export function getPermissions(_in, out) {
  const __in = _in ? _in.reduce(reducePerms, {}): null
  const __out = out ? out.reduce(reducePerms, {}): null
  return new DnDPermissions(__in, __out)
}
