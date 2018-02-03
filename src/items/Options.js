import {cloneItemFn as defCloneFn} from './clone'
import {default as Permissions, getPermissions} from './Permissions'

export default class Options {
  constructor(
    allowItemRemoval=true,
    wrapDnDHandle=true,
    permissions=[null, null],
    cloneItemFn=defCloneFn) {
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
    this.cloneItemFn = cloneItemFn
    this.permissions = permissions
  }

  set permissions(perms) {
    if(perms.length !== 2) {return}
    const _in = perms[0]
    const out = perms[1]
    this.perms = getPermissions(_in, out)
  }

  get permissions() {
    return this.perms
  }
}
