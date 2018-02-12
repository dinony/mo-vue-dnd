export default class ItemIntersection {
  constructor(sourceContext, targetContext, insertBefore) {
    this.srcCtx = sourceContext
    this.trgCtx = targetContext
    this.insBef = insertBefore
  }

  get isSameContext() {
    return this.srcCtx.cnt === this.trgCtx.cnt
  }

  equals(other) {
    return this.insBef === other.insBef &&
      this.srcCtx.equals(other.srcCtx) &&
      this.trgCtx.equals(other.trgCtx)
  }
}
