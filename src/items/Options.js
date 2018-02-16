import {cloneItemFn as defCloneFn} from './clone'
import {getPermissions} from './Permissions'

export default class Options {
  constructor(
    allowItemRemoval=true,
    wrapMdArea=true,
    permissions=[null, null],
    cloneItemFn=defCloneFn) {
    this.allowItemRemoval = allowItemRemoval
    this.wrapMdArea = wrapMdArea
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
