import {cloneItemFn as defCloneFn} from './clone'
import DnDPermissions from './dndPermissions'

export default class DnDOptions {
  constructor(
    allowItemRemoval=true,
    wrapDnDHandle=true,
    permissions=new DnDPermissions(),
    cloneItemFn=defCloneFn) {
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
    this.cloneItemFn = cloneItemFn
    this.permissions = permissions
  }
}
