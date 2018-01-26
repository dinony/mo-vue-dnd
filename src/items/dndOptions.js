import {cloneItemFn as defCloneFn} from './clone'
import {default as DnDPermissions, getPermissions} from './dndPermissions'

export default class DnDOptions {
  constructor(
    allowItemRemoval=true,
    wrapDnDHandle=true,
    permissions=[null, null],
    cloneItemFn=defCloneFn) {
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
    this.cloneItemFn = cloneItemFn
    this.perms = permissions
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
