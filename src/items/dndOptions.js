export default class DnDOptions {
  constructor(
    allowSameContainer=true,
    allowItemRemoval=false,
    wrapDnDHandle=true) {
    this.allowSameContainer = allowSameContainer
    this.allowItemRemoval = allowItemRemoval
    this.wrapDnDHandle = wrapDnDHandle
  }
}
