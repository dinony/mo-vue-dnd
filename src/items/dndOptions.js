import {cloneItemFn as defCloneFn} from './clone'

export default class DnDOptions {
  constructor(
    allowSameContainer=true,
    allowItemRemoval=true,
    wrapDnDHandle=true,
    cloneItemFn=defCloneFn) {
    this.allowSameContainer = allowSameContainer
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
    this.cloneItemFn = cloneItemFn
  }
}
