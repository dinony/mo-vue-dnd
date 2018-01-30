export default class DnDPermissions {
  constructor(_in=null, out=null) {
    this.in = _in
    this.out = out
  }
}

export class InvalidPermissionKeyException extends Error {
  constructor(message) {
    super(message)
  }
}

const invalidKeyErrMsg = key =>
  (`
   Permission key: \`${key}\` is not allowed.
   Please use a valid group name (string).
  `)

const reducePerms = (accum, key) => {
  if(key !== null && key !== undefined) {
    accum[key] = true
  } else {
    throw new InvalidPermissionKeyException(invalidKeyErrMsg(key))
  }
  return accum
}

export function getPermissions(_in, out) {
  const __in = _in ? _in.reduce(reducePerms, {}): null
  const __out = out ? out.reduce(reducePerms, {}): null
  return new DnDPermissions(__in, __out)
}
