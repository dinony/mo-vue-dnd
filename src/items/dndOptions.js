import {cloneItemFn as defCloneFn} from './clone'
import DnDPermissions from './dndPermissions'

export default class DnDOptions {
  constructor(
    allowSameContainer=true,
    allowItemRemoval=true,
    wrapDnDHandle=true,
    permissions=new DnDPermissions(),
    cloneItemFn=defCloneFn) {
    this.allowSameContainer = allowSameContainer
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
    this.cloneItemFn = cloneItemFn
    this.permissions = permissions
  }
}
